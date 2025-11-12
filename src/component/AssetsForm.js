import moment from "moment";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeAssetForm = () => {
    const nav = useNavigate();
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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/getAllEmployees`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data.data);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);
  useEffect(() => {
    console.log("employees updated:", employees);
  }, [employees]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };





   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/addAsset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Response:", data);
        alert(`✅ Successfully assigned asset to employee`);
        setFormData({
          employeeId: "",
          assetName: "",
          assetType: "",
          serialNumber: "",
          qty: "",
          remarks: "",
          issueDate: "",
          returnDate: "",
        });
        nav("/dashboard/employeesAssets");
      } else {
        alert(`❌ Error: ${data.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("❌ Server error. Check console for details.");
    }
  };


  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-10 m-8 ">
      <h2 className="text-2xl font-semibold mb-12 text-gray-800 text-center">
        Assign Asset to Employee
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
          {/* Employee Select */}
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
              <option value="" required>-- Select Employee --</option>
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

          {/* Model */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Model
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
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Issue Date
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Remarks (full width on desktop) */}
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

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAssetForm;
