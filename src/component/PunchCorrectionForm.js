import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";
import { FaPlus, FaTimes, FaCalendarAlt } from "react-icons/fa";

const PunchAttendance = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [punches, setPunches] = useState([]);
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const calendarRef = useRef(null);

    const location = useLocation();

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowFromCalendar(false);
                setShowToCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getToday = () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    const normalizeDate = (dateStr) => {
        if (!dateStr) return getToday();
        if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
    };

    // Auto-load data when employee or dates change
    useEffect(() => {
        if (selectedEmployeeId && fromDate && toDate) {
            handleFetchRange();
        }
    }, [selectedEmployeeId, fromDate, toDate]);

    useEffect(() => {
        const state = location.state;
        const params = new URLSearchParams(location.search);
        const queryDate = params.get("date");

        if (state) {
            if (state.employeeId) setSelectedEmployeeId(state.employeeId);
            if (state.fromDate) setFromDate(normalizeDate(state.fromDate));
            if (state.toDate) setToDate(normalizeDate(state.toDate));
        } else {
            const defaultDate = queryDate ? normalizeDate(queryDate) : getToday();
            setFromDate(defaultDate);
            setToDate(defaultDate);
        }
    }, [location]);

    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/employee_list/`
                );
                if (response.data.status === "Success") {
                    setEmployeeList(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching employee list:", err);
            }
        };
        fetchEmployeeList();
    }, []);

    const handleFetchRange = async () => {
        if (!selectedEmployeeId || !fromDate || !toDate) return;

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/getSinglePunch`, {
                employeeId: selectedEmployeeId,
                fromDate: normalizeDate(fromDate),
                toDate: normalizeDate(toDate),
            });

            const formatted = res.data.map((p) => {
                const logTimeIST = moment.tz(p.logTime, "Asia/Kolkata");
                return {
                    ...p,
                    isNew: false,
                    displayTime: logTimeIST.format("YYYY-MM-DDTHH:mm"),
                    createdAt: logTimeIST.format("YYYY-MM-DD"),
                    refTime: logTimeIST.format("HH:mm:ss"),
                };
            });

            setPunches(formatted);
        } catch (err) {
            console.error("Error fetching punches:", err);
            setPunches([]);
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...punches];
        updated[index][field] = value;

        if (field === "displayTime") {
            const logTimeIST = moment.tz(value, "Asia/Kolkata");
            updated[index].refTime = logTimeIST.format("HH:mm:ss");
            updated[index].createdAt = logTimeIST.format("YYYY-MM-DD");
        }

        setPunches(updated);
    };

    const handleAddRow = () => {
        if (!selectedEmployeeId) {
            alert("Please select an employee first");
            return;
        }

        const nowIST = moment().tz("Asia/Kolkata");
        const nowStr = nowIST.format("YYYY-MM-DDTHH:mm");
        const createdDate = nowIST.format("YYYY-MM-DD");

        setPunches([
            ...punches,
            {
                id: null,
                employeeId: selectedEmployeeId,
                displayTime: nowStr,
                logType: "In",
                place1: "",
                device: "Manual",
                isNew: true, // Mark new records
                createdAt: createdDate,
                refTime: nowIST.format("HH:mm:ss"),
            },
        ]);
    };

    const handleRemoveRow = (index) => {
        const updated = [...punches];
        updated.splice(index, 1);
        setPunches(updated);
    };

    const handleSubmitAll = async () => {
        if (punches.length === 0) {
            alert("No punch records to save");
            return;
        }

        try {
            const payload = punches.map((p) => ({
                id: p.id,
                employeeId: p.employeeId,
                logType: p.logType,
                place1: p.place1,
                device: p.device,
                refTime: p.refTime,
                createdAt: p.createdAt
            }));

            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/updateOrInsertPunches`, {
                updates: payload,
            });

            if (data.status === "Success") {
                alert(data.message || "Punches saved successfully");
                handleFetchRange();
            } else {
                alert(data.message || "Error saving punches");
            }
        } catch (err) {
            console.error("Error saving punches:", err);
            alert(err.response?.data?.message || "Submission failed");
        }
    };

    // Group punches by date
    const groupedPunches = punches.reduce((acc, punch) => {
        const dateKey = punch.createdAt;
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(punch);
        return acc;
    }, {});

    // Sort dates in descending order
    const sortedDates = Object.keys(groupedPunches).sort((a, b) => 
        moment(b).diff(moment(a))
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Punch Attendance System</h2>

            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={selectedEmployeeId}
                    onChange={(e) => {
                        setSelectedEmployeeId(e.target.value);
                        setPunches([]);
                    }}
                    className="border px-2 py-1 rounded"
                >
                    <option value="">Select Employee</option>
                    {employeeList.map((emp) => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                            {emp.employeeName}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={fromDate.includes('/') ? 
                        moment(fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : 
                        fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border px-2 py-1 rounded"
                />

                <input
                    type="date"
                    value={toDate.includes('/') ? 
                        moment(toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : 
                        toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border px-2 py-1 rounded"
                />

                {/* <button
                    onClick={handleFetchRange}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                    Search
                </button> */}

                <button
                    onClick={handleAddRow}
                    disabled={!selectedEmployeeId}
                    className={`flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded ${
                        !selectedEmployeeId ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <FaPlus /> Add Punch
                </button>
            </div>

            {sortedDates.length > 0 ? (
                sortedDates.map((date) => (
                    <div key={date} className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                                {moment(date).format("DD MMM YYYY")}
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-3 py-2">Time</th>
                                        <th className="border px-3 py-2">Type</th>
                                        <th className="border px-3 py-2">Location</th>
                                        <th className="border px-3 py-2">Device</th>
                                        <th className="border px-3 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedPunches[date].map((p, idx) => {
                                        const globalIndex = punches.findIndex(item => item === p);
                                        return (
                                            <tr key={idx}>
                                                <td className="border px-3 py-2">
                                                    <input
                                                        type="datetime-local"
                                                        value={p.displayTime}
                                                        onChange={(e) => handleChange(
                                                            globalIndex,
                                                            "displayTime",
                                                            e.target.value
                                                        )}
                                                        className="border px-2 py-1 rounded w-full"
                                                    />
                                                </td>
                                                <td className="border px-3 py-2">
                                                    <select
                                                        value={p.logType}
                                                        onChange={(e) => handleChange(
                                                            globalIndex,
                                                            "logType",
                                                            e.target.value
                                                        )}
                                                        className="border px-2 py-1 rounded w-full"
                                                    >
                                                        <option value="In">In</option>
                                                        <option value="Out">Out</option>
                                                    </select>
                                                </td>
                                                <td className="border px-3 py-2">
                                                    <input
                                                        type="text"
                                                        value={p.place1 || ""}
                                                        onChange={(e) => handleChange(
                                                            globalIndex,
                                                            "place1",
                                                            e.target.value
                                                        )}
                                                        className="border px-2 py-1 rounded w-full"
                                                        placeholder="Enter location"
                                                    />
                                                </td>
                                                <td className="border px-3 py-2">
                                                    <input
                                                        type="text"
                                                        value={p.device || ""}
                                                        onChange={(e) => handleChange(
                                                            globalIndex,
                                                            "device",
                                                            e.target.value
                                                        )}
                                                        className="border px-2 py-1 rounded w-full"
                                                        placeholder="Enter device"
                                                    />
                                                </td>
                                                <td className="border px-3 py-2 text-center">
                                                    {/* Only show cancel button for new records */}
                                                    {p.isNew && (
                                                        <button
                                                            onClick={() => handleRemoveRow(globalIndex)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Cancel"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500">
                    {selectedEmployeeId ? "No punch records found" : "Please select an employee"}
                </div>
            )}

            {punches.length > 0 && (
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSubmitAll}
                        className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
                    >
                        Save All Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default PunchAttendance;