// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
//   const [remarks, setRemarks] = useState({});
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("");

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

//   const fetchLeaveApplications = async (
//     startDate,
//     endDate,
//     employeeId = ""
//   ) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
//         {
//           startDate: startDate,
//           endDate: endDate,
//         }
//       );

//       let filteredData = response.data.data || [];

//       if (employeeId) {
//         filteredData = filteredData.filter(
//           (leave) => leave.Employee_id === employeeId
//         );
//       }

//       if (selectedStatus) {
//         filteredData = filteredData.filter(
//           (leave) => leave.status === selectedStatus
//         );
//       }

//       setLeaveApplications(filteredData);
//     } catch (error) {
//       console.error("Error fetching leave applications:", error);
//     }
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//   }, [fromDate, toDate, selectedEmployeeId, selectedStatus]);

//   const handleAccept = (id, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then(() => fetchLeaveApplications(fromDate, toDate, selectedEmployeeId))
//       .catch((error) => console.error("Error accepting leave:", error));
//   };

//   const handleReject = (id, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then(() => fetchLeaveApplications(fromDate, toDate, selectedEmployeeId))
//       .catch((error) => console.error("Error rejecting leave:", error));
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   const getStatusStyleNew = (status) => {
//     let backgroundColor = "";
//     let textColor = "";

//     switch (status) {
//       case "Pending":
//         backgroundColor = "#ffe0b2"; // Light orange
//         textColor = "#f57c00"; // Dark orange
//         break;
//       case "Accepted":
//         backgroundColor = "#b9f6ca"; // Light green
//         textColor = "#00c853"; // Dark green
//         break;
//       case "Rejected":
//         backgroundColor = "#ffcdd2"; // Light red
//         textColor = "#e53935"; // Dark red
//         break;
//       default:
//         backgroundColor = "#e0e0e0"; // Light grey
//         textColor = "#757575"; // Dark grey
//     }

//     return {
//       backgroundColor,
//       color: textColor,
//       fontWeight: "bold",
//       borderRadius: "20px",
//       padding: "4px 8px",
//       textAlign: "center",
//       display: "inline-block",
//       fontSize: "0.875rem",
//     };
//   };

//   return (
//     <div style={containerStyle}>
//       <div style={filterContainerStyle}>
//         <div style={filterItemStyle}>
//           <label htmlFor="fromDate">From Date:</label>
//           <input
//             type="date"
//             id="fromDate"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             style={inputStyle}
//           />
//         </div>

//         <div style={filterItemStyle}>
//           <label htmlFor="toDate">To Date:</label>
//           <input
//             type="date"
//             id="toDate"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             style={inputStyle}
//           />
//         </div>

//         <div style={filterItemStyle}>
//           <label htmlFor="employee">Employee:</label>
//           <select
//             id="employee"
//             value={selectedEmployeeId}
//             onChange={(e) => setSelectedEmployeeId(e.target.value)}
//             style={inputStyle}
//           >
//             <option value="">All Employees</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>
//                 {emp.employeeName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div style={filterItemStyle}>
//           <label htmlFor="status">Status:</label>
//           <select
//             id="status"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             style={inputStyle}
//           >
//             <option value="">All</option>
//             <option value="Pending">Pending</option>
//             <option value="Accepted">Accepted</option>
//             <option value="Rejected">Rejected</option>
//           </select>
//         </div>
//       </div>

//       <div style={{ overflowX: "auto" }}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           <table style={tableStyle}>
//             <thead>
//               <tr>
//                 <th>Employee Name</th>
//                 <th>Start Date</th>
//                 <th>End Date</th>
//                 <th>Applied On</th>
//                 <th>Type</th>
//                 <th>Days</th>
//                 <th>Leave Time</th>
//                 <th>Reason</th>
//                 <th>Remarks</th>
//                 <th>Actions</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leaveApplications.map((leave) => (
//                 <tr key={leave.lid}>
//                   <td>{leave.employeeName}</td>
//                   <td style={{ whiteSpace: "nowrap" }}>
//                     {moment(leave.startDate).format("YYYY-MM-DD")}
//                   </td>
//                   <td style={{ whiteSpace: "nowrap" }}>
//                     {moment(leave.endDate).format("YYYY-MM-DD")}
//                   </td>
//                   <td style={{ whiteSpace: "nowrap" }}>
//                     {leave.createdAt
//                       ? moment(leave.createdAt).format("YYYY-MM-DD HH:mm")
//                       : "N/A"}
//                   </td>
//                   <td style={{ whiteSpace: "nowrap" }}>{leave.leaveTypes}</td>
//                   <td>{leave.noOfDays}</td>
//                   <td>{leave.leaveTimes}</td>
//                   <td>
//                     <textarea
//                       value={leave.reason}
//                       readOnly
//                       style={textareaStyle}
//                     />
//                   </td>
//                   <td>
//                     <textarea
//                       id={`remarks-${leave.lid}`}
//                       value={remarks[leave.lid] || leave.rejectReason || ""}
//                       onChange={(e) => handleRemarksChange(leave.lid, e)}
//                       style={textareaStyle}
//                     />
//                   </td>
//                   <td className="px-4 py-2">
//                     {leave.status === "Pending" && (
//                       <div className="flex items-center gap-1 flex-wrap">
//                         <button
//                           onClick={() =>
//                             handleAccept(
//                               leave.lid,
//                               document.getElementById(`remarks-${leave.lid}`)
//                                 .value
//                             )
//                           }
//                           className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-green-200 transition-all"
//                         >
//                           Accept
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleReject(
//                               leave.lid,
//                               document.getElementById(`remarks-${leave.lid}`)
//                                 .value
//                             )
//                           }
//                           className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-red-200 transition-all"
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-4 py-2">
//                     <span style={getStatusStyleNew(leave.status)}>
//                       {leave.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// // ========== STYLES ==========

// const containerStyle = {
//   padding: "20px",
//   fontFamily: "Arial, sans-serif",
// };

// const filterContainerStyle = {
//   display: "flex",
//   gap: "20px",
//   flexWrap: "wrap",
//   marginBottom: "20px",
//   backgroundColor: "#f8f9fa",
//   padding: "20px",
//   borderRadius: "10px",
//   border: "1px solid #dee2e6",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
// };

// const filterItemStyle = {
//   display: "flex",
//   flexDirection: "column",
//   minWidth: "180px",
// };

// const inputStyle = {
//   padding: "8px",
//   borderRadius: "6px",
//   border: "1px solid #ced4da",
//   fontSize: "14px",
//   backgroundColor: "#fff",
//   boxShadow: "inset 0 1px 2px rgba(0,0,0,0.075)",
// };

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
// };

// const textareaStyle = {
//   width: "100%",
//   minHeight: "40px",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   padding: "5px",
//   fontFamily: "inherit",
// };

// const getStatusStyle = (status) => {
//   const base = {
//     fontWeight: "bold",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     padding: "4px",
//     textAlign: "center",
//   };
//   switch (status) {
//     case "Pending":
//       return { ...base, color: "orange" };
//     case "Accepted":
//       return { ...base, color: "green" };
//     case "Rejected":
//       return { ...base, color: "red" };
//     default:
//       return base;
//   }
// };

// const acceptButtonStyle = {
//   backgroundColor: "#28a745",
//   color: "#fff",
//   border: "none",
//   borderRadius: "4px",
//   padding: "5px 10px",
//   marginBottom: "5px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "#dc3545",
//   color: "#fff",
//   border: "none",
//   borderRadius: "4px",
//   padding: "5px 10px",
//   cursor: "pointer",
// };

// // Global style adjustments for responsiveness
// const styleSheet = document.styleSheets[0];
// styleSheet.insertRule(
//   `table, th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }`,
//   styleSheet.cssRules.length
// );
// styleSheet.insertRule(
//   `tbody tr:nth-child(odd) { background-color: #f9f9f9; }`,
//   styleSheet.cssRules.length
// );
// styleSheet.insertRule(
//   `tbody tr:hover { background-color: #f1f1f1; }`,
//   styleSheet.cssRules.length
// );
// styleSheet.insertRule(
//   `thead th {
//     background-color: #e5e7eb;
//     color:#111827;;
//     position: sticky;
//     top: 0;
//     z-index: 2;
//   }`,
//   styleSheet.cssRules.length
// );
// styleSheet.insertRule(
//   `button:hover {
//     opacity: 0.9;
//     transform: scale(1.02);
//     transition: all 0.2s ease;
//   }`,
//   styleSheet.cssRules.length
// );

// // Media queries for responsive design
// styleSheet.insertRule(
//   `@media (max-width: 768px) {
//     .table-container {
//       overflow-x: auto;
//     }
//     table {
//       width: 100%;
//       display: block;
//       overflow-x: auto;
//       white-space: nowrap;
//     }
//     th, td {
//       padding: 10px;
//       font-size: 14px;
//     }
//     .filterContainerStyle {
//       flex-direction: column;
//     }
//     .filterItemStyle {
//       width: 100%;
//       margin-bottom: 10px;
//     }
//   }`,
//   styleSheet.cssRules.length
// );

// export default LeaveApplications;

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LeaveApplications = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { isAuth, userData } = useSelector((state) => state.login);
    const navigate = useNavigate();

    useEffect(() => {
    if (userData.userType !== "Admin") {
      navigate("/dashboard/dashboards");
    }
  }, []);

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

  const fetchLeaveApplications = async (
    startDate,
    endDate,
    employeeId = ""
  ) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
        {
          startDate: startDate,
          endDate: endDate,
        }
      );

      let filteredData = response.data.data || [];

      if (employeeId) {
        filteredData = filteredData.filter(
          (leave) => leave.Employee_id === employeeId
        );
      }

      if (selectedStatus) {
        filteredData = filteredData.filter(
          (leave) => leave.status === selectedStatus
        );
      }

      setLeaveApplications(filteredData);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    }
  };

  useEffect(() => {
    fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
  }, [fromDate, toDate, selectedEmployeeId, selectedStatus]);

  const handleAccept = (id, remarks) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
        leaveId: id,
        remarks,
        status: "Accepted",
      })
      .then(() => fetchLeaveApplications(fromDate, toDate, selectedEmployeeId))
      .catch((error) => console.error("Error accepting leave:", error));
  };

  const handleReject = (id, remarks) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
        leaveId: id,
        remarks,
        status: "Rejected",
      })
      .then(() => fetchLeaveApplications(fromDate, toDate, selectedEmployeeId))
      .catch((error) => console.error("Error rejecting leave:", error));
  };

  const handleRemarksChange = (lid, event) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [lid]: event.target.value,
    }));
  };

  const getStatusStyleNew = (status) => {
    let backgroundColor = "";
    let textColor = "";

    switch (status) {
      case "Pending":
        backgroundColor = "#fff4e5"; // lighter orange background
        textColor = "#e65100"; // dark orange text
        break;
      case "Accepted":
        backgroundColor = "#e8f5e9"; // lighter green background
        textColor = "#2e7d32"; // dark green text
        break;
      case "Rejected":
        backgroundColor = "#ffebee"; // lighter red background
        textColor = "#c62828"; // dark red text
        break;
      default:
        backgroundColor = "#f5f5f5"; // light gray
        textColor = "#616161"; // gray text
    }

    return {
      backgroundColor,
      color: textColor,
      fontWeight: "600",
      borderRadius: "20px",
      padding: "3px 10px",
      fontSize: "0.75rem",
      display: "inline-block",
      minWidth: "70px",
      textAlign: "center",
    };
  };

  return (
    <div className="container">
      <h1 className="font-bold text-center text-black mb-4" style={{ fontSize: '1.5rem' }}>Leave status</h1>
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="fromDate">From Date:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="toDate">To Date:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="employee">Employee:</label>
          <select
            id="employee"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          >
            <option value="">All Employees</option>
            {employeeList.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        {leaveApplications.length === 0 ? (
          <p className="no-data">
            No leave applications available for the selected filters.
          </p>
        ) : (
          <table className="leave-table">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Employee Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Applied On</th>
                <th>Type</th>
                <th>Days</th>
                <th>Leave Time</th>
                <th>Reason</th>
                <th>Remarks</th>
                <th>Actions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveApplications.map((leave, index) => (
                <tr key={leave.lid}>
                  <td>{index + 1}</td>
                  <td>{leave.employeeName}</td>
                  <td className="nowrap">
                    {moment(leave.startDate).format("YYYY-MM-DD")}
                  </td>
                  <td className="nowrap">
                    {moment(leave.endDate).format("YYYY-MM-DD")}
                  </td>
                  <td className="nowrap">
                    {leave.createdAt
                      ? moment(leave.createdAt).format("YYYY-MM-DD HH:mm")
                      : "N/A"}
                  </td>
                  <td>{leave.leaveTypes}</td>
                  <td>{leave.noOfDays}</td>
                  <td>{leave.leaveTimes}</td>
                  <td>
                    <textarea
                      value={leave.reason}
                      readOnly
                      className="reason-textarea"
                    />
                  </td>
                  <td>
                    <textarea
                      id={`remarks-${leave.lid}`}
                      value={remarks[leave.lid] || leave.rejectReason || ""}
                      onChange={(e) => handleRemarksChange(leave.lid, e)}
                      className="remarks-textarea"
                    />
                  </td>
                  <td className="actions-cell">
                    {leave.status === "Pending" && (
                      <div className="actions-buttons">
                        <button
                          onClick={() =>
                            handleAccept(
                              leave.lid,
                              document.getElementById(`remarks-${leave.lid}`)
                                .value
                            )
                          }
                          className="btn accept-btn"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleReject(
                              leave.lid,
                              document.getElementById(`remarks-${leave.lid}`)
                                .value
                            )
                          }
                          className="btn reject-btn"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={getStatusStyleNew(leave.status)}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .container {
          padding: 16px 20px;
          font-size: 14px; /* was 13px */
          color: #333;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 20px;
          background: #f9fafb;
          padding: 18px 20px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.05);
          justify-content: Left;
        }
        .filter-item {
          display: flex;
          flex-direction: column;
          min-width: 180px;
        }
        label {
          font-weight: 600;
          margin-bottom: 6px;
          color: #4b5563;
        }
        input[type="date"],
        select {
          padding: 6px 10px;
          font-size: 14px; /* was 13px */
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #fff;
          transition: border-color 0.2s ease-in-out;
        }
        input[type="date"]:focus,
        select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 3px #93c5fd;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .no-data {
          text-align: center;
          padding: 40px 0;
          color: #6b7280;
          font-style: italic;
          font-size: 15px; /* was 14px */
        }
        table.leave-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px; /* was 12px */
          color: #374151;
          min-width: 900px;
        }
        table.leave-table th,
        table.leave-table td {
          border: 1px solid #e5e7eb;
          padding: 8px 10px;
          vertical-align: middle;
          white-space: normal;
        }
        table.leave-table thead th {
          background-color: #f3f4f6;
          color: #1f2937;
          font-weight: 700;
          text-align: left;
          user-select: none;
        }
        .nowrap {
          white-space: nowrap;
        }
        textarea.reason-textarea,
        textarea.remarks-textarea {
          width: 100%;
          min-height: 36px;
          resize: vertical;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          font-size: 13px; /* was 12px */

          padding: 5px 8px;
          color: #374151;
          background-color: #f9fafb;
        }
        textarea.reason-textarea {
          background-color: #f3f4f6;
          cursor: default;
        }
        .actions-cell {
          width: 110px;
          text-align: center;
          white-space: nowrap;
        }
        .actions-buttons {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        .btn {
          padding: 5px 12px;
          font-size: 13px; /* was 12px */
          font-weight: 600;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
          user-select: none;
        }
        .accept-btn {
          background-color: #22c55e;
          color: white;
        }
        .accept-btn:hover {
          background-color: #16a34a;
        }
        .reject-btn {
          background-color: #ef4444;
          color: white;
        }
        .reject-btn:hover {
          background-color: #b91c1c;
        }
      `}</style>
    </div>
  );
};

export default LeaveApplications;
