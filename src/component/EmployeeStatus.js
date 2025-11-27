// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import "./EmployeeList.css";

// const EmployeeStatus = () => {
//   const [deactivatedEmployees, setDeactivatedEmployees] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   useEffect(() => {
//     const fetchDeactivatedEmployees = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/deactiveEmployees/`,
//           {
//             params: { domain: "", page, limit: maxDisplayCount },
//           }
//         );

//         const { data, totalRecords } = response.data;

//         if (Array.isArray(data)) {
//           setDeactivatedEmployees(data);
//           setTotalRecords(totalRecords || 0);
//         } else {
//           setDeactivatedEmployees([]);
//           setTotalRecords(0);
//         }
//       } catch (error) {
//         console.error("Error fetching deactivated employees:", error);
//         setError("Failed to fetch data.");
//         setDeactivatedEmployees([]);
//         setTotalRecords(0);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeactivatedEmployees();
//   }, [page, maxDisplayCount]);

//   const handleMenuOpen = (event, employee) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedEmployee(employee);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedEmployee(null);
//   };

//   const handleView = () => {
//     if (selectedEmployee) {
//       navigate("/dashboard/addEmployee", { state: { employee: selectedEmployee, readOnly: true } });
//     }
//     handleMenuClose();
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4"> Old Employee List</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : deactivatedEmployees.length > 0 ? (
//         <div className="grid grid-cols-3 gap-4">
//           {deactivatedEmployees.map((employee) => (
//             <div key={employee.id} className="p-4 border rounded-lg shadow-md relative employee-card">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={
//                     employee.profileUrl?.startsWith("http")
//                       ? employee.profileUrl
//                       : `${process.env.REACT_APP_API_URL}/uploads/Images/${employee.profileUrl}`
//                   }
//                   className="w-16 h-16 rounded-lg employee-image"
//                   alt="Profile"
//                 />
//                 <div className="ml-2">
//                   <h3 className="text-lg font-bold">{employee.name}</h3>
//                   <p className="text-purple-600">{employee.designation}</p>
//                   <p>Phone: {employee.mobileNumber}</p>
//                   <p>Email: {employee.email}</p>
//                 </div>
//               </div>

//               {/* Three-dot menu */}
//               <div className="absolute top-2 right-2">
//                 <MoreVertIcon
//                   className="cursor-pointer"
//                   onClick={(event) => handleMenuOpen(event, employee)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No deactivated employees found.</p>
//       )}

//       <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
//         <MenuItem onClick={handleView}>View</MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default EmployeeStatus;

// import React, { useEffect, useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import "./EmployeeList.css";

// const EmployeeStatus = () => {
//   const [deactivatedEmployees, setDeactivatedEmployees] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   useEffect(() => {
//     const fetchDeactivatedEmployees = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/deactiveEmployees/`,
//           {
//             params: { domain: "", page, limit: maxDisplayCount },
//           }
//         );

//         const { data, totalRecords } = response.data;

//         if (Array.isArray(data)) {
//           setDeactivatedEmployees(data);
//           setTotalRecords(totalRecords || 0);
//         } else {
//           setDeactivatedEmployees([]);
//           setTotalRecords(0);
//         }
//       } catch (error) {
//         console.error("Error fetching deactivated employees:", error);
//         setError("Failed to fetch data.");
//         setDeactivatedEmployees([]);
//         setTotalRecords(0);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeactivatedEmployees();
//   }, [page, maxDisplayCount]);

//   const handleMenuOpen = (event, employee) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedEmployee(employee);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedEmployee(null);
//   };

//   const handleView = () => {
//     if (selectedEmployee) {
//       navigate("/dashboard/addEmployee", { state: { employee: selectedEmployee, readOnly: true } });
//     }
//     handleMenuClose();
//   };

//   return (
//     <div className="p-6 relative">
//       {/* Top-right button */}
//       <button
//         onClick={() => navigate("/dashboard/employee-list")}
//         className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//       >
//         View Employee List
//       </button>

//       <h2 className="text-2xl font-bold mb-4">Old Employee List</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : deactivatedEmployees.length > 0 ? (
//         <div className="grid grid-cols-3 gap-4">
//           {deactivatedEmployees.map((employee) => (
//             <div key={employee.id} className="p-4 border rounded-lg shadow-md relative employee-card">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={
//                     employee.profileUrl?.startsWith("http")
//                       ? employee.profileUrl
//                       : `${process.env.REACT_APP_API_URL}/uploads/Images/${employee.profileUrl}`
//                   }
//                   className="w-16 h-16 rounded-lg employee-image"
//                   alt="Profile"
//                 />
//                 <div className="ml-2">
//                   <h3 className="text-lg font-bold">{employee.name}</h3>
//                   <p className="text-purple-600">{employee.designation}</p>
//                   <p>Phone: {employee.mobileNumber}</p>
//                   <p>Email: {employee.email}</p>
//                 </div>
//               </div>

//               {/* Three-dot menu */}
//               <div className="absolute top-2 right-2">
//                 <MoreVertIcon
//                   className="cursor-pointer"
//                   onClick={(event) => handleMenuOpen(event, employee)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No deactivated employees found.</p>
//       )}

//       <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
//         <MenuItem onClick={handleView}>View</MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default EmployeeStatus;
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import "./EmployeeList.css";

// const EmployeeStatus = () => {
//   const [deactivatedEmployees, setDeactivatedEmployees] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   useEffect(() => {
//     const fetchDeactivatedEmployees = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/deactiveEmployees/`,
//           {
//             params: { domain: "", page, limit: maxDisplayCount },
//           }
//         );

//         const { data, totalRecords } = response.data;

//         if (Array.isArray(data)) {
//           setDeactivatedEmployees(data);
//           setTotalRecords(totalRecords || 0);
//         } else {
//           setDeactivatedEmployees([]);
//           setTotalRecords(0);
//         }
//       } catch (error) {
//         console.error("Error fetching deactivated employees:", error);
//         setError("Failed to fetch data.");
//         setDeactivatedEmployees([]);
//         setTotalRecords(0);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeactivatedEmployees();
//   }, [page, maxDisplayCount]);

//   const handleMenuOpen = (event, employee) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedEmployee(employee);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedEmployee(null);
//   };

//   const handleView = () => {
//     if (selectedEmployee) {
//       navigate("/dashboard/addEmployee", {
//         state: { employee: selectedEmployee, readOnly: true },
//       });
//     }
//     handleMenuClose();
//   };

//   return (
//     <div className="p-6">
//       {/* Top Right Button */}
//       <div className="relative mb-6">
//         <h2 className="text-2xl font-semibold text-gray-800 text-center">
//           Deactivated Employees
//         </h2>
//         <button
//           onClick={() => navigate("/dashboard/employee-list")}
//           className="absolute top-0 right-0 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
//         >
//           View Employee List
//         </button>
//       </div>

//       {/* Loading & Error States */}
//       {loading ? (
//         <p className="text-gray-600">Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : deactivatedEmployees.length === 0 ? (
//         <p className="text-gray-500">No deactivated employees found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {deactivatedEmployees.map((employee) => (
//             <div
//               key={employee.id}
//               className="bg-white shadow-md border rounded-lg p-4 relative hover:shadow-lg transition"
//             >
//               {/* Profile and Info */}
//               <div className="flex items-center">
//                 <img
//                   src={
//                     employee.profileUrl?.startsWith("http")
//                       ? employee.profileUrl
//                       : `${process.env.REACT_APP_API_URL}/uploads/Images/${employee.profileUrl}`
//                   }
//                   alt="Profile"
//                   className="w-16 h-16 rounded-lg object-cover"
//                 />
//                 <div className="ml-4">
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {employee.name}
//                   </h3>
//                   <p className="text-sm text-purple-600">
//                     {employee.designation}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Phone.No: {employee.mobileNumber}
//                   </p>
//                   <p className="text-sm text-gray-600">Email:{employee.email}</p>
//                 </div>
//               </div>

//               {/* Action Menu */}
//               <div className="absolute top-2 right-2">
//                 <MoreVertIcon
//                   className="cursor-pointer text-gray-600 hover:text-gray-800"
//                   onClick={(event) => handleMenuOpen(event, employee)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Context Menu */}
//       <Menu
//         anchorEl={menuAnchor}
//         open={Boolean(menuAnchor)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleView}>View</MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default EmployeeStatus;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./EmployeeList.css";
import logo from "../img/logo/profile.png";
import { useSelector } from "react-redux";

const EmployeeStatus = () => {
  const [deactivatedEmployees, setDeactivatedEmployees] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { isAuth, userData } = useSelector((state) => state.login);

  useEffect(() => {
    const fetchDeactivatedEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/deactiveEmployees/`,
          {
            params: { domain: "", page, limit: maxDisplayCount },
          }
        );
        const { data, totalRecords } = response.data;

        if (Array.isArray(data)) {
          setDeactivatedEmployees(data);
          setTotalRecords(totalRecords || 0);
        } else {
          setDeactivatedEmployees([]);
          setTotalRecords(0);
        }
      } catch (error) {
        console.error("Error fetching deactivated employees:", error);
        setError("Failed to fetch data.");
        setDeactivatedEmployees([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDeactivatedEmployees();
  }, [page, maxDisplayCount]);

  useEffect(() => {
    if (userData.userType !== "Admin") {
      navigate("/dashboard/dashboards");
    }
  }, []);

  const handleMenuOpen = (event, employee) => {
    setMenuAnchor(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedEmployee(null);
  };

  const handleView = () => {
    if (selectedEmployee) {
      navigate("/dashboard/addEmployee", {
        state: { employee: selectedEmployee, readOnly: true },
      });
    }
    handleMenuClose();
  };

  return (
    <div className="p-6">
      {/* <div className="relative mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Deactivated Employees
        </h2>
        <button
          onClick={() => navigate("/dashboard/employee-list")}
          className="absolute top-0 right-0 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          View Employee List
        </button>
      </div> */}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : deactivatedEmployees.length === 0 ? (
        <p className="text-gray-500">No deactivated employees found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deactivatedEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-red-50 shadow-md border rounded-lg p-4 relative hover:shadow-lg transition"
            >
              <div className="flex flex-col gap-y-4">
                <div className="flex gap-x-3 items-center justify-start">
                  {employee.profileUrl == null || employee.profileUrl == "" ? (
                    <img
                      src={logo}
                      alt="Profile"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <img
                      src={
                        employee.profileUrl?.startsWith("http")
                          ? employee.profileUrl
                          : `${process.env.REACT_APP_API_URL}/uploads/Images/${employee.profileUrl}`
                      }
                      alt="Profile"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {employee.name.length > 12
                        ? employee.name.slice(0, 12) + "..."
                        : employee.name}
                    </h3>
                    <p className="text-sm text-blue-800">
                      {employee.designation.length > 18
                        ? employee.designation.slice(0, 18) + "..."
                        : employee.designation}
                    </p>
                  </div>
                </div>

                <div className="ml-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Phone No : </span>{" "}
                    {employee.mobileNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Email : </span>
                    {employee.email.length > 20
                      ? employee.email.slice(0, 20) + "..."
                      : employee.email}
                  </p>
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <MoreVertIcon
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                  onClick={(event) => handleMenuOpen(event, employee)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>View</MenuItem>
      </Menu>
    </div>
  );
};

export default EmployeeStatus;
