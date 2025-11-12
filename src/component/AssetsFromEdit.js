import React, { useState, useEffect } from "react";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeAssetFormEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    assetName: "",
    assetType: "",
    serialNumber: "",
    qty: "",
    remarks: "",
    issueDate: "",
    returnDate: "",
  });

  // ✅ Fetch specific asset
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getAsset/${id}`);
        const data = await res.json();
        if (data?.data?.[0]) {
          setFormData(data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching asset:", err);
      }
    };
    fetchAsset();
  }, [id]);

  // ✅ Fetch employee list
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getAllEmployees`);
        const data = await res.json();
        setEmployees(data.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit (with MySQL-safe date formatting)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      issueDate: formData.issueDate
        ? moment(formData.issueDate).format("YYYY-MM-DD HH:mm:ss")
        : null,
      returnDate: formData.returnDate
        ? moment(formData.returnDate).format("YYYY-MM-DD HH:mm:ss")
        : null,
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/updateAsset/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Asset updated successfully!");
        navigate("/dashboard/employeesAssets");
      } else {
        alert(`❌ Error: ${data.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("❌ Server error. Check console for details.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-10 m-8">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
        Edit Employee Asset
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
          {/* Employee */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Select Employee
            </label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employeeId}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Asset Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Asset Name
            </label>
            <input
              type="text"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Asset Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Asset Type
            </label>
            <input
              type="text"
              name="assetType"
              value={formData.assetType}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Serial Number
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              name="qty"
              min="1"
              value={formData.qty}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Issue Date
            </label>
            <input
              type="date"
              name="issueDate"
              value={
                formData.issueDate
                  ? moment(formData.issueDate).format("YYYY-MM-DD")
                  : ""
              }
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Return Date
            </label>
            <input
              type="date"
              name="returnDate"
              value={
                formData.returnDate
                  ? moment(formData.returnDate).format("YYYY-MM-DD")
                  : ""
              }
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Remarks */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAssetFormEdit;
