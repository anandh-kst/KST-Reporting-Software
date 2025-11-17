import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./Dashboard.css";
import logo from "../img/logo/logo_bg_r.png";
import userIcon from "../img/logo/profile.png";
import mailIcon from "../img/logo/mail.png";
import { logOut } from "../Redux/slice/loginSlice";
import ChangePassword from "./ChangePassword";
import AddEmployee from "./AddEmployees";
import LeveStatus from "./LeveStatus";
import ApplyLeave from "./ApplyLeave";
import LeaveAccess from "./LeaveAccess";
import EmployeeMaster from "./EmployeeMaster";
import EmployeeMasters from "./EmployeeMasters";
import AttendanceReport from "./AttendanceReport";
import EmployeeStatus from "./EmployeeStatus";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";
import { closeModel, setHasModalShownToday } from "../Redux/slice/commonSlice";
import ProjectAssignForm from "./ProjectAssignForm";
import ProjectAssignList from "./ProjectAssignList";
import LateReport from "./LateReport";
import PunchCorrectionForm from "./PunchCorrectionForm";
import { usePageTitle } from "../lib/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import EmployeesAssets from "./EmployeesAssets";
import EmployeeAssetForm from "./AssetsForm";
import EmployeeAssetFormEdit from "./AssetsFromEdit";

const EmployeeReport = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./EmployeeReport")
);
const RulesMaster = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./RulesMaster")
);
const EmployeeTask = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./Tasks/Employeetask")
);
const EmployeeTaskEdit = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./Tasks/EmployeetaskEdit")
);
const IdCardReport = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./IdCardReport")
);
const IdCardReportEdit = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./IdCardReportEdit")
);
const ReportHistory = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./ReportHistory")
);
const ReportHistoryTl = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./ReportHistoryTl")
);
const EmployeeList = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./EmployeeList")
);
const TeamReport = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./TeamReport")
);
const PunchReport = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./PunchReport")
);
const EditPunch = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./EditPunch")
);

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, userData } = useSelector((state) => state.login);
  const [isAdmin, setIsAdmin] = useState();
  const [TL, setTL] = useState();
  const [Tl, setTl] = useState();

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
    setIsAdmin(userData?.userType === "Admin");
    setTL(userData?.designation === "Sr Technicals Lead");
    setTl(userData?.designation === "Sr. Technical Head");
  }, [isAuth, navigate, userData]);

  const [isToggled, setIsToggled] = useState(true);
  const sidebarRef = useRef(null);
  const location = useLocation();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
console.log("formdata",userData)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsToggled(true);
      } else {
        setIsToggled(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const logOuts = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logOut());
      dispatch(setHasModalShownToday(false));
      navigate("/");
    }
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const handleLogoClick = () => {
    if (isAdmin || TL || Tl) {
      navigate("/dashboard/dashboard");
    } else {
      navigate("/dashboard/dashboards");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth < 1024 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !isToggled
      ) {
        setIsToggled(true);
      }

      if (userDropdownOpen && !event.target.closest(".user-dropdown")) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggled, userDropdownOpen]);

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleChangePassword = () => {
    navigate("/dashboard/changePassword");
    setUserDropdownOpen(false);
  };

  const copyEmailToClipboard = () => {
    if (userData?.email) {
      navigator.clipboard
        .writeText(userData.email)
        .then(() => {
          const emailElement = document.querySelector(".email-text");
          if (emailElement) {
            const originalText = emailElement.innerHTML;
            emailElement.innerHTML =
              '<span style="color: #10B981;">Email copied!</span>';
            setTimeout(() => {
              emailElement.innerHTML = originalText;
            }, 2000);
          }
        })
        .catch((err) => {
          console.error("Failed to copy email: ", err);
        });
    }
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
    setUserDropdownOpen(false);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadMessage("");
    setIsUploading(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setUploadMessage("Please select a valid image file (JPG, JPEG, PNG)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadMessage("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadMessage("");
    }
  };

  const handleSaveProfilePicture = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadMessage("Uploading...");

    try {
      const formData = new FormData();
      formData.append("profileUrl", selectedFile);
       //http://localhost:5000/updateProfileImage/kst89
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/updateProfileImage/${userData?.employeeId}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUploadMessage("Profile image saved successfully!");

        setTimeout(() => {
          closeProfileModal();
          window.location.reload();
        }, 2000);
      } else {
        setUploadMessage(data.message || "Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setUploadMessage("Error uploading profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMenuItemClick = () => {
    if (window.innerWidth < 1024) {
      setIsToggled(true);
    }
  };
  const toggleDropdown = (dropdownType) => {
    setProjectDropdownOpen(false);
    setEmployeeDropdownOpen(false);
    setReportsDropdownOpen(false);

    switch (dropdownType) {
      case "project":
        setProjectDropdownOpen(!projectDropdownOpen);
        break;
      case "employee":
        setEmployeeDropdownOpen(!employeeDropdownOpen);
        break;
      case "reports":
        setReportsDropdownOpen(!reportsDropdownOpen);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="top-header">
        <div className="header-content">
          {window.innerWidth < 1024 && (
            <button
              onClick={handleToggle}
              className="sidebar-toggle"
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
          )}
          <img
            alt="logo"
            className="header-logo"
            src={logo}
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="hidden sm:flex">
          <h1 className="text-xl font-bold text-blue-900">
            {usePageTitle() || "Dashboard"}
          </h1>
        </div>
        <div className="header-actions">
          {/* <div className="email-display" onClick={copyEmailToClipboard} style={{ cursor: 'pointer' }}>
            <img src={mailIcon} alt="Email" className="email-icon" />
            <span className="email-text">
              <span className="email-label">Email:</span> {userData?.email || "N/A"}
            </span>
          </div> */}

          {/* Separator */}
          {/* <div className="header-separator"></div> */}

          {/* User Profile Dropdown */}
          <div className="user-dropdown">
            <button
              onClick={toggleUserDropdown}
              className="user-profile-btn"
              style={{ color: "black!important" }}
            >
              <img
                src={
                  userData?.profileUrl
                    ? userData.profileUrl.startsWith("http")
                      ? userData.profileUrl
                      : `${process.env.REACT_APP_API_URL}/uploads/Images/${userData.profileUrl}`
                    : userIcon
                }
                className="user-avatar"
                alt="Profile"
                onError={(e) => {
                  e.target.src = userIcon;
                }}
              />
            
              <div className="user-info">
                <h3 className="user-name">
                  {userData?.employeeName || "User"}
                </h3>
                <p className="user-designation">
                  {userData?.designation || "Employee"}
                </p>
              </div>
              {/* <div className="user-info">
                <h3 className="user-name">KS Anandh</h3>
                <p className="user-designation">Software Engineer</p>
              </div> */}
              <svg
                className={`dropdowns-arrows ${
                  userDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* <p>{`${process.env.REACT_APP_API_URL}/uploads/Images/${userData.profileUrl}`}</p> */}
            {userDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={openProfileModal} className="dropdown-item">
                  <svg
                    className="dropdown-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={handleChangePassword}
                  className="dropdown-item"
                >
                  <svg
                    className="dropdown-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Change Password
                </button>
                <button onClick={logOuts} className="dropdown-item logout-item">
                  <svg
                    className="dropdown-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {profileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Profile Picture</h2>
              <button
                className="close-button"
                onClick={closeProfileModal}
                disabled={isUploading}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-preview">
                <img
                  src={
                    previewUrl ||
                    (userData?.profileUrl
                      ? userData.profileUrl.startsWith("http")
                        ? userData.profileUrl
                        : `${process.env.REACT_APP_API_URL}/uploads/Images/${userData.profileUrl}`
                      : userIcon)
                  }
                  alt="Profile Preview"
                  className="profile-preview-img"
                  onError={(e) => {
                    e.target.src = userIcon;
                  }}
                />
              </div>
              <div className="file-upload-section">
                <label htmlFor="profile-upload" className="file-upload-label">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Choose Image
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="file-input"
                  disabled={isUploading}
                />
                <p className="file-format-info">
                  Supports: JPG, JPEG, PNG (Max 5MB)
                </p>
                {/* {selectedFile && (
                  <p className="file-selected-info">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )} */}
              </div>
              {uploadMessage && (
                <div
                  className={`upload-message ${
                    uploadMessage.includes("successfully") ? "success" : "error"
                  }`}
                >
                  {uploadMessage}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={closeProfileModal}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                className="save-button"
                onClick={handleSaveProfilePicture}
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="spinner"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "8px",
                      }}
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        ref={sidebarRef}
        id="sidebar-multi-level-sidebar"
        className={isToggled ? "sidebar active" : "sidebar"}
        aria-label="Sidebar"
      >
        <div className="sidebar-header">
          <button onClick={handleToggle} className="sidebar-close-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="h-full px-3 py-4 overflow-y-auto bg-sidebar">
          <ul className="space-y-2 font-medium sidebar-menu">
            <li>
              {/* <Link to={isAdmin || TL || Tl ? "/dashboard/dashboard" : "/dashboard/dashboards"} className="flex justify-center items-center p-2 text-gray-900 rounded-lg bg-gray-100 group">
                <span className="ms-3 mr-4">
                  <img alt="logo" className="h-14 w-auto" src={logo}></img>
                </span>
              </Link> */}
            </li>
            {TL ? (
              <>
                              <li>
                  <Link
                    to="/dashboard/employeeTask"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/employeeTask"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/employeeTask"
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-3-3v6m-3-6h6M5 3a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z"
                      />
                    </svg>
                    <span className="sidebar-text">Daily Task</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/employee-report"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/employee-report" ? "active" : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/employee-report" ? "active" : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                      />
                    </svg>
                    <span className="sidebar-text">Employee Report</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/id-card-report"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/id-card-report"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/id-card-report"
                          ? "active"
                          : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                    <span className="sidebar-text">ID Card Report</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/report-history"
                    className={`sidebar-menu-item ${
                      location.pathname.startsWith("/dashboard/report-history")
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname.startsWith(
                          "/dashboard/report-history"
                        )
                          ? "active"
                          : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span className="sidebar-text">Report History</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/teamReport"
                    className={`sidebar-menu-item ${
                      location.pathname.startsWith("/dashboard/teamReport")
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname.startsWith("/dashboard/teamReport")
                          ? "active"
                          : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h4v12H4zm6 6h4v6h-4zm6-12h4v18h-4z"
                      />
                    </svg>
                    <span className="sidebar-text">Team Report</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/applyLeave"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/applyLeave"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/applyLeave"
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 12V8m4 4V8m1-4H9a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-1z"
                      />
                    </svg>
                    <span className="sidebar-text">Apply Leave</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/leveStatus"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/leveStatus"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/leveStatus"
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 8h12M6 12h8m-8 4h8m-9 5h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"
                      />
                    </svg>
                    <span className="sidebar-text">Leave Status</span>
                  </Link>
                </li>
              </>
            ) : isAdmin ? (
              <>
                <li>
                  <Link
                    to="/dashboard/dashboard"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/dashboard"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname.startsWith("/dashboard/dashboard")
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 3V21M4 21H20M20 21V3M8 17V11M12 17V7M16 17V13"
                      />
                    </svg>
                    <span className="sidebar-text">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => toggleDropdown("employee")}
                    className={`sidebar-menu-item dropdown-toggle ${
                      employeeDropdownOpen ||
                      location.pathname.startsWith("/dashboard/employee")
                        ? "active"
                        : ""
                    }`}
                  >
                    <svg
                      className={`sidebar-icon ${
                        employeeDropdownOpen ||
                        location.pathname.startsWith("/dashboard/employee")
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z M4 17c0-1.657 1.343-3 3-3h10c1.657 0 3 1.343 3 3v1c0 .552-.448 1-1 1H5c-.552 0-1-.448-1-1v-1z M16 14v6"
                      />
                    </svg>
                    <span className="sidebar-text">Employee Details</span>
                    <svg
                      className={`dropdown-arrow ${
                        employeeDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {employeeDropdownOpen && (
                    <ul className="submenu">
                      <li>
                        <Link
                          to="/dashboard/employee-list"
                          className={`submenu-item ${
                            location.pathname === "/dashboard/employee-list"
                              ? "active"
                              : ""
                          }`}
                          onClick={handleMenuItemClick}
                        >
                          <svg
                            className={`submenu-icon ${
                              location.pathname === "/dashboard/employee-list"
                                ? "active"
                                : ""
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                            />
                          </svg>
                          <span className="submenu-text">Employee List</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/employee-status"
                          className={`submenu-item ${
                            location.pathname === "/dashboard/employee-status"
                              ? "active"
                              : ""
                          }`}
                          onClick={handleMenuItemClick}
                        >
                          <svg
                            className={`submenu-icon ${
                              location.pathname === "/dashboard/employee-status"
                                ? "active"
                                : ""
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle
                              cx="12"
                              cy="8"
                              r="4"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                            <circle
                              cx="18"
                              cy="18"
                              r="4"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M18 16v2l1.5 1.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <rect
                              x="6"
                              y="14"
                              width="8"
                              height="6"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                            <path
                              d="M8 16h4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="submenu-text">
                            Old Employee Details
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/employeesAssets"
                          className={`submenu-item ${
                            location.pathname === "/dashboard/employeesAssets"
                              ? "active"
                              : ""
                          }`}
                          onClick={handleMenuItemClick}
                        >
                          <FontAwesomeIcon
                            icon={faBriefcase}
                            className={`submenu-icon ${
                              location.pathname === "/dashboard/employeesAssets"
                                ? "active"
                                : ""
                            }`}
                          />
                          <span className="submenu-text">Employee Assets</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <button
                    onClick={() => toggleDropdown("reports")}
                    className={`sidebar-menu-item dropdown-toggle ${
                      reportsDropdownOpen ||
                      location.pathname.startsWith("/dashboard/report")
                        ? "active"
                        : ""
                    }`}
                  >
                    <svg
                      className={`sidebar-icon ${
                        reportsDropdownOpen ||
                        location.pathname.startsWith("/dashboard/report")
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span className="sidebar-text">Reports</span>
                    <svg
                      className={`dropdown-arrow ${
                        reportsDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {reportsDropdownOpen && (
                    <ul className="submenu">
                      <li>
                        <Link
                          to="/dashboard/attendance-report"
                          className={`submenu-item ${
                            location.pathname === "/dashboard/attendance-report"
                              ? "active"
                              : ""
                          }`}
                          onClick={handleMenuItemClick}
                        >
                          <svg
                            className={`submenu-icon ${
                              location.pathname ===
                              "/dashboard/attendance-report"
                                ? "active"
                                : ""
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                            />
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 21C5 17.134 8.134 14 12 14C15.866 14 19 17.134 19 21"
                            />
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 19L18 21L22 17"
                            />
                          </svg>
                          <span className="submenu-text">
                            Attendance Report
                          </span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/dashboard/report-history"
                          className={`submenu-item ${
                            location.pathname === "/dashboard/report-history"
                              ? "active"
                              : ""
                          }`}
                          onClick={handleMenuItemClick}
                        >
                          <svg
                            className={`submenu-icon ${
                              location.pathname.startsWith(
                                "/dashboard/report-history"
                              )
                                ? "active"
                                : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2ZM7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8ZM12 14v-2m0 0v-2m0 4l2 2m-2-2-2 2"
                            />
                          </svg>
                          <span className="submenu-text">Report History</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/punchReport"
                          className={`submenu-item ${
                            location.pathname === "/dashboard/punchReport"
                              ? "active"
                              : ""
                          }`}
                          onClick={handleMenuItemClick}
                        >
                          <svg
                            className={`submenu-icon ${
                              location.pathname.startsWith(
                                "/dashboard/punchReport"
                              )
                                ? "active"
                                : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6l4 2M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"
                            />
                          </svg>
                          <span className="submenu-text">Punch Report</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/LateReport"
                          className={`submenu-item ${
                            location.pathname === "/dashboard/LateReport"
                              ? "active"
                              : ""
                          }`}
                          onClick={handleMenuItemClick}
                        >
                          <svg
                            className="submenu-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="submenu-text">LateReport</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <button
                    onClick={() => toggleDropdown("project")}
                    className={`sidebar-menu-item dropdown-toggle ${
                      projectDropdownOpen ||
                      location.pathname.startsWith("/dashboard/project")
                        ? "active"
                        : ""
                    }`}
                  >
                    <svg
                      className={`sidebar-icon ${
                        projectDropdownOpen ||
                        location.pathname.startsWith("/dashboard/project")
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"
                      />
                    </svg>
                    <span className="sidebar-text">Projects</span>
                    <svg
                      className={`dropdown-arrow ${
                        projectDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {projectDropdownOpen && (
                    <ul className="submenu">
                      <li>
                        <Link
                          to="/dashboard/projects"
                          className={`submenu-item ${
                            location.pathname.includes("/dashboard/projects")
                              ? "active"
                              : ""
                          }`}
                          onClick={handleMenuItemClick}
                        >
                          <span className="submenu-text">Project List</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/project-assign-list"
                          className={`submenu-item ${
                            location.pathname ===
                            "/dashboard/project-assign-list"
                              ? "active"
                              : ""
                          }`}
                          onClick={handleMenuItemClick}
                        >
                          <span className="submenu-text">Project Assign</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    to="/dashboard/leaveAccess"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/leaveAccess"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className="sidebar-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6M9 16h6M9 8h6M19 3H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
                      />
                    </svg>
                    <span className="sidebar-text">Leave Approve</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/rules_form"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/rules_form"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className="sidebar-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span className="sidebar-text">Rules Form</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/PunchCorrectionForm"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/PunchCorrectionForm"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className="sidebar-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6l3 3m6 0a9 9 0 11-9-9 9 9 0 019 9z"
                      />
                    </svg>
                    <span className="sidebar-text">Punch Correction Form</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/dashboard/dashboards"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/dashboards"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname.startsWith("/dashboard/dashboards")
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 3V21M4 21H20M20 21V3M8 17V11M12 17V7M16 17V13"
                      />
                    </svg>
                    <span className="sidebar-text">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/project-assign-list"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/project-assign-list"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/project-assign-list"
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-3-3v6m-3-6h6M5 3a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z"
                      />
                    </svg>
                    <span className="sidebar-text">Daily Task</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/employee-report"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/employee-report" ? "active" : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/employee-report" ? "active" : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                      />
                    </svg>
                    <span className="sidebar-text">Employee Report</span>
                  </Link>
                </li>
                
                <li>
                  <Link
                    to="/dashboard/id-card-report"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/id-card-report"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/id-card-report"
                          ? "active"
                          : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                    <span className="sidebar-text">ID Card Report</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/report-history"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/report-history"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/report-history"
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2ZM7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8ZM12 14v-2m0 0v-2m0 4l2 2m-2-2-2 2"
                      />
                    </svg>
                    <span className="sidebar-text">Report History</span>
                  </Link>
                </li>
                {Tl && (
                  <li>
                    <Link
                      to="/dashboard/report-historyTl"
                      className={`sidebar-menu-item ${
                        location.pathname === "/dashboard/report-historyTl"
                          ? "active"
                          : ""
                      }`}
                      onClick={handleMenuItemClick}
                    >
                      <svg
                        className={`sidebar-icon ${
                          location.pathname === "/dashboard/report-historyTl"
                            ? "active"
                            : ""
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h4v12H4zm6 6h4v6h-4zm6-12h4v18h-4z"
                        />
                      </svg>
                      <span className="sidebar-text">Team Report</span>
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    to="/dashboard/applyLeave"
                    className={`sidebar-menu-item ${
                      location.pathname === "/dashboard/applyLeave" ||
                      location.pathname === "/dashboard/leveStatus"
                        ? "active"
                        : ""
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    <svg
                      className={`sidebar-icon ${
                        location.pathname === "/dashboard/applyLeave" ||
                        location.pathname === "/dashboard/leveStatus"
                          ? "active"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 12V8m4 4V8m1-4H9a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-1z"
                      />
                    </svg>
                    <span className="sidebar-text">Apply Leave</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>

      <div className="main-content">
        <div className="content-container">
          <Routes>
            <Route path="/employee-report" element={<EmployeeReport />} />
            <Route path="/employeeTask" element={<EmployeeTask />} />
            <Route path="/employeeTaskEdit" element={<EmployeeTaskEdit />} />
            <Route path="/id-card-report" element={<IdCardReport />} />
            <Route path="/idCardReportEdit" element={<IdCardReportEdit />} />
            <Route path="/report-history/*" element={<ReportHistory />} />
            <Route path="/report-historyTl/*" element={<ReportHistoryTl />} />
            <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/dashboard" element={<EmployeeMaster />} />
            <Route path="/attendance-report" element={<AttendanceReport />} />
            <Route path="/employee-status" element={<EmployeeStatus />} />
            <Route path="/dashboards" element={<EmployeeMasters />} />
            <Route path="/addEmployee" element={<AddEmployee />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/teamReport/*" element={<TeamReport />} />
            <Route path="/applyLeave" element={<LeveStatus />} />
            <Route path="/leveStatus" element={<ApplyLeave />} />
            <Route path="/leaveAccess" element={<LeaveAccess />} />
            <Route path="/punchReport" element={<PunchReport />} />
            <Route path="/editPunch" element={<EditPunch />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/add" element={<ProjectForm />} />
            <Route path="/project-assign" element={<ProjectAssignForm />} />
            <Route path="/rules_form" element={<RulesMaster />} />
            <Route path="/LateReport" element={<LateReport />} />
            <Route path="/employeesAssets" element={<EmployeesAssets />} />
                <Route path="/EmployeeAssetForm" element={<EmployeeAssetForm />} />
                <Route path="/EmployeeAssetFormEdit/:id" element={<EmployeeAssetFormEdit />} />
            <Route
              path="/PunchCorrectionForm"
              element={<PunchCorrectionForm />}
            />
            <Route
              path="/project-assign-list"
              element={<ProjectAssignList />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
