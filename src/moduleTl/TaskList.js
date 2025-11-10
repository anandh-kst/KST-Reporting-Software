// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";

// const EmployeeReportList = () => {
//   const { designation } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(""); // Track selected employee
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");

//   useEffect(() => {
//     // Fetching employee data if user is Admin
//     if (designation === "Sr. Technical Head") {
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
//           designation === "Sr. Technical Head" /* ||
//           designation === "developerAdmin" ||
//           designation === "idcardAdmin" */
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
//   }, [
//     fromDate,
//     toDate,
//     page,
//     maxDisplayCount,
//     employeeId,
//     designation,
//     selectedEmployee,
//   ]);

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
//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value); // Update selected employee
//     setPage(1); // Reset to page 1 when employee is selected
//   };

//   // Filter the report data by selected employee
//   const filteredData = selectedEmployee
//     ? reportData.filter((item) => item.employeeName === selectedEmployee)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//       <div
//         date-rangepicker
//         className="my-4 flex flex-col sm:flex-row items-center"
//       >
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(
//                   new Set(reportData.map((employee) => employee.employeeName))
//                 ).map((employeeName, index) => (
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
//             <table
//               className="w-full text-sm text-left rtl:text-right text-gray-500"
//               style={{ minWidth: "2000px" }}
//             >
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>
//                     Date
//                   </th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Employee Name
//                     </th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>
//                     Customer
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Estimated Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Start Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     End Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Status
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Reason for Incomplete
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Remarks
//                   </th>
//                   {/*  {designation === "employee" || "Employee" && (
//                     <th className="border px-4 py-2">Edit</th>
//                   )}
//                   {designation === "employee"|| "Employee" && (
//                     <th className="border px-4 py-2">Delete</th>
//                   )}  */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((item, index) => {
//                   const reportDate = moment(item.date).format("DD-MM-YYYY");
//                   const employeeName = item.employeeName || "N/A";
//                   const isEditable = moment(item.date).isSameOrBefore(
//                     moment(),
//                     "day"
//                   );

//                   return (
//                     <tr
//                       key={item.id}
//                       className="bg-white border-b hover:bg-gray-50"
//                     >
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       {designation === "Sr. Technical Head" && (
//                         <td className="border px-4 py-4">{employeeName}</td>
//                       )}
//                       <td className="border px-4 py-4">{item.customer}</td>
//                       <td className="border px-4 py-4">{item.task}</td>
//                       <td className="border px-4 py-4">{item.estimatedTime}</td>
//                       <td className="border px-4 py-4">{item.startTime}</td>
//                       <td className="border px-4 py-4">{item.endTime}</td>
//                       <td className="border px-4 py-4">{item.taskStatus}</td>
//                       <td className="border px-4 py-4">
//                         {item.reasonForIncomplete}
//                       </td>
//                       <td className="border px-4 py-4">{item.remarks}</td>
//                       {/*  {designation!== "Sr. Technical Head" &&
//                       moment(reportDate, "DD-MM-YYYY").isSame(
//                         moment(),
//                         "day"
//                       ) && (
//                         <td className="px-4 py-3">
//                           <button
//                             onClick={() => handleEditClick(item)}
//                             className="text-blue-600 hover:underline"
//                           >
//                             <FontAwesomeIcon icon={faEdit} />
//                           </button>
//                         </td>
//                       )}
//                       {designation !== "Sr. Technical Head" && moment(reportDate, "DD-MM-YYYY").isSame(
//                         moment(),
//                         "day"
//                       ) && (
//                     <td className="px-4 py-3">
//                     <button onClick={() => handleDelete(item.id)}>
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>
//                   </td>
//                     )} */}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() =>
//             handlePageChange(page < totalPages ? page + 1 : totalPages)
//           }
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(""); // Track selected employee
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");

//   useEffect(() => {
//     // Fetching employee data if user is Admin
//     if (designation === "Sr. Technical Head") {
//       const fetchEmployeeData = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           setEmployees(response.data.status === "Success" ? response.data.data : []);
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
//           designation === "Sr. Technical Head"
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
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData(newPage);
//   };

//   const fetchReportData = async (currentPage) => {
//     try {
//       const payload = {
//         page: currentPage.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId, // Filter by selected employee
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1); // Reset to page 1 when count changes
//     fetchReportData(1); // Call fetchReportData for page 1
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value); // Update selected employee
//     setPage(1); // Reset to page 1 when employee is selected
//     fetchReportData(1); // Call fetchReportData for page 1
//   };

//   const handleSubmitReview = async (id, review, evaluation) => {
//     try {
//       const response = await axios.post(
//         "http://192.168.2.133:4001/api/createtask",
//         { id, review, evaluation }
//       );
//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//         // Optionally refresh data here
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName)))
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

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table
//               className="w-full text-sm text-left rtl:text-right text-gray-500"
//               style={{ minWidth: "2000px" }}
//             >
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>
//                     Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Time
//                   </th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Employee Name
//                     </th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>
//                     Customer
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Estimated Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Start Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     End Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Status
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Reason for Incomplete
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Remarks
//                   </th>
//                   {userType === "Admin" && (
//                     <th className="border px-4 py-2">Admin Review</th>
//                   )}
//                   {designation === "Sr. Technical Leader" && (
//                     <th className="border px-4 py-2">Team Leader</th>
//                   )}
//                   <th className="border px-4 py-2"></th> {/* Save button without header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => {
//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
//                       {designation === "Sr. Technical Head" && (
//                         <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                       )}
//                       <td className="border px-4 py-4">{item.customer}</td>
//                       <td className="border px-4 py-4">{item.task}</td>
//                       <td className="border px-4 py-4">{item.estimatedTime}</td>
//                       <td className="border px-4 py-4">{item.startTime}</td>
//                       <td className="border px-4 py-4">{item.endTime}</td>
//                       <td className="border px-4 py-4">{item.taskStatus}</td>
//                       <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                       <td className="border px-4 py-4">{item.remarks}</td>
//                       <td className="border px-4 py-4 text-center">
//                         <button
//                           onClick={() => handleSubmitReview(item.id, /* Admin review */ /* Team Leader Review */)}
//                           className="bg-blue-500 text-white px-2 py-1 rounded"
//                           disabled={!(userType === "Admin" || designation === "Sr. Technical Leader")}
//                         >
//                           Save
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(""); // Track selected employee
//   const [adminReviews, setAdminReviews] = useState({}); // Store Admin reviews by ID
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({}); // Store Team Leader reviews by ID
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");

//   useEffect(() => {
//     // Fetching employee data if user is Admin
//     if (designation === "Sr. Technical Head") {
//       const fetchEmployeeData = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           setEmployees(response.data.status === "Success" ? response.data.data : []);
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
//           designation === "Sr. Technical Head"
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

//     // Fetch report data if conditions are met
//     if (fromDate && toDate && employeeId) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData(newPage);
//   };

//   const fetchReportData = async (currentPage) => {
//     try {
//       const payload = {
//         page: currentPage.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1); // Reset to page 1 when count changes
//     fetchReportData(1); // Fetch report data for page 1
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value); // Update selected employee
//     setPage(1); // Reset to page 1
//     fetchReportData(1); // Fetch report data for page 1
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (isAdmin) {
//       setAdminReviews((prev) => ({ ...prev, [id]: value }));
//     } else {
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     const review = adminReviews[id] || "";
//     const evaluation = teamLeaderReviews[id] || "";
//     try {
//       const response = await axios.post(
//         "http://192.168.2.133:4001/api/createtask",
//         { id, review, evaluation }
//       );
//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//         // Optionally refresh data here
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName)))
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

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table
//               className="w-full text-sm text-left rtl:text-right text-gray-500"
//               style={{ minWidth: "2000px" }}
//             >
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>
//                     Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Time
//                   </th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Employee Name
//                     </th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>
//                     Customer
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Estimated Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Start Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     End Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Status
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Reason for Incomplete
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Remarks
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Admin Review
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Team Leader Review
//                   </th>
//                   {userType === "Admin" && <th className="border px-4 py-2">Admin Review</th>}
//                   {designation === "Sr. Technical Leader" && <th className="border px-4 py-2">Team Leader</th>}
//                   <th className="border px-4 py-2"></th> {/* Save button without header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => {
//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
//                       {designation === "Sr. Technical Head" && (
//                         <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                       )}
//                       <td className="border px-4 py-4">{item.customer}</td>
//                       <td className="border px-4 py-4">{item.task}</td>
//                       <td className="border px-4 py-4">{item.estimatedTime}</td>
//                       <td className="border px-4 py-4">{item.startTime}</td>
//                       <td className="border px-4 py-4">{item.endTime}</td>
//                       <td className="border px-4 py-4">{item.taskStatus}</td>
//                       <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                       <td className="border px-4 py-4">{item.remarks}</td>
//                       <td className="border px-4 py-4">{item.evaluation}</td>
//                       <td className="border px-4 py-4">{item.review}</td>
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <input
//                             type="text"
//                             placeholder="Admin Review"
//                             className="border border-gray-300 rounded p-1"
//                             onChange={(e) => handleReviewChange(item.id, true, e.target.value)}
//                           />
//                         </td>
//                       )}
//                       {designation === "Sr. Technical Leader" && (
//                         <td className="border px-4 py-4">
//                           <input
//                             type="text"
//                             placeholder="Team Leader"
//                             className="border border-gray-300 rounded p-1"
//                             onChange={(e) => handleReviewChange(item.id, false, e.target.value)}
//                           />
//                         </td>
//                       )}
//                       <td className="border px-4 py-4 text-center">
//                         <button
//                           onClick={() => handleSubmitReview(item.id)}
//                           className="bg-blue-500 text-white px-2 py-1 rounded"
//                           disabled={!(userType === "Admin" || designation === "Sr. Technical Leader")}
//                         >
//                           Save
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [adminReviews, setAdminReviews] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       if (designation === "Sr. Technical Head") {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           setEmployees(response.data.status === "Success" ? response.data.data : []);
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       }
//     };

//     const fetchReportData = async () => {
//       try {
//         const payload = {
//           page: page.toString(),
//           limit: maxDisplayCount,
//           fromDate,
//           toDate,
//           employeeId: selectedEmployee || employeeId,
//         };
        
//         const apiEndpoint =
//           designation === "Sr. Technical Head"
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

//     fetchEmployeeData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData(newPage);
//   };

//   const fetchReportData = async (currentPage) => {
//     try {
//       const payload = {
//         page: currentPage.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//     fetchReportData(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//     fetchReportData(1);
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (isAdmin) {
//       setAdminReviews((prev) => ({ ...prev, [id]: value }));
//     } else {
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     const review = adminReviews[id] || "";
//     const evaluation = teamLeaderReviews[id] || "";
//     try {
//       const response = await axios.post(
//         "http://192.168.2.133:4001/api/createtask",
//         { id, review, evaluation }
//       );
//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName)))
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

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table
//               className="w-full text-sm text-left rtl:text-right text-gray-500"
//               style={{ minWidth: "2000px" }}
//             >
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>
//                     Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Time
//                   </th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Employee Name
//                     </th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>
//                     Customer
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Estimated Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Start Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     End Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Status
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Reason for Incomplete
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Remarks
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Admin Review
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Team Leader Review
//                   </th>
//                   {userType === "Admin" && <th className="border px-4 py-2">Admin Review</th>}
//                   {designation === "Sr. Technical Leader" && <th className="border px-4 py-2">Team Leader</th>}
//                   <th className="border px-4 py-2"></th> {/* Save button without header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => {
//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
//                       {designation === "Sr. Technical Head" && (
//                         <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                       )}
//                       <td className="border px-4 py-4">{item.customer}</td>
//                       <td className="border px-4 py-4">{item.task}</td>
//                       <td className="border px-4 py-4">{item.estimatedTime}</td>
//                       <td className="border px-4 py-4">{item.startTime}</td>
//                       <td className="border px-4 py-4">{item.endTime}</td>
//                       <td className="border px-4 py-4">{item.taskStatus}</td>
//                       <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                       <td className="border px-4 py-4">{item.remarks}</td>
//                       <td className="border px-4 py-4" disabled>
//                         {item.evaluation}
//                       </td>
//                       <td className="border px-4 py-4" disabled>
//                         {item.review}
//                       </td>
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <input
//                             type="text"
//                             placeholder="Admin Review"
//                             className="border border-gray-300 rounded p-1"
//                             value={item.review}
//                             disabled // Admin Review input is disabled
//                           />
//                         </td>
//                       )}
//                       {designation === "Sr. Technical Leader" && (
//                         <td className="border px-4 py-4">
//                           <input
//                             type="text"
//                             placeholder="Team Leader Review"
//                             className="border border-gray-300 rounded p-1"
//                             onChange={(e) => handleReviewChange(item.id, false, e.target.value)}
//                           />
//                         </td>
//                       )}
//                       <td className="border px-4 py-4 text-center">
//                         <button
//                           onClick={() => handleSubmitReview(item.id)}
//                           className="bg-blue-500 text-white px-2 py-1 rounded"
//                           disabled={!(userType === "Admin" || designation === "Sr. Technical Leader")}
//                         >
//                           Save
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [adminReviews, setAdminReviews] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       if (designation === "Sr. Technical Head") {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           setEmployees(response.data.status === "Success" ? response.data.data : []);
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       }
//     };

//     const fetchReportData = async () => {
//       try {
//         const payload = {
//           page: page.toString(),
//           limit: maxDisplayCount,
//           fromDate,
//           toDate,
//           employeeId: selectedEmployee || employeeId,
//         };
        
//         const apiEndpoint =
//           designation === "Sr. Technical Head"
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

//     fetchEmployeeData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData(newPage);
//   };

//   const fetchReportData = async (currentPage) => {
//     try {
//       const payload = {
//         page: currentPage.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//     fetchReportData(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//     fetchReportData(1);
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (isAdmin) {
//       setAdminReviews((prev) => ({ ...prev, [id]: value }));
//     } else {
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     const review = adminReviews[id] || "";
//     const evaluation = teamLeaderReviews[id] || "";
//     try {
//       const response = await axios.post(
//         "http://192.168.2.133:4001/api/createtask",
//         { id, review, evaluation }
//       );
//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//         // Optionally refresh the report data
//         fetchReportData(page);
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName)))
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

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table
//               className="w-full text-sm text-left rtl:text-right text-gray-500"
//               style={{ minWidth: "2000px" }}
//             >
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>
//                     Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Time
//                   </th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Employee Name
//                     </th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>
//                     Customer
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Estimated Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Start Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     End Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Status
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Reason for Incomplete
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Remarks
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Admin Review
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Team Leader Review
//                   </th>
//                   {userType === "Admin" && <th className="border px-4 py-2">Admin Review</th>}
//                   {designation === "Sr. Technical Leader" && <th className="border px-4 py-2">Team Leader</th>}
//                   <th className="border px-4 py-2"></th> {/* Save button without header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => {
//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
//                       {designation === "Sr. Technical Head" && (
//                         <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                       )}
//                       <td className="border px-4 py-4">{item.customer}</td>
//                       <td className="border px-4 py-4">{item.task}</td>
//                       <td className="border px-4 py-4">{item.estimatedTime}</td>
//                       <td className="border px-4 py-4">{item.startTime}</td>
//                       <td className="border px-4 py-4">{item.endTime}</td>
//                       <td className="border px-4 py-4">{item.taskStatus}</td>
//                       <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                       <td className="border px-4 py-4">{item.remarks}</td>
//                       <td className="border px-4 py-4" disabled>
//                         {item.evaluation}
//                       </td>
//                       <td className="border px-4 py-4">
//                         <input
//                           type="text"
//                           placeholder="Team Leader Review"
//                           className="border border-gray-300 rounded p-1"
//                           onChange={(e) => handleReviewChange(item.id, false, e.target.value)}
//                         />
//                       </td>
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <input
//                             type="text"
//                             placeholder="Admin Review"
//                             className="border border-gray-300 rounded p-1"
//                             value={item.review}
//                             disabled // Admin Review input is disabled
//                           />
//                         </td>
//                       )}
//                       <td className="border px-4 py-4 text-center">
//                         <button
//                           onClick={() => handleSubmitReview(item.id)}
//                           className="bg-blue-500 text-white px-2 py-1 rounded"
//                           disabled={!(userType === "Admin" || designation === "Sr. Technical Leader")}
//                         >
//                           Save
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [adminReviews, setAdminReviews] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       if (designation === "Sr. Technical Head") {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           setEmployees(response.data.status === "Success" ? response.data.data : []);
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       }
//     };

//     const fetchReportData = async () => {
//       try {
//         const payload = {
//           page: page.toString(),
//           limit: maxDisplayCount,
//           fromDate,
//           toDate,
//           employeeId: selectedEmployee || employeeId,
//         };
        
//         const apiEndpoint =
//           designation === "Sr. Technical Head"
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

//     fetchEmployeeData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData(newPage);
//   };

//   const fetchReportData = async (currentPage) => {
//     try {
//       const payload = {
//         page: currentPage.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//     fetchReportData(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//     fetchReportData(1);
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (isAdmin) {
//       setAdminReviews((prev) => ({ ...prev, [id]: value }));
//     } else {
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     const adminReview = adminReviews[id] || "";
//     const teamLeaderReview = teamLeaderReviews[id] || "";
    
//     try {
//       // Update the backend with both Admin Review and Team Leader Review
//       const response = await axios.post(
//         "http://192.168.2.133:4001/api/createtask",
//         { id, adminReview, teamLeaderReview }
//       );

//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//         // Refresh data after saving review
//         fetchReportData(page);
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName)))
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

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table
//               className="w-full text-sm text-left rtl:text-right text-gray-500"
//               style={{ minWidth: "2000px" }}
//             >
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>
//                     Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Time
//                   </th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Employee Name
//                     </th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>
//                     Customer
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Estimated Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Start Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     End Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Status
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Reason for Incomplete
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Remarks
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Admin Review
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Team Leader Review
//                   </th>
//                   {userType === "Admin" && <th className="border px-4 py-2">Admin Review</th>}
//                   {designation === "Sr. Technical Leader" && <th className="border px-4 py-2">Team Leader</th>}
//                   <th className="border px-4 py-2"></th> {/* Save button without header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => {
//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
//                       {designation === "Sr. Technical Head" && (
//                         <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                       )}
//                       <td className="border px-4 py-4">{item.customer}</td>
//                       <td className="border px-4 py-4">{item.task}</td>
//                       <td className="border px-4 py-4">{item.estimatedTime}</td>
//                       <td className="border px-4 py-4">{item.startTime}</td>
//                       <td className="border px-4 py-4">{item.endTime}</td>
//                       <td className="border px-4 py-4">{item.taskStatus}</td>
//                       <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                       <td className="border px-4 py-4">{item.remarks}</td>
//                       <td className="border px-4 py-4" disabled>
//                         {item.evaluation}
//                       </td>
//                       <td className="border px-4 py-4">
//                         <input
//                           type="text"
//                           placeholder="Team Leader Review"
//                           className="border border-gray-300 rounded p-1"
//                           onChange={(e) => handleReviewChange(item.id, false, e.target.value)}
//                         />
//                       </td>
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <input
//                             type="text"
//                             placeholder="Admin Review"
//                             className="border border-gray-300 rounded p-1"
//                             value={item.review}
//                             disabled // Admin Review input is disabled
//                           />
//                         </td>
//                       )}
//                       <td className="border px-4 py-4 text-center">
//                         <button
//                           onClick={() => handleSubmitReview(item.id)}
//                           className="bg-blue-500 text-white px-2 py-1 rounded"
//                           disabled={!(userType === "Admin" || designation === "Sr. Technical Leader")}
//                         >
//                           Save
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [adminReviews, setAdminReviews] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (fromDate && toDate && employeeId) {
//         await fetchReportData();
//       }
//     };
//     fetchData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData();
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (isAdmin) {
//       setAdminReviews((prev) => ({ ...prev, [id]: value }));
//     } else {
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     const adminReview = adminReviews[id] || "";
//     const teamLeaderReview = teamLeaderReviews[id] || "";

//     try {
//       // Update the backend with both Admin Review and Team Leader Review
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/createtask`,
//         { id, evaluation: adminReview, review: teamLeaderReview } // Adjusted to pass correct data
//       );

//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//         // Refresh data after saving review
//         fetchReportData();
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Time</th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Remarks</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Admin Review</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Team Leader Review</th>
//                   <th className="border px-4 py-2"></th> {/* Save button column header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => (
//                   <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                     <td className="border px-4 py-4">
//                       {index + 1 + (page - 1) * maxDisplayCount}
//                     </td>
//                     <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                     <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
//                     {designation === "Sr. Technical Head" && (
//                       <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                     )}
//                     <td className="border px-4 py-4">{item.customer}</td>
//                     <td className="border px-4 py-4">{item.task}</td>
//                     <td className="border px-4 py-4">{item.estimatedTime}</td>
//                     <td className="border px-4 py-4">{item.startTime}</td>
//                     <td className="border px-4 py-4">{item.endTime}</td>
//                     <td className="border px-4 py-4">{item.taskStatus}</td>
//                     <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                     <td className="border px-4 py-4">{item.remarks}</td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Admin Review"
//                         value={adminReviews[item.id] || item.evaluation} // Display current value or admin input
//                         onChange={(e) => handleReviewChange(item.id, true, e.target.value)}
//                         className="border border-gray-300 rounded p-1"
//                       />
//                     </td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Team Leader Review"
//                         value={teamLeaderReviews[item.id] || item.review} // Display current value or team leader input
//                         onChange={(e) => handleReviewChange(item.id, false, e.target.value)}
//                         className="border border-gray-300 rounded p-1"
//                       />
//                     </td>
//                     {/* Save button */}
//                     <td className="border px-4 py-4 text-center">
//                       <button
//                         onClick={() => handleSubmitReview(item.id)}
//                         className="bg-blue-500 text-white px-2 py-1 rounded"
//                         disabled={!(userType === "Admin" || designation === "Sr. Technical Head")}
//                       >
//                         Save
//                       </button>   
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [adminReviews, setAdminReviews] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (fromDate && toDate && employeeId) {
//         await fetchReportData();
//       }
//     };
//     fetchData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData();
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (isAdmin) {
//       setAdminReviews((prev) => ({ ...prev, [id]: value }));
//     } else {
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     const adminReview = adminReviews[id] || "";
//     const teamLeaderReview = teamLeaderReviews[id] || "";

//     try {
//       // Update the backend with both Admin Review and Team Leader Review
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/createtask`,
//         { id, evaluation: adminReview, review: teamLeaderReview } // Adjusted to pass correct data
//       );

//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//         // Refresh data after saving review
//         fetchReportData();
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Time</th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Remarks</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Admin Review</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Team Leader Review</th>
//                   <th className="border px-4 py-2"></th> {/* Save button column header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => (
//                   <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                     <td className="border px-4 py-4">
//                       {index + 1 + (page - 1) * maxDisplayCount}
//                     </td>
//                     <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                     <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
//                     {designation === "Sr. Technical Head" && (
//                       <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                     )}
//                     <td className="border px-4 py-4">{item.customer}</td>
//                     <td className="border px-4 py-4">{item.task}</td>
//                     <td className="border px-4 py-4">{item.estimatedTime}</td>
//                     <td className="border px-4 py-4">{item.startTime}</td>
//                     <td className="border px-4 py-4">{item.endTime}</td>
//                     <td className="border px-4 py-4">{item.taskStatus}</td>
//                     <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                     <td className="border px-4 py-4">{item.remarks}</td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Admin Review"
//                         value={adminReviews[item.id] || item.evaluation} // Display current value or admin input
//                         onChange={(e) => handleReviewChange(item.id, true, e.target.value)}
//                         className="border border-gray-300 rounded p-1"
//                         disabled // Disable Admin Review input
//                       />
//                     </td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Team Leader Review"
//                         value={teamLeaderReviews[item.id] || item.review} // Display current value or team leader input
//                         onChange={(e) => handleReviewChange(item.id, false, e.target.value)}
//                         className="border border-gray-300 rounded p-1"
//                       />
//                     </td>
//                     {/* Save button */}
//                     <td className="border px-4 py-4 text-center">
//                       <button
//                         onClick={() => handleSubmitReview(item.id)}
//                         className="bg-blue-500 text-white px-2 py-1 rounded"
//                         disabled={!(userType === "Admin" || designation === "Sr. Technical Head")}
//                       >
//                         Save
//                       </button>   
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [adminReviews, setAdminReviews] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (fromDate && toDate && employeeId) {
//         await fetchReportData();
//       }
//     };
//     fetchData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData();
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (isAdmin) {
//       // Preserve the existing admin review when typing
//       setAdminReviews((prev) => ({ ...prev, [id]: value }));
//     } else {
//       // Update the team leader review independently
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     // Get the latest values from state
//     const adminReview = adminReviews[id] || "";
//     const teamLeaderReview = teamLeaderReviews[id] || "";

//     try {
//       // Update the backend with both Admin Review and Team Leader Review
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/createtask`,
//         { id, evaluation: adminReview, review: teamLeaderReview }
//       );

//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//         // Refresh data after saving review
//         fetchReportData();
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Time</th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Remarks</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Admin Review</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Team Leader Review</th>
//                   <th className="border px-4 py-2"></th> {/* Save button column header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => (
//                   <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                     <td className="border px-4 py-4">
//                       {index + 1 + (page - 1) * maxDisplayCount}
//                     </td>
//                     <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                     <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
//                     {designation === "Sr. Technical Head" && (
//                       <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                     )}
//                     <td className="border px-4 py-4">{item.customer}</td>
//                     <td className="border px-4 py-4">{item.task}</td>
//                     <td className="border px-4 py-4">{item.estimatedTime}</td>
//                     <td className="border px-4 py-4">{item.startTime}</td>
//                     <td className="border px-4 py-4">{item.endTime}</td>
//                     <td className="border px-4 py-4">{item.taskStatus}</td>
//                     <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                     <td className="border px-4 py-4">{item.remarks}</td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Admin Review"
//                         value={adminReviews[item.id] || item.evaluation} // Display current value or admin input
//                         onChange={(e) => handleReviewChange(item.id, true, e.target.value)}
//                         className="border border-gray-300 rounded p-1"
//                         disabled={userType === "Sr. Technical Lead"} // Disable if userType is Sr. Technical Lead
//                       />
//                     </td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Team Leader Review"
//                         value={teamLeaderReviews[item.id] || item.review} // Always display current value
//                         onChange={(e) => handleReviewChange(item.id, false, e.target.value)}
//                         className="border border-gray-300 rounded p-1"
//                       />
//                     </td>
//                     {/* Save button */}
//                     <td className="border px-4 py-4 text-center">
//                       <button
//                         onClick={() => handleSubmitReview(item.id)}
//                         className="bg-blue-500 text-white px-2 py-1 rounded"
//                         disabled={!(userType === "Admin" || designation === "Sr. Technical Head")}
//                       >
//                         Save
//                       </button>   
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [adminReviews, setAdminReviews] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (fromDate && toDate && employeeId) {
//         await fetchReportData();
//       }
//     };
//     fetchData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData();
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (!isAdmin) {
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     const teamLeaderReview = teamLeaderReviews[id] || "";

//     try {
//       // Update only the team leader review since the admin review is read-only for Sr. Technical Lead
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/createtask`,
//         { id, review: teamLeaderReview }
//       );

//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//         // Refresh data after saving review
//         fetchReportData();
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
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
//           {designation === "Sr. Technical Head" && (
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
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Time</th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Remarks</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Admin Review</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Team Leader Review</th>
//                   <th className="border px-4 py-2"></th> {/* Save button column header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => (
//                   <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                     <td className="border px-4 py-4">
//                       {index + 1 + (page - 1) * maxDisplayCount}
//                     </td>
//                     <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                     <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
//                     {designation === "Sr. Technical Head" && (
//                       <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                     )}
//                     <td className="border px-4 py-4">{item.customer}</td>
//                     <td className="border px-4 py-4">{item.task}</td>
//                     <td className="border px-4 py-4">{item.estimatedTime}</td>
//                     <td className="border px-4 py-4">{item.startTime}</td>
//                     <td className="border px-4 py-4">{item.endTime}</td>
//                     <td className="border px-4 py-4">{item.taskStatus}</td>
//                     <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                     <td className="border px-4 py-4">{item.remarks}</td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Admin Review"
//                         value={item.evaluation || ""} // Always display this value
//                         onChange={(e) => handleReviewChange(item.id, true, e.target.value)} // Will not change if Sr. Technical Lead
//                         className="border border-gray-300 rounded p-1"
//                         disabled={userType === "Sr. Technical Lead"} // Disable if userType is Sr. Technical Lead
//                       />
//                     </td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Team Leader Review"
//                         value={teamLeaderReviews[item.id] || item.review} // Always display current value
//                         onChange={(e) => handleReviewChange(item.id, false, e.target.value)}
//                         className="border border-gray-300 rounded p-1"
//                       />
//                     </td>
//                     {/* Save button */}
//                     <td className="border px-4 py-4 text-center">
//                       <button
//                         onClick={() => handleSubmitReview(item.id)}
//                         className="bg-blue-500 text-white px-2 py-1 rounded"
//                         disabled={!(userType === "Admin" || designation === "Sr. Technical Head")}
//                       >
//                         Save
//                       </button>   
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [adminReviews, setAdminReviews] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [employeeList, setEmployeeList] = useState([]);


//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };


//   useEffect(() => {
//     let isMounted = true; // Add an isMounted flag
//       const fetchEmployeeList = async () => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//             if (response.data.status === 'Success') {
//               if(isMounted){
//                 setEmployeeList(response.data.data);
//               }
//             }
//         } catch (err) {
//             console.error('Error fetching employee list:', err);
//         }
//     };

//     const fetchData = async () => {
//       if (fromDate && toDate && employeeId) {
//         await fetchReportData();
//       }
//     };


//     fetchData();
//     fetchEmployeeList();

//     // Cleanup function (Important!)
//     return () => {
//         isMounted = false; // Prevent state updates on unmounted component
//         //  axios.CancelToken.source().cancel('Operation cancelled'); // If using axios and you have pending requests, cancel them here.
//     };
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]); // Include dependencies in the array


//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData();
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (!isAdmin) {
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     const teamLeaderReview = teamLeaderReviews[id] || "";

//     try {
//       // Update only the team leader review since the admin review is read-only for Sr. Technical Lead
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/createtask`,
//         { id, review: teamLeaderReview }
//       );

//       if (response.data.status === "Success") {
//         alert("Review saved successfully.");
//         // Refresh data after saving review
//         fetchReportData();
//       } else {
//         alert("Failed to save review.");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <h5 className="text-center text-darkblue mb-4">
//         Daily Task
//       </h5>
//       <div className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">
//             Start Date:
//           </label>
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//             style={{ width: "200px" }}
//           />
//           <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">
//             End Date:
//           </label>
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//             style={{ width: "200px" }}
//           />
//           {designation === "Sr. Technical Head" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                 Select Employee:
//               </label>
//               <select
//                 id="employee"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//                 style={{ width: "240px" }}
//                  onChange={handleEmployeeChange}
//               >
//                 <option value="">All</option>
//                 {employeeList.map((emp) => (
//                   <option key={emp.employeeId} value={emp.employeeId}>
//                     {emp.employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {reportData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Time
//                   </th>
//                   {designation === "Sr. Technical Head" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Start Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Remarks</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Admin Review</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Team Leader Review</th>
//                   <th className="border px-4 py-2"></th> {/* Save button column header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => (
//                   <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                     <td className="border px-4 py-4">
//                       {index + 1 + (page - 1) * maxDisplayCount}
//                     </td>
//                     <td className="border px-4 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>
//                     <td className="border px-4 py-4">
//                       {moment(item.createdAt).format("HH:mm A")}
//                     </td>
//                     {designation === "Sr. Technical Head" && (
//                       <td className="border px-4 py-4">{item.employeeName || "N/A"}</td>
//                     )}
//                     <td className="border px-4 py-4">{item.customer}</td>
//                     <td className="border px-4 py-4">{item.task}</td>
//                     <td className="border px-4 py-4">{item.estimatedTime}</td>
//                     <td className="border px-4 py-4">{item.startTime}</td>
//                     <td className="border px-4 py-4">{item.endTime}</td>
//                     <td className="border px-4 py-4">{item.taskStatus}</td>
//                     <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                     <td className="border px-4 py-4">{item.remarks}</td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Admin Review"
//                         value={item.evaluation || ""} // Always display this value
//                         onChange={(e) => handleReviewChange(item.id, true, e.target.value)} // Will not change if Sr. Technical Lead
//                         className="border border-gray-300 rounded p-1"
//                         disabled={userType === "Sr. Technical Lead"} // Disable if userType is Sr. Technical Lead
//                       />
//                     </td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Team Leader Review"
//                         value={teamLeaderReviews[item.id] || item.review} // Always display current value
//                         onChange={(e) => handleReviewChange(item.id, false, e.target.value)}
//                         className="border border-gray-300 rounded p-1"
//                       />
//                     </td>
//                     {/* Save button */}
//                     <td className="border px-4 py-4 text-center">
//                       <button
//                         onClick={() => handleSubmitReview(item.id)}
//                         className="bg-blue-500 text-white px-2 py-1 rounded"
//                         disabled={!(userType === "Admin" || designation === "Sr. Technical Head")}
//                       >
//                         Save
//                       </button>   
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;









// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [adminReviews, setAdminReviews] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//   const [employeeList, setEmployeeList] = useState([]);

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId, // Use selectedEmployee for filtering
//       };

//       const apiEndpoint =
//         designation === "Sr. Technical Head"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     let isMounted = true; // Add an isMounted flag
//     const fetchEmployeeList = async () => {
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/employee_list/`
//         );
//         if (response.data.status === "Success") {
//           if (isMounted) {
//             setEmployeeList(response.data.data);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching employee list:", err);
//       }
//     };

//     const fetchData = async () => {
//       if (fromDate && toDate && employeeId) {
//         await fetchReportData();
//       }
//     };

//     fetchData();
//     fetchEmployeeList();

//     // Cleanup function (Important!)
//     return () => {
//       isMounted = false; // Prevent state updates on unmounted component
//     };
//   }, [
//     fromDate,
//     toDate,
//     page,
//     maxDisplayCount,
//     employeeId,
//     designation,
//     selectedEmployee,
//   ]); // Include dependencies in the array

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//     setPage(1); // Reset page on date change
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchReportData();
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1); // Reset page when employee changes
//   };

//   const handleReviewChange = (id, isAdmin, value) => {
//     if (isAdmin) {
//       setAdminReviews((prev) => ({ ...prev, [id]: value }));
//     } else {
//       setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmitReview = async (id) => {
//     const teamLeaderReview = teamLeaderReviews[id] || ""; // Get team leader review
//     const adminReview = adminReviews[id] || ""; // Get admin review.  Important to read the value here.

//     try {
//       const payload = {
//         id: id,
//         review: teamLeaderReview, // Only send team leader review to API
//       };
//       // Update only the team leader review since the admin review is read-only for Sr. Technical Lead
//       if (userType !== "Sr. Technical Lead") {  // Only update team leader review.
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/api/createtask`,
//           payload
//         );
//         if (response.data.status === "Success") {
//           alert("Team Leader Review saved successfully.");
//         } else {
//           alert("Failed to save Team Leader review.");
//         }
//       }

//       // if (designation === "Sr. Technical Head") { // No need for extra API call.  Admin Reviews already saved in the backend.
//       //   const adminReviewPayload = {
//       //     id: id,
//       //     review: adminReview, // Send admin review to API.
//       //   };

//       //   const adminResponse = await axios.post(
//       //     `${process.env.REACT_APP_API_URL}/api/updatetask`,
//       //     adminReviewPayload
//       //   );
//       //   if (adminResponse.data.status === 'Success') {
//       //     alert('Admin review saved successfully.');
//       //   } else {
//       //     alert('Failed to save Admin review.');
//       //   }
//       // }

//       // Refresh data after saving review
//       fetchReportData();
//     } catch (error) {
//       console.error("Error saving review:", error);
//       alert("An error occurred while saving the review.");
//     }
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   // Filter report data based on selectedEmployee
//   const filteredReportData =
//     selectedEmployee !== ""
//       ? reportData.filter((item) => item.employeeName === selectedEmployee)
//       : reportData;
//   return (
//     <div className="container mx-auto">
//       <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">Daily Task</h5>
//       <div className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">
//             Start Date:
//           </label>
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//             style={{ width: "200px" }}
//           />
//           <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">
//             End Date:
//           </label>
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//             style={{ width: "200px" }}
//           />
//           {designation === "Sr. Technical Head" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                 Select Employee:
//               </label>
//               <select
//                 id="employee"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//                 style={{ width: "240px" }}
//                 onChange={handleEmployeeChange}
//                 value={selectedEmployee} // Set the value to selectedEmployee
//               >
//                 <option value="">All</option>
//                 {employeeList.map((emp) => (
//                   <option key={emp.employeeId} value={emp.employeeName}>
//                     {emp.employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {filteredReportData.length > 0 ? ( // Use filteredReportData
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table
//               className="w-full text-sm text-left rtl:text-right text-gray-500"
//               style={{ minWidth: "2000px" }}
//             >
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>
//                     Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Time
//                   </th>
//                   {designation === "Sr. Technical Head" && (
//                     <th
//                       className="border px-4 py-2"
//                       style={{ width: "150px" }}
//                     >
//                       Employee Name
//                     </th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>
//                     Customer
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Estimated Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Start Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     End Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Status
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Reason for Incomplete
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Remarks
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Admin Review
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Team Leader Review
//                   </th>
//                   <th className="border px-4 py-2"></th>{" "}
//                   {/* Save button column header */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredReportData.map((item, index) => ( // Use filteredReportData
//                   <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                     <td className="border px-4 py-4">
//                       {index + 1 + (page - 1) * maxDisplayCount}
//                     </td>
//                     <td className="border px-4 py-4">
//                       {moment(item.date).format("DD-MM-YYYY")}
//                     </td>
//                     <td className="border px-4 py-4">
//                       {moment(item.createdAt).format("HH:mm A")}
//                     </td>
//                     {designation === "Sr. Technical Head" && (
//                       <td className="border px-4 py-4">
//                         {item.employeeName || "N/A"}
//                       </td>
//                     )}
//                     <td className="border px-4 py-4">{item.customer}</td>
//                     <td className="border px-4 py-4">{item.task}</td>
//                     <td className="border px-4 py-4">{item.estimatedTime}</td>
//                     <td className="border px-4 py-4">{item.startTime}</td>
//                     <td className="border px-4 py-4">{item.endTime}</td>
//                     <td className="border px-4 py-4">{item.taskStatus}</td>
//                     <td className="border px-4 py-4">
//                       {item.reasonForIncomplete}
//                     </td>
//                     <td className="border px-4 py-4">{item.remarks}</td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Admin Review"
//                         value={adminReviews[item.id] || item.evaluation || ""} // Display current value
//                         onChange={(e) =>
//                           handleReviewChange(item.id, true, e.target.value)
//                         } // Update adminReviews
//                         className="border border-gray-300 rounded p-1"
//                         disabled={userType === "Sr. Technical Lead"} // Disable for Sr. Technical Lead
//                       />
//                     </td>
//                     <td className="border px-4 py-4">
//                       <input
//                         type="text"
//                         placeholder="Team Leader Review"
//                         value={teamLeaderReviews[item.id] || item.review || ""} // Display current value
//                         onChange={(e) =>
//                           handleReviewChange(item.id, false, e.target.value)
//                         } // Update teamLeaderReviews
//                         className="border border-gray-300 rounded p-1"
//                       />
//                     </td>
//                     {/* Save button */}
//                     <td className="border px-4 py-4 text-center">
//                       <button
//                         onClick={() => handleSubmitReview(item.id)}
//                         className="bg-blue-500 text-white px-2 py-1 rounded"
//                         disabled={
//                           !(userType === "Admin" || designation === "Sr. Technical Head")
//                         }
//                       >
//                         Save
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() =>
//             handlePageChange(page < totalPages ? page + 1 : totalPages)
//           }
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;






import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const EmployeeReportList = () => {
  const { designation, userType } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(10);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");
  const [adminReviews, setAdminReviews] = useState({});
  const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
  const [employeeList, setEmployeeList] = useState([]);

  // Fetch report data function
  const fetchReportData = async () => {
    try {
      const payload = {
        page: page.toString(),
        limit: maxDisplayCount,
        fromDate,
        toDate,
        employeeId: selectedEmployee || employeeId, // Use selectedEmployee for filtering
      };

      const apiEndpoint =
        designation === "Sr. Technical Head"
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

  useEffect(() => {
    let isMounted = true; // Add an isMounted flag
    const fetchEmployeeList = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/employee_list/`
        );
        if (response.data.status === "Success") {
          if (isMounted) {
            setEmployeeList(response.data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching employee list:", err);
      }
    };

    const fetchData = async () => {
      if (fromDate && toDate && employeeId) {
        await fetchReportData();
      }
    };

    fetchData();
    fetchEmployeeList();

    // Cleanup function (Important!)
    return () => {
      isMounted = false; // Prevent state updates on unmounted component
    };
  }, [
    fromDate,
    toDate,
    page,
    maxDisplayCount,
    employeeId,
    designation,
    selectedEmployee,
  ]); // Include dependencies in the array

  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
    setPage(1); // Reset page on date change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchReportData();
  };

  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1);
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
    setPage(1); // Reset page when employee changes
  };

  const handleReviewChange = (id, isAdmin, value) => {
    if (isAdmin) {
      // Admin reviews are read-only; no changes allowed
      return;
    } else {
      setTeamLeaderReviews((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmitReview = async (id) => {
    const teamLeaderReview = teamLeaderReviews[id] || ""; // Get team leader review

    try {
      const payload = {
        id: id,
        review: teamLeaderReview, // Only send team leader review to API
      };
      // Update only the team leader review since the admin review is read-only for Sr. Technical Lead
      if (userType !== "Sr. Technical Lead") {  // Only update team leader review.
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/createtask`,
          payload
        );
        if (response.data.status === "Success") {
          alert("Team Leader Review saved successfully.");
        } else {
          alert("Failed to save Team Leader review.");
        }
      }

      // Refresh data after saving review
      fetchReportData();
    } catch (error) {
      console.error("Error saving review:", error);
      alert("An error occurred while saving the review.");
    }
  };

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);
  const today = new Date().toISOString().split("T")[0];

  // Filter report data based on selectedEmployee
  const filteredReportData =
    selectedEmployee !== ""
      ? reportData.filter((item) => item.employeeName === selectedEmployee)
      : reportData;
  return (
    <div className="container mx-auto">
      <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">Daily Task</h5>
      <div className="my-4 flex flex-col sm:flex-row items-center">
        <div className="flex flex-col sm:flex-row">
          <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">
            Start Date:
          </label>
          <input
            type="date"
            name="fromDate"
            value={fromDate}
            onChange={handleDateChange}
            max={today}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
            style={{ width: "200px" }}
          />
          <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">
            End Date:
          </label>
          <input
            type="date"
            name="toDate"
            value={toDate}
            onChange={handleDateChange}
            max={today}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
            style={{ width: "200px" }}
          />
          {designation === "Sr. Technical Head" && (
            <div className="flex items-center">
              <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
                Select Employee:
              </label>
              <select
                id="employee"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                style={{ width: "240px" }}
                onChange={handleEmployeeChange}
                value={selectedEmployee} // Set the value to selectedEmployee
              >
                <option value="">All</option>
                {employeeList.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeName}>
                    {emp.employeeName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {filteredReportData.length > 0 ? ( // Use filteredReportData
        <div className="overflow-x-auto border border-gray-300">
          <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
            <table
              className="w-full text-sm text-left rtl:text-right text-gray-500"
              style={{ minWidth: "2000px" }}
            >
              <thead className="bg-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="border px-4 py-2">S/No</th>
                  <th className="border px-4 py-2" style={{ width: "350px" }}>
                    Date
                  </th>
                  <th className="border px-4 py-2" style={{ width: "120px" }}>
                    Time
                  </th>
                  {designation === "Sr. Technical Head" && (
                    <th
                      className="border px-4 py-2"
                      style={{ width: "150px" }}
                    >
                      Employee Name
                    </th>
                  )}
                  <th className="border px-4 py-2" style={{ width: "150px" }}>
                    Customer
                  </th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>
                    Task
                  </th>
                  <th className="border px-4 py-2" style={{ width: "120px" }}>
                    Estimated Time
                  </th>
                  <th className="border px-4 py-2" style={{ width: "120px" }}>
                    Start Time
                  </th>
                  <th className="border px-4 py-2" style={{ width: "120px" }}>
                    End Time
                  </th>
                  <th className="border px-4 py-2" style={{ width: "100px" }}>
                    Status
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Reason for Incomplete
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Remarks
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Admin Review
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Team Leader Review
                  </th>
                  <th className="border px-4 py-2"></th>{" "}
                  {/* Save button column header */}
                </tr>
              </thead>
              <tbody>
                {filteredReportData.map((item, index) => ( // Use filteredReportData
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="border px-4 py-4">
                      {index + 1 + (page - 1) * maxDisplayCount}
                    </td>
                    <td className="border px-4 py-4">
                      {moment(item.date).format("DD-MM-YYYY")}
                    </td>
                    <td className="border px-4 py-4">
                      {moment(item.createdAt).format("HH:mm A")}
                    </td>
                    {designation === "Sr. Technical Head" && (
                      <td className="border px-4 py-4">
                        {item.employeeName || "N/A"}
                      </td>
                    )}
                    <td className="border px-4 py-4">{item.customer}</td>
                    <td className="border px-4 py-4">{item.task}</td>
                    <td className="border px-4 py-4">{item.estimatedTime}</td>
                    <td className="border px-4 py-4">{item.startTime}</td>
                    <td className="border px-4 py-4">{item.endTime}</td>
                    <td className="border px-4 py-4">{item.taskStatus}</td>
                    <td className="border px-4 py-4">
                      {item.reasonForIncomplete}
                    </td>
                    <td className="border px-4 py-4">{item.remarks}</td>
                    <td className="border px-4 py-4">
                      {/* Admin Review - Non-editable */}
                      <input
                        type="text"
                        placeholder="Admin Review"
                        value={item.evaluation || ""} // Display the evaluation
                        className=""
                        readOnly // Make it read-only
                      />
                    </td>
                    <td className="border px-4 py-4">
                      <input
                        type="text"
                        placeholder="Team Leader Review"
                        value={teamLeaderReviews[item.id] || item.review || ""} // Display current value
                        onChange={(e) =>
                          handleReviewChange(item.id, false, e.target.value)
                        } // Update teamLeaderReviews
                        className="border border-gray-300 rounded p-1"
                      />
                    </td>
                    {/* Save button */}
                    <td className="border px-4 py-4 text-center">
                      <button
                        onClick={() => handleSubmitReview(item.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        disabled={
                          !(userType === "Admin" || designation === "Sr. Technical Head")
                        }
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">No reports available.</div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            handlePageChange(page < totalPages ? page + 1 : totalPages)
          }
          disabled={page === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeReportList;