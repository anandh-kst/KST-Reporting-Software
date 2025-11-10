import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";

const PunchAttendance = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [punches, setPunches] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);

    const location = useLocation();

    const getToday = () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    // Function to normalize date format to YYYY-MM-DD
    const normalizeDate = (dateStr) => {
        if (!dateStr) return getToday();
        
        // If date is in DD/MM/YYYY format
        if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        // If date is already in YYYY-MM-DD format
        return dateStr;
    };

    useEffect(() => {
        const state = location.state;
        const params = new URLSearchParams(location.search);
        const queryDate = params.get("date");

        if (state) {
            console.log("Received location.state:", state);
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

    useEffect(() => {
        // Auto-fetch punch data when component mounts with initial state
        if (initialLoad && selectedEmployeeId && fromDate && toDate) {
            handleFetchRange();
            setInitialLoad(false);
        }
    }, [selectedEmployeeId, fromDate, toDate, initialLoad]);

    const handleFetchRange = async () => {
        if (!selectedEmployeeId || !fromDate || !toDate) {
            return alert("Please select employee, from-date and to-date");
        }

        try {
            // Ensure dates are in correct format before sending
            const formattedFromDate = normalizeDate(fromDate);
            const formattedToDate = normalizeDate(toDate);

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/getSinglePunch`, {
                employeeId: selectedEmployeeId,
                fromDate: formattedFromDate,
                toDate: formattedToDate,
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
            alert("No punch records found");
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...punches];
        updated[index][field] = value;

        // When logTime changes, update refTime and createdAt accordingly
        if (field === "displayTime") {
            const logTimeIST = moment.tz(value, "Asia/Kolkata");
            updated[index].refTime = logTimeIST.format("HH:mm:ss");
            updated[index].createdAt = logTimeIST.format("YYYY-MM-DD");
        }

        setPunches(updated);
    };

    const handleAddRow = () => {
        const nowIST = moment().tz("Asia/Kolkata");
        const nowStr = nowIST.format("YYYY-MM-DDTHH:mm");
        const createdDate = nowIST.format("YYYY-MM-DD");

        setPunches([
            ...punches,
            {
                id: null,
                employeeId: selectedEmployeeId,
                displayTime: nowStr,
                logType: "",
                place1: "",
                device: "Manual",
                isNew: true,
                createdAt: createdDate,
                refTime: nowIST.format("HH:mm:ss"),
            },
        ]);
    };

    const handleSubmitAll = async () => {
        try {
            const payload = punches.map((p) => {
                return {
                    id: p.id,
                    employeeId: p.employeeId,
                    logType: p.logType,
                    place1: p.place1,
                    device: p.device,
                    refTime: p.refTime,
                    createdAt: p.createdAt
                };
            });

            await axios.post(`${process.env.REACT_APP_API_URL}/updateOrInsertPunches`, {
                updates: payload,
            });
            alert("Updated successfully");
            handleFetchRange();
        } catch (err) {
            console.error("Error saving punches:", err);
            alert("Submission failed: " + err.message);
        }
    };

    const groupedData = punches.reduce((acc, punch) => {
        const dateKey = punch.createdAt;
        const key = `${punch.employeeId}-${dateKey}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(punch);
        return acc;
    }, {});

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Punch Attendance System</h2>

            <div className="flex gap-4 mb-4">
                <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
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
                    onChange={(e) => {
                        const newDate = e.target.value;
                        setFromDate(newDate);
                    }}
                    className="border px-2 py-1 rounded"
                />

                <input
                    type="date"
                    value={toDate.includes('/') ? 
                        moment(toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : 
                        toDate}
                    onChange={(e) => {
                        const newDate = e.target.value;
                        setToDate(newDate);
                    }}
                    className="border px-2 py-1 rounded"
                />

                <button
                    onClick={handleFetchRange}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                    Search
                </button>
            </div>

            {Object.entries(groupedData).map(([groupKey, punchList]) => (
                <div key={groupKey} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{groupKey}</h3>
                    <table className="table-auto w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-3 py-2">Log Time</th>
                                <th className="border px-3 py-2">Log Type</th>
                                <th className="border px-3 py-2">Place</th>
                                <th className="border px-3 py-2">Device</th>
                            </tr>
                        </thead>
                        <tbody>
                            {punchList.map((p, idx) => (
                                <tr key={idx}>
                                    <td className="border px-3 py-2">
                                        <input
                                            type="datetime-local"
                                            value={p.displayTime}
                                            onChange={(e) => handleChange(idx, "displayTime", e.target.value)}
                                            className="border px-2 py-1 rounded"
                                        />
                                    </td>
                                    <td className="border px-3 py-2">
                                        <select
                                            value={p.logType}
                                            onChange={(e) => handleChange(idx, "logType", e.target.value)}
                                            className="border px-2 py-1 rounded"
                                        >
                                            <option value="">Select</option>
                                            <option value="In">In</option>
                                            <option value="Out">Out</option>
                                        </select>
                                    </td>
                                    <td className="border px-3 py-2">
                                        <input
                                            type="text"
                                            value={p.place1 || ""}
                                            onChange={(e) => handleChange(idx, "place1", e.target.value)}
                                            className="border px-2 py-1 rounded"
                                        />
                                    </td>
                                    <td className="border px-3 py-2">
                                        <input
                                            type="text"
                                            value={p.device || ""}
                                            onChange={(e) => handleChange(idx, "device", e.target.value)}
                                            className="border px-2 py-1 rounded"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}

            <div className="flex gap-4 mt-4">
                <button
                    onClick={handleAddRow}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Add Row
                </button>
                <button
                    onClick={handleSubmitAll}
                    className="bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Submit All
                </button>
            </div>
        </div>
    );
};

export default PunchAttendance;