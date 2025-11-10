

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProjectAssignForm = () => {
//   const navigate = useNavigate();
//   const { userData } = useSelector((state) => state.login);
//   const employeeId = userData ? userData.employeeId : null;
//   const userType = userData ? userData.userType : null;
//   const designation = userData ? userData.designation : null;
//   const location = useLocation();
//   const [employees, setEmployees] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const id = location.state?.id || null;
//   const createdBy = location.state?.created_by || null;
//   const [formData, setFormData] = useState({
//     employee_id: "",
//     employee_name: "",
//     project_name: "",
//     sub_products: "",
//     assigned_date: "",
//     deadline_date: "",
//     task_details: "",
//     task_description: "",
//   });
//   const buttonText = id ? "Update Assign Project" : "Assign Project";
//   const currentDate = new Date().toISOString().slice(0, 10);
//   const isAdmin = userType === "Admin" || designation === "Sr. Technical Head";
//   const isDisabled = createdBy && createdBy !== userType;
//   console.log(isDisabled, createdBy, isAdmin);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/employee_list`
//       );
//       setEmployees(res.data.data || []);

//       // Prefill for employees
//       if (!isAdmin && userData?.employeeName && userData?.employeeId) {
//         setFormData((prev) => ({
//           ...prev,
//           employee_name: userData.employeeName,
//           employee_id: userData.employeeId,
//         }));
//       }
//     };

//     const fetchProjects = async () => {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/get_projects_list`
//       );
//       setProjects(res.data.data || []);
//     };

//     // Fetch data if it's an edit scenario
//     if (id) {
//       const fetchAssignmentDetails = async () => {
//         try {
//           const res = await axios.post(
//             `${process.env.REACT_APP_API_URL}/get_assigned_project`,
//             { id }
//           );
//           const data = res.data.data[0]; // Assuming response contains assignment data
//           const formatDateTime = (datetime) => {
//             if (!datetime) return "";
//             return datetime.slice(0, 16); // Keeps 'YYYY-MM-DDTHH:MM'
//           };

//           setFormData({
//             employee_id: data.employee_id,
//             employee_name: data.employee_name,
//             project_name: data.project_name,
//             sub_products: data.sub_products,
//             assigned_date: formatDateTime(data.assigned_date),
//             deadline_date: formatDateTime(data.deadline_date),
//             task_details: data.task_details,
//             task_description: data.task_description,
//             estimated_time: data.estimated_time,
//           });
//         } catch (err) {
//           console.error("Error fetching assignment details:", err);
//         }
//       };

//       fetchAssignmentDetails();
//     }

//     fetchEmployees();
//     fetchProjects();
//   }, [id]);

//   const handleEmployeeChange = (e) => {
//     const employee_name = e.target.value;
//     const selected = employees.find((emp) => emp.name === employee_name);

//     setFormData((prev) => ({
//       ...prev,
//       employee_name,
//       employee_id: selected?.employeeId || "",
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...formData,
//       date: currentDate,
//       created_by: userType,
//       id: id || undefined, // Only include id for editing
//     };

//     try {
//       let res;
//       // Use the same API for both create and update
//       res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/project_assign`,
//         payload
//       );
//       alert(res.data.message);
//       navigate("/dashboard/project-assign-list");
//     } catch (err) {
//       alert(err.response?.data?.error || "Something went wrong!");
//     }
//   };
//   return (
//     <div className="min-h-screen ">
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8">
//         <h1 className="font-bold text-center text-black mb-4">
//           {isAdmin ? "Project Assign" : "Assign Task"}
//         </h1>

//         <p className="text-sm text-black-500 text-center mb-6">
//           Current Date: {currentDate}
//         </p>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           <div>
//             <label className="block mb-1 text-gray-600">Employee Name</label>
//             {isAdmin ? (
//               <select
//                 name="employee_name"
//                 value={formData.employee_name}
//                 onChange={handleEmployeeChange}
//                 className="w-full border border-gray-300 p-2 rounded-xl"
//                 required
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((emp) => (
//                   <option key={emp.employee_id} value={emp.name}>
//                     {emp.name}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 disabled={isDisabled}
//                 type="text"
//                 value={formData.employee_name}
//                 readOnly
//                 className="w-full border border-gray-300 p-2 rounded-xl bg-gray-100 cursor-not-allowed"
//               />
//             )}
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-600">Project Name</label>
//             <select
//               name="project_name"
//               value={formData.project_name}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded-xl"
//               required
//             >
//               <option value="">Select Project</option>
//               {projects.map((proj) => (
//                 <option key={proj.id} value={proj.projectName}>
//                   {proj.projectName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-600">Sub Products</label>
//             <select
//               name="sub_products"
//               value={formData.sub_products}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded-xl"
//             >
//               <option value="">Select Sub Product</option>
//               {projects
//                 .find((p) => p.projectName === formData.project_name)
//                 ?.subCategory?.map((sub, idx) => (
//                   <option key={idx} value={sub}>
//                     {sub}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-600">Assigned Date</label>
//             <input
//               disabled={isDisabled}
//               type="datetime-local"
//               name="assigned_date"
//               value={formData.assigned_date}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded-xl"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-600">Deadline Date</label>
//             <input
//               disabled={isDisabled}
//               type="datetime-local"
//               name="deadline_date"
//               value={formData.deadline_date}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded-xl"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-1 text-gray-600">Estimated Time</label>
//             <input
//               disabled={isDisabled}
//               name="estimated_time"
//               value={formData.estimated_time}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded-xl"
//               required
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block mb-1 text-gray-600">Task Name</label>
//             <textarea
//               disabled={isDisabled}
//               name="task_details"
//               value={formData.task_details}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded-xl"
//               rows="2"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block mb-1 text-gray-600">Task Description</label>
//             <textarea
//               disabled={isDisabled}
//               name="task_description"
//               value={formData.task_description}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-2 rounded-xl"
//               rows="3"
//             />
//           </div>

//           <div className="md:col-span-2 flex justify-between mt-4">
//             {!isDisabled && (
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-6 py-3 rounded-xl transition-all hover:bg-blue-700"
//               >
//                 {buttonText}
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={() => navigate("/dashboard/project-assign-list")}
//               className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProjectAssignForm;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProjectAssignForm = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.login);
  const employeeId = userData ? userData.employeeId : null;
  const userType = userData ? userData.userType : null;
  const designation = userData ? userData.designation : null;
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const id = location.state?.id || null;
  const createdBy = location.state?.created_by || null;
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    project_name: "",
    sub_products: "",
    assigned_date: "",
    deadline_date: "",
    task_details: "",
    task_description: "",
    estimated_time: "",
  });
  const buttonText = id ? "Update Assign Project" : "Assign Project";
  const currentDate = new Date().toISOString().slice(0, 10);
  const isAdmin = userType === "Admin" || designation === "Sr. Technical Head";
  const isDisabled = createdBy && createdBy !== userType;

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/employee_list`
      );
      setEmployees(res.data.data || []);

      if (!isAdmin && userData?.employeeName && userData?.employeeId) {
        setFormData((prev) => ({
          ...prev,
          employee_name: userData.employeeName,
          employee_id: userData.employeeId,
        }));
      }
    };

    const fetchProjects = async () => {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/get_projects_list`
      );
      setProjects(res.data.data || []);
    };

    if (id) {
      const fetchAssignmentDetails = async () => {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/get_assigned_project`,
            { id }
          );
          const data = res.data.data[0];
          const formatDateTime = (datetime) => {
            if (!datetime) return "";
            return datetime.slice(0, 16);
          };

          setFormData({
            employee_id: data.employee_id,
            employee_name: data.employee_name,
            project_name: data.project_name,
            sub_products: data.sub_products,
            assigned_date: formatDateTime(data.assigned_date),
            deadline_date: formatDateTime(data.deadline_date),
            task_details: data.task_details,
            task_description: data.task_description,
            estimated_time: data.estimated_time || "",
          });
        } catch (err) {
          console.error("Error fetching assignment details:", err);
        }
      };

      fetchAssignmentDetails();
    }

    fetchEmployees();
    fetchProjects();
  }, [id]);

  const handleEmployeeChange = (e) => {
    const employee_name = e.target.value;
    const selected = employees.find((emp) => emp.name === employee_name);

    setFormData((prev) => ({
      ...prev,
      employee_name,
      employee_id: selected?.employeeId || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      date: currentDate,
      created_by: userType,
      id: id || undefined,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/project_assign`,
        payload
      );
      alert(res.data.message);
      navigate("/dashboard/project-assign-list");
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className=" mx-auto rounded-2xl p-8">
        <h1 className="font-bold text-center text-black text-lg mb-4">
          {isAdmin ? "Project Assign" : "Assign Task"}
        </h1>

        <p className="text-center text-black text-sm mb-6">
          Current Date: {currentDate}
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black text-base"
        >
          <div>
            <label className="block mb-1">Employee Name</label>
            {isAdmin ? (
              <select
                name="employee_name"
                value={formData.employee_name}
                onChange={handleEmployeeChange}
                className="w-full border border-gray-300 p-2 rounded-xl text-black"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                disabled={isDisabled}
                type="text"
                value={formData.employee_name}
                readOnly
                className="w-full border border-gray-300 p-2 rounded-xl bg-gray-100 cursor-not-allowed text-black"
              />
            )}
          </div>

          <div>
            <label className="block mb-1">Project Name</label>
            <select
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-xl text-black"
              required
            >
              <option value="">Select Project</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.projectName}>
                  {proj.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Sub Products</label>
            <select
              name="sub_products"
              value={formData.sub_products}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-xl text-black"
            >
              <option value="">Select Sub Product</option>
              {projects
                .find((p) => p.projectName === formData.project_name)
                ?.subCategory?.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Assigned Date</label>
            <input
              disabled={isDisabled}
              type="datetime-local"
              name="assigned_date"
              value={formData.assigned_date}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-xl text-black"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Deadline Date</label>
            <input
              disabled={isDisabled}
              type="datetime-local"
              name="deadline_date"
              value={formData.deadline_date}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-xl text-black"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Estimated Time</label>
            <input
              disabled={isDisabled}
              name="estimated_time"
              value={formData.estimated_time}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-xl text-black"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1">Task Name</label>
            <textarea
              disabled={isDisabled}
              name="task_details"
              value={formData.task_details}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-xl text-black"
              rows="2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1">Task Description</label>
            <textarea
              disabled={isDisabled}
              name="task_description"
              value={formData.task_description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-xl text-black"
              rows="3"
            />
          </div>

          <div className="md:col-span-2 flex justify-between mt-4">
            {!isDisabled && (
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl transition-all hover:bg-blue-700"
              >
                {buttonText}
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/dashboard/project-assign-list")}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectAssignForm;

