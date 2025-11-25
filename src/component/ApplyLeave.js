import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ApplyLeave.css";
import { useNavigate } from "react-router-dom";

const ApplyLeave = () => {
  const initialFormState = {
    leaveTypes: "",
    leaveTimes: "",
    leaveTimingCategory: "0",
    startDate: "",
    endDate: "",
    reason: "",
    Employee_id: localStorage.getItem("employeeId"),
    userName: localStorage.getItem("employeeName"),
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Track success or error
  const [casualLeaveUsed, setCasualLeaveUsed] = useState(false); // Track if casual leave has been used
  const [saturdayOffUsed, setSaturdayOffUsed] = useState(false); // Track if Saturday Off has been used
  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
  });
  const leaveTypeOptions = [
    "Casual Leave",
    "Work From Home",
    "Maternity Leave",
    "Permission",
    // "Saturday Off",
    "Loss of Pay Leave",
  ];

  const fullDayOptions = ["Full day", "Half day"];
  const permissionOptions = ["1 hour", "2 hours"];

  const permissionTimingOptions = [
    { id: 1, label: "Morning (10:00AM - 11:00AM)" },
    { id: 2, label: "Evening (6:00PM - 7:00PM)" },
    { id: 3, label: "In Middle (1 hour)" },
    { id: 4, label: "Morning (10:00AM - 12:00AM)" },
    { id: 5, label: "Evening (5:00PM - 7:00PM)" },
    { id: 6, label: "In Middle (2 hours)" },
  ];

  const halfDayTimingOptions = [
    { id: 7, label: "Morning (10:00AM - 2:00AM)" },
    { id: 8, label: "Afternoon (3:00PM - 7:00PM)" },
  ];

  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    const userName = localStorage.getItem("userName");

    if (employeeId && userName) {
      setFormData((prevData) => ({
        ...prevData,
        Employee_id: employeeId,
        userName: userName,
      }));
    }
  }, []);

  const isSaturday = (date) => {
    const selectedDate = new Date(date);
    return selectedDate.getDay() === 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const today = new Date().toISOString().split("T")[0];
    const oneDayLeaves = ["Saturday Off", "Casual Leave", "Permission"];

    let updatedForm = { ...formData, [name]: value };
    console.log(updatedForm);
    let updatedErrors = { ...errors };

    // Check if selected start date is Saturday
    if (name === "startDate") {
      const selectedDay = new Date(value).getDay(); // 6 = Saturday
      if (selectedDay === 6) {
        updatedForm.leaveTypes = "Saturday Off";
        updatedForm.endDate = value; // one-day leave
      }
    }

    // Past date check
    if ((name === "startDate" || name === "endDate") && value < today) {
      updatedErrors[name] = " You cannot select a past date.";
    } else {
      updatedErrors[name] = "";
    }

    // End date before start date
    if (
      name === "endDate" &&
      updatedForm.startDate &&
      value < updatedForm.startDate
    ) {
      updatedErrors.endDate = " End Date cannot be before Start Date.";
    }

    if (name === "leaveTimes" && value === "Half day") {
      updatedForm.leaveTimingCategory = "7";
    }
    if (name === "leaveTypes" && value === "Permission") {
      updatedForm.leaveTimes = "1 hour";
      updatedForm.leaveTimingCategory = "1";
    }
    if (name === "leaveTypes" && value !== "Permission") {
      updatedForm.leaveTimes = "Full day";
      updatedForm.leaveTimingCategory = "0";
    }
    if (name === "leaveTimes" && value === "2 hours") {
      updatedForm.leaveTimingCategory = "4";
    }
    // Auto-update end date for one-day leaves
    if (
      (name === "leaveTypes" && oneDayLeaves.includes(value)) ||
      (name === "startDate" && oneDayLeaves.includes(formData.leaveTypes))
    ) {
      updatedForm.endDate = updatedForm.startDate || value;
      updatedErrors.endDate = ""; // Clear error
    }

    setErrors(updatedErrors);
    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/applyLeave`,
        formData
      );
      const { status, message } = response.data;

      if (status === "Success") {
        setMessage(message);
        setMessageType("success");

        // Send notification (optional but included)
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/notifications`, {
            message: `Leave applied by ${formData.userName} (ID: ${formData.Employee_id}) for ${formData.leaveTypes} from ${formData.startDate} to ${formData.endDate}. Reason: ${formData.reason}`,
            read: false,
          });
        } catch (notificationError) {
          console.warn(
            "Notification failed but leave applied:",
            notificationError
          );
        }
        // Redirect after short delay (optional for UX)
        setTimeout(() => {
          alert("Leave applied successfully!");
          navigate("/dashboard/applyLeave");
        }, 1000);
      } else if (status === "Error") {
        setMessage(message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Leave application failed due to server error."
      );
      setMessageType("error");
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setMessage("");
    setMessageType("");
    navigate("/dashboard/applyLeave");
  };

  return (
    <div className="apply-leave-container bg-gray-200 rounded-md">
      <div className="apply-leave-card">
        <h2 className="text-sm font-bold text-center text-black mb-16">
          - - Apply for Leave - -
        </h2>

        {message && (
          <div
            className={`apply-leave-alert ${
              messageType === "success"
                ? "apply-leave-alert-success"
                : "apply-leave-alert-error"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="apply-leave-form">
          <div className="row">
            <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="apply-leave-input"
                required
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.startDate && (
                <div
                  className="error-text"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errors.startDate}
                </div>
              )}
            </div>
            <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="apply-leave-input"
                required
                // 👇 Logic: disable if certain leave types or if startDate not chosen
                disabled={
                  formData.leaveTypes === "Saturday Off" ||
                  formData.leaveTypes === "Casual Leave" ||
                  formData.leaveTypes === "Permission" ||
                  !formData.startDate
                }
                // 👇 Logic: don't allow picking before start date
                min={
                  formData.startDate
                    ? new Date(formData.startDate).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
              />
              {formData.endDate && formData.endDate < formData.startDate && (
                <div
                  className="error-text"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  End Date cannot be before Start Date.
                </div>
              )}
              {errors.endDate && (
                <div
                  className="error-text"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errors.endDate}
                </div>
              )}
            </div>{" "}
            <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">Leave Types</label>
              <select
                name="leaveTypes"
                value={formData.leaveTypes}
                onChange={handleChange}
                className="apply-leave-select"
                required
              >
                <option value="" disabled>
                  Select Leave Type
                </option>
                {leaveTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
                {/* {formData.startDate &&
                  isSaturday(formData.startDate) &&
                  !saturdayOffUsed && (
                    <option value="Saturday Off">Saturday Off</option>
                  )} */}
              </select>
            </div>
            <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">Leave Time</label>
              {formData.leaveTypes === "Permission" ? (
                <select
                  name="leaveTimes"
                  value={formData.leaveTimes}
                  onChange={handleChange}
                  className="apply-leave-select"
                  required
                >
                  <option value="" disabled>
                    Select Permission Time
                  </option>
                  {permissionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  name="leaveTimes"
                  value={formData.leaveTimes}
                  onChange={handleChange}
                  className="apply-leave-select"
                  required
                >
                  <option value="" disabled>
                    Select Leave Time
                  </option>
                  {fullDayOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {formData.leaveTimes === "Half day" && (
              <div className="col-md-6 apply-leave-form-group">
                <label className="apply-leave-label">Choose Timings</label>
                <select
                  name="leaveTimingCategory"
                  value={formData.leaveTimingCategory}
                  onChange={handleChange}
                  className="apply-leave-select"
                  required
                >
                  <option value="" disabled>
                    Halfday Timings
                  </option>
                  {halfDayTimingOptions.slice(0, 2).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {formData.leaveTypes === "Permission" && (
              <div className="col-md-6 apply-leave-form-group">
                <label className="apply-leave-label">Choose Timings</label>
                {formData.leaveTimes === "1 hour" ? (
                  <select
                    name="leaveTimingCategory"
                    value={formData.leaveTimingCategory}
                    onChange={handleChange}
                    className="apply-leave-select"
                    required
                  >
                    <option value="" disabled>
                      Select leave Time
                    </option>
                    {permissionTimingOptions.slice(0, 3).map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    name="leaveTimingCategory"
                    value={formData.leaveTimingCategory}
                    onChange={handleChange}
                    className="apply-leave-select"
                    required
                  >
                    <option value="" disabled>
                      Select Leave Time
                    </option>
                    {permissionTimingOptions.slice(3, 6).map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
          {formData.leaveTypes !== "Saturday Off" && (
            <div className="apply-leave-form-group">
              <textarea
                name="reason"
                placeholder="Reason for Leave"
                value={formData.reason}
                onChange={handleChange}
                className="apply-leave-input"
                rows={5}
                required
              />
            </div>
          )}

          <div className="apply-leave-buttons">
            <button type="submit" className="apply-leave-btn">
              Apply Leave
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="apply-leave-btn apply-leave-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
