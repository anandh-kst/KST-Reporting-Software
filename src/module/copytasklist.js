// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(""); // Track selected employee
//   const [evaluationData, setEvaluationData] = useState({}); // Track evaluation data
//   const [employeeDetails, setEmployeeDetails] = useState(null); // Track selected employee details
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");

//   useEffect(() => {
//     // Fetching employee data if user is Admin
//     if (userType === "Admin") {
//       const fetchEmployeeData = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           if (response.data.status === "Success") {
//             setEmployees(response.data.data); // Set employee list
//           } else {
//             setEmployees([]);
//           }
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       };
//       fetchEmployeeData();
//     }

//     const fetchReportData = async () => {
//       try {
//         const payload = {
//           page: page.toString(),
//           limit: maxDisplayCount,
//           fromDate,
//           toDate,
//           employeeId: selectedEmployee || employeeId, // Filter by selected employee
//         };

//         const apiEndpoint =
//           userType === "Admin" ||
//           userType === "developerAdmin" ||
//           userType === "idcardAdmin"
//             ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);
//         } else {
//           setReportData([]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate && employeeId) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const handleEditClick = (report) => {
//     localStorage.setItem("selectedReport", JSON.stringify(report.id));
//     navigate("/dashboard/employeeTaskEdit");
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value); // Update selected employee
//     setPage(1); // Reset to page 1 when employee is selected
//   };

//   const handleEvaluationChange = (e, reportId) => {
//     const updatedData = { ...evaluationData, [reportId]: { ...evaluationData[reportId], evaluation: e.target.value } };
//     setEvaluationData(updatedData);

//     // Save to localStorage for persistence
//     localStorage.setItem("evaluationData", JSON.stringify(updatedData));
//   };

//   const handleReviewChange = (e, reportId) => {
//     const updatedData = { ...evaluationData, [reportId]: { ...evaluationData[reportId], review: e.target.value } };
//     setEvaluationData(updatedData);

//     // Save to localStorage for persistence
//     localStorage.setItem("evaluationData", JSON.stringify(updatedData));
//   };

//   // Filter the report data by selected employee
//   const filteredData = selectedEmployee
//     ? reportData.filter(item => item.employeeName === selectedEmployee)
//     : reportData;

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   // Retrieve evaluation data from localStorage when the component mounts
//   useEffect(() => {
//     const savedEvaluationData = localStorage.getItem("evaluationData");
//     if (savedEvaluationData) {
//       setEvaluationData(JSON.parse(savedEvaluationData));
//     }
//   }, []); 

//   // Format time safely
//   const formatTime = (time) => {
//     if (time && moment(time, "HH:mm", true).isValid()) {
//       return moment(time).format("HH:mm");
//     }
//     return "Invalid Time";
//   };

//   // Display Employee details when clicked
//   const handleEmployeeDetailsClick = (employee) => {
//     setEmployeeDetails(employee); // Show the details of the selected employee
//   };

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex items-center">
//         <div className="flex">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                 Select Employee:
//               </label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {[
//                   "Abinesh A", "Abarna S", "admin", "Anusuya P","Dinesh M", "Elayaraja T", "Esakki Raj M", 
//                   "Gayathri A", "Jayaram A", "Kowsalya S", "Lakshmi Devi G", "Manimaran A", 
//                   "Nagesha KS", "Nithiksha N", "Rajashree S", "Raja M", "SANJITHA CM", 
//                   "Sowmiyaa. S", "Srinath D"
//                 ]
//                   .sort()
//                   .map((employeeName, index) => (
//                     <option key={index} value={employeeName}>
//                       {employeeName}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {filteredData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//             <thead className="bg-slate-200 sticky top-0 z-10">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
//                 <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
//                 <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
//                 <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
//                 <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
//                 <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
//                 <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
//                 <th className="border px-4 py-2" style={{ width: "750px" }}>Evaluation</th>
//                 <th className="border px-4 py-2" style={{ width: "750px" }}>Review</th>
//                 {userType === "employee" && (
//                   <>
//                     <th className="border px-4 py-2">Edit</th>
//                     <th className="border px-4 py-2">Delete</th>
//                   </>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((item, index) => {
//                 const reportDate = moment(item.date).format("DD-MM-YYYY");

//                 return (
//                   <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                     <td className="border px-4 py-2">{index + 1}</td>
//                     <td className="border px-4 py-2">{reportDate}</td>
//                     <td className="border px-4 py-2 cursor-pointer" onClick={() => handleEmployeeDetailsClick(item)}>
//                       {item.employeeName}
//                     </td>
//                     <td className="border px-4 py-2">{item.customer}</td>
//                     <td className="border px-4 py-2">{item.task}</td>
//                     <td className="border px-4 py-2">{item.estimatedTime}</td>
//                     <td className="border px-4 py-2">{formatTime(item.startTime)}</td>
//                     <td className="border px-4 py-2">{formatTime(item.endTime)}</td>
//                     <td className="border px-4 py-2">{item.status}</td>
//                     <td className="border px-4 py-2">{item.reasonForIncomplete}</td>
//                     <td className="border px-4 py-2">
//                       <input
//                         type="text"
//                         value={evaluationData[item.id]?.evaluation || ""}
//                         onChange={(e) => handleEvaluationChange(e, item.id)}
//                         placeholder="Add Evaluation"
//                         className="border px-2 py-1 rounded"
//                       />
//                     </td>
//                     <td className="border px-4 py-2">
//                       <input
//                         type="text"
//                         value={evaluationData[item.id]?.review || ""}
//                         onChange={(e) => handleReviewChange(e, item.id)}
//                         placeholder="Add Review"
//                         className="border px-2 py-1 rounded"
//                       />
//                     </td>
//                     {userType === "employee" && (
//                       <>
//                         <td className="border px-4 py-2">
//                           <button
//                             onClick={() => handleEditClick(item)}
//                             className="text-blue-500 hover:text-blue-700"
//                           >
//                             <FontAwesomeIcon icon={faEdit} />
//                           </button>
//                         </td>
//                         <td className="border px-4 py-2">
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <FontAwesomeIcon icon={faTrash} />
//                           </button>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="my-4 text-center text-lg text-gray-500">No records found</div>
//       )}
//     </div>
//   );
// };

// export default EmployeeReportList;











// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [selectedEmployee, setSelectedEmployee] = useState("");  // Track selected employee
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");

//   useEffect(() => {
//     const fetchReportData = async () => {
//       try {
//         const payload = {
//           page: page.toString(),
//           limit: maxDisplayCount,
//           fromDate,
//           toDate,
//           employeeId: selectedEmployee || employeeId, // Filter by selected employee
//         };

//         const apiEndpoint =
//           userType === "Admin" ||
//           userType === "developerAdmin" ||
//           userType === "idcardAdmin"
//             ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);
//         } else {
//           setReportData([]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const handleEditClick = (report) => {
//     localStorage.setItem("selectedReport", JSON.stringify(report.id));
//     navigate("/dashboard/employeeTaskEdit");
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value); // Update selected employee
//     setPage(1); // Reset to page 1 when employee is selected
//   };

//   const handleTextChange = async (e, column, reportId) => {
//     const updatedValue = e.target.value;
//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/api/updateReport/${reportId}`,
//         { [column]: updatedValue }
//       );
//       if (response.data.status === "Success") {
//         // Automatically save the changes
//         setReportData((prevData) =>
//           prevData.map((item) =>
//             item.id === reportId
//               ? { ...item, [column]: updatedValue }
//               : item
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating report:", error);
//     }
//   };

//   const handleSaveClick = (reportId) => {
//     alert("Successfully saved!");
//   };

//   const filteredData = selectedEmployee
//     ? reportData.filter(item => item.employeeName === selectedEmployee)
//     : reportData;

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex items-center">
//         <div className="flex">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                 Select Employee:
//               </label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {[ 
//                   "Abinesh A", "Abarna S", "Dinesh M", "Elayaraja T", "Esakki Raj M", 
//                   "Gayathri A", "Jayaram A", "Kowsalya S", "Lakshmi Devi G", "Manimaran A", 
//                   "Nagesha KS", "Nithiksha N", "Rajashree S", "Raja M", "SANJITHA CM",  
//                   "Sowmiyaa. S", "Srinath D", "Anusuya P", "Revathi S"
//                 ].sort().map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {filteredData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
//                   {(userType === "Admin" || userType === "developerAdmin" || userType === "idcardAdmin") && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Evaluation</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Review</th>
//                   {userType === "employee" && (
//                     <th className="border px-4 py-2">Save</th>
//                   )}
//                   {userType === "employee" && (
//                     <th className="border px-4 py-2">Edit</th>
//                   )}
//                   {userType === "employee" && (
//                     <th className="border px-4 py-2">Delete</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((item, index) => {
//                   const reportDate = moment(item.date).format("DD-MM-YYYY");
//                   const employeeName = item.employeeName || "N/A";

//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       {(userType === "Admin" || userType === "developerAdmin" || userType === "idcardAdmin") && (
//                         <td className="border px-4 py-4">{employeeName}</td>
//                       )}
//                       <td className="border px-4 py-4">{item.customer}</td>
//                       <td className="border px-4 py-4">{item.task}</td>
//                       <td className="border px-4 py-4">{item.estimatedTime}</td>
//                       <td className="border px-4 py-4">{item.startTime}</td>
//                       <td className="border px-4 py-4">{item.endTime}</td>
//                       <td className="border px-4 py-4">{item.taskStatus}</td>
//                       <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                       {/* Editable Evaluation and Review fields for Admin */}
//                       {userType === "Admin" && (
//                         <>
//                           <td className="border px-4 py-4">
//                             <input
//                               type="text"
//                               defaultValue={item.evaluation || ""}
//                               onChange={(e) => handleTextChange(e, "evaluation", item.id)}
//                               className="w-full p-2 rounded border"
//                             />
//                           </td>
//                           <td className="border px-4 py-4">
//                             <input
//                               type="text"
//                               defaultValue={item.review || ""}
//                               onChange={(e) => handleTextChange(e, "review", item.id)}
//                               className="w-full p-2 rounded border"
//                             />
//                           </td>
//                         </>
//                       )}
//                       {/* Save button in employee portal */}
//                       {userType === "employee" && (
//                         <td className="px-4 py-3">
//                           <button
//                             onClick={() => handleSaveClick(item.id)}
//                             className="text-green-500 hover:underline"
//                           >
//                             Save
//                           </button>
//                         </td>
//                       )}
//                       {/* Edit button in employee portal */}
//                       {userType === "employee" && (
//                         <td className="px-4 py-3">
//                           <FontAwesomeIcon
//                             icon={faEdit}
//                             className="text-blue-500 cursor-pointer"
//                             onClick={() => handleEditClick(item)}
//                           />
//                         </td>
//                       )}
//                       {/* Delete button in employee portal */}
//                       {userType === "employee" && (
//                         <td className="px-4 py-3">
//                           <FontAwesomeIcon
//                             icon={faTrash}
//                             className="text-red-500 cursor-pointer"
//                             onClick={() => handleDelete(item.id)}
//                           />
//                         </td>
//                       )}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No data available</div>
//       )}

//       <div className="flex justify-between items-center mt-4">
//         {/* Pagination controls */}
//         <div>
//           <button
//             onClick={() => handlePageChange(page - 1)}
//             disabled={page <= 1}
//             className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//           >
//             Previous
//           </button>
//           <span className="px-4">{`Page ${page} of ${totalPages}`}</span>
//           <button
//             onClick={() => handlePageChange(page + 1)}
//             disabled={page >= totalPages}
//             className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
//           >
//             Next
//           </button>
//         </div>

//         {/* Records per page selection */}
//         <div>
//           <select
//             value={maxDisplayCount}
//             onChange={handleMaxDisplayCountChange}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
//           >
//             <option value="5">5</option>
//             <option value="10">10</option>
//             <option value="20">20</option>
//             <option value="50">50</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EmployeeReportList = () => {
  const { userType } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(10);
  const [selectedEmployee, setSelectedEmployee] = useState("");  // Track selected employee
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const payload = {
          page: page.toString(),
          limit: maxDisplayCount,
          fromDate,
          toDate,
          employeeId: selectedEmployee || employeeId, // Filter by selected employee
        };

        const apiEndpoint =
          userType === "Admin" ||
          userType === "developerAdmin" ||
          userType === "idcardAdmin"
            ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
            : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

        const response = await axios.post(apiEndpoint, payload);
        const { status, data, totalRecords } = response.data;

        if (status === "Success") {
          setTotalRecords(totalRecords);
          setReportData(data || []);
        } else {
          setReportData([]);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setReportData([]);
      }
    };

    fetchReportData();
  }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1);
  };

  const handleEditClick = (report) => {
    localStorage.setItem("selectedReport", JSON.stringify(report.id));
    navigate("/dashboard/employeeTaskEdit");
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`
      );
      if (response.data.status === "Success") {
        alert("Record deleted successfully");
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("An error occurred while deleting the record");
    }
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value); // Update selected employee
    setPage(1); // Reset to page 1 when employee is selected
  };

  const handleTextChange = async (e, column, reportId) => {
    const updatedValue = e.target.value;

    try {
      // Immediately send the update to the backend
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/updateReport/${reportId}`,
        { [column]: updatedValue }
      );

      if (response.data.status === "Success") {
        // Automatically save the changes to the state
        setReportData((prevData) =>
          prevData.map((item) =>
            item.id === reportId ? { ...item, [column]: updatedValue } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const filteredData = selectedEmployee
    ? reportData.filter(item => item.employeeName === selectedEmployee)
    : reportData;

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto">
      <div date-rangepicker className="my-4 flex items-center">
        <div className="flex">
          <input
            type="date"
            name="fromDate"
            value={fromDate}
            onChange={handleDateChange}
            max={today}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
          />
          <input
            type="date"
            name="toDate"
            value={toDate}
            onChange={handleDateChange}
            max={today}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
          />
          {userType === "Admin" && (
            <div className="flex items-center">
              <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
                Select Employee:
              </label>
              <select
                id="employee"
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
              >
                <option value="">All Employees</option>
                {[ 
                  "Abinesh A", "Abarna S", "Dinesh M", "Elayaraja T", "Esakki Raj M", 
                  "Gayathri A", "Jayaram A", "Kowsalya S", "Lakshmi Devi G", "Manimaran A", 
                  "Nagesha KS", "Nithiksha N", "Rajashree S", "Raja M", "SANJITHA CM",  
                  "Sowmiyaa. S", "Srinath D", "Anusuya P", "Revathi S"
                ].sort().map((employeeName, index) => (
                  <option key={index} value={employeeName}>
                    {employeeName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className="overflow-x-auto border border-gray-300">
          <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
              <thead className="bg-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="border px-4 py-2">S/No</th>
                  <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
                  {(userType === "Admin" || userType === "developerAdmin" || userType === "idcardAdmin") && (
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
                  )}
                  <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
                  <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
                  <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>Evaluation</th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>Review</th>
                  {userType === "employee" && (
                    <th className="border px-4 py-2">Edit</th>
                  )}
                  {userType === "employee" && (
                    <th className="border px-4 py-2">Delete</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  const reportDate = moment(item.date).format("DD-MM-YYYY");

                  return (
                    <tr key={item.id}>
                      <td className="border px-4 py-4">{index + 1}</td>
                      <td className="border px-4 py-4">{reportDate}</td>
                      {userType === "Admin" || userType === "developerAdmin" || userType === "idcardAdmin" ? (
                        <td className="border px-4 py-4">{item.employeeName}</td>
                      ) : null}
                      <td className="border px-4 py-4">{item.customer}</td>
                      <td className="border px-4 py-4">{item.task}</td>
                      <td className="border px-4 py-4">{item.estimatedTime}</td>
                      <td className="border px-4 py-4">{item.startTime}</td>
                      <td className="border px-4 py-4">{item.endTime}</td>
                      <td className="border px-4 py-4">{item.status}</td>
                      <td className="border px-4 py-4">{item.reasonForIncomplete}</td>

                      {userType === "Admin" && (
                        <td className="border px-4 py-4">
                          <input
                            type="text"
                            defaultValue={item.evaluation || ""}
                            onChange={(e) => handleTextChange(e, "evaluation", item.id)}
                            className="w-full p-2 rounded border"
                          />
                        </td>
                      )}

                      {userType === "Admin" && (
                        <td className="border px-4 py-4">
                          <input
                            type="text"
                            defaultValue={item.review || ""}
                            onChange={(e) => handleTextChange(e, "review", item.id)}
                            className="w-full p-2 rounded border"
                          />
                        </td>
                      )}

                      {userType === "employee" && (
                        <td className="border px-4 py-4">
                          <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleEditClick(item)}
                            className="cursor-pointer"
                          />
                        </td>
                      )}

                      {userType === "employee" && (
                        <td className="border px-4 py-4">
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => handleDelete(item.id)}
                            className="cursor-pointer text-red-600"
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <label htmlFor="maxDisplayCount">Records per page: </label>
              <select
                id="maxDisplayCount"
                value={maxDisplayCount}
                onChange={handleMaxDisplayCountChange}
                className="ml-2 border p-1 rounded"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="flex">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="border px-4 py-2 rounded bg-blue-500 text-white"
              >
                Prev
              </button>
              <span className="px-4 py-2">Page {page}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="border px-4 py-2 rounded bg-blue-500 text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">No records available</div>
      )}
    </div>
  );
};

export default EmployeeReportList;
