// import React, { useEffect, useState } from "react";

// const Notifications = ({ userType, employeeId }) => {
//   // State to hold notifications and toggling display
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const isAdmin = userType === "admin" && employeeId === "HR";

//   // Fetch notifications from the API
//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/get_notification1");
//       const data = await response.json();
//       setNotifications(data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   // Update notification status when it is clicked
//   const updateNotificationStatus = async (notificationID) => {
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/update_notification1", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: notificationID }), // Adjust body according to your API
//       });
//       if (response.ok) {
//         // Refresh notifications after updating
//         fetchNotifications();
//       } else {
//         console.error("Failed to update notification");
//       }
//     } catch (error) {
//       console.error("Error updating notification:", error);
//     }
//   };

//   // Toggle the notification display
//   const handleToggleNotifications = () => {
//     if (!showNotifications) {
//       fetchNotifications(); // Fetch notifications when displaying
//     }
//     setShowNotifications(!showNotifications);
//   };

//   // Only render the notifications for authorized users
//   if (!isAdmin) {
//     return null; // Render nothing if user is not authorized
//   }

//   return (
//     <div className="notifications">
//       <button onClick={handleToggleNotifications} className="notification-button">
//         Notifications
//       </button>
//       {showNotifications && (
//         <div className="notification-dropdown">
//           <table className="notification-table">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Info Details</th>
//                 <th>Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {notifications.map((notification) => (
//                 <tr key={notification.id} onClick={() => updateNotificationStatus(notification.id)}>
//                   <td>{new Date(notification.date).toLocaleDateString("en-GB")}</td>
//                   <td>{notification.details}</td>
//                   <td>{new Date(notification.time).toLocaleTimeString("en-US")}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;






// import React, { useEffect, useState } from "react";
// import "./Notification.css"; // Import the CSS file

// const Notifications = ({ userType, employeeId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const isAdmin = userType === "admin" && employeeId === "HR";

//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/get_notification1");
//       const data = await response.json();
//       setNotifications(data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   const updateNotificationStatus = async (notificationID) => {
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/update_notification1", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: notificationID }),
//       });
//       if (response.ok) {
//         fetchNotifications();
//       } else {
//         console.error("Failed to update notification");
//       }
//     } catch (error) {
//       console.error("Error updating notification:", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   if (!isAdmin) {
//     return null;
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.toLocaleString("en-US", { month: "short" });
//     return { day, month };
//   };

//   return (
//     <div className="notifications-container">
//       <h2 className="notification-header">Notifications</h2>
//       <div className="notification-list">
//         {notifications.map((notification) => {
//           const { day, month } = formatDate(notification.date);
//           return (
//             <div
//               key={notification.id}
//               className="notification-card"
//               onClick={() => updateNotificationStatus(notification.id)}
//             >
//               <div className="date-box">
//                 <span className="month">{month}</span>
//                 <span className="day">{day}</span>
//               </div>
//               <div className="notification-content">
//                 <p>{notification.details}</p>
//                 <span className="notification-time">
//                   {new Date(notification.time).toLocaleTimeString("en-US", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: true,
//                   })}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Notifications;





// import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
// import "./Notification.css"; // Import the CSS file

// const Notifications = ({ userType, employeeId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const isAdmin = userType === "admin" && employeeId === "HR";

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/get_notification1");
//       if (!response.ok) {
//         throw new Error("Network response was not ok.");
//       }
//       const data = await response.json();
//       setNotifications(data);
//     } catch (error) {
//       setError("Error fetching notifications.");
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateNotificationStatus = async (notificationsID) => {
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/update_notification1", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: notificationsID }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update notifications");
//       }
//       fetchNotifications();
//     } catch (error) {
//       console.error("Error updating notification:", error);
//       setError("Error updating notification status.");
//     }
//   };

//   useEffect(() => {
//     if (isAdmin) {
//       fetchNotifications();
//     }
//   }, [isAdmin]);

//   if (!isAdmin) {
//     return null;
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { day: "numeric", month: "short" };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   };

//   return (
//     <div className="notifications-container">
//       <h2 className="notifications-header">Notifications</h2>
      
//       {/* Link to another route */}
//       <Link to="/dashboard" className="back-link">
//         Back to Dashboard
//       </Link>

//       {loading && <p>Loading notifications...</p>}
//       {error && <p className="error-message">{error}</p>}
      
//       {notifications.length === 0 && !loading && <p>No notifications available.</p>}

//       {/* Notifications Table */}
//       <div className="my-5 overflow-auto">
//         <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//           <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//             <tr>
//               <th className="border px-4 py-2">ID</th>
//               <th className="border px-4 py-2">Date</th>
//               <th className="border px-4 py-2">Details</th>
//               <th className="border px-4 py-2">Time</th>
//               <th className="border px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {notifications.map((notifications) => {
//               const formattedDate = formatDate(notifications.date);
//               return (
//                 <tr key={notifications.id} className="bg-white border-b hover:bg-gray-50">
//                   <td className="border px-6 py-4">{notifications.id}</td>
//                   <td className="border px-6 py-4">{formattedDate}</td>
//                   <td className="border px-6 py-4">{notifications.details}</td>
//                   <td className="border px-6 py-4">
//                     {new Date(notifications.time).toLocaleTimeString("en-US", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                   </td>
//                   <td className="border px-6 py-4">
//                     <button
//                       onClick={() => updateNotificationStatus(notifications.id)}
//                       className="mt-2 text-blue-500"
//                     >
//                       Mark as Read
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Notifications;









// import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
// import "./Notification.css";

// const Notifications = ({ userType, employeeId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const isAdmin = userType === "admin" && employeeId === "HR";

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/get_notification1");
//       if (!response.ok) {
//         throw new Error("Network response was not ok.");
//       }
//       const data = await response.json();
//       setNotifications(data);
//     } catch (error) {
//       setError("Error fetching notifications.");
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateNotificationStatus = async (notificationsID) => {
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/update_notification1", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: notificationsID }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update notifications");
//       }
//       fetchNotifications();
//     } catch (error) {
//       console.error("Error updating notification:", error);
//       setError("Error updating notification status.");
//     }
//   };

//   useEffect(() => {
//     if (isAdmin) {
//       fetchNotifications();
//     }
//   }, [isAdmin]);

//   if (!isAdmin) {
//     return null;
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { day: "numeric", month: "short" };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   };

//   return (
//     <div className="notifications-container">
//       <h2 className="notifications-header">Notifications</h2>
      
//       <Link to="/dashboard" className="back-link">
//         Back to Dashboard
//       </Link>

//       {loading && <p>Loading notifications...</p>}
//       {error && <p className="error-message">{error}</p>}
//       {notifications.length === 0 && !loading && <p>No notifications available.</p>}

//       <div className="my-5 overflow-auto">
//         <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//           <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//             <tr>
//               <th className="border px-4 py-2">ID</th>
//               <th className="border px-4 py-2">Date</th>
//               <th className="border px-4 py-2">Details</th>
//               <th className="border px-4 py-2">Time</th>
//               <th className="border px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {notifications.map(notification => {
//               const formattedDate = formatDate(notification.date);
//               return (
//                 <tr key={notification.id} className="bg-white border-b hover:bg-gray-50">
//                   <td className="border px-6 py-4">{notification.id}</td>
//                   <td className="border px-6 py-4">{formattedDate}</td>
//                   <td className="border px-6 py-4">{notification.details}</td>
//                   <td className="border px-6 py-4">
//                     {new Date(notification.time).toLocaleTimeString("en-US", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                   </td>
//                   <td className="border px-6 py-4">
//                     <button
//                       onClick={() => updateNotificationStatus(notification.id)}
//                       className="mt-2 text-blue-500"
//                     >
//                       Mark as Read
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Notifications;




// import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
// import './Notification.css';

// const Notifications = ({ userType, employeeId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Debugging: Log userType and employeeId
//   console.log("userType:", userType, "employeeId:", employeeId);

//   const isAdmin = userType === "admin" && employeeId === "HR";

//   // Debugging: Log isAdmin
//   console.log("isAdmin:", isAdmin);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/get_notification1");
//       if (!response.ok) {
//         throw new Error("Network response was not ok.");
//       }
//       const data = await response.json();
//       console.log("API Response:", data); // Debugging: Log API response
//       setNotifications(data);
//     } catch (error) {
//       setError("Error fetching notifications.");
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateNotificationStatus = async (notificationsID) => {
//     try {
//       const response = await fetch("http://124.123.64.185:81/leave/update_notification1", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: notificationsID }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update notifications");
//       }
//       fetchNotifications(); // Refresh notifications after updating
//     } catch (error) {
//       console.error("Error updating notification:", error);
//       setError("Error updating notification status.");
//     }
//   };

//   useEffect(() => {
//     if (isAdmin) {
//       fetchNotifications();
//     }
//   }, [isAdmin]);

//   // Debugging: Log loading and error states
//   console.log("loading:", loading, "error:", error);

//   if (!isAdmin) {
//     console.log("User is not an admin. Rendering nothing."); // Debugging: Log if not admin
//     return null;
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { day: "numeric", month: "short" };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   };

//   return (
//     <div className="notifications-container">
//       <h2 className="notifications-header">Notifications</h2>

//       <Link to="/dashboard" className="back-link">
//         Back to Dashboard
//       </Link>

//       {loading && <p>Loading notifications...</p>}
//       {error && <p className="error-message">{error}</p>}
//       {notifications.length === 0 && !loading && <p>No notifications available.</p>}

//       <div className="my-5 overflow-auto">
//         <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//           <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//             <tr>
//               <th className="border px-4 py-2">ID</th>
//               <th className="border px-4 py-2">Date</th>
//               <th className="border px-4 py-2">Details</th>
//               <th className="border px-4 py-2">Time</th>
//               <th className="border px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {notifications.map((notification) => {
//               const formattedDate = formatDate(notification.date);
//               return (
//                 <tr key={notification.id} className="bg-white border-b hover:bg-gray-50">
//                   <td className="border px-6 py-4">{notification.id}</td>
//                   <td className="border px-6 py-4">{formattedDate}</td>
//                   <td className="border px-6 py-4">{notification.details}</td>
//                   <td className="border px-6 py-4">
//                     {new Date(notification.time).toLocaleTimeString("en-US", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                   </td>
//                   <td className="border px-6 py-4">
//                     <button
//                       onClick={() => updateNotificationStatus(notification.id)}
//                       className="mt-2 text-blue-500"
//                     >
//                       Mark as Read
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Notifications;












// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios"; // Make sure to import axios for making requests
// import './Notification.css'; // Import the CSS file

// const Notifications = ({ userType, employeeId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Check if the user is an admin
//   const isAdmin = userType === "admin" && employeeId === "HR";

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`);
//       const { status, data } = response.data;

//       if (status === "Success") {
//         setNotifications(data);
//       } else {
//         setError("Error fetching notifications.");
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setError("Error fetching notifications.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateNotificationStatus = async (notificationID) => {
//     try {
//       const payload = { id: notificationID };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/notifications`, payload);
//       const { status } = response.data;

//       if (status === "Success") {
//         // Refresh notifications after updating
//         fetchNotifications();
//       } else {
//         setError("Failed to update notification status.");
//       }
//     } catch (error) {
//       console.error("Error updating notification:", error);
//       setError("Error updating notification status.");
//     }
//   };

//   useEffect(() => {
//     if (isAdmin) {
//       fetchNotifications();
//     }
//   }, [isAdmin]);

//   // Return nothing if user is not admin
//   if (!isAdmin) {
//     return null;
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { day: "numeric", month: "short" };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   };

//   return (
//     <div className="notifications-container">
//       <h2 className="notifications-header">Notifications</h2>

//       <Link to="/dashboard" className="back-link">
//         Back to Dashboard
//       </Link>

//       {loading && <p>Loading notifications...</p>}
//       {error && <p className="error-message">{error}</p>}
//       {notifications.length === 0 && !loading && <p>No notifications available.</p>}

//       <div className="my-5 overflow-auto">
//         <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//           <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//             <tr>
//               <th className="border px-4 py-2">ID</th>
//               <th className="border px-4 py-2">Date</th>
//               <th className="border px-4 py-2">Details</th>
//               <th className="border px-4 py-2">Time</th>
//               <th className="border px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {notifications.map((notification) => {
//               const formattedDate = formatDate(notification.date);
//               return (
//                 <tr key={notification.id} className="bg-white border-b hover:bg-gray-50">
//                   <td className="border px-6 py-4">{notification.id}</td>
//                   <td className="border px-6 py-4">{formattedDate}</td>
//                   <td className="border px-6 py-4">{notification.details}</td>
//                   <td className="border px-6 py-4">
//                     {new Date(notification.time).toLocaleTimeString("en-US", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                   </td>
//                   <td className="border px-6 py-4">
//                     <button
//                       onClick={() => updateNotificationStatus(notification.id)}
//                       className="mt-2 text-blue-500"
//                     >
//                       Mark as Read
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Notifications;








// // src/components/Notifications.js
// import React from 'react';
// import './Notification.css';

// const Notifications = () => {
//   const notifications = [
//     {
//       date: 'Jan 31, 2025',
//       name:'John Doe',
//       details: 'Leave Apply from Feb 2, 2025 to Feb 3, 2025 Full day',
//       time: '9:40 AM',
//     },
//     // You can add more notifications here
//   ];

//   return (
//     <div className="notifications">
//       <h2>Notifications</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Name</th>
//             <th>Details</th>
//             <th>Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {notifications.map((notification, index) => (
//             <tr key={index}>
//               <td>{notification.date}</td>
//               <td>{notification.name}    </td>
//               <td>{notification.details}</td>
//               <td>{notification.time}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Notifications;




// src/components/Notifications.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import './Notification.css';

// const Notifications = ({ userType, employeeId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch notifications from the backend
//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`);
//       const { status, data } = response.data;

//       if (status === "Success") {
//         setNotifications(data);
//       } else {
//         setError("Error fetching notifications.");
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setError("Error fetching notifications.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to update notification status
//   const updateNotificationStatus = async (notificationID) => {
//     try {
//       const payload = { id: notificationID };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/notifications`, payload);
//       const { status } = response.data;

//       if (status === "Success") {
//         // Refresh notifications after updating
//         fetchNotifications();
//       } else {
//         setError("Failed to update notification status.");
//       }
//     } catch (error) {
//       console.error("Error updating notification:", error);
//       setError("Error updating notification status.");
//     }
//   };

//   // UseEffect to fetch notifications when the component mounts
//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   // Helper function to format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { day: "numeric", month: "short" };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   };

//   // Rendering notifications
//   if (loading) {
//     return <div>Loading notifications...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   if (notifications.length === 0) {
//     return <div>No notifications available.</div>;
//   }

//   return (
//     <div className="notifications-container">
//       <h2 className="notifications-header">Notifications</h2>

//       <Link to="/dashboard" className="back-link">
//         Back to Dashboard
//       </Link>

//       <div className="my-5 overflow-auto">
//         <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//           <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//             <tr>
//               <th className="border px-4 py-2">ID</th>
//               <th className="border px-4 py-2">Date</th>
//               <th className="border px-4 py-2">Details</th>
//               <th className="border px-4 py-2">Time</th>
//               <th className="border px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {notifications.map((notification) => {
//               const formattedDate = formatDate(notification.date);
//               return (
//                 <tr key={notification.id} className="bg-white border-b hover:bg-gray-50">
//                   <td className="border px-6 py-4">{notification.id}</td>
//                   <td className="border px-6 py-4">{formattedDate}</td>
//                   <td className="border px-6 py-4">{notification.details}</td>
//                   <td className="border px-6 py-4">
//                     {new Date(notification.time).toLocaleTimeString("en-US", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                   </td>
//                   <td className="border px-6 py-4">
//                     <button
//                       onClick={() => updateNotificationStatus(notification.id)}
//                       className="mt-2 text-blue-500"
//                     >
//                       Mark as Read
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Notifications;








// // src/components/Notifications.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import './Notification.css';

// const Notifications = ({ userType, employeeId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch notifications from the backend
//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`);
//       const { status, data } = response.data;

//       if (status === "Success") {
//         setNotifications(data);
//       } else {
//         setError("Error fetching notifications.");
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setError("Error fetching notifications.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to update notification status
//   const updateNotificationStatus = async (notificationID) => {
//     try {
//       const payload = { id: notificationID };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/notifications`, payload);
//       const { status } = response.data;

//       if (status === "Success") {
//         // Refresh notifications after updating
//         fetchNotifications();
//       } else {
//         setError("Failed to update notification status.");
//       }
//     } catch (error) {
//       console.error("Error updating notification:", error);
//       setError("Error updating notification status.");
//     }
//   };

//   // UseEffect to fetch notifications when the component mounts
//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   // Helper function to format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { day: "numeric", month: "short" };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
//   };

//   // Rendering notifications
//   if (loading) {
//     return <div>Loading notifications...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   if (notifications.length === 0) {
//     return <div>No notifications available.</div>;
//   }

//   return (
//     <div className="notifications-container">
//       <h2 className="notifications-header">Notifications</h2>

//       <Link to="/dashboard" className="back-link">
//         Back to Dashboard
//       </Link>

//       <div className="my-5 overflow-auto">
//         <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//           <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//             <tr>
//               <th className="border px-4 py-2">ID</th>
//               <th className="border px-4 py-2">Date</th>
//               <th className="border px-4 py-2">Details</th>
//               <th className="border px-4 py-2">Time</th>
//               <th className="border px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {notifications.map((notification) => {
//               if (!notification.id || !notification.date || !notification.details || !notification.time) {
//                 console.log("Notification is missing required fields:", notification);
//                 return <tr key={notification.id}><td colSpan="5">Notification is missing required fields</td></tr>;
//               }

//               const formattedDate = formatDate(notification.date);
//               return (
//                 <tr key={notification.id} className="bg-white border-b hover:bg-gray-50">
//                   <td className="border px-6 py-4">{notification.id}</td>
//                   <td className="border px-6 py-4">{formattedDate}</td>
//                   <td className="border px-6 py-4">{notification.details}</td>
//                   <td className="border px-6 py-4">
//                     {new Date(notification.time).toLocaleTimeString("en-US", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                   </td>
//                   <td className="border px-6 py-4">
//                     <button
//                       onClick={() => updateNotificationStatus(notification.id)}
//                       className="mt-2 text-blue-500"
//                     >
//                       Mark as Read
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Notifications;




// // src/components/Notifications.js
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import moment from "moment";
// import './Notification.css';

// const Notifications = () => {
//   // Redux state
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
  
//   // State management
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch notifications for the logged-in employee
//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications/${employeeId}`);
//       const { leaveRequests, upcomingBirthdays } = response.data;

//       setLeaveRequests(leaveRequests);
//       setUpcomingBirthdays(upcomingBirthdays);
//     } catch (err) {
//       console.error("Error fetching notifications:", err);
//       setError("Failed to load notifications.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UseEffect to fetch notifications on component mount
//   useEffect(() => {
//     fetchNotifications();
//   }, [employeeId]);

//   // Calculate total notifications
//   const totalNotifications = leaveRequests.length + upcomingBirthdays.length;

//   // Render loading, error, or notifications
//   if (loading) {
//     return <div>Loading notifications...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div className="notifications-container">
//       <h2 className="notifications-header">Notifications</h2>

//       <div className="notification-icon">
//         <img src="/path/to/your/icon.png" alt="Notifications" />
//         {totalNotifications > 0 && <span className="notification-badge">{totalNotifications}</span>}
//       </div>
      
//       <h3>Leave Requests</h3>
//       {leaveRequests.length === 0 ? (
//         <div>No leave requests available.</div>
//       ) : (
//         <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//           <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//             <tr>
//               <th className="border px-4 py-2">Employee Name</th>
//               <th className="border px-4 py-2">Leave Type</th>
//               <th className="border px-4 py-2">Reason</th>
//               <th className="border px-4 py-2">From Date</th>
//               <th className="border px-4 py-2">To Date</th>
//               <th className="border px-4 py-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaveRequests.map((request) => (
//               <tr key={request.lid} className="bg-white border-b hover:bg-gray-50">
//                 <td className="border px-6 py-4">{request.userName}</td>
//                 <td className="border px-6 py-4">{request.leaveTypes}</td>
//                 <td className="border px-6 py-4">{request.reason}</td>
//                 <td className="border px-6 py-4">{moment(request.startDate).format("YYYY-MM-DD")}</td>
//                 <td className="border px-6 py-4">{moment(request.endDate).format("YYYY-MM-DD")}</td>
//                 <td className="border px-6 py-4">{request.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <h3>Upcoming Birthdays</h3>
//       {upcomingBirthdays.length === 0 ? (
//         <div>No upcoming birthdays.</div>
//       ) : (
//         <ul>
//           {upcomingBirthdays.map((birthday) => (
//             <li key={birthday.employeeId}>
//               {birthday.name} - {moment(birthday.dateOfBirth).format("YYYY-MM-DD")}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notifications;








// // src/components/Notifications.js
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import moment from "moment";
// import './Notification.css';

// const Notifications = () => {
//   // Redux state
//   const { employeeId } = useSelector((state) => state.login.userData);
  
//   // State management
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch notifications for the logged-in employee
//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications/${employeeId}`);
//       const { leaveRequests = [], upcomingBirthdays = [] } = response.data; // Default to empty arrays

//       setLeaveRequests(leaveRequests);
//       setUpcomingBirthdays(upcomingBirthdays);
//     } catch (err) {
//       console.error("Error fetching notifications:", err);
//       setError("Failed to load notifications.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UseEffect to fetch notifications on component mount
//   useEffect(() => {
//     fetchNotifications();
//   }, [employeeId]);

//   // Calculate total notifications
//   const totalNotifications = leaveRequests.length + upcomingBirthdays.length;

//   // Render loading, error, or notifications
//   if (loading) {
//     return <div>Loading notifications...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div className="notifications-container">
//       <h2 className="notifications-header">Notifications</h2>

//       {/* <div className="notification-icon">
//         <img src="/path/to/your/icon.png" alt="Notifications" />
//         {totalNotifications > 0 && <span className="notification-badge">{totalNotifications}</span>}
//       </div> */}
      
//       <h3>Leave Requests</h3>
//       {leaveRequests.length === 0 ? (
//         <div>No leave requests available.</div>
//       ) : (
//         <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//           <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//             <tr>
//               <th className="border px-4 py-2">Employee Name</th>
//               <th className="border px-4 py-2">Leave Type</th>
//               <th className="border px-4 py-2">Reason</th>
//               <th className="border px-4 py-2">From Date</th>
//               <th className="border px-4 py-2">To Date</th>
//               <th className="border px-4 py-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaveRequests.map((request) => (
//               <tr key={request.lid} className="bg-white border-b hover:bg-gray-50">
//                 <td className="border px-6 py-4">{request.userName}</td>
//                 <td className="border px-6 py-4">{request.leaveTypes}</td>
//                 <td className="border px-6 py-4">{request.reason}</td>
//                 <td className="border px-6 py-4">{moment(request.startDate).format("YYYY-MM-DD")}</td>
//                 <td className="border px-6 py-4">{moment(request.endDate).format("YYYY-MM-DD")}</td>
//                 <td className="border px-6 py-4">{request.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <h3>Upcoming Birthdays</h3>
//       {upcomingBirthdays.length === 0 ? (
//         <div>No upcoming birthdays.</div>
//       ) : (
//         <ul>
//           {upcomingBirthdays.map((birthday) => (
//             <li key={birthday.employeeId}>
//               {birthday.name} - {moment(birthday.dateOfBirth).format("YYYY-MM-DD")}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notifications;



// // src/components/Notifications.js
// import React, { useEffect, useState } from 'react';
// import axios from '../config/axios'; 
// import './Notification.css'; // Styles for the notifications component

// const Notifications = () => {
//   const [notificationData, setNotificationData] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     getUpdateNotification();
//     getNotification();
//   }, []);

//   const getNotification = async () => {
//     setLoading(true);
//     try {
//       // Uncomment the next line to use the API call when ready
//       // const response = await axios.get("http://124.123.64.185:81/leave/get_notification1");
      
//       // Mock data for testing
//       const mockData = [
//         { date: "2023-10-01", message: "New notification 1", time: "14:00" },
//         { date: "2023-10-02", message: "New notification 2", time: "15:00" },
//         { date: "2023-10-03", message: "New notification 3", time: "16:00" },
//       ];

//       // Simulating an API call delay
//       setTimeout(() => {
//         // Simulating success response directly
//         setNotificationData(mockData);
//         setLoading(false);
//       }, 1000);
      
//       // The original code is commented out for testing with mock data
//       /*
//       if (response.data.status === 'success') {
//         setNotificationData(response.data.data);
//       } else {
//         console.error(response.data.message);
//       }
//       */
//     } catch (e) {
//       console.error(`Notification fetch error: ${e.message}`);
//       setLoading(false);
//     }
//   };

//   const getUpdateNotification = async () => {
//     try {
//       const response = await axios.post("http://124.123.64.185:81/leave/update_notification1"); // Adjust URL as necessary
//       if (response.data.status === 'success') {
//         console.log(response.data.message);
//       } else {
//         console.error(response.data.message);
//       }
//     } catch (e) {
//       console.error(`Update notification error: ${e}`);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>; // Placeholder for loading
//   }

//   return (
//     <div className="notification-container">
//       <header className="notification-header">
//         {/* <h2>Notifications</h2> */}
//       </header>
//       <div className="notification-list">
//         {notificationData.map((notification, index) => (
//           <div key={index} className="notification-card">
//             <div className="notification-date">
//               <span>{notification.date}</span>
//             </div>
//             <div className="notification-message">
//               <p>{notification.message}</p>
//             </div>
//             <div className="notification-time">
//               <span>{notification.time}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Notifications;



// // src/components/Notifications.js
// import React, { useEffect, useState } from 'react';
// import axios from '../config/axios'; 
// import './Notification.css'; // Styles for the notifications component

// const Notifications = () => {
//   const [notificationData, setNotificationData] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     getUpdateNotification();
//     getNotification();
//   }, []);

//   const getNotification = async () => {
//     setLoading(true);
//     try {
//       // This line will be uncommented when ready to use API
//       const response = await axios.get("http://124.123.64.185:81/leave/get_notification1");
      
//       // Mock data for testing
//       const mockData = [
//         { date: "2025-02-01", message: "Upcoming birthday Anusuya P - Date (03-02-2025)", time: "09:00 AM" },
//         { date: "2025-01-31", message: "Leave Request FROM Lakshmi Devi G From Date: 2025-01-31 To Date: 2025-01-31 FullDay", time: "08:52 AM" },
//         { date: "2025-01-31", message: "Leave Request FROM Esakki Raj M From Date: 2025-02-01 To Date: 2025-02-01 FullDay", time: "05:39 PM" },
//       ];

//       // Simulating an API call delay
//       setTimeout(() => {
//         setNotificationData(mockData);
//         setLoading(false);
//       }, 1000);
//     } catch (e) {
//       console.error(`Notification fetch error: ${e.message}`);
//       setLoading(false);
//     }
//   };

//   const getUpdateNotification = async () => {
//     try {
//       const response = await axios.post("http://124.123.64.185:81/leave/update_notification1");
//       if (response.data.status === 'success') {
//         console.log(response.data.message);
//       } else {
//         console.error(response.data.message);
//       }
//     } catch (e) {
//       console.error(`Update notification error: ${e}`);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>; // Placeholder for loading
//   }

//   return (
//     <div className="notification-container">
//       <header className="notification-header">
//         <h2>Notifications</h2>
//       </header>
//       <div className="notification-list">
//         {notificationData.map((notification, index) => (
//           <div key={index} className="notification-card">
//             <div className="notification-date">
//               <span>{notification.date}</span>
//             </div>
//             <div className="notification-message">
//               <p>{notification.message}</p>
//             </div>
//             <div className="notification-time">
//               <span>{notification.time}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Notifications;








// import React, { useState, useEffect } from 'react';
// import axios from '../config/axios'; 

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadNotifications, setUnreadNotifications] = useState(0);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`);
//         console.log(response.data); // Log the response
//         setNotifications(response.data); // Ensure response.data is an array
//         const unread = Array.isArray(response.data)
//           ? response.data.filter((notification) => notification.read === false).length
//           : 0; // Fallback to 0 if it's not an array
//         setUnreadNotifications(unread);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchNotifications();
//   }, []);

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       await axios.patch(`${process.env.REACT_APP_API_URL}/notifications/${notificationId}`, { read: true });
//       setNotifications((prevNotifications) =>
//         prevNotifications.map((notification) => {
//           if (notification.id === notificationId) {
//             return { ...notification, read: true };
//           }
//           return notification;
//         })
//       );
//       setUnreadNotifications((prevUnread) => prevUnread - 1);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h1>Notifications</h1>
//       <ul>
//         {Array.isArray(notifications) && notifications.length > 0 ? (
//           notifications.map((notification) => (
//             <li key={notification.id}>
//               <p>
//                 {notification.message}{' '}
//                 <span style={{ color: notification.read ? 'green' : 'red' }}>
//                   {notification.read ? 'Read' : 'Unread'}
//                 </span>
//               </p>
//               <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
//             </li>
//           ))
//         ) : (
//           <li>No notifications available.</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Notifications;







// import React, { useState, useEffect } from 'react';
// import axios from '../config/axios'; 
// import './Notification.css';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState({});

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`);
//         setNotifications(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchNotifications();
//   }, []);

//   const handleLeaveRequest = (leaveRequest) => ( 
//     <div key={leaveRequest.lid}>
//       <h4>Leave Request from {leaveRequest.userName}</h4>
//       <p>
//         Leave Type: {leaveRequest.leaveTypes}
//         <br />
//         Leave Time: {leaveRequest.leaveTimes}
//         <br />
//         Start Date: {new Date(leaveRequest.startDate).toDateString()}
//         <br />
//         End Date: {new Date(leaveRequest.endDate).toDateString()}
//         <br />
//         No. of Days: {leaveRequest.noOfDays}
//         <br />
//         Reason: {leaveRequest.reason}
//         <br />
//         Status: {leaveRequest.status}
//       </p>
//       <hr />
//     </div>
//   );

//   const handleBirthday = (birthday) => (
//     <div key={birthday.employeeId}>
//       <h4>Upcoming Birthday of {birthday.name}</h4>
//       <p>Date of Birth: {new Date(birthday.dateOfBirth).toDateString()}</p>
//       <hr />
//     </div>
//   );

//   return (
//     <div>
//       {/* <h1>Notifications</h1> */}
//       <ul>
//         {Object.keys(notifications).length > 0 && (
//           <div>
//             Leave Requests
//             {notifications.leaveRequests.map((leaveRequest) => handleLeaveRequest(leaveRequest))}
//             <br />
//             <br />
//             Upcoming Birthdays
//             {notifications.upcomingBirthdays.map((birthday) => handleBirthday(birthday))}
//           </div>
//         )}
//         {Object.keys(notifications).length == 0 && <li>No notifications available.</li>}
//       </ul>
//     </div>
//   );
// };

// export default Notifications;



// import React, { useState, useEffect } from 'react';
// import axios from '../config/axios'; 
// import './Notification.css';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState({});

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`);
//         setNotifications(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchNotifications();
//   }, []);

//   const handleLeaveRequest = (leaveRequest) => (
//     <div key={leaveRequest.lid} className="leave-request">
//       <h4 className="request-title">Leave Request from {leaveRequest.userName}</h4>
//       <p className="request-details">
//         <span className="detail-label">Leave Type:</span> {leaveRequest.leaveTypes}
//         <br />
//         <span className="detail-label">Leave Time:</span> {leaveRequest.leaveTimes}
//         <br />
//         <span className="detail-label">Start Date:</span> {new Date(leaveRequest.startDate).toDateString()}
//         <br />
//         <span className="detail-label">End Date:</span> {new Date(leaveRequest.endDate).toDateString()}
//         <br />
//         <span className="detail-label">No. of Days:</span> {leaveRequest.noOfDays}
//         <br />
//         <span className="detail-label">Reason:</span> {leaveRequest.reason}
//         <br />
//         <span className="detail-label">Status:</span> {leaveRequest.status}
//       </p>
//       <hr className="request-divider" />
//     </div>
//   );

//   const handleBirthday = (birthday) => (
//     <div key={birthday.employeeId} className="birthday">
//       <h4 className="birthday-title">Upcoming Birthday of {birthday.name}</h4>
//       <p className="birthday-details">
//         <span className="detail-label">Date of Birth:</span> {new Date(birthday.dateOfBirth).toDateString()}
//       </p>
//       <hr className="birthday-divider" />
//     </div>
//   );

//   return (
//     <div className="notifications-container">
//       <h1 className="notifications-title">Notifications</h1>
//       {Object.keys(notifications).length > 0 && (
//         <div className="notifications-content">
//           <h2 className="section-title">Leave Requests</h2>
//           {notifications.leaveRequests.map((leaveRequest) => handleLeaveRequest(leaveRequest))}
//           <h2 className="section-title">Upcoming Birthdays</h2>
//           {notifications.upcomingBirthdays.map((birthday) => handleBirthday(birthday))}
//         </div>
//       )}
//       {Object.keys(notifications).length == 0 && (
//         <p className="no-notifications">No notifications available.</p>
//       )}
//     </div>
//   );
// };

// export default Notifications;




import React, { useState, useEffect } from 'react';
import axios from '../config/axios'; 
import './Notification.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`);
        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
  }, []);

  const handleLeaveRequest = (leaveRequest) => (
    <div key={leaveRequest.lid} className="leave-request">
      <h4 className="request-title">Leave Request from {leaveRequest.userName}</h4>
      <div className="request-details">
        <div className="request-row">
          <span className="detail-label">Leave Type:</span> {leaveRequest.leaveTypes}

          <span className="detail-label">Leave Time:</span> {leaveRequest.leaveTimes}
        </div>
        <div className="request-row">
          <span className="detail-label">Start Date:</span> {new Date(leaveRequest.startDate).toDateString()}
          <span className="detail-label">End Date:</span> {new Date(leaveRequest.endDate).toDateString()}
        </div>
        <div className="request-row">
          <span className="detail-label">No. of Days:</span> {leaveRequest.noOfDays}
          <span className="detail-label">Reason:</span> {leaveRequest.reason}
        </div>
        {/* <div className="request-row">
          <span className="detail-label">Status:</span> {leaveRequest.status}
        </div> */}
      </div>
      <hr className="request-divider" />
    </div>
  );

  const handleBirthday = (birthday) => (
    <div key={birthday.employeeId} className="birthday">
      <h4 className="birthday-title">Upcoming Birthday of {birthday.name}</h4>
      <p className="birthday-details">
        <span className="detail-label">Date of Birth:</span> {new Date(birthday.dateOfBirth).toDateString()}
      </p>
      <hr className="birthday-divider" />
    </div>
  );

  return (
    <div className="notifications-container">
      <h1 className="notifications-title">Notifications</h1>
      {Object.keys(notifications).length > 0 && (
        <div className="notifications-content">
          <h2 className="section-title">Leave Requests</h2>
          {notifications.leaveRequests.map((leaveRequest) => handleLeaveRequest(leaveRequest))}
          <h2 className="section-title">Upcoming Events</h2>
          {notifications.upcomingBirthdays.map((birthday) => handleBirthday(birthday))}
        </div>
      )}
      {Object.keys(notifications).length === 0 && (
        <p className="no-notifications">No notifications available.</p>
      )}
    </div>
  );
};

export default Notifications;

