import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import "./AttendanceReport.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AttendanceReport = () => {
  const [leaveData, setLeaveData] = useState({});
  const [punchData, setPunchData] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [Frommonth, setFromMonth] = useState(moment().format("MM"));
  const [Tomonth, setToMonth] = useState(moment().format("MM"));
  const [year, setYear] = useState(moment().format("YYYY"));
  const [holidays, setHolidays] = useState([]);
  const [salaryInputs, setSalaryInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [leaveSummary, setLeaveSummary] = useState({});
  const { isAuth, userData } = useSelector((state) => state.login);
  const navigate = useNavigate();


    useEffect(() => {
    if (userData.userType !== "Admin") {
      navigate("/dashboard/dashboards");
    }
  }, []);

  const computeLeaveSummary = (employeeName) => {
    const leaves = leaveData[employeeName] || [];
    const summary = {
      CasualLeave: 0,
      LossOfPay: 0,
      SaturdayOff: 0,
      HalfDay: 0,
    };

    const rangeStart = moment(`${year}-${Frommonth}-01`).startOf("month");
    const rangeEnd = moment(`${year}-${Tomonth}-01`).endOf("month");

    leaves.forEach((leave) => {
      const leaveStart = moment(leave.startDate);
      const leaveEnd = moment(leave.endDate);

      // Calculate overlap between leave and selected month range
      const overlapStart = leaveStart.isBefore(rangeStart) ? rangeStart : leaveStart;
      const overlapEnd = leaveEnd.isAfter(rangeEnd) ? rangeEnd : leaveEnd;

      if (overlapEnd.isBefore(overlapStart)) {
        return; // No overlap, skip this leave
      }

      // Handle half-day leaves
      if (leave.leaveTimes === "Halfday" || leave.noOfDays === 0.5) {
        if (leave.leaveTypes.includes("Casual Leave")) {
          summary.CasualLeave += 0.5;
        } else if (leave.leaveTypes.includes("LossofPay Leave") || leave.leaveTypes.includes("Loss of Pay Leave")) {
          summary.LossOfPay += 0.5;
        }
        summary.HalfDay += 0.5;
        return;
      }

      const days = overlapEnd.diff(overlapStart, "days") + 1;

      if (leave.leaveTypes.includes("Casual Leave")) {
        summary.CasualLeave += days;
      }
      if (leave.leaveTypes.includes("LossofPay Leave") || leave.leaveTypes.includes("Loss of Pay Leave")) {
        summary.LossOfPay += days;
      }
      if (leave.leaveTypes.includes("Saturday Off")) {
        summary.SaturdayOff += days;
      }
    });

    setLeaveSummary(summary);
  };

  useEffect(() => {
    if (selectedEmployee) {
      computeLeaveSummary(selectedEmployee);
    }
  }, [selectedEmployee, leaveData]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [Frommonth, Tomonth, year, selectedEmployee, employeeList, punchData, leaveData, salaryInputs]);

  useEffect(() => {
    const storedSalary = localStorage.getItem("salaryInputs");
    if (storedSalary) {
      setSalaryInputs(JSON.parse(storedSalary));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("salaryInputs", JSON.stringify(salaryInputs));
  }, [salaryInputs]);

  useEffect(() => {
    fetchEmployeeList();
    fetchHolidayData();
  }, []);

  useEffect(() => {
    if (year && Frommonth && Tomonth) {
      fetchLeaveData(year, Frommonth, Tomonth);
    }
  }, [year, Frommonth, Tomonth]);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
      if (response.data.status === "Success") {
        setEmployeeList(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching employee list:", err);
    }
  };

  const fetchLeaveData = async (selectedYear, selectedFromMonth, selectedToMonth) => {
    try {
      const startDate = moment(`${selectedYear}-${selectedFromMonth}-01`).startOf("month").format("YYYY-MM-DD");
      const endDate = moment(`${selectedYear}-${selectedToMonth}-01`).endOf("month").format("YYYY-MM-DD");
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, { startDate, endDate });

      const formattedData = response.data.data || [];
      const leaveMap = {};

      formattedData.forEach((leave) => {
        if (leave.status !== "Rejected") {
          leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
          leaveMap[leave.employeeName].push({
            startDate: leave.startDate,
            endDate: leave.endDate,
            leaveTypes: leave.leaveTypes,
            permissionHours: leave.permissionHours || 0,
            leaveTimes: leave.leaveTimes,
            noOfDays: leave.noOfDays
          });
        }
      });

      setLeaveData(leaveMap);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const fetchHolidayData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllHolidays`);
      setHolidays(response.data.data);
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
  };

  const getLeaveSymbol = (date, employeeLeaves) => {
    const today = moment();
    const formattedDate = date.format("YYYY-MM-DD");

    // Check for holidays first
    const holiday = holidays.find((h) =>
      (h.isActive === "1" && moment(h.eventStartDate).startOf("day").isSame(date.startOf("day"))) ||
      date.isBetween(moment(h.eventStartDate).startOf("day"), moment(h.eventEndDate).endOf("day"), "day", "[]")
    );

    if (moment(date).day() === 0) return "S"; // Sunday
    if (holiday?.eventName === "SAT OFF") return "SO";
    if (holiday) return "HO";
    if (date.isAfter(today, "day")) return "";

    let leaveSymbol = "P";
    let totalPermissionHours = 0;

    // Check if there are any leaves for this employee on this date
    const leavesForDate = employeeLeaves?.filter(leave =>
      date.isBetween(moment(leave.startDate), moment(leave.endDate), "day", "[]")
    ) || [];

    // Process each leave for this date
    for (const leave of leavesForDate) {
      // Handle half-day leaves
      if (leave.leaveTimes === "Halfday" || leave.noOfDays === 0.5) {
        if (leave.leaveTypes.includes("Casual Leave")) return "CL-H";
        if (leave.leaveTypes.includes("LossofPay Leave") || leave.leaveTypes.includes("Loss of Pay Leave")) return "LOP-H";
        return "H";
      }

      // Handle full day leaves
      if (leave.leaveTypes.includes("Casual Leave")) return "CL";
      if (leave.leaveTypes.includes("Saturday Off")) return "SO";
      if (leave.leaveTypes.includes("LossofPay Leave") || leave.leaveTypes.includes("Loss of Pay Leave")) return "LOP";
      if (leave.leaveTypes.includes("Work From Home")) return "WFH";

      // Handle permission hours
      if (leave.leaveTypes.includes("Permission")) {
        totalPermissionHours += leave.leaveDuration || 0;
      }
    }

    // Handle permission cases
    if (totalPermissionHours > 2) {
      return "H"; // half-day deduction
    } else if (totalPermissionHours > 0) {
      return "PE"; // Partial Leave
    }

    return leaveSymbol;
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Export attendance tables
    const tables = document.querySelectorAll(".attendance-table");
    tables.forEach((table, index) => {
      const worksheet = XLSX.utils.table_to_sheet(table);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Month ${index + 1}`);
    });

    // Export leave summary
    if (selectedEmployee) {
      const summaryData = [
        ["Leave Type", "Total Days"],
        ["Casual Leave", leaveSummary.CasualLeave],
        ["Loss of Pay", leaveSummary.LossOfPay],
        ["Saturday Off", leaveSummary.SaturdayOff],
        ["Half Days", leaveSummary.HalfDay],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Leave Summary");
    }

    XLSX.writeFile(workbook, `Attendance_Report_${year}_${Frommonth}-${Tomonth}.xlsx`);
  };

  const startMonthNumber = parseInt(Frommonth, 10);
  const endMonthNumber = parseInt(Tomonth, 10);
  const monthCount = endMonthNumber - startMonthNumber + 1;

  const handleSalaryChange = (employeeName, value) => {
    setSalaryInputs((prev) => ({
      ...prev,
      [employeeName]: value,
    }));
  };

  const handleEmployeeChange = (e) => {
    const empName = e.target.value;
    setSelectedEmployee(empName);

    // Find the employee ID based on the selected name
    if (empName) {
      const emp = employeeList.find(e => e.employeeName === empName);
      setSelectedEmployeeId(emp ? emp.employeeId : "");
    } else {
      setSelectedEmployeeId("");
    }
  };

  return (
    <div className="attendance-container">
      <h2>Attendance Report</h2>
      <div className="filters">
        <label>From Month:</label>
        <select value={Frommonth} onChange={(e) => setFromMonth(e.target.value)}>
          {moment.months().map((m, index) => (
            <option key={index} value={String(index + 1).padStart(2, "0")}>
              {m}
            </option>
          ))}
        </select>
        <label>To Month:</label>
        <select value={Tomonth} onChange={(e) => setToMonth(e.target.value)}>
          {moment.months().map((m, index) => (
            <option key={index} value={String(index + 1).padStart(2, "0")}>
              {m}
            </option>
          ))}
        </select>
        <label>Year:</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {[...Array(10)].map((_, i) => {
            const currentYear = moment().year();
            return (
              <option key={i} value={currentYear - i}>
                {currentYear - i}
              </option>
            );
          })}
        </select>
        <label>Select Employee:</label>
        <select value={selectedEmployee} onChange={handleEmployeeChange}>
          <option value="">All Employees</option>
          {employeeList.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeName}>
              {emp.employeeName} ({emp.employeeId})
            </option>
          ))}
        </select>
        {selectedEmployeeId && (
          <div className="employee-id-display">
            <strong>Employee ID:</strong> {selectedEmployeeId}
          </div>
        )}
        <button className="export-btn" onClick={exportToExcel}>
          Export
        </button>
      </div>
      {loading ? (
        <div className="loading-indicator">Loading attendance report...</div>
      ) : selectedEmployee ? (
        <div className="month-summary-table">
          <h3>Attendance Summary for {selectedEmployee} ({selectedEmployeeId})</h3>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Month</th>
                <th>Total Working Days</th>
                <th>Total Present</th>
                <th>Total Absent</th>
                <th>Casual Leave</th>
                <th>Loss of Pay</th>
                <th>Saturday Off</th>
                <th>Half Days</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: monthCount }, (_, idx) => {
                const currentMonth = moment(`${year}-${Frommonth}`, "YYYY-MM").add(idx, "months");
                const monthNumber = currentMonth.format("MM");
                const monthName = currentMonth.format("MMMM");
                const fullMonthDays = currentMonth.daysInMonth();

                const today = moment();
                const doj = employeeList.find((emp) => emp.employeeName === selectedEmployee)?.dateOfJoining || null;
                let totalPresent = 0;
                let totalAbsent = 0;
                let halfDayCount = 0;

                const leaves = leaveData[selectedEmployee] || [];
                const summary = {
                  CasualLeave: 0,
                  LossOfPay: 0,
                  SaturdayOff: 0,
                  HalfDay: 0,
                };

                const rangeStart = moment(`${year}-${Frommonth}-01`).startOf("month");
                const rangeEnd = moment(`${year}-${Tomonth}-01`).endOf("month");

                leaves.forEach((leave) => {
                  const leaveStart = moment(leave.startDate);
                  const leaveEnd = moment(leave.endDate);
                  const overlapStart = leaveStart.isBefore(rangeStart) ? rangeStart : leaveStart;
                  const overlapEnd = leaveEnd.isAfter(rangeEnd) ? rangeEnd : leaveEnd;

                  if (overlapEnd.isBefore(overlapStart)) return;

                  // Handle half-day leaves
                  if (leave.leaveTimes === "Halfday" || leave.noOfDays === 0.5) {
                    if (leave.leaveTypes.includes("Casual Leave")) {
                      summary.CasualLeave += 0.5;
                    } else if (leave.leaveTypes.includes("LossofPay Leave") || leave.leaveTypes.includes("Loss of Pay Leave")) {
                      summary.LossOfPay += 0.5;
                    }
                    summary.HalfDay += 0.5;
                    return;
                  }

                  const days = overlapEnd.diff(overlapStart, "days") + 1;

                  if (leave.leaveTypes.includes("Casual Leave")) {
                    summary.CasualLeave += days;
                  }
                  if (leave.leaveTypes.includes("LossofPay Leave") || leave.leaveTypes.includes("Loss of Pay Leave")) {
                    summary.LossOfPay += days;
                  }
                  if (leave.leaveTypes.includes("Saturday Off")) {
                    summary.SaturdayOff += days;
                  }
                });

                const dailyStatuses = Array.from({ length: fullMonthDays }, (_, dayIdx) => {
                  const date = moment(`${year}-${monthNumber}`, "YYYY-MM").date(dayIdx + 1);
                  if (date.isBefore(doj, "day")) {
                    totalAbsent++;
                    return "-";
                  }
                  if (date.isAfter(today, "day")) return "";
                  let status = "P";

                  if (punchData[selectedEmployee] && punchData[selectedEmployee].includes(date.format("YYYY-MM-DD"))) {
                    status = "P";
                  } else {
                    if (leaveData[selectedEmployee]) {
                      status = getLeaveSymbol(date, leaveData[selectedEmployee]);
                    } else {
                      status = getLeaveSymbol(date, [{
                        startDate: "",
                        endDate: "",
                        leaveTypes: "TEST",
                        permissionHours: 0,
                      }]);
                    }
                    if (date.day() === 0) status = "S";
                  }

                  if (status === "LOP" || status === "LOP-H") totalAbsent += status === "LOP-H" ? 0.5 : 1;
                  if (status === "H" || status === "CL-H" || status === "LOP-H") halfDayCount++;
                  if (["P", "SO", "CL", "PE", "S", "WFH"].includes(status)) totalPresent++;
                  return status;
                });
                
                const totalWorkingDays = year === moment().format("YYYY") && monthNumber === moment().format("MM") ?
                  moment().date() : fullMonthDays;

                return (
                  <tr key={monthNumber}>
                    <td>{idx + 1}</td>
                    <td>{monthName}</td>
                    <td>{totalWorkingDays}</td>
                    <td>{totalPresent}</td>
                    <td>{totalAbsent}</td>
                    <td>{summary.CasualLeave}</td>
                    <td>{summary.LossOfPay}</td>
                    <td>{summary.SaturdayOff}</td>
                    <td>{summary.HalfDay}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        Array.from({ length: monthCount }, (_, idx) => {
          const currentMonth = moment(`${year}-${Frommonth}`, "YYYY-MM").add(idx, "months");
          const monthNumber = currentMonth.format("MM");
          const monthName = currentMonth.format("MMMM");
          const fullMonthDays = currentMonth.daysInMonth();

          return (
            <div key={monthNumber} className="month-table">
              <h3>
                {monthName} {year}
              </h3>
              <div className="table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Employee ID</th>
                      <th>Employee Name</th>
                      {Array.from({ length: fullMonthDays }, (_, dayIdx) => (
                        <th key={dayIdx}>{currentMonth.date(dayIdx + 1).format("DD")}</th>
                      ))}
                      <th>Total Working Days</th>
                      <th>Total Present</th>
                      <th>Total Absent</th>
                      <th>Casual Leave</th>
                      <th>Loss of Pay</th>
                      <th>Saturday Off</th>
                      <th>Half Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeList
                      .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee)
                      .map((emp, index) => {
                        const today = moment();
                        const doj = moment(emp.dateOfJoining);
                        let totalPresent = 0;
                        let totalAbsent = 0;
                        let halfDayCount = 0;

                        const leaves = leaveData[emp.employeeName] || [];
                        const summary = {
                          CasualLeave: 0,
                          LossOfPay: 0,
                          SaturdayOff: 0,
                          HalfDay: 0,
                        };

                        const rangeStart = moment(`${year}-${Frommonth}-01`).startOf("month");
                        const rangeEnd = moment(`${year}-${Tomonth}-01`).endOf("month");

                        leaves.forEach((leave) => {
                          const leaveStart = moment(leave.startDate);
                          const leaveEnd = moment(leave.endDate);
                          const overlapStart = leaveStart.isBefore(rangeStart) ? rangeStart : leaveStart;
                          const overlapEnd = leaveEnd.isAfter(rangeEnd) ? rangeEnd : leaveEnd;

                          if (overlapEnd.isBefore(overlapStart)) return;

                          // Handle half-day leaves
                          if (leave.leaveTimes === "Halfday" || leave.noOfDays === 0.5) {
                            if (leave.leaveTypes.includes("Casual Leave")) {
                              summary.CasualLeave += 0.5;
                            } else if (leave.leaveTypes.includes("LossofPay Leave") || leave.leaveTypes.includes("Loss of Pay Leave")) {
                              summary.LossOfPay += 0.5;
                            }
                            summary.HalfDay += 0.5;
                            return;
                          }

                          const days = overlapEnd.diff(overlapStart, "days") + 1;

                          if (leave.leaveTypes.includes("Casual Leave")) {
                            summary.CasualLeave += days;
                          }
                          if (leave.leaveTypes.includes("LossofPay Leave") || leave.leaveTypes.includes("Loss of Pay Leave")) {
                            summary.LossOfPay += days;
                          }
                          // if (leave.leaveTypes.includes("Saturday Off")) {
                          //   summary.SaturdayOff += days;
                          // }
                        });
                        summary.SaturdayOff=0;
                        const dailyStatuses = Array.from({ length: fullMonthDays }, (_, dayIdx) => {
                          const date = moment(`${year}-${monthNumber}`, "YYYY-MM").date(dayIdx + 1);
                          if (date.isBefore(doj, "day")) {
                            totalAbsent++;
                            return "-";
                          }
                          if (date.isAfter(today, "day")) return "";
                          let status = "P";

                          if (punchData[emp.employeeName] && punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))) {
                            status = "P";
                          } else {
                            if (leaveData[emp.employeeName]) {
                              status = getLeaveSymbol(date, leaveData[emp.employeeName]);
                            } else {
                              status = getLeaveSymbol(date, [{
                                startDate: "",
                                endDate: "",
                                leaveTypes: "TEST",
                                permissionHours: 0,
                              }]);
                            }
                            if (date.day() === 0) status = "S";
                          }
                          if (status === "LOP" || status === "LOP-H") totalAbsent += status === "LOP-H" ? 0.5 : 1;
                          if (status === "H" || status === "CL-H" || status === "LOP-H") halfDayCount++;
                          if (["P", "SO", "CL", "PE", "S", "WFH"].includes(status)) totalPresent++;
                          if(status === "SO") {
                              summary.SaturdayOff++;    
                          };
                          return status;
                        });

                        const totalWorkingDays = year === moment().format("YYYY") && monthNumber === moment().format("MM") ?
                          moment().date() : fullMonthDays;
                        const effectiveDeductionDays = totalAbsent + halfDayCount / 2;
                        const enteredSalary = parseFloat(salaryInputs[emp.employeeName]) || 0;
                        const perDaySalary = enteredSalary ? enteredSalary / fullMonthDays : 0;
                        const finalSalary = enteredSalary ? (enteredSalary - effectiveDeductionDays * perDaySalary).toFixed(2) : "";

                        return (
                          <tr key={emp.employeeId}>
                            <td>{index + 1}</td>
                            <td>{emp.employeeId}</td>
                            <td className="employee-name">{emp.employeeName}</td>
                            {dailyStatuses.map((status, i) => (
                              <td key={i} className={`status ${status.toLowerCase().replace('-', '')}`}>
                                {status}
                              </td>
                            ))}
                            <td>{totalWorkingDays}</td>
                            <td>{totalPresent}</td>
                            <td>{totalAbsent}</td>
                            <td>{summary.CasualLeave}</td>
                            <td>{summary.LossOfPay}</td>
                            <td>{summary.SaturdayOff}</td>
                            <td>{summary.HalfDay}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AttendanceReport;