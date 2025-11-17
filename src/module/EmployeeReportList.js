// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const navigate = useNavigate();
//   const { isAuth, userData } = useSelector((state) => state.login);
//   useEffect(() => {
//     if (!isAuth) {
//       navigate("/");
//     }
//   }, [isAuth, navigate]);
//   const employeeId = userData?.employeeId ?? null;
//   const userType = userData?.userType ?? null;
//   const today = new Date().toISOString().split("T")[0];

//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({}); // State for Team Leader Reviews
//   const [reviews, setReviews] = useState({});

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [employeeList, setEmployeeList] = useState([]); // Added to store employee list

//   useEffect(() => {
//     const fetchEmployeeList = async () => {
//       try {
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//         if (response.data.status === "Success") {
//           setEmployeeList(response.data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching employee list:", err);
//       }
//     };
//     fetchEmployeeList();
//   }, []);

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee,
//       };

//       const apiEndpoint = userType === "Admin" ? `${process.env.REACT_APP_API_URL}/reportHistory_admin` : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const employeeNames = [...new Set(data.flatMap((report) => report.name))];
//           setEmployees(["All", ...employeeNames]);

//           const existingEvaluations = {};
//           const existingTeamLeaderReviews = {};

//           data.forEach((dateItem) => {
//             existingEvaluations[dateItem.id] = typeof dateItem.evaluation === "string" ? JSON.parse(dateItem.evaluation) : dateItem.evaluation || {};

//             existingTeamLeaderReviews[dateItem.id] = typeof dateItem.teamLeaderReview === "string" ? JSON.parse(dateItem.teamLeaderReview) : dateItem.teamLeaderReview || {};
//           });
//           setEvaluations(existingEvaluations);
//           setTeamLeaderReviews(existingTeamLeaderReviews);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   //   const fetchEmployees = async () => {
//   //     try {
//   //       const response = await axios.get(
//   //         `${process.env.REACT_APP_API_URL}/addEmployee`
//   //       );
//   //       if (response.data.status === "Success") {
//   //         setEmployees(response.data.employees); // Store employee list in state
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching employees:", error);
//   //     }
//   //   };

//   //   useEffect(() => {
//   //     fetchEmployees();
//   //   }, []);

//   useEffect(() => {
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, selectedEmployee]);

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

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//         fetchReportData(); // Refresh the data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || ""; // this is not being used anymore, we will use teamLeaderReviews
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review: teamLeaderReviews[id] || "", // This is being sent for backward compatibility, but teamLeaderReview is the relevant one now
//         //  teamLeaderReview: teamLeaderReviews[id] || "", // Send teamLeaderReview
//       };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//         fetchReportData(); // Refresh after save to update data
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">Employee Report</h5>
//       <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex items-center sm:flex-row">
//           <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">
//             Start Date:
//           </label>
//           <input type="date" name="fromDate" value={fromDate} onChange={handleDateChange} max={today} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2" style={{ width: "200px" }} />
//           <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">
//             End Date:
//           </label>
//           <input type="date" name="toDate" value={toDate} onChange={handleDateChange} max={today} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2" style={{ width: "200px" }} />
//          {userType !== "Admin" || userType !== "developerAdmin" &&
//           <div className="flex items-center">
//             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//               Select Employee:
//             </label>
//             <select id="employee" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5" style={{ width: "240px" }} value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
//               <option value="All">All</option>
//               {employeeList.map((emp) => (
//                 <option key={emp.employeeId} value={emp.employeeId}>
//                   {emp.employeeName}
//                 </option>
//               ))}
//             </select>
//           </div>}
//         </div>
//       </div>

//       {userType === "Admin" || userType === "developerAdmin" ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="table-container">
//               <table>
//                 <thead className="table-header-row">
//                   <tr>
//                     <th>S/No</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Employee Name</th>
//                     <th>Project Name</th>
//                     <th>Product</th>
//                     <th>Report</th>
//                     <th>Admin Review</th>
//                     <th>Team Leader Review</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount;

//                     return reportData.map((reportItem, reportIndex) => {
//                       const reportDetails = reportItem.reportDetails || [];
//                       const createdAt = reportItem.created_at ? moment(reportItem.created_at).format("HH:mm A") : "N/A";

//                       const totalSubCategories = reportDetails.reduce((acc, detailItem) => acc + (detailItem.subCategory?.length || 0), 0);

//                       let hasRenderedMainCells = false;

//                       return reportDetails.flatMap((detailItem, detailIndex) => {
//                         const subcategories = detailItem.subCategory || [];

//                         return subcategories.map((subCategoryItem, subCatIndex) => {
//                           const isFirstRow = !hasRenderedMainCells;
//                           const row = (
//                             <tr key={`${reportItem.id}-${detailIndex}-${subCatIndex}`} className="bg-white border-b hover:bg-gray-50">
//                               {isFirstRow && (
//                                 <>
//                                   <td className="border px-6 py-4" rowSpan={totalSubCategories}>
//                                     {reportIndex + 1}
//                                   </td>
//                                   <td className="border px-6 py-4" rowSpan={totalSubCategories}>
//                                     {reportItem.reportDate}
//                                   </td>
//                                   <td className="border px-6 py-4" rowSpan={totalSubCategories}>
//                                     {createdAt}
//                                   </td>
//                                   <td className="border px-6 py-4" rowSpan={totalSubCategories}>
//                                     {reportItem.name || "N/A"}
//                                   </td>
//                                 </>
//                               )}

//                               {subCatIndex === 0 && (
//                                 <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                   {detailItem.projectName || "N/A"}
//                                 </td>
//                               )}

//                               <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                               <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>

//                               {/* Admin Review */}
//                               <td className="border px-6 py-4">
//                                 {userType === "Employee" ? (
//                                   <div className="border rounded p-1 bg-gray-100">{reportItem.evaluation || "No admin review available."}</div>
//                                 ) : (
//                                   <input
//                                     type="text"
//                                     value={evaluations?.[reportItem.id]?.[detailItem.projectName]?.[subCategoryItem.subCategoryName] || ""}
//                                     onChange={(e) => {
//                                       const updated = { ...evaluations };
//                                       if (!updated[reportItem.id]) updated[reportItem.id] = {};
//                                       if (!updated[reportItem.id][detailItem.projectName]) updated[reportItem.id][detailItem.projectName] = {};
//                                       updated[reportItem.id][detailItem.projectName][subCategoryItem.subCategoryName] = e.target.value;
//                                       setEvaluations(updated);
//                                     }}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                   />
//                                 )}
//                               </td>

//                               {/* Team Leader Review */}
//                               <td className="border px-6 py-4">
//                                 {userType === "Admin" ? (
//                                   <div>{reportItem.review || "No review available"}</div>
//                                 ) : (
//                                   <input
//                                     type="text"
//                                     value={teamLeaderReviews?.[reportItem.id]?.[detailItem.projectName]?.[subCategoryItem.subCategoryName] || ""}
//                                     onChange={(e) => {
//                                       const updated = { ...teamLeaderReviews };
//                                       if (!updated[reportItem.id]) updated[reportItem.id] = {};
//                                       if (!updated[reportItem.id][detailItem.projectName]) updated[reportItem.id][detailItem.projectName] = {};
//                                       updated[reportItem.id][detailItem.projectName][subCategoryItem.subCategoryName] = e.target.value;
//                                       setTeamLeaderReviews(updated);
//                                     }}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                   />
//                                 )}
//                               </td>

//                               <td className="border px-6 py-4">
//                                 <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">
//                                   Save
//                                 </button>
//                               </td>
//                             </tr>
//                           );

//                           hasRenderedMainCells = true;
//                           return row;
//                         });
//                       });
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: "430px" }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="postion-sticky text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>
//                       S/No
//                     </th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>
//                       Date
//                     </th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>
//                       Time
//                     </th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Project Name
//                     </th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>
//                       Subcategory
//                     </th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>
//                       Report
//                     </th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>
//                       Admin Review
//                     </th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>
//                       Team Leader Review
//                     </th>{" "}
//                     {/* Team Leader Review Column */}
//                     {userType === "employee" && (
//                       <th className="border px-4 py-2" style={{ width: "50px" }}>
//                         Delete
//                       </th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];
//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                     {/* Report Time - Created At */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {dateItem.reportTime ? dateItem.reportTime : "N/A"}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">{dateItem.review || "No admin review available."}</td>
//                                 {/* Team Leader Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">{dateItem.evaluation || "No team leader review available."}</td>
//                                 {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day") && (
//                                   <td className="px-4 py-3">
//                                     <button onClick={() => handleDelete(dateItem.id)}>
//                                       <FontAwesomeIcon icon={faTrash} />
//                                     </button>
//                                   </td>
//                                 )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button onClick={() => handlePageChange(page > 1 ? page - 1 : 1)} disabled={page === 1} className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50">
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)} disabled={page === totalPages} className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50">
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EmployeeReportList = () => {
  const navigate = useNavigate();
  const { isAuth, userData } = useSelector((state) => state.login);
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);
  const employeeId = userData?.employeeId ?? null;
  const userType = userData?.userType ?? null;
  const today = new Date().toISOString().split("T")[0];

  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(25);
  const [evaluations, setEvaluations] = useState({});
  const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
  const [reviews, setReviews] = useState({});
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [employeeList, setEmployeeList] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);

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
  const getReviewAndEvaluation = (r) => {
    if (typeof r === "string") {
      try {
        r = JSON.parse(r);
      } catch {
        return r;
      }
    }
    return r || "";
  };
  function safeParse(value) {
    // Case 1: Already object → return as-is
    if (typeof value === "object" && value !== null) return value;

    // Case 2: Not a string → return empty object
    if (typeof value !== "string") return {};

    const trimmed = value.trim();

    // Case 3: String is plain (e.g., "Cool") → return string
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      return value;
    }

    // Case 4: Try JSON parse safely
    try {
      return JSON.parse(trimmed);
    } catch {
      return value; // fallback to plain string
    }
  }

  const fetchReportData = async () => {
    try {
      const payload = {
        domain: "Development",
        page: page.toString(),
        limit: maxDisplayCount,
        fromDate,
        toDate,
        employeeId: selectedEmployee,
      };

      const apiEndpoint =
        userType === "Admin"
          ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
          : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

      const response = await axios.post(apiEndpoint, payload);
      const { status, data, totalRecords } = response.data;

      if (status === "Success") {
        setTotalRecords(totalRecords);
        setReportData(data || []);

        if (userType === "Admin") {
          const employeeNames = [
            ...new Set(data.flatMap((report) => report.name)),
          ];
          setEmployees(["All", ...employeeNames]);

          const existingEvaluations = {};
          const existingTeamLeaderReviews = {};

          data.forEach((dateItem) => {
            existingEvaluations[dateItem.id] =
              typeof dateItem.evaluation === "string"
                ? JSON.parse(dateItem.evaluation)
                : dateItem.evaluation || {};

            existingTeamLeaderReviews[dateItem.id] = safeParse(dateItem.review);
          });
          setEvaluations(existingEvaluations);
          setTeamLeaderReviews(existingTeamLeaderReviews);
        }
      } else {
        setReportData([]);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setReportData([]);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [fromDate, toDate, page, maxDisplayCount, selectedEmployee]);

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

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
      );
      if (response.data.status === "Success") {
        alert("Record deleted successfully");
        fetchReportData();
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("An error occurred while deleting the record");
    }
  };

  useEffect(() => {}, []);

  const handleSaveEvaluationReview = async (id) => {
    const evaluation = evaluations[id] || "";
    const review = reviews[id] || "";
    try {
      const payload = {
        id,
        evaluation,
        review: teamLeaderReviews[id] || "",
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/post_emp_report`,
        payload
      );

      if (response.data.status === "Success") {
        alert("Evaluation and Review saved successfully");
        fetchReportData();
      } else {
        alert("Failed to save Evaluation and Review.");
      }
    } catch (error) {
      console.error("Error saving evaluation and review:", error);
      alert("An error occurred while saving.");
    }
  };

  const handleExcelExport = async () => {
    try {
      setExportLoading(true);

      const payload = {
        domain: "Development",
        fromDate,
        toDate,
        employeeId: selectedEmployee,
        export: true,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/reportHistory_admin`,
        payload,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!(response.data instanceof Blob)) {
        throw new Error("Invalid response format - expected blob");
      }

      const contentType = response.headers["content-type"];
      if (
        !contentType ||
        (!contentType.includes("application/vnd.ms-excel") &&
          !contentType.includes(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ))
      ) {
        console.warn("Unexpected content type:", contentType);
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      let fileName = `EmployeeReports_${fromDate}_to_${toDate}.xlsx`;

      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      } else {
        const employeeName =
          selectedEmployee === "All"
            ? "AllEmployees"
            : employeeList.find((emp) => emp.employeeId === selectedEmployee)
                ?.employeeName || "Employee";
        fileName = `EmployeeReports_${employeeName}_${fromDate}_to_${toDate}.xlsx`;
      }
      if (!fileName.toLowerCase().endsWith(".xlsx")) {
        fileName += ".xlsx";
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setExportLoading(false);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setExportLoading(false);

      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text();
          const errorData = JSON.parse(errorText);
          alert(`Export failed: ${errorData.message || "Unknown error"}`);
        } catch (parseError) {
          alert(
            "An error occurred while exporting to Excel. Please check the backend service."
          );
        }
      } else {
        alert("An error occurred while exporting to Excel. Please try again.");
      }
    }
  };

  const handleExcelExportFrontend = () => {
    try {
      let csvContent =
        "Date,Time,Employee Name,Project Name,Subcategory,Report,Admin Review,Team Leader Review\n";

      reportData.forEach((reportItem) => {
        const reportDetails = reportItem.reportDetails || [];

        reportDetails.forEach((detailItem) => {
          const subcategories = detailItem.subCategory || [];

          subcategories.forEach((subCategoryItem) => {
            const row = [
              `"${reportItem.reportDate || ""}"`,
              `"${
                reportItem.created_at
                  ? moment(reportItem.created_at).format("HH:mm A")
                  : ""
              }"`,
              `"${reportItem.name || ""}"`,
              `"${detailItem.projectName || ""}"`,
              `"${subCategoryItem.subCategoryName || ""}"`,
              `"${subCategoryItem.report || ""}"`,
              `"${reportItem.evaluation || ""}"`,
              `"${reportItem.review || ""}"`,
            ].join(",");

            csvContent += row + "\n";
          });
        });
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const employeeName =
        selectedEmployee === "All"
          ? "AllEmployees"
          : employeeList.find((emp) => emp.employeeId === selectedEmployee)
              ?.employeeName || "Employee";
      const fileName = `EmployeeReports_${employeeName}_${fromDate}_to_${toDate}.csv`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("Error generating export file");
    }
  };

  return (
    <div className="container mx-auto">
      <h5 className="text-xl font-semibold mb-2 text-center text-blue-900">
        Employee Report
      </h5>
      <div
        data-rangepicker
        className="my-4 flex flex-col sm:flex-row items-center"
      >
        <div className="flex items-center sm:flex-row justify-center w-full flex-wrap gap-y-2">
          <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">
            Start Date:
          </label>
          <input
            type="date"
            name="fromDate"
            value={fromDate}
            onChange={handleDateChange}
            max={today}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-4"
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

          {(userType === "Admin" || userType === "developerAdmin") && (
            <div className="flex items-center">
              <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
                Select Employee:
              </label>
              <select
                id="employee"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                style={{ width: "240px" }}
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="All">All</option>
                {employeeList.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.employeeName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {(userType === "Admin" || userType === "developerAdmin") && (
          <div className="mt-2 sm:mt-0 sm:ml-4 flex space-x-2">
            {/* <button 
              onClick={handleExcelExport}
              disabled={exportLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
              {exportLoading ? 'Exporting...' : 'Export to Excel'}
            </button> */}

            <button
              onClick={handleExcelExportFrontend}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
              Export to Excel
            </button>
          </div>
        )}
      </div>

      {userType === "Admin" || userType === "developerAdmin" ? (
        <div className="my-5">
          {reportData.length > 0 ? (
            <div className="table-container">
              <table>
                <thead className="table-header-row">
                  <tr>
                    <th>S/No</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Employee Name</th>
                    <th>Project Name</th>
                    <th>Product</th>
                    <th>Report</th>
                    <th>Admin Review</th>
                    <th>Team Leader Review</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let serialNo = (page - 1) * maxDisplayCount;
                    return reportData.map((reportItem, reportIndex) => {
                      const reportDetails = reportItem.reportDetails || [];
                      const createdAt = reportItem.created_at
                        ? moment(reportItem.created_at).format("HH:mm A")
                        : "N/A";
                      const totalSubCategories = reportDetails.reduce(
                        (acc, detailItem) =>
                          acc + (detailItem.subCategory?.length || 0),
                        0
                      );
                      let hasRenderedMainCells = false;

                      return reportDetails.flatMap(
                        (detailItem, detailIndex) => {
                          const subcategories = detailItem.subCategory || [];
                          return subcategories.map(
                            (subCategoryItem, subCatIndex) => {
                              const isFirstRow = !hasRenderedMainCells;
                              const row = (
                                <tr
                                  key={`${reportItem.id}-${detailIndex}-${subCatIndex}`}
                                  className="bg-white border-b hover:bg-gray-50"
                                >
                                  {isFirstRow && (
                                    <>
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={totalSubCategories}
                                      >
                                        {reportIndex + 1}
                                      </td>
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={totalSubCategories}
                                      >
                                        {reportItem.reportDate}
                                      </td>
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={totalSubCategories}
                                      >
                                        {createdAt}
                                      </td>
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={totalSubCategories}
                                      >
                                        {reportItem.name || "N/A"}
                                      </td>
                                    </>
                                  )}
                                  {subCatIndex === 0 && (
                                    <td
                                      className="border px-6 py-4"
                                      rowSpan={subcategories.length}
                                    >
                                      {detailItem.projectName || "N/A"}
                                    </td>
                                  )}
                                  <td className="border px-6 py-4">
                                    {subCategoryItem.subCategoryName || "N/A"}
                                  </td>
                                  <td className="border px-6 py-4">
                                    {subCategoryItem.report ||
                                      "No report available."}
                                  </td>
                                  {console.log("evaluations", evaluations)}
                                  <td className="border px-6 py-4">
                                    <input
                                      type="text"
                                      disabled={
                                        getReviewAndEvaluation(
                                          reportItem.evaluation
                                        )?.[detailItem.projectName]?.[
                                          subCategoryItem.subCategoryName
                                        ]
                                          ? true
                                          : false
                                      }
                                      defaultValue={
                                        getReviewAndEvaluation(
                                          reportItem.evaluation
                                        )?.[detailItem.projectName]?.[
                                          subCategoryItem.subCategoryName
                                        ] || ""
                                      }
                                      onChange={(e) => {
                                        const updated = { ...evaluations };
                                        if (!updated[reportItem.id])
                                          updated[reportItem.id] = {};
                                        if (
                                          !updated[reportItem.id][
                                            detailItem.projectName
                                          ]
                                        )
                                          updated[reportItem.id][
                                            detailItem.projectName
                                          ] = {};
                                        updated[reportItem.id][
                                          detailItem.projectName
                                        ][subCategoryItem.subCategoryName] =
                                          e.target.value;
                                        setEvaluations(updated);
                                      }}
                                      className="border rounded p-1"
                                      placeholder="Add Admin Review"
                                    />
                                  </td>
                                  <td className="border px-6 py-4">
                                    <input
                                      type="text"
                                      disabled={
                                        getReviewAndEvaluation(
                                          reportItem.review
                                        )?.[detailItem.projectName]?.[
                                          subCategoryItem.subCategoryName
                                        ]
                                          ? true
                                          : false
                                      }
                                      defaultValue={
                                        getReviewAndEvaluation(
                                          reportItem.review
                                        )?.[detailItem.projectName]?.[
                                          subCategoryItem.subCategoryName
                                        ] || ""
                                      }
                                      onChange={(e) => {
                                        const updated = {
                                          ...teamLeaderReviews,
                                        };
                                        if (!updated[reportItem.id])
                                          updated[reportItem.id] = {};
                                        if (
                                          !updated[reportItem.id][
                                            detailItem.projectName
                                          ]
                                        )
                                          updated[reportItem.id][
                                            detailItem.projectName
                                          ] = {};
                                        updated[reportItem.id][
                                          detailItem.projectName
                                        ][subCategoryItem.subCategoryName] =
                                          e.target.value;
                                        setTeamLeaderReviews(updated);
                                      }}
                                      className="border rounded p-1"
                                      placeholder="Add Team Leader Review"
                                    />
                                  </td>
                                  <td className="border px-6 py-4">
                                    <button
                                      onClick={() =>
                                        handleSaveEvaluationReview(
                                          reportItem.id
                                        )
                                      }
                                      className="bg-blue-500 text-white px-2 rounded"
                                    >
                                      Save
                                    </button>
                                  </td>
                                </tr>
                              );
                              hasRenderedMainCells = true;
                              return row;
                            }
                          );
                        }
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              No reports found for the selected date range.
            </p>
          )}
        </div>
      ) : (
        <div className="my-5">
          {reportData.length > 0 ? (
            <div className="overflow-auto" style={{ maxHeight: "430px" }}>
              <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
                <thead className="postion-sticky text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
                  <tr>
                    <th className="border px-4 py-2" style={{ width: "50px" }}>
                      S/No
                    </th>
                    <th className="border px-4 py-2" style={{ width: "180px" }}>
                      Date
                    </th>
                    <th className="border px-4 py-2" style={{ width: "180px" }}>
                      Time
                    </th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Project Name
                    </th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Subcategory
                    </th>
                    <th className="border px-4 py-2" style={{ width: "500px" }}>
                      Report
                    </th>
                    <th className="border px-4 py-2" style={{ width: "350px" }}>
                      Admin Review
                    </th>
                    <th className="border px-4 py-2" style={{ width: "350px" }}>
                      Team Leader Review
                    </th>
                    {userType === "employee" && (
                      <th
                        className="border px-4 py-2"
                        style={{ width: "50px" }}
                      >
                        Delete
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let serialNo = 1;
                    return reportData.map((dateItem, dateIndex) => {
                      const reportDate = moment(
                        dateItem.reportDate,
                        "DD-MMM-YYYY"
                      ).format("DD-MM-YYYY");
                      const reportDetails = dateItem.reportDetails || [];
                      return (
                        <React.Fragment key={dateIndex}>
                          {reportDetails.map((detailItem, detailIndex) => {
                            const subcategories = detailItem.subCategory || [];
                            return subcategories.map(
                              (subCategoryItem, subCatIndex) => (
                                <tr
                                  key={subCatIndex}
                                  className="bg-white border-b hover:bg-gray-50"
                                >
                                  {subCatIndex === 0 && detailIndex === 0 && (
                                    <>
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={reportDetails.reduce(
                                          (acc, curr) =>
                                            acc + curr.subCategory.length,
                                          0
                                        )}
                                      >
                                        {serialNo++}
                                      </td>
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={reportDetails.reduce(
                                          (acc, curr) =>
                                            acc + curr.subCategory.length,
                                          0
                                        )}
                                      >
                                        {reportDate}
                                      </td>
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={reportDetails.reduce(
                                          (acc, curr) =>
                                            acc + curr.subCategory.length,
                                          0
                                        )}
                                      >
                                        {dateItem.reportTime
                                          ? dateItem.reportTime
                                          : "N/A"}
                                      </td>
                                    </>
                                  )}
                                  {subCatIndex === 0 && (
                                    <td
                                      className="border px-6 py-4"
                                      rowSpan={subcategories.length}
                                    >
                                      {detailItem.projectName || "N/A"}
                                    </td>
                                  )}
                                  <td className="border px-6 py-4">
                                    {subCategoryItem.subCategoryName || "N/A"}
                                  </td>
                                  <td className="border px-6 py-4">
                                    {subCategoryItem.report ||
                                      "No report available."}
                                  </td>
                                  <td className="border px-6 py-4">
                                    {getReviewAndEvaluation(
                                      dateItem.evaluation
                                    )?.[detailItem.projectName]?.[
                                      subCategoryItem.subCategoryName
                                    ] || "No admin review available."}
                                  </td>
                                  <td className="border px-6 py-4">
                                    {getReviewAndEvaluation(dateItem.review)?.[
                                      detailItem.projectName
                                    ]?.[subCategoryItem.subCategoryName] ||
                                      "No team leader review available."}
                                  </td>
                                  {userType === "employee" &&
                                    moment(reportDate, "DD-MM-YYYY").isSame(
                                      moment(),
                                      "day"
                                    ) && (
                                      <td className="px-4 py-3">
                                        <button
                                          onClick={() =>
                                            handleDelete(dateItem.id)
                                          }
                                        >
                                          <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                      </td>
                                    )}
                                </tr>
                              )
                            );
                          })}
                        </React.Fragment>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              No reports found for the selected date range.
            </p>
          )}
        </div>
      )}
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
