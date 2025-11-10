// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import { useNavigate } from "react-router-dom";
// import "./PunchReport.css";

// const PunchLogTable = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [showExtraColumns, setShowExtraColumns] = useState(true);

//   // Function to convert date string to Date object for proper sorting
//   const parseDate = (dateStr) => {
//     if (!dateStr) return new Date(0); // Return very old date if no date
//     const parts = dateStr.split('/');
//     if (parts.length === 3) {
//       return new Date(parts[2], parts[1] - 1, parts[0]);
//     }
//     return new Date(dateStr); // Fallback for other formats
//   };

//   // Fetch Punch Data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/dailypunch1`, {
//           from_date: fromDate,
//           to_date: toDate,
//           employeeId: "",
//           punchType: "",
//           employeeName: ""
//         });

//         // Sort data by date
//         const sortedData = (response.data || []).sort((a, b) => {
//           return parseDate(a.date) - parseDate(b.date);
//         });

//         setData(sortedData);
//         setFilteredData(sortedData);
//         setError(null);
//         const uniqueEmployees = [...new Set(response.data.map(item => item.employeeName))];
//         setEmployees(uniqueEmployees);
//       } catch (err) {
//         setError("Error fetching data. Please try again.");
//         setData([]);
//         setFilteredData([]);
//         setEmployees([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [fromDate, toDate]);

//   useEffect(() => {
//     if (!data || data.length === 0) {
//       setFilteredData([]);
//       return;
//     }

//     let filtered = [...data];

//     if (punchType === "Late Punches") {
//       filtered = filtered.filter((item) => item.lateIn && item.lateIn !== "");
//     } else if (punchType === "In") {
//       filtered = filtered.filter((item) => item.punchIn && item.punchIn.length > 0);
//     } else if (punchType === "Out") {
//       filtered = filtered.filter((item) => item.punchOut && item.punchOut.length > 0);
//     }

//     if (selectedEmployee) {
//       filtered = filtered.filter((item) =>
//         item.employeeName && item.employeeName === selectedEmployee
//       );
//     }

//     setFilteredData(filtered);
//   }, [data, punchType, selectedEmployee]);

//   const handleExport = () => {
//     if (!filteredData || filteredData.length === 0) return;

//     const exportData = filteredData.map((item) => ({
//       EmployeeName: item.employeeName || "",
//       Place: item.place || "",
//       Date: item.date || "",
//       PunchIn: item.punchIn ? item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(", ") : "",
//       PunchOut: item.punchOut ? item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(", ") : "",
//       TotalHours: item.totalHours || "",
//       BreakHours: item.breakHours || "",
//       TotalWorkingHours: item.netWorkingHours || "",
//       LateIn: item.lateIn || "",
//       EarlyOut: item.earlyOut || "",
//       Device: item.device || "",
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "PunchLog");
//     XLSX.writeFile(wb, "PunchLogData.xlsx");
//   };

//   const handleEdit = (employeeId, date) => {
//     navigate("/dashboard/PunchCorrectionForm", {
//       state: { employeeId, fromDate: date, toDate: date },
//     });
//   };

//   // Format time for display
//   const formatTime = (timeString) => {
//     if (!timeString) return "--";
//     try {
//       return new Date(timeString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     } catch {
//       return "--";
//     }
//   };

//   return (
//     <div className="container">
//       <div className="header-container">
//         <div></div>
//         <h1 className="header-title">Punch Report</h1>
//         <button onClick={() => setShowExtraColumns(!showExtraColumns)} className="toggle-columns-btn">
//           {showExtraColumns ? "Hide Extra Columns" : "Show Extra Columns"}
//         </button>
//       </div>

//       <div className="filters">
//         <div className="filter-item">
//           <label>From Date:</label>
//           <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div className="filter-item">
//           <label>To Date:</label>
//           <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div className="filter-item">
//           <label>Punch Type:</label>
//           <select value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div className="filter-item">
//           <label>Employee:</label>
//           <select
//             value={selectedEmployee}
//             onChange={(e) => setSelectedEmployee(e.target.value)}
//           >
//             <option value="">All Employees</option>
//             {employees.map((emp, index) => (
//               <option key={index} value={emp}>
//                 {emp}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button className="export-btn" onClick={handleExport}>
//           Export
//         </button>
//       </div>

//       {loading ? (
//         <div className="no-records">Loading...</div>
//       ) : error ? (
//         <div className="no-records">{error}</div>
//       ) : (
//         <div className="table-container">
//           <table>
//             <thead>
//               <tr className="table-header-row">
//                 {showExtraColumns ? (
//                   <>
//                     <th>S.No</th>
//                     <th>Employee Name</th>
//                     <th>Place</th>
//                     <th>Date</th>
//                     <th>Punch In</th>
//                     <th>Punch Out</th>
//                     <th>Total Hours</th>
//                     <th>Break</th>
//                     <th>Working Hrs</th>
//                     <th>Late In</th>
//                     <th>Early Out</th>
//                     <th>Device</th>
//                   </>
//                 ) : (
//                   <>
//                     <th>S.No</th>
//                     <th>Employee Name</th>
//                     <th>Date</th>
//                     <th>Punch In</th>
//                     <th>Punch Out</th>
//                     <th>Working Hrs</th>
//                   </>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData && filteredData.length > 0 ? (
//                 filteredData.map((item, index) => (
//                   <tr key={item.key || index}>
//                     <td>{index + 1}</td>
//                     <td className="whitespace-nowrap">{item.employeeName || "--"}</td>

//                     {showExtraColumns ? (
//                       <>
//                         <td>{item.place || "--"}</td>
//                         <td className="whitespace-nowrap">{item.date || "--"}</td>
//                         <td>
//                           {item.punchIn && item.punchIn.length > 0 ? (
//                             item.punchIn.map((time, i) => (
//                               <div key={i} className="punch-time">
//                                 {formatTime(time)}
//                               </div>
//                             ))
//                           ) : (
//                             <div className="punch-time">--</div>
//                           )}
//                         </td>
//                         <td>
//                           {item.punchOut && item.punchOut.length > 0 ? (
//                             item.punchOut.map((time, i) => (
//                               <div key={i} className="punch-time">
//                                 {formatTime(time)}
//                               </div>
//                             ))
//                           ) : (
//                             <div className="punch-time">--</div>
//                           )}
//                         </td>
//                         <td className="total-hours-cell">{item.totalHours || "--"}</td>
//                         <td>{item.breakHours || "--"}</td>
//                         <td className="total-hours-cell">{item.netWorkingHours || "--"}</td>
//                         <td className={item.lateIn ? "late-text" : ""}>{item.lateIn || "--"}</td>
//                         <td className={item.earlyOut ? "early-text" : ""}>{item.earlyOut || "--"}</td>
//                         <td className={item.device === "Device1" ? "device-text" : "device2-text"}>{item.device || "--"}</td>
//                       </>
//                     ) : (
//                       <>
//                         <td className="whitespace-nowrap">{item.date || "--"}</td>
//                         <td>
//                           {item.punchIn && item.punchIn.length > 0 ? (
//                             <div className="punch-time-compact">
//                               {item.punchIn.map((time, i) => (
//                                 <span key={i}>
//                                   {formatTime(time)}
//                                   {i < item.punchIn.length - 1 ? ", " : ""}
//                                 </span>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="punch-time">--</div>
//                           )}
//                         </td>
//                         <td>
//                           {item.punchOut && item.punchOut.length > 0 ? (
//                             <div className="punch-time-compact">
//                               {item.punchOut.map((time, i) => (
//                                 <span key={i}>
//                                   {formatTime(time)}
//                                   {i < item.punchOut.length - 1 ? ", " : ""}
//                                 </span>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="punch-time">--</div>
//                           )}
//                         </td>
//                         <td className="total-hours-cell">{item.netWorkingHours || "--"}</td>
//                       </>
//                     )}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={showExtraColumns ? 12 : 6} className="no-records">
//                     No records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;


import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import "./PunchReport.css";

const PunchLogTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [punchType, setPunchType] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showExtraColumns, setShowExtraColumns] = useState(true);

  // Function to convert date string to Date object for proper sorting
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date(dateStr);
  };

  // Fetch Punch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/dailypunch1`, {
          from_date: fromDate,
          to_date: toDate,
          employeeId: "",
          punchType: "",
          employeeName: ""
        });

        const sortedData = (response.data || []).sort((a, b) => {
          return parseDate(a.date) - parseDate(b.date);
        });

        setData(sortedData);
        setFilteredData(sortedData);
        setError(null);
        const uniqueEmployees = [...new Set(response.data.map(item => item.employeeName))];
        setEmployees(uniqueEmployees);
      } catch (err) {
        setError("Error fetching data. Please try again.");
        setData([]);
        setFilteredData([]);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fromDate, toDate]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    let filtered = [...data];

    if (punchType === "Late Punches") {
      filtered = filtered.filter((item) => item.lateIn && item.lateIn !== "");
    } else if (punchType === "In") {
      filtered = filtered.filter((item) => item.punchIn && item.punchIn.length > 0);
    } else if (punchType === "Out") {
      filtered = filtered.filter((item) => item.punchOut && item.punchOut.length > 0);
    }

    if (selectedEmployee) {
      filtered = filtered.filter((item) =>
        item.employeeName && item.employeeName === selectedEmployee
      );
    }

    setFilteredData(filtered);
  }, [data, punchType, selectedEmployee]);

  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) return;

    const exportData = filteredData.map((item) => ({
      EmployeeName: item.employeeName || "",
      Place: item.place || "",
      Date: item.date || "",
      PunchIn: item.punchIn ? item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(", ") : "",
      PunchOut: item.punchOut ? item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(", ") : "",
      TotalHours: item.totalHours || "",
      BreakHours: item.breakHours || "",
      TotalWorkingHours: item.netWorkingHours || "",
      LateIn: item.lateIn || "",
      EarlyOut: item.earlyOut || "",
      Device: item.device || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PunchLog");
    XLSX.writeFile(wb, "PunchLogData.xlsx");
  };

  const handleEdit = (employeeId, date) => {
    navigate("/dashboard/PunchCorrectionForm", {
      state: { employeeId, fromDate: date, toDate: date },
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "--";
    try {
      return new Date(timeString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "--";
    }
  };

  // Helper to check if the date is Saturday
  const isSaturday = (dateStr) => {
    const date = parseDate(dateStr);
    return date.getDay() === 6; // 6 means Saturday
  };

  return (
    <div className="container">
      <div className="header-container">
        <div></div>
        <h1 className="header-title">Punch Report</h1>
        <button onClick={() => setShowExtraColumns(!showExtraColumns)} className="toggle-columns-btn">
          {showExtraColumns ? "Hide Extra Columns" : "Show Extra Columns"}
        </button>
      </div>

      <div className="filters">
        <div className="filter-item">
          <label>From Date:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>To Date:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>Punch Type:</label>
          <select value={punchType} onChange={(e) => setPunchType(e.target.value)}>
            <option value="">All</option>
            <option value="In">In Punches</option>
            <option value="Out">Out Punches</option>
            <option value="Late Punches">Late Punches</option>
          </select>
        </div>
        <div className="filter-item">
          <label>Employee:</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">All Employees</option>
            {employees.map((emp, index) => (
              <option key={index} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>
        <button className="export-btn" onClick={handleExport}>
          Export
        </button>
      </div>

      {loading ? (
        <div className="no-records">Loading...</div>
      ) : error ? (
        <div className="no-records">{error}</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr className="table-header-row">
                {showExtraColumns ? (
                  <>
                    <th>S.No</th>
                    <th>Employee Name</th>
                    <th>Place</th>
                    <th>Date</th>
                    <th>Punch In</th>
                    <th>Punch Out</th>
                    <th>Total Hours</th>
                    <th>Break</th>
                    <th>Working Hrs</th>
                    <th>Late In</th>
                    <th>Early Out</th>
                    <th>Device</th>
                  </>
                ) : (
                  <>
                    <th>S.No</th>
                    <th>Employee Name</th>
                    <th>Date</th>
                    <th>Punch In</th>
                    <th>Punch Out</th>
                    <th>Working Hrs</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  // Check if it's Saturday
                  const saturday = isSaturday(item.date);

                  // On Saturday, hide EarlyOut display
                  const displayEarlyOut = saturday ? "--" : (item.earlyOut || "--");

                  return (
                    <tr key={item.key || index}>
                      <td>{index + 1}</td>
                      <td className="whitespace-nowrap">{item.employeeName || "--"}</td>

                      {showExtraColumns ? (
                        <>
                          <td>{item.place || "--"}</td>
                          <td className="whitespace-nowrap">{item.date || "--"}</td>
                          <td>
                            {item.punchIn && item.punchIn.length > 0 ? (
                              item.punchIn.map((time, i) => (
                                <div key={i} className="punch-time">
                                  {formatTime(time)}
                                </div>
                              ))
                            ) : (
                              <div className="punch-time">--</div>
                            )}
                          </td>
                          <td>
                            {item.punchOut && item.punchOut.length > 0 ? (
                              item.punchOut.map((time, i) => (
                                <div key={i} className="punch-time">
                                  {formatTime(time)}
                                </div>
                              ))
                            ) : (
                              <div className="punch-time">--</div>
                            )}
                          </td>
                          <td className="total-hours-cell">{item.totalHours || "--"}</td>
                          <td>{item.breakHours || "--"}</td>
                          <td className="total-hours-cell">{item.netWorkingHours || "--"}</td>
                          <td className={item.lateIn ? "late-text" : ""}>{item.lateIn || "--"}</td>
                          <td className={item.earlyOut ? "early-text" : ""}>{displayEarlyOut}</td>
                          <td className={item.device === "Device1" ? "device-text" : "device2-text"}>{item.device || "--"}</td>
                        </>
                      ) : (
                        <>
                          <td className="whitespace-nowrap">{item.date || "--"}</td>
                          <td>
                            {item.punchIn && item.punchIn.length > 0 ? (
                              <div className="punch-time-compact">
                                {item.punchIn.map((time, i) => (
                                  <span key={i}>
                                    {formatTime(time)}
                                    {i < item.punchIn.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="punch-time">--</div>
                            )}
                          </td>
                          <td>
                            {item.punchOut && item.punchOut.length > 0 ? (
                              <div className="punch-time-compact">
                                {item.punchOut.map((time, i) => (
                                  <span key={i}>
                                    {formatTime(time)}
                                    {i < item.punchOut.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="punch-time">--</div>
                            )}
                          </td>
                          <td className="total-hours-cell">{item.netWorkingHours || "--"}</td>
                        </>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={showExtraColumns ? 12 : 6} className="no-records">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PunchLogTable;
