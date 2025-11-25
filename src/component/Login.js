

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../Redux/slice/loginSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../img/logo/logo_bg_r.png";

// import report from "../img/icons/report.png";

const Login = () => {
  const navigate = useNavigate();
  const { isAuth, userData } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error state

  const passwordInputRef = useRef(null); // Ref for password input

  useEffect(() => {
    if (isAuth && userData) {
      // Check if userData is defined
      if (userData.userType === "Admin") {
        navigate("/dashboard/dashboard");
      } else {
        navigate("/dashboard/dashboards");
      }
    }
  }, [isAuth, userData, navigate]);

  /*useEffect(() => {
    if (isAuth && userData) { 
      navigate("/dashboard"); // Redirecting correctly
    }
  }, [isAuth, userData, navigate]);*/

  // Focus on username field on component mount
  useEffect(() => {
    const usernameInput = document.getElementById("username");
    if (usernameInput) {
      usernameInput.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { username, password }
      );
      const { status, data } = loginResponse.data;

      if (status === "Success") {
        dispatch(logIn(data));

        // Save employeeId and employeeName to local storage
        localStorage.setItem("employeeId", data.employeeId);
        localStorage.setItem("employeeName", data.employeeName);
        localStorage.setItem("userName", data.userName);

        navigate(
          data.userType === "Admin"
            ? "/dashboard/dashboard"
            : "/dashboard/dashboards"
        );
        //navigate(data.userType === "employee" ? "/dashboard/dashbaords" : "/dashboard");

        // navigate(data.userType === "Admin" ? "/dashboard" : "/dashboard");
        //navigate("/dashboard");
      }
    } catch (error) {
      // Handle backend error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message); // Set error message from backend
      } else {
        setErrorMessage("An unexpected error occurred. Please try again."); // Fallback message
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  // Handle key press for Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (document.activeElement.id === "username") {
        passwordInputRef.current.focus();
      } else if (document.activeElement.id === "password") {
        handleSubmit(e);
      }
    }
  };

  return (
    <section
      className="bg-gray-100 min-h-screen flex items-center justify-center"
      onKeyPress={handleKeyPress}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <img src={logo} alt="logo" className="h-16" />
          {/* <img src={report} alt="icon" className="h-12" /> */}
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              name="username"
              id="username"
              className="mt-1 text-sm block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              ref={passwordInputRef}
              className="mt-1 text-sm block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1 text-gray-600"
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>

          {/* Display error message */}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleForgotPassword}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
