// import React, { useState } from 'react';
// import axios from '../config/axios'; 

// const ChangePassword = () => {
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       setError('New password and confirm password do not match');
//       return;
//     }

//     try {
//       const response = await axios.put(`${process.env.REACT_APP_API_URL}/changePassword`, {
//         employeeId: localStorage.getItem('employeeId'),       
//         oldPassword,
//         newPassword,
//       });

//       if (response.data.status === 'Success') {
//         setSuccess('Password has been changed successfully');
//         setError('');
//         setOldPassword('');
//         setNewPassword('');
//         setConfirmPassword('');
//       } else {
//         setError(response.data.message); // Display specific error messages from backend
//         setSuccess('');
//       }
//     } catch (err) {
//       // Handle different error responses
//       if (err.response && err.response.data) {
//         setError(err.response.data.message); // Display the error message from backend
//       } else {
//         setError('An error occurred while changing the password');
//       }
//       setSuccess('');
//     }
//   };

//   // Updated styles
//   const containerStyle = {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '90vh',
//     backgroundColor: '#f4f4f9',
//     padding: '20px',
//   };

//   const cardStyle = {
//     maxWidth: '400px',
//     width: '100%',
//     background: '#fff',
//     borderRadius: '12px',
//     padding: '30px',
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//     transition: 'box-shadow 0.3s ease',
//   };

//   const headingStyle = {
//     color: '#333',
//     textAlign: 'center',
//     fontSize: '1.5rem',
//     fontWeight: 'bold',
//     marginBottom: '20px',
//   };

//   const formControlStyle = {
//     borderRadius: '6px',
//     border: '1px solid #dcdfe6',
//     padding: '12px 15px',
//     fontSize: '1rem',
//     marginBottom: '15px',
//     width: '100%',
//     outline: 'none',
//     transition: 'border-color 0.3s',
//   };

//   const buttonStyle = {
//     backgroundColor: '#007bff',
//     border: 'none',
//     padding: '12px 20px',
//     fontSize: '1rem',
//     borderRadius: '6px',
//     width: '100%',
//     color: '#fff',
//     cursor: 'pointer',
//     marginTop: '15px',
//     transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
//   };

//   const buttonHoverStyle = {
//     backgroundColor: '#0056b3',
//     boxShadow: '0 4px 10px rgba(0, 91, 187, 0.3)',
//   };

//   const alertStyle = {
//     fontSize: '0.9rem',
//     borderRadius: '8px',
//     marginBottom: '20px',
//     padding: '12px',
//     textAlign: 'center',
//   };

//   return (
//     <div style={containerStyle}>
//       <div style={cardStyle}>
//         <h2 style={headingStyle}>Change Password</h2>
//         {error && (
//           <div style={{ ...alertStyle, backgroundColor: '#f8d7da', color: '#721c24' }}>{error}</div>
//         )}
//         {success && (
//           <div style={{ ...alertStyle, backgroundColor: '#d4edda', color: '#155724' }}>{success}</div>
//         )}
//         <form onSubmit={handleChangePassword}>
//           <input
//             type="password"
//             value={oldPassword}
//             onChange={(e) => setOldPassword(e.target.value)}
//             placeholder="Enter old password"
//             required
//             style={formControlStyle}
//           />
//           <input
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             placeholder="Enter new password"
//             required
//             style={formControlStyle}
//           />
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             placeholder="Confirm new password"
//             required
//             style={formControlStyle}
//           />
//           <button
//             type="submit"
//             style={buttonStyle}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor;
//               e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow;
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor;
//               e.currentTarget.style.boxShadow = 'none';
//             }}
//           >
//             Change Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;


import React, { useState } from 'react';
import axios from 'axios'; 

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Function to validate password strength
  const isValidPassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
  };

  // Handle confirm password validation
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (newPassword && e.target.value !== newPassword) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!isValidPassword(newPassword)) {
      setError('Password must be at least 8 characters long and include one uppercase letter and one number.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/changePassword`, {
        employeeId: localStorage.getItem('employeeId'),
        oldPassword,
        newPassword,
      });

      if (response.data.status === 'Success') {
        setSuccess('Password has been changed successfully');
        setError('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPopup(true);
      } else {
        setError(response.data.message);
        setSuccess('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while changing the password');
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Change Password</h2>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            required
            className="input"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="input"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPassword}
            placeholder="Confirm new password"
            required
            className="input"
          />
          {confirmError && <div className="error-text">{confirmError}</div>}

          <button type="submit" className="btn">Change Password</button>
        </form>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Password Changed Successfully!</p>
            <button onClick={() => setShowPopup(false)} className="popup-btn">OK</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 90vh;
          background-color: #f4f4f9;
          padding: 20px;
        }
        .card {
          max-width: 400px;
          width: 100%;
          background: #fff;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .alert {
          font-size: 0.9rem;
          border-radius: 8px;
          margin-bottom: 15px;
          padding: 12px;
          text-align: center;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
        }
        .input {
          border-radius: 6px;
          border: 1px solid #dcdfe6;
          padding: 12px 15px;
          font-size: 1rem;
          margin-bottom: 10px;
          width: 100%;
          outline: none;
        }
        .btn {
          background-color: #007bff;
          border: none;
          padding: 12px 20px;
          font-size: 1rem;
          border-radius: 6px;
          width: 100%;
          color: #fff;
          cursor: pointer;
          margin-top: 10px;
        }
        .btn:hover {
          background-color: #0056b3;
        }
        .error-text {
          color: #d9534f;
          font-size: 0.85rem;
          margin-bottom: 10px;
        }
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          width: 300px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .popup-btn {
          margin-top: 10px;
          padding: 10px 15px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .popup-btn:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ChangePassword;
