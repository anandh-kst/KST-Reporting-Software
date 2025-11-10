// import React, { useEffect, useState, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from '../config/axios'; 
// import './AddEmployee.css'; // Import custom CSS file

// const AddEmployee = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [employee, setEmployee] = useState(null);
//     const [employeeData, setEmployeeData] = useState({
//         employeeId: '',
//         name: '',
//         userName: '',
//         password: '',
//         userType: '',
//         designation: '',
//         domain: '',
//         qualification: '',
//         gender: '',
//         dateOfBirth: '',
//         bloodGroup: '',
//         dateOfJoining: '',
//         mobileNumber: '',
//         mobileNumber2: '',
//         email: '',
//         email2: '',
//         aadhaarNo: '',
//         panNo: '',
//         nationality: '',
//         address: '',
//         state: '',
//         pincode: '',
//         DateOfReleaving: '',
//         profileUrl: null,
//         bankName: '',
//         bankBranch: '',
//         accountNo: '',
//         ifscNo: '',
//         salary: '',
//         isActive: '1',
//         maritialStatus: '',
//         fatherName: '',
//         spouseName: '',
//         spouseJob: '',
//         spouseNumber: '',
//         spouseDob: '',
//         weddingDay: '',
//         child1Name: '',
//         child1Dob: '',
//         child2Name: '',
//         child2Dob: '',
//         EmergencyContactFullName: '',
//         EmergencyMobileNumber: '',
//         EmergencyContactRelationship: '',
//         EmergencyContactFullAddress: '',
//         EmergencyContactState: '',
//         EmergencyContactPincode: '',
//         isTeamLeader: '0'
//     });

//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const employeeIdRef = useRef(null);

//     useEffect(() => {
//         const fetchEmployeeId = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_API_URL}/generateEmployeeId`);
//                 if (response.data.status === "Success") {
//                     setEmployeeData((prevData) => ({
//                         ...prevData,
//                         employeeId: response.data.data,
//                     }));
//                 } else {
//                     setError("Failed to fetch new Employee ID");
//                 }
//             } catch (err) {
//                 console.error("Error fetching Employee ID:", err);
//                 setError("Failed to fetch new Employee ID");
//             }
//         };

//         if (location.state && location.state.employee) {
//             setEmployee(location.state.employee);
//             setEmployeeData({
//                 ...location.state.employee,
//                 profileUrl: null,
//             });
//         } else {
//             fetchEmployeeId(); // Fetch new Employee ID on initial load
//         }

//         // Set focus on Employee ID field when the page loads
//         if (employeeIdRef.current) {
//             employeeIdRef.current.focus();
//         }
//     }, [location]);

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;

//         // Only allow digits in specific fields
//         if (['mobileNumber', 'mobileNumber2', 'aadhaarNo', 'pincode', 'spouseNumber', 'EmergencyMobileNumber', 'EmergencyContactPincode', 'accountNo'].includes(name) && !/^\d*$/.test(value)) {
//             return;
//         }

//         // Allow length restrictions
//         if (['mobileNumber', 'mobileNumber2', 'EmergencyMobileNumber', 'spouseNumber'].includes(name) && value.length > 10) return;
//         if (name === 'aadhaarNo' && value.length > 12) return;
//         if (['pincode', 'EmergencyContactPincode'].includes(name) && value.length > 6) return;

//         if (type === 'file') {
//             if (files && files.length > 0) {
//                 setEmployeeData({ ...employeeData, profileUrl: files[0] });
//             } else {
//                 setEmployeeData({ ...employeeData, profileUrl: null });
//             }
//         } else {
//             setEmployeeData({ ...employeeData, [name]: value });
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             const formElements = Array.from(e.target.form.elements);
//             const nextElement = formElements[formElements.indexOf(e.target) + 1];
//             if (nextElement) nextElement.focus();
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         const requiredFields = [
//             'employeeId',
//             'name',
//             'userName',
//             'password',
//             'userType',
//             'designation',
//             'domain',
//             'dateOfBirth',
//             'bloodGroup',
//             'mobileNumber',
//             'email',
//             'dateOfJoining',
//             'gender',
//             'qualification'
//         ];

//         // Validate required fields
//         for (let field of requiredFields) {
//             if (!employeeData[field]) {
//                 setError(`Missing required field: ${field}`);
//                 return;
//             }
//         }

//         const formData = new FormData();
//         Object.keys(employeeData).forEach((key) => {
//             if (employeeData[key] !== undefined && employeeData[key] !== null) {
//                 console.log(`Appending ${key}: ${employeeData[key]}`); // Debugging
//                 if (['maritialStatus', 'profileUrl', 'dateOfJoining', 'dateOfBirth', 'spouseDob', 'weddingDay', 'child1Dob', 'child2Dob', 'DateOfReleaving'].includes(key)) {
//                     const date = new Date(employeeData[key]);
//                     if (!isNaN(date.getTime())) {
//                         const formattedDate = date.toISOString().split('T')[0];
//                         formData.append(key, formattedDate);
//                     }
//                 } else {
//                     formData.append(key, employeeData[key]);
//                 }
//             }
//         });

//         try {
//             if (employee) {
//                 const response = await axios.post(`${process.env.REACT_APP_API_URL}/addEmployee1`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//                 if (response.data.status === 'Success') {
//                     navigate('/dashboard/addEmployee', { state: { employee: response.data.data } });
//                 }
//                 setSuccess("Employee updated successfully");
//                 alert("Employee updated successfully");
//             } else {
//                 await axios.post(`${process.env.REACT_APP_API_URL}/addEmployee1`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//                 setSuccess("Employee added successfully");
//                 alert("Employee added successfully");
//             }

//             // Reset employeeData after successful submission
//             setEmployeeData({
//                 employeeId: '',
//                 name: '',
//                 userName: '',
//                 password: '',
//                 userType: '',
//                 designation: '',
//                 domain: '',
//                 qualification: '',
//                 gender: '',
//                 dateOfBirth: '',
//                 bloodGroup: '',
//                 dateOfJoining: '',
//                 mobileNumber: '',
//                 mobileNumber2: '',
//                 email: '',
//                 email2: '',
//                 aadhaarNo: '',
//                 panNo: '',
//                 nationality: '',
//                 address: '',
//                 state: '',
//                 pincode: '',
//                 DateOfReleaving: '',
//                 profileUrl: null,
//                 bankName: '',
//                 bankBranch: '',
//                 accountNo: '',
//                 ifscNo: '',
//                 salary: '',
//                 isActive: '1',
//                 maritialStatus: '',
//                 fatherName: '',
//                 spouseName: '',
//                 spouseJob: '',
//                 spouseNumber: '',
//                 spouseDob: '',
//                 weddingDay: '',
//                 child1Name: '',
//                 child1Dob: '',
//                 child2Name: '',
//                 child2Dob: '',
//                 EmergencyContactFullName: '',
//                 EmergencyMobileNumber: '',
//                 EmergencyContactRelationship: '',
//                 EmergencyContactFullAddress: '',
//                 EmergencyContactState: '',
//                 EmergencyContactPincode: '',
//                 isTeamLeader: '0'
//             });

//         } catch (error) {
//             if (error.response) {
//                 setError(error.response.data.message);
//             } else {
//                 setError('An unexpected error occurred. Please try again.');
//             }
//         }
//     };

//     const today = new Date().toISOString().split('T')[0];

//     return (
//         <div className="container mt-5">
//             {employee && <p>Editing: {employee.name}</p>}
//             <h2 className="text-xl font-semibold">Employee Details</h2>
//             <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
//                 {error && <div className="alert alert-danger">{error}</div>}
//                 {success && <div className="alert alert-success">{success}</div>}

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Employee ID <span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type="text"
//                             name="employeeId"
//                             className="form-control"
//                             value={employeeData.employeeId}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             ref={employeeIdRef}
//                             required
//                             disabled
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Name <span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type="text"
//                             name="name"
//                             className="form-control"
//                             value={employeeData.name}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">User Name <span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type="text"
//                             name="userName"
//                             className="form-control"
//                             value={employeeData.userName}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         />
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Password <span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type="password"
//                             name="password"
//                             className="form-control"
//                             value={employeeData.password}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">User Type <span style={{ color: 'red' }}>*</span></label>
//                         <select
//                             name="userType"
//                             className="form-control"
//                             value={employeeData.userType}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         >
//                             <option value="">Select user type</option>
//                             <option value="Admin">Admin</option>
//                             <option value="Employee">Employee</option>
//                         </select>
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Designation <span style={{ color: 'red' }}>*</span></label>
//                         <select
//                             name="designation"
//                             className="form-control"
//                             value={employeeData.designation}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         >
//                             <option value="">Select Designation</option>
//                             <option value="Sr. Azure Administrator">Sr. Azure Administrator</option>
//                             <option value="Sr. Designer">Sr. Designer</option>
//                             <option value="Sr. Technical Head">Sr. Technical Head</option>
//                             <option value="Sr. Technical Lead">Sr. Technical Lead</option>
//                             <option value="Software Developer">Software Developer</option>
//                             <option value="Software Engineer">Software Engineer</option>
//                             <option value="Trainee">Trainee</option>
//                             <option value="House Keeping">House Keeping</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Team Leader <span style={{ color: 'red' }}>*</span></label>
//                         <select
//                             name="isTeamLeader"
//                             className="form-control"
//                             value={employeeData.isTeamLeader}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         >
//                             <option value="0">No</option>
//                             <option value="1">Yes</option>
//                         </select>
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Domain <span style={{ color: 'red' }}>*</span></label>
//                         <select
//                             name="domain"
//                             className="form-control"
//                             value={employeeData.domain}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         >
//                             <option value="">Select Domain</option>
//                             <option value="Development">Development</option>
//                             <option value="IdCard">IdCard</option>
//                         </select>
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Qualification <span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type="text"
//                             name="qualification"
//                             className="form-control"
//                             value={employeeData.qualification}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         />
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Gender <span style={{ color: 'red' }}>*</span></label>
//                         <select
//                             name="gender"
//                             className="form-control"
//                             value={employeeData.gender}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         >
//                             <option value="">Select Gender</option>
//                             <option value="Male">Male</option>
//                             <option value="Female">Female</option>
//                             <option value="Other">Other</option>
//                         </select>
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Employee Status <span style={{ color: 'red' }}>*</span></label>
//                         <select
//                             name="isActive"
//                             className="form-control"
//                             value={employeeData.isActive}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         >
//                             <option value="1">Active</option>
//                             <option value="0">Deactive</option>
//                         </select>
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Date of Birth <span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type="date"
//                             name="dateOfBirth"
//                             className="form-control"
//                             value={employeeData.dateOfBirth}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                             max={today} // Disable future dates
//                         />
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Blood Group <span style={{ color: 'red' }}>*</span></label>
//                         <select
//                             name="bloodGroup"
//                             className="form-control"
//                             value={employeeData.bloodGroup}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         >
//                             <option value="">Select Blood Group</option>
//                             <option value="A+">A+</option>
//                             <option value="A-">A-</option>
//                             <option value="B+">B+</option>
//                             <option value="B-">B-</option>
//                             <option value="AB+">AB+</option>
//                             <option value="AB-">AB-</option>
//                             <option value="O+">O+</option>
//                             <option value="O-">O-</option>
//                         </select>
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Date of Joining <span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type="date"
//                             name="dateOfJoining"
//                             className="form-control"
//                             value={employeeData.dateOfJoining ? employeeData.dateOfJoining.substring(0, 10) : ''}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                             max={today}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Mobile Number <span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type="text"
//                             name="mobileNumber"
//                             className="form-control"
//                             value={employeeData.mobileNumber}
//                             maxLength="10"
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         />
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Alternative Mobile No</label>
//                         <input
//                             type="text"
//                             name="mobileNumber2"
//                             className="form-control"
//                             value={employeeData.mobileNumber2}
//                             maxLength="10"
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Email <span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type="email"
//                             name="email"
//                             className="form-control"
//                             value={employeeData.email}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             required
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Alternative Email</label>
//                         <input
//                             type="email"
//                             name="email2"
//                             className="form-control"
//                             value={employeeData.email2}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Aadhaar No</label>
//                         <input
//                             type="text"
//                             name="aadhaarNo"
//                             className="form-control"
//                             value={employeeData.aadhaarNo}
//                             maxLength="12"
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">PAN No</label>
//                         <input
//                             type="text"
//                             name="panNo"
//                             className="form-control"
//                             value={employeeData.panNo}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Nationality</label>
//                         <select
//                             name="nationality"
//                             className="form-control"
//                             value={employeeData.nationality}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         >
//                             <option value="">Select Nationality</option>
//                             <option value="Indian">Indian</option>
//                             <option value="American">American</option>
//                             <option value="British">British</option>
//                             <option value="Canadian">Canadian</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Address</label>
//                         <input
//                             type="text"
//                             name="address"
//                             className="form-control"
//                             value={employeeData.address}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">State</label>
//                         <select
//                             name="state"
//                             className="form-control"
//                             value={employeeData.state}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         >
//                             <option value="">Select State</option>
//                             <option value="Andhra Pradesh">Andhra Pradesh</option>
//                             <option value="Goa">Goa</option>
//                             <option value="Maharashtra">Maharashtra</option>
//                         </select>
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Pincode</label>
//                         <input
//                             type="text"
//                             name="pincode"
//                             className="form-control"
//                             value={employeeData.pincode}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             maxLength="6"
//                         />
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Date of Relieving</label>
//                         <input
//                             type="date"
//                             name="DateOfReleaving"
//                             className="form-control"
//                             value={employeeData.DateOfReleaving ? employeeData.DateOfReleaving.substring(0, 10) : ''}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             min={today}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Profile Image</label>
//                         <input
//                             type="file"
//                             name="profileUrl"
//                             className="form-control"
//                             accept="image/*"
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Bank Name</label>
//                         <input
//                             type="text"
//                             name="bankName"
//                             className="form-control"
//                             value={employeeData.bankName}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Bank Branch</label>
//                         <input
//                             type="text"
//                             name="bankBranch"
//                             className="form-control"
//                             value={employeeData.bankBranch}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Account No</label>
//                         <input
//                             type="text"
//                             name="accountNo"
//                             className="form-control"
//                             value={employeeData.accountNo}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">IFSC No</label>
//                         <input
//                             type="text"
//                             name="ifscNo"
//                             className="form-control"
//                             value={employeeData.ifscNo}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Salary</label>
//                         <input
//                             type="number"
//                             name="salary"
//                             className="form-control"
//                             value={employeeData.salary}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Marital Status</label>
//                         <select
//                             name="maritialStatus"
//                             className="form-control"
//                             value={employeeData.maritialStatus}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         >
//                             <option value="">Select Marital Status</option>
//                             <option value="Single">UnMarried</option>
//                             <option value="Married">Married</option>
//                             <option value="Divorced">Others</option>
//                         </select>
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Father Name</label>
//                         <input
//                             type="text"
//                             name="fatherName"
//                             className="form-control"
//                             value={employeeData.fatherName}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                 </div>

//                 {/* Spouse Information */}
//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Spouse Name</label>
//                         <input
//                             type="text"
//                             name="spouseName"
//                             className="form-control"
//                             value={employeeData.spouseName}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Spouse Job</label>
//                         <input
//                             type="text"
//                             name="spouseJob"
//                             className="form-control"
//                             value={employeeData.spouseJob}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Spouse Number</label>
//                         <input
//                             type="text"
//                             name="spouseNumber"
//                             className="form-control"
//                             value={employeeData.spouseNumber}
//                             maxLength="10"
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                 </div>

//                 {/* Spouse DOB, Wedding Day */}
//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Spouse DOB</label>
//                         <input
//                             type="date"
//                             name="spouseDob"
//                             className="form-control"
//                             value={employeeData.spouseDob ? employeeData.spouseDob.substring(0, 10) : ''}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             max={today}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Wedding Day</label>
//                         <input
//                             type="date"
//                             name="weddingDay"
//                             className="form-control"
//                             value={employeeData.weddingDay ? employeeData.weddingDay.substring(0, 10) : ''}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             max={today}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Child 1 Name</label>
//                         <input
//                             type="text"
//                             name="child1Name"
//                             className="form-control"
//                             value={employeeData.child1Name}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Child 1 DOB</label>
//                         <input
//                             type="date"
//                             name="child1Dob"
//                             className="form-control"
//                             value={employeeData.child1Dob ? employeeData.child1Dob.substring(0, 10) : ''}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             max={today}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Child 2 Name</label>
//                         <input
//                             type="text"
//                             name="child2Name"
//                             className="form-control"
//                             value={employeeData.child2Name}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Child 2 DOB</label>
//                         <input
//                             type="date"
//                             name="child2Dob"
//                             className="form-control"
//                             value={employeeData.child2Dob ? employeeData.child2Dob.substring(0, 10) : ''}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             max={today}
//                         />
//                     </div>
//                 </div>

//                 {/* Emergency Contact Info */}
//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Emergency Contact Name</label>
//                         <input
//                             type="text"
//                             name="EmergencyContactFullName"
//                             className="form-control"
//                             value={employeeData.EmergencyContactFullName}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Emergency Mobile No</label>
//                         <input
//                             type="text"
//                             name="EmergencyMobileNumber"
//                             className="form-control"
//                             value={employeeData.EmergencyMobileNumber}
//                             maxLength="10"
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Emergency Contact Relationship</label>
//                         <select
//                             name="EmergencyContactRelationship"
//                             className="form-control"
//                             value={employeeData.EmergencyContactRelationship}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         >
//                             <option value="">Select Relationship</option>
//                             <option value="Mother">Mother</option>
//                             <option value="Father">Father</option>
//                             <option value="Wife">Wife</option>
//                             <option value="Husband">Husband</option>
//                             <option value="Others">Others</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="row mb-3">
//                     <div className="col">
//                         <label className="form-label">Emergency Address</label>
//                         <input
//                             type="text"
//                             name="EmergencyContactFullAddress"
//                             className="form-control"
//                             value={employeeData.EmergencyContactFullAddress}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Emergency Contact State</label>
//                         <input
//                             type="text"
//                             name="EmergencyContactState"
//                             className="form-control"
//                             value={employeeData.EmergencyContactState}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <div className="col">
//                         <label className="form-label">Emergency Contact Pincode</label>
//                         <input
//                             type="text"
//                             name="EmergencyContactPincode"
//                             className="form-control"
//                             value={employeeData.EmergencyContactPincode}
//                             onChange={handleChange}
//                             onKeyDown={handleKeyDown}
//                             maxLength="6"
//                         />
//                     </div>
//                 </div>

//                 <button type="submit" className="btn btn-primary d-block mx-auto">
//                     {employee ? 'Update Employee' : 'Add Employee'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddEmployee;


import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "./AddEmployee.css"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [readOnly, setReadOnly] = useState(location.state?.readOnly || false);

  const [isEditing, setIsEditing] = useState(
    location.state?.employee !== undefined
  ); 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validatePassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      pwd
    );
  };

  const processResetSubmit = async (e) => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must have 8+ chars, uppercase, lowercase, number & special char"
      );
      return;
    }
    try {
      const payload = {
        employeeId: employeeData.employeeId,
        newPassword: password,
        confirmPassword: confirmPassword,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/resetPwd`,
        payload
      );
      if (response.data.status === "Success") {
        setShowResetPopup(false);
        alert("Password reset successful");
        navigate("/dashboard/employee-list");
      }
    } catch (err) {
      setError("Failed to reset password");
    }
  };

  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    name: "",
    userName: "",
    password: "",
    userType: "",
    designation: "",
    domain: "",
    qualification: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    dateOfJoining: "",
    mobileNumber: "",
    mobileNumber2: "",
    email: "",
    email2: "",
    aadhaarNo: "",
    panNo: "",
    nationality: "",
    address: "",
    state: "",
    pincode: "",
    DateOfReleaving: "",
    profileUrl: null,
    bankName: "",
    bankBranch: "",
    accountNo: "",
    ifscNo: "",
    salary: "",
    isActive: "1",
    maritialStatus: "",
    fatherName: "",
    spouseName: "",
    spouseJob: "",
    spouseNumber: "",
    spouseDob: "",
    weddingDay: "",
    child1Name: "",
    child1Dob: "",
    child2Name: "",
    child2Dob: "",
    EmergencyContactFullName: "",
    EmergencyMobileNumber: "",
    EmergencyContactRelationship: "",
    EmergencyContactFullAddress: "",
    EmergencyContactState: "",
    EmergencyContactPincode: "",
    isTeamLeader: "0",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const employeeIdRef = useRef(null);

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/generateEmployeeId`
        );
        if (response.data.status === "Success") {
          setEmployeeData((prevData) => ({
            ...prevData,
            employeeId: response.data.data,
          }));
        } else {
          setError("Failed to fetch new Employee ID");
        }
      } catch (err) {
        console.error("Error fetching Employee ID:", err);
        setError("Failed to fetch new Employee ID");
      }
    };

    if (location.state && location.state.employee) {
      setEmployee(location.state.employee);
      setIsEditing(true);

      setEmployeeData((prevData) => ({
        ...prevData,
        ...location.state.employee,
        profileUrl: location.state.employee.profileUrl || null,
        maritialStatus: location.state.employee.maritialStatus || "Single",
      }));
    } else {
      fetchEmployeeId();
    }

    if (employeeIdRef.current) {
      employeeIdRef.current.focus();
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (
      [
        "mobileNumber",
        "mobileNumber2",
        "aadhaarNo",
        "pincode",
        "spouseNumber",
        "EmergencyMobileNumber",
        "EmergencyContactPincode",
        "accountNo",
      ].includes(name) &&
      !/^\d*$/.test(value)
    ) {
      return;
    }
    if (
      [
        "mobileNumber",
        "mobileNumber2",
        "EmergencyMobileNumber",
        "spouseNumber",
      ].includes(name) &&
      value.length > 10
    )
      return;
    if (name === "aadhaarNo" && value.length > 12) return;
    if (
      ["pincode", "EmergencyContactPincode"].includes(name) &&
      value.length > 6
    )
      return;

    if (type === "file") {
      if (files && files.length > 0) {
        const file = files[0];
        setEmployeeData({
          ...employeeData,
          profileUrl: file,
        });
      }
    } else {
      setEmployeeData({ ...employeeData, [name]: value });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formElements = Array.from(e.target.form.elements);
      const nextElement = formElements[formElements.indexOf(e.target) + 1];
      if (nextElement) nextElement.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const requiredFields = [
      "employeeId",
      "name",
      "userName",
      "password",
      "userType",
      "designation",
      "domain",
      "dateOfBirth",
      "bloodGroup",
      "mobileNumber",
      "email",
      "dateOfJoining",
      "gender",
      "qualification",
    ];

    for (let field of requiredFields) {
      if (!employeeData[field]) {
        setError(`Missing required field: ${field}`);
        return;
      }
    }

    const formData = new FormData();
    Object.keys(employeeData).forEach((key) => {
      if (employeeData[key] !== undefined && employeeData[key] !== null) {
        if (key === "profileUrl" && employeeData[key] instanceof File) {
          formData.append(key, employeeData[key]);
        } else if (key === "maritialStatus" && !employeeData[key]) {
          formData.append(key, "Single");
        } else if (
          [
            "dateOfJoining",
            "dateOfBirth",
            "spouseDob",
            "weddingDay",
            "child1Dob",
            "child2Dob",
            "DateOfReleaving",
          ].includes(key)
        ) {
          let date = new Date(employeeData[key]);
          if (!isNaN(date.getTime())) {
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            const formattedDate = date.toISOString().split("T")[0];
            formData.append(key, formattedDate);
          }
        } else {
          formData.append(key, employeeData[key]);
        }
      }
    });

    try {
      if (employee) {
         const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/addEmployee1`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        navigate("/dashboard/employee-list", {
          state: { employee: response.data.data },
        });
        setSuccess("Employee updated successfully");
        alert("Employee updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/addEmployee1`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSuccess("Employee added successfully");
        alert("Employee added successfully");
      }

      const tempProfileUrl = employeeData.profileUrl;
      setEmployeeData({
        employeeId: "",
        name: "",
        userName: "",
        password: "",
        userType: "",
        designation: "",
        domain: "",
        qualification: "",
        gender: "",
        dateOfBirth: "",
        bloodGroup: "",
        dateOfJoining: "",
        mobileNumber: "",
        mobileNumber2: "",
        email: "",
        email2: "",
        aadhaarNo: "",
        panNo: "",
        nationality: "",
        address: "",
        state: "",
        pincode: "",
        DateOfReleaving: "",
        profileUrl: tempProfileUrl,
        bankName: "",
        bankBranch: "",
        accountNo: "",
        ifscNo: "",
        salary: "",
        isActive: "1",
        maritialStatus: "",
        fatherName: "",
        spouseName: "",
        spouseJob: "",
        spouseNumber: "",
        spouseDob: "",
        weddingDay: "",
        child1Name: "",
        child1Dob: "",
        child2Name: "",
        child2Dob: "",
        EmergencyContactFullName: "",
        EmergencyMobileNumber: "",
        EmergencyContactRelationship: "",
        EmergencyContactFullAddress: "",
        EmergencyContactState: "",
        EmergencyContactPincode: "",
        isTeamLeader: "0",
      });
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="container mt-5">
      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999; /* Ensure the modal is above everything */
          }

          .modal {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px; /* Adjust the width as necessary */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }
            .modal-title {
              text-align: center;
              font-weight: bold;
              font-size: 20px;
              margin-bottom: 15px;
    }
          .input-group-text {
              cursor: pointer;
              background: transparent;
              border: none;
    }

           .d-flex.gap-3 {
              gap: 15px;
    }
            .input-group {
              position: relative;
    }
    
    .input-group-text {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
      
      .d-flex {
        display: flex;
        justify-content: space-between; /* Distribute space evenly */
  }

      .update-employee-button {
        margin-left: auto; /* Push "Update Employee" to the right */
  }
 `}
      </style>
      <button
        onClick={() =>
          readOnly
            ? navigate("/dashboard/employee-status")
            : navigate("/dashboard/employee-list")
        }
        className="btn btn-secondary float-right mb-2"
      >
        Back
      </button>
      {isEditing && employee && <p>Editing: {employee.name}</p>}
      <h2 className="text-xl font-semibold">Employee Details</h2>

      <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">
              Employee ID <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="employeeId"
              className="form-control"
              value={employeeData.employeeId}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              ref={employeeIdRef}
              required
              disabled
            />
          </div>
          <div className="col">
            <label className="form-label">
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={employeeData.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">
              User Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="userName"
              className="form-control"
              value={employeeData.userName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          {!isEditing && (
            <div className="col">
              <label className="form-label">
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={employeeData.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
                disabled={readOnly}
              />
            </div>
          )}
          <div className="col">
            <label className="form-label">
              User Type <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="userType"
              className="form-control"
              value={employeeData.userType}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            >
              <option value="">Select user type</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">
              Designation <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="designation"
              className="form-control"
              value={employeeData.designation}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            >
              <option value="">Select Designation</option>
              <option value="Sr. Azure Administrator">
                Sr. Azure Administrator
              </option>
              <option value="Sr. Designer">Sr. Designer</option>
              <option value="Sr. Technical Head">Sr. Technical Head</option>
              <option value="Sr. Technical Lead">Sr. Technical Lead</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Trainee">Trainee</option>
              <option value="House Keeping">House Keeping</option>
              <option value="Chief Technology Officer">Chief Technology Officer</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">
              Team Leader <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="isTeamLeader"
              className="form-control"
              value={employeeData.isTeamLeader}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">
              Domain <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="domain"
              className="form-control"
              value={employeeData.domain}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            >
              <option value="">Select Domain</option>
              <option value="Development">Development</option>
              <option value="IdCard">IdCard</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">
              Qualification <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="qualification"
              className="form-control"
              value={employeeData.qualification}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">
              Gender <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="gender"
              className="form-control"
              value={employeeData.gender}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">
              Employee Status <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="isActive"
              className="form-control"
              value={employeeData.isActive}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            >
              <option value="1">Active</option>
              <option value="0">Deactive</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">
              Date of Birth <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className="form-control"
              value={
                employeeData.dateOfBirth
                  ? employeeData.dateOfBirth.substring(0, 10)
                  : ""
              }
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              max={today} 
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">
              Blood Group <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="bloodGroup"
              className="form-control"
              value={employeeData.bloodGroup}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="A1+">A1+</option>
              <option value="A1-">A1-</option>
              <option value="A2+">A2+</option>
              <option value="A2-">A2-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="A1B+">A1B+</option>
              <option value="A1B-">A1B-</option>
              <option value="A2B+">A2B+</option>
              <option value="A2B-">A2B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="Bombay">Bombay (hh)</option>
              <option value="Rh-null">Rh-null</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">
              Date of Joining <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              name="dateOfJoining"
              className="form-control"
              value={
                employeeData.dateOfJoining
                  ? employeeData.dateOfJoining.substring(0, 10)
                  : ""
              }
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              max={today}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">
              Mobile Number <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="mobileNumber"
              className="form-control"
              value={employeeData.mobileNumber}
              maxLength="10"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Alternative Mobile No</label>
            <input
              type="text"
              name="mobileNumber2"
              className="form-control"
              value={employeeData.mobileNumber2}
              maxLength="10"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={employeeData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Alternative Email</label>
            <input
              type="email"
              name="email2"
              className="form-control"
              value={employeeData.email2}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Aadhaar No</label>
            <input
              type="text"
              name="aadhaarNo"
              className="form-control"
              value={employeeData.aadhaarNo}
              maxLength="12"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">PAN No</label>
            <input
              type="text"
              name="panNo"
              className="form-control"
              value={employeeData.panNo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Nationality</label>
            <select
              name="nationality"
              className="form-control"
              value={employeeData.nationality}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            >
              <option value="">Select Nationality</option>
              <option value="Indian">Indian</option>
              <option value="American">American</option>
              <option value="British">British</option>
              <option value="Canadian">Canadian</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={employeeData.address}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">State</label>
            <select
              name="state"
              className="form-control"
              value={employeeData.state}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            >
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
               <option value="Arunachal Pradesh">Arunachal Pradesh</option>
               <option value="Assam">Assam</option>
               <option value="Bihar">Bihar</option>
               <option value="Chhattisgarh">Chhattisgarh</option>
               <option value="Goa">Goa</option>
               <option value="Gujarat">Gujarat</option>
               <option value="Haryana">Haryana</option>
               <option value="Himachal Pradesh">Himachal Pradesh</option>
               <option value="Jharkhand">Jharkhand</option>
               <option value="Karnataka">Karnataka</option>
               <option value="Kerala">Kerala</option>
               <option value="Madhya Pradesh">Madhya Pradesh</option>
               <option value="Maharashtra">Maharashtra</option>
               <option value="Manipur">Manipur</option>
               <option value="Meghalaya">Meghalaya</option>
               <option value="Mizoram">Mizoram</option>
               <option value="Nagaland">Nagaland</option>
               <option value="Odisha">Odisha</option>
               <option value="Punjab">Punjab</option>
               <option value="Rajasthan">Rajasthan</option>
               <option value="Sikkim">Sikkim</option>
               <option value="Tamil Nadu">Tamil Nadu</option>
               <option value="Telangana">Telangana</option>
               <option value="Tripura">Tripura</option>
               <option value="Uttar Pradesh">Uttar Pradesh</option>
               <option value="Uttarakhand">Uttarakhand</option>
               <option value="West Bengal">West Bengal</option>
            </select>
          </div>
          <div className="col">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              name="pincode"
              className="form-control"
              value={employeeData.pincode}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength="6"
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Date of Relieving</label>
            <input
              type="date"
              name="DateOfReleaving"
              className="form-control"
              value={
                employeeData.DateOfReleaving
                  ? employeeData.DateOfReleaving.substring(0, 10)
                  : ""
              }
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              min={today}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Profile Image</label>
            <input
              type="file"
              name="profileUrl"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              disabled={readOnly}
            />
            {employeeData.profileUrl && (
              <img
                src={
                  employeeData.profileUrl instanceof File
                    ? URL.createObjectURL(employeeData.profileUrl)
                    : employeeData.profileUrl
                }
                alt="Profile Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            )}
          </div>
          <div className="col">
            <label className="form-label">Bank Name</label>
            <input
              type="text"
              name="bankName"
              className="form-control"
              value={employeeData.bankName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Bank Branch</label>
            <input
              type="text"
              name="bankBranch"
              className="form-control"
              value={employeeData.bankBranch}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Account No</label>
            <input
              type="text"
              name="accountNo"
              className="form-control"
              value={employeeData.accountNo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">IFSC No</label>
            <input
              type="text"
              name="ifscNo"
              className="form-control"
              value={employeeData.ifscNo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Salary</label>
            <input
              type="number"
              name="salary"
              className="form-control"
              value={employeeData.salary}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          
          <div className="col">
            <label className="form-label">Marital Status</label>
            <select
              name="maritialStatus"
              className="form-control"
              value={employeeData.maritialStatus || ""}
              onChange={(e) =>
                setEmployeeData({
                  ...employeeData,
                  maritialStatus: e.target.value,
                })
              }
              disabled={readOnly}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">UnMarried</option>
              <option value="Married">Married</option>
              <option value="Divorced">Others</option>
            </select>
          </div>

          <div className="col">
            <label className="form-label">Father Name</label>
            <input
              type="text"
              name="fatherName"
              className="form-control"
              value={employeeData.fatherName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
        </div>

        {/* Spouse Information */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Spouse Name</label>
            <input
              type="text"
              name="spouseName"
              className="form-control"
              value={employeeData.spouseName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Spouse Job</label>
            <input
              type="text"
              name="spouseJob"
              className="form-control"
              value={employeeData.spouseJob}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Spouse Number</label>
            <input
              type="text"
              name="spouseNumber"
              className="form-control"
              value={employeeData.spouseNumber}
              maxLength="10"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Spouse DOB</label>
            <input
              type="date"
              name="spouseDob"
              className="form-control"
              value={
                employeeData.spouseDob
                  ? employeeData.spouseDob.substring(0, 10)
                  : ""
              }
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              max={today}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Wedding Day</label>
            <input
              type="date"
              name="weddingDay"
              className="form-control"
              value={
                employeeData.weddingDay
                  ? employeeData.weddingDay.substring(0, 10)
                  : ""
              }
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              max={today}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Child 1 Name</label>
            <input
              type="text"
              name="child1Name"
              className="form-control"
              value={employeeData.child1Name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Child 1 DOB</label>
            <input
              type="date"
              name="child1Dob"
              className="form-control"
              value={
                employeeData.child1Dob
                  ? employeeData.child1Dob.substring(0, 10)
                  : ""
              }
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              max={today}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Child 2 Name</label>
            <input
              type="text"
              name="child2Name"
              className="form-control"
              value={employeeData.child2Name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Child 2 DOB</label>
            <input
              type="date"
              name="child2Dob"
              className="form-control"
              value={
                employeeData.child2Dob
                  ? employeeData.child2Dob.substring(0, 10)
                  : ""
              }
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              max={today}
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Emergency Contact Name</label>
            <input
              type="text"
              name="EmergencyContactFullName"
              className="form-control"
              value={employeeData.EmergencyContactFullName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Emergency Mobile No</label>
            <input
              type="text"
              name="EmergencyMobileNumber"
              className="form-control"
              value={employeeData.EmergencyMobileNumber}
              maxLength="10"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Emergency Contact Relationship</label>
            <select
              name="EmergencyContactRelationship"
              className="form-control"
              value={employeeData.EmergencyContactRelationship}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            >
              <option value="">Select Relationship</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Wife">Wife</option>
              <option value="Husband">Husband</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Emergency Address</label>
            <input
              type="text"
              name="EmergencyContactFullAddress"
              className="form-control"
              value={employeeData.EmergencyContactFullAddress}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Emergency Contact State</label>
            <input
              type="text"
              name="EmergencyContactState"
              className="form-control"
              value={employeeData.EmergencyContactState}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
            />
          </div>
          <div className="col">
            <label className="form-label">Emergency Contact Pincode</label>
            <input
              type="text"
              name="EmergencyContactPincode"
              className="form-control"
              value={employeeData.EmergencyContactPincode}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={readOnly}
              maxLength="6"
            />
          </div>
        </div>
      
        {isEditing ? (
          <div className="d-flex">
             {!readOnly && (
            <button
              type="button"
              className="btn btn-warning me-2"
              onClick={() => setShowResetPopup(true)}
            >
              Reset Password
            </button>
            )}
            {!readOnly && (
              <button
                type="submit"
                className="btn btn-primary update-employee-button"
              >
                Update Employee
              </button>
            )}
          </div>
        ) : (
          <button type="submit" className="btn btn-primary">
            Add Employee
          </button>
        )}
      </form>

      {showResetPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Reset Password</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label>New Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label>Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-primary"
                onClick={processResetSubmit}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-5"
                onClick={() => setShowResetPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;


