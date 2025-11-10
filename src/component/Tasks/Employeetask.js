import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { useSelector } from "react-redux";

const AddTask = () => {
  const location = useLocation();
  const id = location.state?.id || null;
  const createdBy = location.state?.created_by || null;

  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.login);
  const employeeId = userData ? userData.employeeId : null;
  const userType = userData ? userData.userType : null;
  const [isProjectAssigned, setIsProjectAssigned] = useState(false);
  const [taskData, setTaskData] = useState({
    date: new Date(),
    project_name: "",
    task_details: "",
    task_description: "",
    sub_products: "",
    estimated_time: "",
    assigned_date: null,
    deadline_date: null,
    task_status: "",
    remarks: "",
    employee_id: localStorage.getItem("employeeId"),
    employee_name: localStorage.getItem("employeeName"),
    admin_review: "",
    team_leader_review: "",
  });
  const isAdmin = userType === "Admin";
  const isDisabled = createdBy && createdBy === "Admin" && !isAdmin;
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const today = moment().startOf("day").toDate();
  const minDate = moment(today).subtract(1, "day").toDate();
  const maxDate = moment(today).add(1, "day").toDate();

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setTaskData({ ...taskData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...taskData,
      date: moment(taskData.date).format("YYYY-MM-DD"),
      id: id ? Number(id) : undefined,
      created_by: taskData.created_by || userType,
    };

    console.log("Submitting payload:", payload);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/project_assign`,
        payload
      );
      alert(res.data.message);
      navigate("/dashboard/project-assign-list");
    } catch (err) {
      console.error("API error:", err);
      alert(err.response?.data?.error || "Something went wrong!");
    }
  };

  useEffect(() => {
    const fetchAssignedProjectTask = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/get_assigned_project`,
          {
            id: id,
            from_date: moment(taskData.date).format("YYYY-MM-DD"),
            to_date: moment(taskData.date).format("YYYY-MM-DD"),
          }
        );

        const assignedTask = res.data.data?.[0];
        if (assignedTask) {
          setTaskData((prev) => ({
            ...prev,
            project_name: assignedTask.project_name || "",
            sub_products: assignedTask.sub_products || "",
            task_details: assignedTask.task_details || "",
            task_description: assignedTask.task_description || "",
            estimated_time: assignedTask.estimated_time || "",
            assigned_date: assignedTask.assigned_date
              ? moment(assignedTask.assigned_date).format("YYYY-MM-DD HH:mm:ss")
              : null,

            deadline_date: assignedTask.deadline_date
              ? moment(assignedTask.deadline_date).format("YYYY-MM-DD HH:mm:ss")
              : null,

            task_status: assignedTask.taskStatus || "",
            reason_for_incomplete: assignedTask.reason_for_incomplete || "",
            remarks: assignedTask.remarks || "",
            created_by: assignedTask.created_by || "",
            team_leader_review: assignedTask.team_leader_review,
            admin_review: assignedTask.admin_review,
          }));
          setIsProjectAssigned(true);
        } else {
          setIsProjectAssigned(false);
        }
      } catch (err) {
        console.error("Error fetching assigned project task:", err);
      }
    };

    fetchAssignedProjectTask();
  }, [taskData.date]);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <div style={{ marginBottom: "15px" }}>
            <label>Date</label>
            <div style={{ position: "relative" }}>
              <DatePicker
                selected={taskData.date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
                placeholderText="Select Date"
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
          </div>
          <div style={{ marginBottom: "15px", marginLeft: "290px" }}>
            <label>Project Name</label>
            <input
              type="text"
              name="project_name"
              value={taskData.project_name}
              onChange={handleChange}
              disabled={isDisabled}
              style={{
                width: "450px",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Sub Products</label>
          <input
            type="text"
            name="sub_products"
            value={taskData.sub_products}
            onChange={handleChange}
            disabled={isDisabled}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Task </label>
          <textarea
            name="task_details"
            value={taskData.task_details}
            onChange={handleChange}
            // disabled={isProjectAssigned}
            disabled={isDisabled}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Task Description</label>
          <textarea
            name="task_description"
            value={taskData.task_description}
            onChange={handleChange}
            disabled={isDisabled}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "0 0 32%",
              marginRight: "10px",
              marginBottom: "15px",
            }}
          >
            <label>Estimated Time</label>
            <input
              type="text"
              name="estimated_time"
              value={taskData.estimated_time}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div
            style={{
              flex: "0 0 32%",
              marginRight: "10px",
              marginBottom: "15px",
            }}
          >
            <label>Start Time</label>
            <br />
            <input
              value={taskData.assigned_date}
              onChange={handleChange}
              name="assigned_date"
              type="datetime-local"
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="datetime"
              dateFormat="YYYY-MM-DD HH:mm:ss"
              className="custom-datepicker"
              placeholderText="Select Start Time"
            />
          </div>

          <div style={{ flex: "0 0 32%", marginBottom: "15px" }}>
            <label>End Time</label>
            <br />
            <input
              value={taskData.deadline_date}
              onChange={handleChange}
              name="deadline_date"
              type="datetime-local"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="custom-datepicker"
              placeholderText="Select End Time"
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Task Status</label>
          <select
            name="task_status"
            value={taskData.task_status}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Status</option>
            <option value="In Progress">In Progress</option>
            <option value="In Complete">In Complete</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Reason for Incomplete</label>
          <textarea
            name="reason_for_incomplete"
            value={taskData.reason_for_incomplete}
            onChange={handleChange}
            // placeholder="reason_for_incomplete"
            rows={3}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Remarks</label>
          <textarea
            name="remarks"
            value={taskData.remarks}
            onChange={handleChange}
            placeholder="Additional remarks"
            rows={3}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "10px 30px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Add Task
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/project-assign-list")}
            style={{
              padding: "10px 30px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
