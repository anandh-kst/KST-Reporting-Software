
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./PunchCorrectionForm.css";

// const PunchCorrectionForm = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [groupedPunches, setGroupedPunches] = useState([]);

//   const today = new Date().toISOString().split("T")[0];
//   const [fromDate, setFromDate] = useState(today);
//   const [toDate, setToDate] = useState(today);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const payload = { from_date: fromDate, to_date: toDate };

//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         const updated = response.data
//           .filter((item) => item.isActive === 1) 
//           .map((item) => ({
//             ...item,
//             manual: false,
//           }));

//         setData(updated);
//         setFilteredData(updated);
//         setError(null);
//       } catch (err) {
//         setError("Error fetching data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (fromDate && toDate) fetchFilteredData();
//   }, [fromDate, toDate]);

//   useEffect(() => {
//     const fetchEmployeeList = async () => {
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/employee_list/`
//         );
//         if (response.data.status === "Success") {
//           setEmployeeList(response.data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching employee list:", err);
//       }
//     };
//     fetchEmployeeList();
//   }, []);

//   useEffect(() => {
//     let filtered = [...data];
//     if (selectedEmployeeId) {
//       filtered = filtered.filter(
//         (item) => item.employeeId === selectedEmployeeId
//       );
//     }
//     setFilteredData(filtered);
//   }, [selectedEmployeeId, data]);

//   // Don't update state during render. Use useEffect instead.
//   useEffect(() => {
//     const newGroupedData = [];

//     filteredData.forEach((item) => {
//       const key = `${item.employeeId}-${new Date(
//         item.logTime
//       ).toLocaleDateString("en-GB")}`;
//       let group = newGroupedData.find((g) => g.key === key);

//       if (!group) {
//         group = {
//           key,
//           employeeId: item.employeeId,
//           employeeName:
//             employeeList.find((emp) => emp.employeeId === item.employeeId)
//               ?.employeeName || item.employeeId,
//           date: new Date(item.logTime).toLocaleDateString("en-GB"),
//           punches: [],
//         };
//         newGroupedData.push(group);
//       }

//       group.punches.push({
//         ...item,
//         time: formatAMPM(new Date(item.logTime)),
//         originalDate: new Date(item.logTime),
//       });

//       group.punches.sort((a, b) => a.originalDate - b.originalDate);
//     });

//     setGroupedPunches(newGroupedData);
//   }, [filteredData, employeeList]);

//   const handlePunchChange = (groupIndex, punchIndex, newTime) => {
//     const updated = [...groupedPunches];
//     updated[groupIndex].punches[punchIndex].time = newTime;
//     updated[groupIndex].punches[punchIndex].manual = true;
//     setGroupedPunches(updated);
//   };

//   function formatAMPM(date) {
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     const h = hours % 12 || 12;
//     const m = minutes < 10 ? `0${minutes}` : minutes;
//     return `${h}:${m} ${ampm}`;
//   }

//   const convertTo24HrFormat = (timeStr, dateStr) => {
//     const [time, modifier] = timeStr.split(" ");
//     let [hours, minutes] = time.split(":").map(Number);

//     if (modifier === "PM" && hours !== 12) hours += 12;
//     if (modifier === "AM" && hours === 12) hours = 0;

//     const timeFormatted = `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}:00`;

//     return `${dateStr.split("/").reverse().join("-")} ${timeFormatted}`;
//   };

//   const handleSave = async (group) => {
//     const updatedPunches = group.punches.filter((p) => p.manual);

//     if (updatedPunches.length === 0) {
//       alert("No manual changes to save.");
//       return;
//     }

//     try {
//       for (const punch of updatedPunches) {
//         const formattedTime = convertTo24HrFormat(punch.time, group.date);

//         const payload = {
//           id: punch.id,
//           employeeId: group.employeeId,
//           logType: punch.logType,
//           newLogTime: formattedTime,
//         };

//         await axios.post(
//           `${process.env.REACT_APP_API_URL}/post_manual_punch_update`,
//           payload
//         );
//       }

//       alert("Punch corrections saved successfully!");
//     } catch (err) {
//       console.error("Error saving manual punch:", err);
//       alert(
//         "Failed to save some or all corrections. Check console for details."
//       );
//     }
//   };
  

//   return (
//     <div className="form-container">
//       <h2>Punch Correction Form</h2>

//       <div className="filters">
//         <div className="filter-item">
//           <label>From Date:</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>
//         <div className="filter-item">
//           <label>To Date:</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>
//         <div className="filter-item">
//           <label>Employee Name:</label>
//           <select
//             value={selectedEmployeeId}
//             onChange={(e) => setSelectedEmployeeId(e.target.value)}
//           >
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>
//                 {emp.employeeName}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {groupedPunches.map((group, groupIndex) => (
//         <div key={group.key} className="punch-table-wrapper">
//           <h4>
//             {group.employeeName} - {group.date}
//           </h4>
//           <table className="punch-table">
//             <thead>
//               <tr>
//                 <th>S.No</th>
//                 <th>Punch Type</th>
//                 <th>Punch Time</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {group.punches.map((punch, punchIndex) => (
//                 <tr key={punchIndex}>
//                   <td>{punchIndex + 1}</td>
//                   <td>
//                     <span>{punch.logType}</span>
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       value={punch.time || ""}
//                       placeholder="HH:MM AM/PM"
//                       onChange={(e) =>
//                         handlePunchChange(
//                           groupIndex,
//                           punchIndex,
//                           e.target.value
//                         )
//                       }
//                     />
//                   </td>
//                   <td>
//                     {punch.time === "" ? (
//                       <span className="missing">Missing</span>
//                     ) : punch.manual ? (
//                       <span className="manual">Manual</span>
//                     ) : (
//                       <span>{punch.device}</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button className="save-button" onClick={() => handleSave(group)}>
//             Save Changes
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PunchCorrectionForm;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PunchCorrectionForm.css";

const PunchCorrectionForm = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [groupedPunches, setGroupedPunches] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const punchesPerPage = 5;

  const payload = { from_date: fromDate, to_date: toDate };

  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/dailypunch`,
          payload
        );
        const updated = response.data
          .filter((item) => item.isActive === 1)
          .map((item) => ({
            ...item,
            manual: false,
          }));

        setData(updated);
        setFilteredData(updated);
        setError(null);
      } catch (err) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (fromDate && toDate) fetchFilteredData();
  }, [fromDate, toDate]);

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/employee_list/`
        );
        if (response.data.status === "Success") {
          setEmployeeList(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching employee list:", err);
      }
    };
    fetchEmployeeList();
  }, []);

  useEffect(() => {
    let filtered = [...data];
    if (selectedEmployeeId) {
      filtered = filtered.filter(
        (item) => item.employeeId === selectedEmployeeId
      );
    }
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on filter
  }, [selectedEmployeeId, data]);

  useEffect(() => {
    const newGroupedData = [];

    filteredData.forEach((item) => {
      const key = `${item.employeeId}-${new Date(
        item.logTime
      ).toLocaleDateString("en-GB")}`;
      let group = newGroupedData.find((g) => g.key === key);

      if (!group) {
        group = {
          key,
          employeeId: item.employeeId,
          employeeName:
            employeeList.find((emp) => emp.employeeId === item.employeeId)
              ?.employeeName || item.employeeId,
          date: new Date(item.logTime).toLocaleDateString("en-GB"),
          punches: [],
        };
        newGroupedData.push(group);
      }

      group.punches.push({
        ...item,
        time: formatAMPM(new Date(item.logTime)),
        originalDate: new Date(item.logTime),
      });

      group.punches.sort((a, b) => a.originalDate - b.originalDate);
    });

    setGroupedPunches(newGroupedData);
  }, [filteredData, employeeList]);

  const handlePunchChange = (groupIndex, punchIndex, newTime) => {
    const updated = [...groupedPunches];
    const globalGroupIndex = indexOfFirstGroup + groupIndex;
    updated[globalGroupIndex].punches[punchIndex].time = newTime;
    updated[globalGroupIndex].punches[punchIndex].manual = true;
    setGroupedPunches(updated);
  };

  function formatAMPM(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    return `${h}:${m} ${ampm}`;
  }

  const convertTo24HrFormat = (timeStr, dateStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const timeFormatted = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;

    return `${dateStr.split("/").reverse().join("-")} ${timeFormatted}`;
  };

  const handleSave = async (group) => {
    const updatedPunches = group.punches.filter((p) => p.manual);

    if (updatedPunches.length === 0) {
      alert("No manual changes to save.");
      return;
    }

    try {
      for (const punch of updatedPunches) {
        const formattedTime = convertTo24HrFormat(punch.time, group.date);

        const payload = {
          id: punch.id,
          employeeId: group.employeeId,
          logType: punch.logType,
          newLogTime: formattedTime,
        };

        await axios.post(
          `${process.env.REACT_APP_API_URL}/post_manual_punch_update`,
          payload
        );
      }

      alert("Punch corrections saved successfully!");
    } catch (err) {
      console.error("Error saving manual punch:", err);
      alert("Failed to save some or all corrections. Check console for details.");
    }
  };

  // Pagination logic
  const indexOfLastGroup = currentPage * punchesPerPage;
  const indexOfFirstGroup = indexOfLastGroup - punchesPerPage;
  const currentGroups = groupedPunches.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(groupedPunches.length / punchesPerPage);

  return (
    <div className="form-container">
     <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Punch Correction Form</h2>

      <div className="filters">
        <div className="filter-item">
          <label>From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Employee Name:</label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">All</option>
            {employeeList.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentGroups.map((group, groupIndex) => (
        <div key={group.key} className="punch-table-wrapper">
          <h4>
            {group.employeeName} - {group.date}
          </h4>
          <table className="punch-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Punch Type</th>
                <th>Punch Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {group.punches.map((punch, punchIndex) => (
                <tr key={punchIndex}>
                  <td>{punchIndex + 1}</td>
                  <td>
                    <span>{punch.logType}</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={punch.time || ""}
                      placeholder="HH:MM AM/PM"
                      onChange={(e) =>
                        handlePunchChange(groupIndex, punchIndex, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    {punch.time === "" ? (
                      <span className="missing">Missing</span>
                    ) : punch.manual ? (
                      <span className="manual">Manual</span>
                    ) : (
                      <span>{punch.device}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="save-button" onClick={() => handleSave(group)}>
            Save Changes
          </button>
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PunchCorrectionForm;

