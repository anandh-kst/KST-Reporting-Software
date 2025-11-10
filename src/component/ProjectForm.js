// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const ProjectForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errors, setErrors] = useState({});

//   const initialProject = location.state?.project || null;

//   const [formData, setFormData] = useState({
//     id: null,
//     project: "",
//     subProject: "",
//     contact_details: [
//       {
//         client_name: "",
//         contact_number: "",
//         mail_id: "",
//       },
//     ],
//   });

//   useEffect(() => {
//     if (initialProject) {
//       setFormData({
//         id: initialProject.id,
//         project: initialProject.projectName || "",
//         subProject: Array.isArray(initialProject.subCategory)
//           ? initialProject.subCategory.join(", ")
//           : "",
//         contact_details:
//           initialProject.contactDetails && initialProject.contactDetails.length
//             ? initialProject.contactDetails
//             : [
//                 {
//                   client_name: "",
//                   contact_number: "",
//                   mail_id: "",
//                 },
//               ],
//       });
//     }
//   }, [initialProject]);

//   const handleChange = (e, index = null, field = null) => {
//     const { name, value } = e.target;
//     if (field !== null && index !== null) {
//       const updatedContacts = [...formData.contact_details];
//       updatedContacts[index][field] = value;
//       setFormData((prev) => ({
//         ...prev,
//         contact_details: updatedContacts,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }

//     if (errors[name]) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//     if (field && errors[`${field}_${index}`]) {
//       setErrors((prevErrors) => {
//         const newErrors = { ...prevErrors };
//         delete newErrors[`${field}_${index}`];
//         return newErrors;
//       });
//     }
//   };

//   const handleAddContact = () => {
//     if (formData.contact_details.length < 5) {
//       setFormData((prev) => ({
//         ...prev,
//         contact_details: [
//           ...prev.contact_details,
//           {
//             client_name: "",
//             contact_number: "",
//             mail_id: "",
//           },
//         ],
//       }));
//     }
//   };

//   const handleRemoveContact = (index) => {
//     const updatedContacts = [...formData.contact_details];
//     updatedContacts.splice(index, 1);
//     setFormData((prev) => ({
//       ...prev,
//       contact_details: updatedContacts,
//     }));
//   };

//   const handleSubmit = async () => {
//     let isValid = true;
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!formData.project.trim()) {
//       newErrors.project = "Project Name is required";
//       isValid = false;
//     }

//     formData.contact_details.forEach((contact, index) => {
//       const client_name = contact.client_name ?? "";
//       const contact_number = contact.contact_number ?? "";
//       const mail_id = contact.mail_id ?? "";

//       const anyFieldFilled =
//         client_name.trim() || contact_number.trim() || mail_id.trim();

//       if (anyFieldFilled) {
//         if (!client_name.trim()) {
//           newErrors[`client_name_${index}`] = "Client Name is required";
//           isValid = false;
//         }
//         if (!contact_number.trim()) {
//           newErrors[`contact_number_${index}`] = "Contact Number is required";
//           isValid = false;
//         } else if (!/^\d{10}$/.test(contact_number.trim())) {
//           newErrors[`contact_number_${index}`] =
//             "Contact number must be exactly 10 digits.";
//           isValid = false;
//         }
//         if (!mail_id.trim()) {
//           newErrors[`mail_id_${index}`] = "Client Email is required";
//           isValid = false;
//         } else if (!emailRegex.test(mail_id.trim())) {
//           newErrors[`mail_id_${index}`] = "Invalid email format";
//           isValid = false;
//         }
//       }
//     });

//     setErrors(newErrors);
//     if (!isValid) return;

//     const payload = {
//       id: formData.id ?? null,
//       project: formData.project || null,
//       idRef: null,
//       subProject: formData.subProject
//         ? formData.subProject.split(",").map((s) => s.trim())
//         : [],
//       contact_details: formData.contact_details.every(
//         (c) => !c.client_name && !c.contact_number && !c.mail_id
//       )
//         ? []
//         : formData.contact_details.map((contact) => ({
//             client_name: contact.client_name,
//             contact_number: contact.contact_number,
//             mail_id: contact.mail_id,
//           })),
//     };

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/project_master`,
//         payload
//       );

//       setSuccessMessage("✅ Project saved successfully.");
//       setErrors({});

//       setTimeout(() => {
//         navigate("/dashboard/projects");
//       }, 1000);
//     } catch (err) {
//       console.error("❌ Failed to submit project", err);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/dashboard/projects");
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
//       <div className="bg-white shadow-md rounded-lg p-8 space-y-6">
//         <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
//           {formData.id ? "Update Project" : "Add Project"}
//         </h2>

//         {/* Project Input */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">
//             Project Name
//           </label>
//           <input
//             type="text"
//             name="project"
//             value={formData.project}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
//           />
//           {errors.project && (
//             <p className="text-red-500 text-sm mt-1">{errors.project}</p>
//           )}
//         </div>

//         {/* Sub Project Input */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">
//             Sub Products
//           </label>
//           <input
//             type="text"
//             name="subProject"
//             value={formData.subProject}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
//           />
//         </div>

//         {/* Contact Section */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-bold border-b pb-2">
//             Client Contact Details
//           </h3>
//           {formData.contact_details.map((contact, index) => (
//             <div
//               key={index}
//               className="bg-gray-100 p-4 rounded-md space-y-4 shadow"
//             >
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Client Name
//                 </label>
//                 <input
//                   type="text"
//                   value={contact.client_name}
//                   onChange={(e) => handleChange(e, index, "client_name")}
//                   className="w-full p-2 border rounded-md"
//                 />
//                 {errors[`client_name_${index}`] && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors[`client_name_${index}`]}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Contact Number
//                 </label>
//                 <input
//                   type="text"
//                   value={contact.contact_number}
//                   onChange={(e) => {
//                     const input = e.target.value;
//                     if (/^\d{0,10}$/.test(input)) {
//                       handleChange(e, index, "contact_number");
//                     }
//                   }}
//                   maxLength={10}
//                   className="w-full p-2 border rounded-md"
//                 />
//                 {errors[`contact_number_${index}`] && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors[`contact_number_${index}`]}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Client Email
//                 </label>
//                 <input
//                   type="email"
//                   value={contact.mail_id}
//                   onChange={(e) => handleChange(e, index, "mail_id")}
//                   className="w-full p-2 border rounded-md"
//                 />
//                 {errors[`mail_id_${index}`] && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors[`mail_id_${index}`]}
//                   </p>
//                 )}
//               </div>

//               {formData.contact_details.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveContact(index)}
//                   className="text-red-600 text-sm underline"
//                 >
//                   ✖ Remove Contact
//                 </button>
//               )}
//             </div>
//           ))}

//           {formData.contact_details.length < 5 && (
//             <button
//               type="button"
//               onClick={handleAddContact}
//               className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
//             >
//               + Add Another Contact
//             </button>
//           )}
//         </div>

//         {successMessage && (
//           <div className="bg-green-100 text-green-800 p-3 rounded shadow-sm text-center font-medium">
//             {successMessage}
//           </div>
//         )}

//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
//           >
//             {formData.id ? "Update Project" : "Add Project"}
//           </button>
//           <button
//             onClick={handleCancel}
//             className="bg-blue-600 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectForm;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const ProjectForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errors, setErrors] = useState({});

//   const initialProject = location.state?.project || null;

//   const [formData, setFormData] = useState({
//     id: null,
//     client_name: "",
//     project: "",
//     subProject: "",
//     projectDomain: "",
//     platform: "",
//     contact_details: [{ contact_number: "", mail_id: "" }],
//   });

//   useEffect(() => {
//     if (initialProject) {
//       setFormData({
//         id: initialProject.id,
//         client_name: initialProject.clientname || "",
//         project: initialProject.projectName || "",
//         subProject: Array.isArray(initialProject.subCategory)
//           ? initialProject.subCategory
//               .map((item) => item.trim()) // Trim each string
//               .filter((item) => item) // Remove empty strings
//               .join(", ")
//           : "",

//         projectDomain: initialProject.projectdomain || "",
//         platform: initialProject.platform || "",
//         contact_details:
//           initialProject.contactDetails &&
//           initialProject.contactDetails.length > 0
//             ? initialProject.contactDetails
//             : [{ contact_number: "", mail_id: "" }],
//       });
//     }
//   }, [initialProject]);

//   const handleChange = (e, index = null, field = null) => {
//     const { name, value } = e.target;
//     if (field !== null && index !== null) {
//       const updatedContacts = [...formData.contact_details];
//       updatedContacts[index][field] = value;
//       setFormData((prev) => ({
//         ...prev,
//         contact_details: updatedContacts,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }

//     if (errors[name]) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//     if (field && errors[`${field}_${index}`]) {
//       setErrors((prevErrors) => {
//         const newErrors = { ...prevErrors };
//         delete newErrors[`${field}_${index}`];
//         return newErrors;
//       });
//     }
//   };

//   const handleSubmit = async () => {
//     let isValid = true;
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!formData.client_name.trim()) {
//       newErrors.client_name = "Client Name is required";
//       isValid = false;
//     }

//     if (!formData.project.trim()) {
//       newErrors.project = "Project Name is required";
//       isValid = false;
//     }

//     if (!formData.projectDomain.trim()) {
//       newErrors.projectDomain = "Project Domain is required";
//       isValid = false;
//     }

//     // if (!formData.platform.trim()) {
//     //   newErrors.platform = "Platform is required";
//     //   isValid = false;
//     // }

//     formData.contact_details.forEach((contact, index) => {
//       const contact_number = contact.contact_number ?? "";
//       const mail_id = contact.mail_id ?? "";

//       const anyFieldFilled = contact_number.trim() || mail_id.trim();

//       if (anyFieldFilled) {
//         if (!contact_number.trim()) {
//           newErrors[`contact_number_${index}`] = "Contact Number is required";
//           isValid = false;
//         } else if (!/^\d{10}$/.test(contact_number.trim())) {
//           newErrors[`contact_number_${index}`] =
//             "Contact number must be exactly 10 digits.";
//           isValid = false;
//         }
//         if (!mail_id.trim()) {
//           newErrors[`mail_id_${index}`] = "Client Email is required";
//           isValid = false;
//         } else if (!emailRegex.test(mail_id.trim())) {
//           newErrors[`mail_id_${index}`] = "Invalid email format";
//           isValid = false;
//         }
//       }
//     });

//     setErrors(newErrors);
//     if (!isValid) return;

//     const payload = {
//       id: formData.id ?? null,
//       clientname: formData.client_name || null, // Change to match backend
//       project: formData.project || null,
//       projectdomain: formData.projectDomain || null, // Change to match backend
//       platform: formData.platform || null,
//       subProject: formData.subProject
//         ? formData.subProject
//             .split(",")
//             .map((s) => s.trim())
//             .filter((s) => s)
//         : [],

//       contact_details: formData.contact_details.every(
//         (c) => !c.contact_number && !c.mail_id
//       )
//         ? []
//         : formData.contact_details.map((contact) => ({
//             contact_number: contact.contact_number,
//             mail_id: contact.mail_id,
//           })),
//     };

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/project_master`,
//         payload
//       );

//       setSuccessMessage("✅ Project saved successfully.");
//       setErrors({});

//       setTimeout(() => {
//         navigate("/dashboard/projects");
//       }, 1000);
//     } catch (err) {
//       console.error("❌ Failed to submit project", err);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/dashboard/projects");
//   };

//   const addContactField = () => {
//     setFormData((prev) => ({
//       ...prev,
//       contact_details: [
//         ...prev.contact_details,
//         { contact_number: "", mail_id: "" },
//       ],
//     }));
//   };

//   const removeContactField = (index) => {
//     const updatedContacts = formData.contact_details.filter(
//       (_, i) => i !== index
//     );
//     setFormData((prev) => ({
//       ...prev,
//       contact_details:
//         updatedContacts.length > 0
//           ? updatedContacts
//           : [{ contact_number: "", mail_id: "" }],
//     }));
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
//       <div className="bg-white shadow-md rounded-lg p-8 space-y-6">
//         <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
//           {formData.id ? "Update Project" : "Add Project"}
//         </h2>

//         {/* Client Name */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">
//             Client Name
//           </label>
//           <input
//             type="text"
//             name="client_name"
//             value={formData.client_name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
//           />
//           {errors.client_name && (
//             <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>
//           )}
//         </div>

//         {/* Project Name */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">
//             Project Name
//           </label>
//           <input
//             type="text"
//             name="project"
//             value={formData.project}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
//           />
//           {errors.project && (
//             <p className="text-red-500 text-sm mt-1">{errors.project}</p>
//           )}
//         </div>

//         {/* Project Domain */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">
//             Project Domain
//           </label>
//           <input
//             type="text"
//             name="projectDomain"
//             value={formData.projectDomain}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
//           />
//           {errors.projectDomain && (
//             <p className="text-red-500 text-sm mt-1">{errors.projectDomain}</p>
//           )}
//         </div>

//         {/* Sub Project */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">
//             Sub Products
//           </label>
//           <input
//             type="text"
//             name="subProject"
//             value={formData.subProject}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
//           />
//         </div>

//         {/* Platform */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">Platform</label>
//           <input
//             type="text"
//             name="platform"
//             value={formData.platform}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
//           />
//           {errors.platform && (
//             <p className="text-red-500 text-sm mt-1">{errors.platform}</p>
//           )}
//         </div>

//         {/* Contact Details */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-bold border-b pb-2">
//             Client Contact Details
//           </h3>
//           {formData.contact_details.map((contact, index) => (
//             <div
//               key={index}
//               className="bg-gray-100 p-4 rounded-md space-y-4 shadow"
//             >
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Contact Number
//                 </label>
//                 <input
//                   type="text"
//                   value={contact.contact_number}
//                   onChange={(e) => {
//                     const input = e.target.value;
//                     if (/^\d{0,10}$/.test(input)) {
//                       handleChange(e, index, "contact_number");
//                     }
//                   }}
//                   maxLength={10}
//                   className="w-full p-2 border rounded-md"
//                 />
//                 {errors[`contact_number_${index}`] && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors[`contact_number_${index}`]}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   Client Email
//                 </label>
//                 <input
//                   type="email"
//                   value={contact.mail_id}
//                   onChange={(e) => handleChange(e, index, "mail_id")}
//                   className="w-full p-2 border rounded-md"
//                 />
//                 {errors[`mail_id_${index}`] && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors[`mail_id_${index}`]}
//                   </p>
//                 )}
//               </div>

//               {/* Remove Button */}
//               {formData.contact_details.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeContactField(index)}
//                   className="text-red-600 text-sm"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}

//           {/* Add Another Contact */}
//           <button
//             type="button"
//             onClick={addContactField}
//             className="text-blue-600 text-sm mt-2"
//           >
//             Add Another Contact
//           </button>
//         </div>

//         {successMessage && (
//           <div className="bg-green-100 text-green-800 p-3 rounded shadow-sm text-center font-medium">
//             {successMessage}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
//           >
//             {formData.id ? "Update Project" : "Add Project"}
//           </button>
//           <button
//             onClick={handleCancel}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectForm;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const initialProject = location.state?.project || null;

  const [formData, setFormData] = useState({
    id: null,
    client_name: "",
    project: "",
    subProject: "",
    projectDomain: "",
    platform: "",
    contact_details: [{ contact_name: "", contact_number: "", mail_id: "" }],
  });

  useEffect(() => {
    if (initialProject) {
      setFormData({
        id: initialProject.id,
        client_name: initialProject.clientname || "",
        project: initialProject.projectName || "",
        subProject: Array.isArray(initialProject.subCategory)
          ? initialProject.subCategory
              .map((item) => item.trim())
              .filter((item) => item)
              .join(", ")
          : "",
        projectDomain: initialProject.projectdomain || "",
        platform: initialProject.platform || "",
        contact_details:
          initialProject.contactDetails &&
          initialProject.contactDetails.length > 0
            ? initialProject.contactDetails.map((contact) => ({
                contact_name: contact.contact_name || "",
                contact_number: contact.contact_number || "",
                mail_id: contact.mail_id || "",
              }))
            : [{ contact_name: "", contact_number: "", mail_id: "" }],
      });
    }
  }, [initialProject]);

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    if (field !== null && index !== null) {
      const updatedContacts = [...formData.contact_details];
      updatedContacts[index][field] = value;
      setFormData((prev) => ({
        ...prev,
        contact_details: updatedContacts,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
    if (field && errors[`${field}_${index}`]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`${field}_${index}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    let isValid = true;
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.client_name.trim()) {
      newErrors.client_name = "Client Name is required";
      isValid = false;
    }
    if (!formData.project.trim()) {
      newErrors.project = "Project Name is required";
      isValid = false;
    }
    if (!formData.projectDomain.trim()) {
      newErrors.projectDomain = "Project Domain is required";
      isValid = false;
    }

    formData.contact_details.forEach((contact, index) => {
      const contact_name = contact.contact_name ?? "";
      const contact_number = contact.contact_number ?? "";
      const mail_id = contact.mail_id ?? "";

      const anyFieldFilled = contact_number.trim() || mail_id.trim();

      if (anyFieldFilled) {
        if (!contact_name.trim()) {
          newErrors[`contact_name_${index}`] = "Contact Name is required";
          isValid = false;
        }

        if (!contact_number.trim()) {
          newErrors[`contact_number_${index}`] = "Contact Number is required";
          isValid = false;
        } else if (!/^\d{10}$/.test(contact_number.trim())) {
          newErrors[`contact_number_${index}`] =
            "Contact number must be exactly 10 digits.";
          isValid = false;
        }

        if (!mail_id.trim()) {
          newErrors[`mail_id_${index}`] = "Client Email is required";
          isValid = false;
        } 
        else if (!emailRegex.test(mail_id.trim())) {
          newErrors[`mail_id_${index}`] = "Invalid email format";
          isValid = false;
        }
    //     if (mail_id.trim() && !emailRegex.test(mail_id.trim())) {
    //   newErrors[`mail_id_${index}`] = "Invalid email format";
    //   isValid = false;
    // }
      }
    });

    setErrors(newErrors);
    if (!isValid) return;

    const payload = {
      id: formData.id ?? null,
      clientname: formData.client_name || null,
      project: formData.project || null,
      projectdomain: formData.projectDomain || null,
      platform: formData.platform || "",
      subProject: formData.subProject
        ? formData.subProject
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [],
      contact_details: formData.contact_details.every(
        (c) => !c.contact_name && !c.contact_number && !c.mail_id
      )
        ? []
        : formData.contact_details.map((contact) => ({
            contact_name: contact.contact_name,
            contact_number: contact.contact_number,
            mail_id: contact.mail_id,
          })),
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/project_master`,
        payload
      );
      setSuccessMessage("✅ Project saved successfully.");
      setErrors({});
      setTimeout(() => {
        navigate("/dashboard/projects");
      }, 1000);
    } catch (err) {
      console.error("❌ Failed to submit project", err);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/projects");
  };

  const addContactField = () => {
    setFormData((prev) => ({
      ...prev,
      contact_details: [
        ...prev.contact_details,
        { contact_number: "", mail_id: "" },
      ],
    }));
  };

  const removeContactField = (index) => {
    const updatedContacts = formData.contact_details.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      contact_details:
        updatedContacts.length > 0
          ? updatedContacts
          : [{ contact_number: "", mail_id: "" }],
    }));
  };

  return (
    <div className="max-w-5xl mx-auto bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {formData.id ? "Update Project" : "Add Project"}
        </h2>

        {/* Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.client_name && (
              <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.project && (
              <p className="text-red-500 text-sm mt-1">{errors.project}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Domain
            </label>
            <input
              type="text"
              name="projectDomain"
              value={formData.projectDomain}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.projectDomain && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projectDomain}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Platform
            </label>
            <input
              type="text"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Projects (comma-separated)
            </label>
            <input
              type="text"
              name="subProject"
              value={formData.subProject}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Client Contact Details
          </h3>
          {formData.contact_details.map((contact, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg border space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contact.contact_name}
                  onChange={(e) => handleChange(e, index, "contact_name")}
                  
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors[`contact_name_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`contact_name_${index}`]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={contact.contact_number}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^\d{0,10}$/.test(input)) {
                        handleChange(e, index, "contact_number");
                      }
                    }}
                    maxLength={10}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors[`contact_number_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`contact_number_${index}`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={contact.mail_id}
                    onChange={(e) => handleChange(e, index, "mail_id")}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors[`mail_id_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`mail_id_${index}`]}
                    </p>
                  )}
                </div>
              </div>

              {formData.contact_details.length > 1 && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => removeContactField(index)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove Contact
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addContactField}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Another Contact
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-blue-600  text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            {formData.id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
