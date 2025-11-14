

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeaveApplications = () => {
  const now = new Date();

  const pad = (n) => n.toString().padStart(2, "0");

  // First day of the month (local time)
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfMonth = `${first.getFullYear()}-${pad(
    first.getMonth() + 1
  )}-${pad(first.getDate())}`;

  // Last day of the month (local time)
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const lastDayOfMonth = `${last.getFullYear()}-${pad(
    last.getMonth() + 1
  )}-${pad(last.getDate())}`;

  console.log("firstDayOfMonth", firstDayOfMonth);
  console.log("lastDayOfMonth", lastDayOfMonth);

  const navigate = useNavigate();
  const styles = {
    mainContainer: {
      width: "80%",
      margin: "40px auto",
      padding: "40px",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "30px",
      textAlign: "center",
    },
    filterContainer: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: "20px",
      flexWrap: "wrap",
      gap: "10px",
    },
    select: {
      padding: "10px",
      paddingRight: "35px", // space for arrow
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "16px",
      cursor: "pointer",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      backgroundColor: "#fff",
      backgroundImage: `url("data:image/svg+xml,%3Csvg fill='none' stroke='%23666' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
      backgroundSize: "16px",
    },

    dropdownContainer: {
      width: "100%", // or fixed like "220px"
      position: "relative",
    },
    dateRangeContainer: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "48%",
    },
    filterbtn: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "end",
      width: "20%",
      margin: "10px",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "16px",
      outline: "none",
    },
    applicationCard: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "14px",
      marginBottom: "20px",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    applicationHeader: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "10px",
    },
    applicationStatus: (status) => ({
      fontSize: "14px",
      fontWeight: "bold",
      color:
        status === "Accepted"
          ? "green"
          : status === "Rejected"
          ? "red"
          : "orange",
    }),
    leaveType: {
      fontSize: "16px",
    },
    dateText: {
      fontSize: "16px",
      color: "#555",
    },
    leaveDetails: {
      fontSize: "15px",
      marginTop: "8px",
      color: "#666",
    },
    reason: {
      fontStyle: "bold",
      marginTop: "8px",
      marginBottom: "8px",
      fontSize: "14px",
    },
    deleteButton: {
      marginTop: "10px",
      padding: "8px 16px",
      backgroundColor: "#dc3545",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
    loading: {
      textAlign: "center",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#007BFF",
    },
    scrollableContent: {
      maxHeight: "80vh",
      overflowY: "auto",
      padding: "10px",
    },
    tableHeader: {
      fontWeight: "bold",
      borderBottom: "2px solid #ddd",
      paddingBottom: "10px",
      marginBottom: "15px",
      width: "100%",
      textAlign: "center",
    },
  };

  const [leaveApplications, setLeaveApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  // const [formData, setFormData] = useState({
  //   startDate: today,
  //   endDate: today,
  // });
  const [formData, setFormData] = useState({
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth,
  });

  const employeeId = localStorage.getItem("employeeId") || "A";

  const fetchLeaveApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/getLeaveApplications`,
        {
          Employee_id: employeeId,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }
      );
      // const data = response.data.data || [];
      // setLeaveApplications(data);
      // setFilteredApplications(data);
      const data = (response.data.data || []).sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      setLeaveApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  const handleFilterChange = (status, leaveType) => {
    setFilteredApplications(
      leaveApplications.filter((app) => {
        const matchStatus = status === "All" || app.status === status;
        const matchType = leaveType === "All" || app.leaveTypes === leaveType;
        return matchStatus && matchType;
      })
    );
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    handleFilterChange(status, leaveTypeFilter);
  };

  const handleLeaveTypeChange = (e) => {
    const type = e.target.value;
    setLeaveTypeFilter(type);
    handleFilterChange(statusFilter, type);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    fetchLeaveApplications();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmed) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteLeaveApplication`,
        { id }
      );
      fetchLeaveApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const leaveTypes = [
    "All",
    "Casual Leave",
    "LossofPay Leave",
    "Saturday Off",
    "Work From Home",
    "Permission",
    "Maternity Leave",
  ];

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div className="p-6 bg-gray-200 rounded-md">
      <h1 className="text-2xl font-bold text-center text-black mb-6">
        Leave Status
      </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/dashboard/leveStatus")}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Apply Leave
        </button>
      </div>

      <form
        onSubmit={handleDateSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
      >
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold">Status</label>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="border rounded-md px-3 py-2"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold">Leave Types</label>
          <select
            value={leaveTypeFilter}
            onChange={handleLeaveTypeChange}
            className="border rounded-md px-3 py-2"
          >
            {leaveTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 w-full"
          >
            Filter
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-5"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-semibold text-gray-800">
                  {application.leaveTypes}
                </span>
                <span
                  className={`text-sm font-bold px-2 py-1 rounded ${
                    application.status === "Accepted"
                      ? "text-green-700 bg-green-100"
                      : application.status === "Rejected"
                      ? "text-red-700 bg-red-100"
                      : "text-yellow-700 bg-yellow-100"
                  }`}
                >
                  [{application.status.toUpperCase()}]
                </span>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>From:</strong> {formatDate(application.startDate)}
                </p>
                <p>
                  <strong>To:</strong> {formatDate(application.endDate)}
                </p>
                <p>
                  <strong>Leave Time:</strong> {application.leaveTimes}
                </p>
                <p>
                  <strong>No. of Days:</strong> {application.noOfDays}
                </p>
                <p>
                  <strong>Reason:</strong> {application.reason}
                </p>
                {application.rejectReason && (
                  <p>
                    <strong>Remarks:</strong> {application.rejectReason}
                  </p>
                )}
              </div>

              {application.status === "Pending" && (
                <div className="mt-3">
                  <button
                    onClick={() => handleDelete(application.lid)}
                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No leave applications found
          </p>
        )}
      </div>
    </div>
  );
};

export default LeaveApplications;
