// import React, { useState } from "react";
// import './ProjectMasters.css';
// import * as XLSX from "xlsx";

// const ProjectMaster = () => {
//   const [selectedHeadings, setSelectedHeadings] = useState([]);

//   const projects = [
//     {
//       heading: "KST",
//       subdivisions: ["Reporting Software", "Accounting Software", "Website", "School Projects", "Mobile App", "ID Card Typing"],
//     },
//     {
//       heading: "Calcium",
//       subdivisions: ["Power BI", "Azure", "Web", "Mobile", "Core Studio"],
//     },
//     {
//       heading: "Sify",
//       subdivisions: [
//         "Collocation",
//         "P2P",
//         "DIA",
//         "Cross Connect Domestic",
//         "Login",
//         "MPLS",
//         "Colointernet",
//         "GCC",
//         "Channel Partner",
//         "Docusign",
//         "NSE",
//         "Others",
//       ],
//     },
//     {
//       heading: "Brakes India",
//       subdivisions: ["PMS", "Unit-1", "Unit-2", "Unit-11", "RWH", "KST"],
//     },
//     {
//       heading: "TNPC",
//       subdivisions: [
//         "Building Asset Management",
//         "Equipment Asset Management",
//         "Fleet",
//         "Billing Software",
//         "Quarter Management",
//       ],
//     },
//     {
//       heading: "CRPF",
//       subdivisions: ["Billing Software", "Montessori School Website"],
//     },
//     {
//       heading: "Renault",
//       subdivisions: ["VMS"],
//     },
//     {
//       heading: "RRD",
//       subdivisions: ["CMS"],
//     },
//     {
//       heading: "Wheels India",
//       subdivisions: ["CV Unit"],
//     },
//     {
//       heading: "ID Card Scanning",
//       subdivisions: [],
//     },
//   ];

//   // Toggle subdivision display
//   const toggleHeading = (heading) => {
//     setSelectedHeadings((prevSelected) =>
//       prevSelected.includes(heading)
//         ? prevSelected.filter((h) => h !== heading)
//         : [...prevSelected, heading]
//     );
//   };

//   // Export to .xlsx file
//   const exportToExcel = () => {

//     if (selectedHeadings.length === 0) {
//       alert("Please select at least one project to export.");
//       return;
//     }

//     if (!window.confirm("The selected project will be exported.")) {
//       return;
//     }

//   const data = [];

//     projects.forEach((project) => {
//       if (selectedHeadings.includes(project.heading)) {
//         if (project.subdivisions.length > 0) {
//           project.subdivisions.forEach((sub) =>
//             data.push({ Project: project.heading, Subdivision: sub })
//           );
//         } else {
//           data.push({ Project: project.heading, Subdivision: "N/A" });
//         }
//       }
//     });

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

//     XLSX.writeFile(workbook, "Project_Master.xlsx");
//   };

//   return (
//     <div className="p-5">
//       <h2 className="text-2xl font-bold mb-4">Projects</h2>

//       <div className="border p-4 rounded shadow-lg bg-white">
//         {projects.map((project) => (
//           <div key={project.heading} className="mb-4">
//             <label className="flex items-center space-x-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={selectedHeadings.includes(project.heading)}
//                 onChange={() => toggleHeading(project.heading)}
//                 className="mr-2"
//               />
//               <span className="text-lg font-semibold">{project.heading}</span>
//             </label>

//             {selectedHeadings.includes(project.heading) && (
//               <ul className="ml-6 mt-2 list-disc">
//                 {project.subdivisions.map((sub, index) => (
//                   <li key={index} className="text-gray-700">{sub}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))}

//         <button
//           onClick={exportToExcel}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Export
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProjectMaster;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProjectMasters.css";
import { useNavigate } from "react-router-dom";


const ProjectMaster = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    project: "",
    subProject: "",
    client_name: "",
    contact_number: "",
    mail_id: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get_projects_list`
      );
      console.log("Fetched Projects:", response.data.data);
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      id: project.id,
      project: project.projectName,
      subProject: Array.isArray(project.subCategory)
        ? project.subCategory.join(", ")
        : "",
      client_name: project.contact_details?.[0]?.client_name || "",
      contact_number: project.contact_details?.[0]?.contact_number || "",
      mail_id: project.contact_details?.[0]?.mail_id || "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const payload = {
      id: formData.id ?? null,
      project: formData.project || null,
      idRef: null, // You can set this dynamically if needed
      subProject: formData.subProject
        ? formData.subProject.split(",").map((s) => s.trim())
        : [],
      contact_details: [
        {
          client_name: formData.client_name || null,
          contact_number: formData.contact_number || null,
          mail_id: formData.mail_id || null,
        },
      ],
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/project_master`,
        payload
      );

      setFormData({
        id: null,
        project: "",
        subProject: "",
        client_name: "",
        contact_number: "",
        mail_id: "",
      });
      fetchProjects();
      setSuccessMessage("Project saved successfully.");
      navigate("/dashboard/projects");
    } catch (err) {
      console.error("Failed to submit project", err);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Project list</h2>
      {showForm ? (
        <button
          onClick={() => {
            setShowForm(false);
            setFormData({
              id: null,
              project: "",
              subProject: "",
              client_name: "",
              contact_number: "",
              mail_id: "",
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-4"
        >
          ← Back
        </button>
      ) : (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          >
            Add New Project
          </button>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-blue-800 p-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">
            {formData.id ? "Update Project" : "Add Project"}
          </h3>
          <input
            type="text"
            name="project"
            placeholder="Project Name"
            value={formData.project}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border"
          />

          <input
            type="text"
            name="subProject"
            placeholder="Sub Projects"
            value={formData.subProject}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border"
          />

          <input
            type="text"
            name="client_name"
            placeholder="Client Name"
            value={formData.client_name}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border"
          />

          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number"
            value={formData.contact_number}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border"
          />

          <input
            type="email"
            name="mail_id"
            placeholder="Email"
            value={formData.mail_id}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {formData.id ? "Update Project" : "Add Project"}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setFormData({
                id: null,
                project: "",
                subProject: "",
                client_name: "",
                contact_number: "",
                mail_id: "",
              });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {/* List Projects */}
      <div className="border p-4 rounded shadow-lg bg-white">
        {projects.map((project) => (
          <div key={project.id} className="mb-4 border-b pb-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{project.projectName}</span>
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-500 hover:underline text-sm"
              >
                Edit
              </button>
            </div>

            <ul className="ml-4 mt-2 list-disc">
              {project.subCategory.map((sub, idx) => (
                <li key={idx}>{sub}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectMaster;
