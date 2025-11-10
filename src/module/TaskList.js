// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

// const EmployeeReportList = () => {
//   const { userType, employeeId, designation } = useSelector(
//     (state) => state.login.userData
//   );
//   const isAdmin = userType === "Admin" || designation === "Sr. Technical Head";
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const navigate = useNavigate();
//   const [team_leader_reviewInputs, setteam_leader_reviewInputs] = useState({});
//   const [admin_reviewInputs, setadmin_reviewInputs] = useState({});
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [isEditable, setIsEditable] = useState(false);
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employee_id:
//           selectedEmployeeId ||
//           designation === "Sr. Technical Head" ||
//           userType === "Admin"
//             ? null
//             : employeeId,
//       };

//       const apiEndpoint = `${process.env.REACT_APP_API_URL}/get_assigned_project`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;
//       console.log(data, "data");

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data);
//         const admin_review = {};
//         const team_leader_review = {};
//         data.forEach((item) => {
//           admin_review[item.id] = item.admin_review;
//           team_leader_review[item.id] = item.team_leader_review;
//         });
//         setadmin_reviewInputs(admin_review);
//         setteam_leader_reviewInputs(team_leader_review);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

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
//     fetchReportData();
//   }, [
//     fromDate,
//     toDate,
//     page,
//     maxDisplayCount,
//     employeeId,
//     userType,
//     selectedEmployeeId,
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
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this Daily Task?"
//     );
//     if (confirmDelete) {
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/delete_project_assign`,
//           {
//             id: id,
//           }
//         );

//         if (response.data.status === "Success") {
//           alert("Record deleted successfully");
//           fetchReportData(); // Refresh report data after deletion
//         } else {
//           alert("Failed to delete record");
//         }
//       } catch (error) {
//         console.error("Error deleting record:", error);
//         alert("An error occurred while deleting the record");
//       }
//     }
//   };

//   const saveadmin_reviewandteam_leader_review = async (payload) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/project_assign`,
//         payload
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error saving task:", error);
//       return { status: "Fail" };
//     }
//   };

//   const handleadmin_reviewChange = (id, e) => {
//     const newValue = e.target.value;
//     setadmin_reviewInputs((prev) => ({
//       ...prev,
//       [id]: newValue,
//     }));
//   };

//   const handleteam_leader_reviewChange = (id, e) => {
//     const newValue = e.target.value;
//     setteam_leader_reviewInputs((prev) => ({
//       ...prev,
//       [id]: newValue,
//     }));
//   };

//   const handleSave = async (id) => {
//     console.log("id", id);
//     console.log("reportData", reportData);
//     const payload = reportData.find((data) => data.id === id);
//     console.log("payload", payload);

//     payload.assigned_date = moment(payload.assigned_date).format(
//       "YYYY-MM-DD HH:mm:ss"
//     );
//     payload.deadline_date = moment(payload.deadline_date).format(
//       "YYYY-MM-DD HH:mm:ss"
//     );
//     payload.admin_review = admin_reviewInputs[id];
//     payload.team_leader_review = team_leader_reviewInputs[id];

//     const response = await saveadmin_reviewandteam_leader_review(payload);

//     if (
//       response.message === "Project updated successfully." ||
//       response.message === "Project assigned successfully."
//     ) {
//       alert("Review saved successfully");
//     } else if (response.error) {
//       alert("Error: " + response.error);
//     } else {
//       alert("Failed to save Review");
//     }

//     fetchReportData();
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">
//         Daily Task
//       </h5>
//       <div className="my-4 flex flex-col sm:flex-row items-center">
//         <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">
//           Start Date:
//         </label>
//         <input
//           type="date"
//           name="fromDate"
//           value={fromDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           style={{ width: "200px" }}
//         />
//         <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">
//           End Date:
//         </label>
//         <input
//           type="date"
//           name="toDate"
//           value={toDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           style={{ width: "200px" }}
//         />
//         {isAdmin && (
//           <div className="flex items-center">
//             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//               Select Employee:
//             </label>
//             <select
//               id="employee"
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               style={{ width: "240px" }}
//               value={selectedEmployeeId}
//               onChange={(e) => setSelectedEmployeeId(e.target.value)}
//             >
//               <option value="">All</option>
//               {employeeList.map((emp) => (
//                 <option key={emp.employeeId} value={emp.employeeId}>
//                   {emp.employeeName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
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
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>
//                     Time
//                   </th>
//                   {isAdmin && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Employee Name
//                     </th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>
//                     Project Name
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Sub Products
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task Details
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task Description
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Estimated Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Assigned Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Deadline Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Task Status
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Reason for Incomplete
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Remarks
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Created By
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Admin Review
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Team Leader Review
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     className="bg-white border-b hover:bg-gray-50"
//                   >
//                     <td className="border px-4 py-2">{index + 1}</td>
//                     <td className="border px-4 py-2">{item.date}</td>
//                     <td className="border px-4 py-2">
//                       {new Date(item.created_at).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </td>

//                     {isAdmin && (
//                       <td className="border px-4 py-2">{item.employee_name}</td>
//                     )}
//                     <td className="border px-4 py-2">{item.project_name}</td>
//                     <td className="border px-4 py-2">{item.sub_products}</td>
//                     <td className="border px-4 py-2">{item.task_details}</td>
//                     <td className="border px-4 py-2">
//                       {item.task_description}
//                     </td>
//                     <td className="border px-4 py-2">{item.estimated_time}</td>
//                     <td className="border px-4 py-2">{moment(item.assigned_date).format("YYYY-MM-DD HH:mm")}</td>
//                     <td className="border px-4 py-2">{moment(item.deadline_date).format("YYYY-MM-DD HH:mm")}</td>
//                     <td className="border px-4 py-2">{item.task_status}</td>
//                     <td className="border px-4 py-2">
//                       {item.reason_for_incomplete}
//                     </td>
//                     <td className="border px-4 py-2">{item.remarks}</td>
//                     <td className="border px-4 py-2">{item.created_by}</td>
//                     <td className="border px-4 py-2">
//                       {isAdmin ? (
//                         <input
//                           type="text"
//                           value={admin_reviewInputs[item.id] || ""}
//                           onChange={(e) => handleadmin_reviewChange(item.id, e)}
//                           placeholder="Enter Admin Review"
//                           className="w-full p-2 border rounded-md"
//                         />
//                       ) : (
//                         <span>{item.admin_review}</span>
//                       )}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {isAdmin ? (
//                         <input
//                           type="text"
//                           value={team_leader_reviewInputs[item.id] || ""}
//                           onChange={(e) =>
//                             handleteam_leader_reviewChange(item.id, e)
//                           }
//                           placeholder="Enter Team Leader Review"
//                           className="w-full p-2 border rounded-md"
//                         />
//                       ) : (
//                         <span>{item.team_leader_review}</span>
//                       )}
//                     </td>
//                     {isEditable && (
//                       <td className="border px-4 py-4">
//                         <button
//                           onClick={() => handleEditClick(item)}
//                           className="text-blue-600 hover:underline"
//                         >
//                           <FontAwesomeIcon icon={faEdit} />
//                         </button>
//                       </td>
//                     )}
//                     {isEditable && (
//                       <td className="border px-4 py-4">
//                         <button onClick={() => handleDelete(item.id)}>
//                           <FontAwesomeIcon
//                             icon={faTrash}
//                             className="text-red-600 hover:underline"
//                           />
//                         </button>
//                       </td>
//                     )}
//                     {isAdmin && (
//                       <td className="border px-4 py-2">
//                         <button
//                           onClick={() => handleSave(item.id)}
//                           className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                         >
//                           Save
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="pagination">
//             <button
//               disabled={page === 1}
//               onClick={() => handlePageChange(page - 1)}
//             >
//               Previous
//             </button>
//             <span>{`Page ${page} of ${totalPages}`}</span>
//             <button
//               disabled={page === totalPages}
//               onClick={() => handlePageChange(page + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p className="text-center">No records found</p>
//       )}
//     </div>
//   );
// };

// export default EmployeeReportList;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

// const EmployeeReportList = () => {
//   const { userType, employeeId, designation } = useSelector(
//     (state) => state.login.userData
//   );
//   const isAdmin = userType === "Admin" || designation === "Sr. Technical Head";
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const navigate = useNavigate();
//   const [team_leader_reviewInputs, setteam_leader_reviewInputs] = useState({});
//   const [admin_reviewInputs, setadmin_reviewInputs] = useState({});
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [isEditable, setIsEditable] = useState(false);
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         from_date:fromDate,
//         to_date:toDate,
//         employee_id:
//           selectedEmployeeId ||
//           designation === "Sr. Technical Head" ||
//           userType === "Admin"
//             ? null
//             : employeeId,
//       };

//       const apiEndpoint = `${process.env.REACT_APP_API_URL}/get_assigned_project`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;
//       console.log(data, "data");

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data);
//         const admin_review = {};
//         const team_leader_review = {};
//         data.forEach((item) => {
//           admin_review[item.id] = item.admin_review;
//           team_leader_review[item.id] = item.team_leader_review;
//         });
//         setadmin_reviewInputs(admin_review);
//         setteam_leader_reviewInputs(team_leader_review);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

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
//     fetchReportData();
//   }, [
//     fromDate,
//     toDate,
//     page,
//     maxDisplayCount,
//     employeeId,
//     userType,
//     selectedEmployeeId,
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
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this Daily Task?"
//     );
//     if (confirmDelete) {
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/delete_project_assign`,
//           {
//             id: id,
//           }
//         );

//         if (response.data.status === "Success") {
//           alert("Record deleted successfully");
//           fetchReportData(); // Refresh report data after deletion
//         } else {
//           alert("Failed to delete record");
//         }
//       } catch (error) {
//         console.error("Error deleting record:", error);
//         alert("An error occurred while deleting the record");
//       }
//     }
//   };

//   const saveadmin_reviewandteam_leader_review = async (payload) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/project_assign`,
//         payload
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error saving task:", error);
//       return { status: "Fail" };
//     }
//   };

//   const handleadmin_reviewChange = (id, e) => {
//     const newValue = e.target.value;
//     setadmin_reviewInputs((prev) => ({
//       ...prev,
//       [id]: newValue,
//     }));
//   };

//   const handleteam_leader_reviewChange = (id, e) => {
//     const newValue = e.target.value;
//     setteam_leader_reviewInputs((prev) => ({
//       ...prev,
//       [id]: newValue,
//     }));
//   };

//   const handleSave = async (id) => {
//     console.log("id", id);
//     console.log("reportData", reportData);
//     const payload = reportData.find((data) => data.id === id);
//     console.log("payload", payload);

//     payload.assigned_date = moment(payload.assigned_date).format(
//       "YYYY-MM-DD HH:mm:ss"
//     );
//     payload.deadline_date = moment(payload.deadline_date).format(
//       "YYYY-MM-DD HH:mm:ss"
//     );
//     payload.admin_review = admin_reviewInputs[id];
//     payload.team_leader_review = team_leader_reviewInputs[id];

//     const response = await saveadmin_reviewandteam_leader_review(payload);

//     if (
//       response.message === "Project updated successfully." ||
//       response.message === "Project assigned successfully."
//     ) {
//       alert("Review saved successfully");
//     } else if (response.error) {
//       alert("Error: " + response.error);
//     } else {
//       alert("Failed to save Review");
//     }

//     fetchReportData();
//   };

//   // const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const totalPages = totalRecords && maxDisplayCount
//   ? Math.ceil(totalRecords / maxDisplayCount)
//   : 1;

//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">
//         Daily Task
//       </h5>
//       <div className="my-4 flex flex-col sm:flex-row items-center">
//         <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">
//           Start Date:
//         </label>
//         <input
//           type="date"
//           name="fromDate"
//           value={fromDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           style={{ width: "200px" }}
//         />
//         <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">
//           End Date:
//         </label>
//         <input
//           type="date"
//           name="toDate"
//           value={toDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           style={{ width: "200px" }}
//         />
//         {isAdmin && (
//           <div className="flex items-center">
//             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//               Select Employee:
//             </label>
//             <select
//               id="employee"
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               style={{ width: "240px" }}
//               value={selectedEmployeeId}
//               onChange={(e) => setSelectedEmployeeId(e.target.value)}
//             >
//               <option value="">All</option>
//               {employeeList.map((emp) => (
//                 <option key={emp.employeeId} value={emp.employeeId}>
//                   {emp.employeeName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
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
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>
//                     Time
//                   </th>
//                   {isAdmin && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Employee Name
//                     </th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>
//                     Project Name
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Sub Products
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task Details
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>
//                     Task Description
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>
//                     Estimated Time
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Assigned Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>
//                     Deadline Date
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Task Status
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>
//                     Reason for Incomplete
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Remarks
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Task Created By
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Admin Review
//                   </th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Team Leader Review
//                   </th>
//                   {isAdmin && (
//                    <th className="border px-4 py-2" style={{ width: "750px" }}>
//                     Action
//                   </th>
//                    )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     className="bg-white border-b hover:bg-gray-50"
//                   >
//                     <td className="border px-4 py-2">{index + 1}</td>
//                     <td className="border px-4 py-2">{item.date}</td>
//                     <td className="border px-4 py-2">
//                       {new Date(item.created_at).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </td>

//                     {isAdmin && (
//                       <td className="border px-4 py-2">{item.employee_name}</td>
//                     )}
//                     <td className="border px-4 py-2">{item.project_name}</td>
//                     <td className="border px-4 py-2">{item.sub_products}</td>
//                     <td className="border px-4 py-2">{item.task_details}</td>
//                     <td className="border px-4 py-2">
//                       {item.task_description}
//                     </td>
//                     <td className="border px-4 py-2">{item.estimated_time}</td>
//                     <td className="border px-4 py-2">{moment(item.assigned_date).format("YYYY-MM-DD HH:mm")}</td>
//                     <td className="border px-4 py-2">{moment(item.deadline_date).format("YYYY-MM-DD HH:mm")}</td>
//                     <td className="border px-4 py-2">{item.task_status}</td>
//                     <td className="border px-4 py-2">
//                       {item.reason_for_incomplete}
//                     </td>
//                     <td className="border px-4 py-2">{item.remarks}</td>
//                     <td className="border px-4 py-2">{item.created_by}</td>
//                     <td className="border px-4 py-2">
//                       {isAdmin ? (
//                         <input
//                           type="text"
//                           value={admin_reviewInputs[item.id] || ""}
//                           onChange={(e) => handleadmin_reviewChange(item.id, e)}
//                           placeholder="Enter Admin Review"
//                           className="w-full p-2 border rounded-md"
//                         />
//                       ) : (
//                         <span>{item.admin_review}</span>
//                       )}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {isAdmin ? (
//                         <input
//                           type="text"
//                           value={team_leader_reviewInputs[item.id] || ""}
//                           onChange={(e) =>
//                             handleteam_leader_reviewChange(item.id, e)
//                           }
//                           placeholder="Enter Team Leader Review"
//                           className="w-full p-2 border rounded-md"
//                         />
//                       ) : (
//                         <span>{item.team_leader_review}</span>
//                       )}
//                     </td>
//                     {isEditable && (
//                       <td className="border px-4 py-4">
//                         <button
//                           onClick={() => handleEditClick(item)}
//                           className="text-blue-600 hover:underline"
//                         >
//                           <FontAwesomeIcon icon={faEdit} />
//                         </button>
//                       </td>
//                     )}
//                     {isEditable && (
//                       <td className="border px-4 py-4">
//                         <button onClick={() => handleDelete(item.id)}>
//                           <FontAwesomeIcon
//                             icon={faTrash}
//                             className="text-red-600 hover:underline"
//                           />
//                         </button>
//                       </td>
//                     )}
//                     {isAdmin && (
//                       <td className="border px-4 py-2">
//                         <button
//                           onClick={() => handleSave(item.id)}
//                           className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                         >
//                           Save
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
// {reportData.length > 0 && Number.isFinite(totalPages) && (
//           <div className="pagination">
//             <button
//               disabled={page === 1}
//               onClick={() => handlePageChange(page - 1)}
//             >
//               Previous
//             </button>
//             <span>{`Page ${page} of ${totalPages}`}</span>
//             <button
//               disabled={page === totalPages}
//               onClick={() => handlePageChange(page + 1)}
//             >
//               Next
//             </button>
//           </div>
// )}
//         </div>


        
//       ) : (
//         <p className="text-center">No records found</p>
//       )}
//     </div>
//   );
// };

// export default EmployeeReportList;


import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faFileExport } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

const EmployeeReportList = () => {
  const { userType, employeeId, designation } = useSelector(
    (state) => state.login.userData
  );
  const isAdmin = userType === "Admin" || designation === "Sr. Technical Head";
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(10);
  const navigate = useNavigate();
  const [team_leader_reviewInputs, setteam_leader_reviewInputs] = useState({});
  const [admin_reviewInputs, setadmin_reviewInputs] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  
  const fetchReportData = async () => {
    try {
      const payload = {
        page: page.toString(),
        limit: maxDisplayCount,
        from_date: fromDate,
        to_date: toDate,
        employee_id: isAdmin && selectedEmployeeId ? selectedEmployeeId : 
                    (!isAdmin ? employeeId : null)
      };

      console.log("API Payload:", payload); // Debug log

      const apiEndpoint = `${process.env.REACT_APP_API_URL}/get_assigned_project`;

      const response = await axios.post(apiEndpoint, payload);
      const { status, data, totalRecords } = response.data;
      console.log("API Response:", data, "data");

      if (status === "Success") {
        setTotalRecords(totalRecords);
        setReportData(data);
        const admin_review = {};
        const team_leader_review = {};
        data.forEach((item) => {
          admin_review[item.id] = item.admin_review;
          team_leader_review[item.id] = item.team_leader_review;
        });
        setadmin_reviewInputs(admin_review);
        setteam_leader_reviewInputs(team_leader_review);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setReportData([]);
    }
  };

  // Function to fetch all data for export (without pagination)
  const fetchAllDataForExport = async () => {
    try {
      const payload = {
        from_date: fromDate,
        to_date: toDate,
        employee_id: isAdmin && selectedEmployeeId ? selectedEmployeeId : 
                    (!isAdmin ? employeeId : null)
      };

      console.log("Export API Payload:", payload); // Debug log

      const apiEndpoint = `${process.env.REACT_APP_API_URL}/get_assigned_project`;

      const response = await axios.post(apiEndpoint, payload);
      const { status, data } = response.data;

      if (status === "Success") {
        console.log("Export Data:", data); // Debug log
        return data;
      }
      return [];
    } catch (error) {
      console.error("Error occurred while fetching data for export:", error);
      return [];
    }
  };

  // Export to Excel function
  const exportToExcel = async () => {
    try {
      // Show loading state
      const exportButton = document.getElementById('export-button');
      const originalText = exportButton.innerHTML;
      exportButton.innerHTML = 'Exporting...';
      exportButton.disabled = true;

      // Fetch all data for the current filter criteria
      const allData = await fetchAllDataForExport();
      
      if (allData.length === 0) {
        alert("No data available to export");
        exportButton.innerHTML = originalText;
        exportButton.disabled = false;
        return;
      }

      // Prepare data for Excel
      const excelData = allData.map((item, index) => ({
        "S/No": index + 1,
        "Date": item.date,
        "Time": new Date(item.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        "Employee Name": item.employee_name,
        "Project Name": item.project_name,
        "Sub Products": item.sub_products,
        "Task Details": item.task_details,
        "Task Description": item.task_description,
        "Estimated Time": item.estimated_time,
        "Assigned Date": moment(item.assigned_date).format("YYYY-MM-DD HH:mm"),
        "Deadline Date": moment(item.deadline_date).format("YYYY-MM-DD HH:mm"),
        "Task Status": item.task_status,
        "Reason for Incomplete": item.reason_for_incomplete,
        "Remarks": item.remarks,
        "Task Created By": item.created_by,
        "Admin Review": item.admin_review,
        "Team Leader Review": item.team_leader_review,
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 5 },   // S/No
        { wch: 12 },  // Date
        { wch: 10 },  // Time
        { wch: 20 },  // Employee Name
        { wch: 20 },  // Project Name
        { wch: 20 },  // Sub Products
        { wch: 30 },  // Task Details
        { wch: 30 },  // Task Description
        { wch: 15 },  // Estimated Time
        { wch: 20 },  // Assigned Date
        { wch: 20 },  // Deadline Date
        { wch: 15 },  // Task Status
        { wch: 25 },  // Reason for Incomplete
        { wch: 25 },  // Remarks
        { wch: 20 },  // Task Created By
        { wch: 25 },  // Admin Review
        { wch: 25 },  // Team Leader Review
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Daily Tasks");

      // Generate file name with date range and employee info
      let fileName = `Daily_Tasks_${fromDate}_to_${toDate}`;
      
      if (selectedEmployeeId) {
        const selectedEmployee = employeeList.find(emp => emp.employeeId === selectedEmployeeId);
        if (selectedEmployee) {
          fileName += `_${selectedEmployee.employeeName.replace(/\s+/g, '_')}`;
        }
      }

      // Export to Excel
      XLSX.writeFile(wb, `${fileName}.xlsx`);

      // Reset button state
      exportButton.innerHTML = originalText;
      exportButton.disabled = false;

    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error occurred while exporting to Excel");
      
      // Reset button state in case of error
      const exportButton = document.getElementById('export-button');
      exportButton.innerHTML = '<FontAwesomeIcon icon={faFileExport} className="mr-2" /> Export to Excel';
      exportButton.disabled = false;
    }
  };

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
    fetchReportData();
  }, [
    fromDate,
    toDate,
    page,
    maxDisplayCount,
    employeeId,
    userType,
    selectedEmployeeId,
    isAdmin
  ]);

  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
    setPage(1); // Reset to first page when date changes
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployeeId(e.target.value);
    setPage(1); // Reset to first page when employee changes
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Daily Task?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/delete_project_assign`,
          {
            id: id,
          }
        );

        if (response.data.status === "Success") {
          alert("Record deleted successfully");
          fetchReportData(); // Refresh report data after deletion
        } else {
          alert("Failed to delete record");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("An error occurred while deleting the record");
      }
    }
  };

  const saveadmin_reviewandteam_leader_review = async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/project_assign`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error saving task:", error);
      return { status: "Fail" };
    }
  };

  const handleadmin_reviewChange = (id, e) => {
    const newValue = e.target.value;
    setadmin_reviewInputs((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const handleteam_leader_reviewChange = (id, e) => {
    const newValue = e.target.value;
    setteam_leader_reviewInputs((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const handleSave = async (id) => {
    console.log("id", id);
    console.log("reportData", reportData);
    const payload = reportData.find((data) => data.id === id);
    console.log("payload", payload);

    payload.assigned_date = moment(payload.assigned_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    payload.deadline_date = moment(payload.deadline_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    payload.admin_review = admin_reviewInputs[id];
    payload.team_leader_review = team_leader_reviewInputs[id];

    const response = await saveadmin_reviewandteam_leader_review(payload);

    if (
      response.message === "Project updated successfully." ||
      response.message === "Project assigned successfully."
    ) {
      alert("Review saved successfully");
    } else if (response.error) {
      alert("Error: " + response.error);
    } else {
      alert("Failed to save Review");
    }

    fetchReportData();
  };

  const totalPages = totalRecords && maxDisplayCount
    ? Math.ceil(totalRecords / maxDisplayCount)
    : 1;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto">
      <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">
        Daily Task
      </h5>
      
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button
          id="export-button"
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <FontAwesomeIcon icon={faFileExport} className="mr-2" />
          Export to Excel
        </button>
      </div>

      {/* Filters Section */}
      <div className="my-4 flex flex-col sm:flex-row items-center">
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
        {isAdmin && (
          <div className="flex items-center">
            <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
              Select Employee:
            </label>
            <select
              id="employee"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
              style={{ width: "240px" }}
              value={selectedEmployeeId}
              onChange={handleEmployeeChange}
            >
              <option value="">All Employees</option>
              {employeeList.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Current Filter Info */}
      {/* <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Current Filter:</strong> 
          {` ${fromDate} to ${toDate}`}
          {selectedEmployeeId && (
            ` | Employee: ${employeeList.find(emp => emp.employeeId === selectedEmployeeId)?.employeeName || selectedEmployeeId}`
          )}
          {!isAdmin && (
            ` | Employee: You (${employeeId})`
          )}
        </p>
      </div> */}

      {reportData.length > 0 ? (
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
                  <th className="border px-4 py-2" style={{ width: "350px" }}>
                    Time
                  </th>
                  {isAdmin && (
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Employee Names
                    </th>
                  )}
                  <th className="border px-4 py-2" style={{ width: "150px" }}>
                    Project Name
                  </th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>
                    Sub Products
                  </th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>
                    Task Details
                  </th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>
                    Task Description
                  </th>
                  <th className="border px-4 py-2" style={{ width: "120px" }}>
                    Estimated Time
                  </th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>
                    Assigned Date
                  </th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>
                    Deadline Date
                  </th>
                  <th className="border px-4 py-2" style={{ width: "100px" }}>
                    Task Status
                  </th>
                  <th className="border px-4 py-2" style={{ width: "100px" }}>
                    Reason for Incomplete
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Remarks
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Task Created By
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Admin Review
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Team Leader Review
                  </th>
                  {isAdmin && (
                   <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Action
                  </th>
                   )}
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2">
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {isAdmin && (
                      <td className="border px-4 py-2">{item.employee_name}</td>
                    )}
                    <td className="border px-4 py-2">{item.project_name}</td>
                    <td className="border px-4 py-2">{item.sub_products}</td>
                    <td className="border px-4 py-2">{item.task_details}</td>
                    <td className="border px-4 py-2">
                      {item.task_description}
                    </td>
                    <td className="border px-4 py-2">{item.estimated_time}</td>
                    <td className="border px-4 py-2">{moment(item.assigned_date).format("YYYY-MM-DD HH:mm")}</td>
                    <td className="border px-4 py-2">{moment(item.deadline_date).format("YYYY-MM-DD HH:mm")}</td>
                    <td className="border px-4 py-2">{item.task_status}</td>
                    <td className="border px-4 py-2">
                      {item.reason_for_incomplete}
                    </td>
                    <td className="border px-4 py-2">{item.remarks}</td>
                    <td className="border px-4 py-2">{item.created_by}</td>
                    <td className="border px-4 py-2">
                      {isAdmin ? (
                        <input
                          type="text"
                          value={admin_reviewInputs[item.id] || ""}
                          onChange={(e) => handleadmin_reviewChange(item.id, e)}
                          placeholder="Enter Admin Review"
                          className="w-full p-2 border rounded-md"
                        />
                      ) : (
                        <span>{item.admin_review}</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {isAdmin ? (
                        <input
                          type="text"
                          value={team_leader_reviewInputs[item.id] || ""}
                          onChange={(e) =>
                            handleteam_leader_reviewChange(item.id, e)
                          }
                          placeholder="Enter Team Leader Review"
                          className="w-full p-2 border rounded-md"
                        />
                      ) : (
                        <span>{item.team_leader_review}</span>
                      )}
                    </td>
                    {isEditable && (
                      <td className="border px-4 py-4">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:underline"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                    )}
                    {isEditable && (
                      <td className="border px-4 py-4">
                        <button onClick={() => handleDelete(item.id)}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-red-600 hover:underline"
                          />
                        </button>
                      </td>
                    )}
                    {isAdmin && (
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          Save
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reportData.length > 0 && Number.isFinite(totalPages) && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>
              <span>{`Page ${page} of ${totalPages}`}</span>
              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center">No records found for the selected filters</p>
      )}
    </div>
  );
};

export default EmployeeReportList;