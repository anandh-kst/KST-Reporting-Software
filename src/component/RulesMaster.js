import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RulesForm.css";
import moment from "moment";

const RulesForm = () => {
  const emptyForm = {
    officeStartTime: "",
    officeEndTime: "",
    workingHoursPerDay: "",
    graceTimeLate: "",
    considerFirstLastPunch: false,
    calculateHalfDayMins: "",
    calculateHalfDayOption: "",
    calculateAbsentMins: "",
    calculateAbsentOption: "",
    deductBreakFromWork: false,
    absentWhenLateForDays: "",
    absentLateOption: "",
    weeklyOffPrefixAbsent: false,
    weeklyOffSuffixAbsent: false,
    weeklyOffBothAbsent: false,
    totalPermissionHoursPerMonth: "",
    noOfPermissionsPerMonth: "",
    breakHoursPerDay: "",
    casualOrPaidLeavePerMonth: "",
    saturdayOffPerMonth: "",
    dailyTaskSubmitMins: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [rulesList, setRulesList] = useState([]);
  const [mode, setMode] = useState("add");
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/get_all_save_rules`);
      setRulesList(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        mode === "edit"
          ? `${API_URL}/update_rule/${selectedRuleId}`
          : `${API_URL}/post_save_rules`;

      const response = await axios.post(endpoint, formData);
      if (response.status === 200) {
        alert(`Rule ${mode === "edit" ? "updated" : "created"} successfully!`);
        fetchRules();
        handleReset();
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save rule.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule) => {
    setFormData(rule);
    setSelectedRuleId(rule.id);
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this rule?")) return;
    try {
      await axios.post(`${API_URL}/delete_rule/${id}`);
      fetchRules();
    } catch (err) {
      console.error(err);
      setError("Failed to delete rule.");
    }
  };

  const handleReset = () => {
    setFormData(emptyForm);
    setMode("add");
    setSelectedRuleId(null);
  };

  const dropdownOptions = (
    <>
      <option value="">Select Type</option>
      <option value="halfday">Half Day LOP</option>
      <option value="fullday">Full Day LOP</option>
    </>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto ">
      <h2 className="text-3xl font-bold mb-6">Rules Master</h2>

      {/* ---------- RULES TABLE ---------- */}
      <h3 className="text-2xl mt-12 mb-4 font-semibold">Saved Rules</h3>
      <div className="w-full overflow-auto">
        <table className="w-full bg-white rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Start Time</th>
              <th className="p-3">End Time</th>
              <th className="p-3">Created Date</th>
              <th className="p-3">Valid From</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rulesList.map((rule) => (
              <tr key={rule.id} className="border-b">
                <td className="p-3">{rule.id}</td>
                <td className="p-3">{rule.officeStartTime}</td>
                <td className="p-3">{rule.officeEndTime}</td>
                <td className="p-3">
                  {moment(rule.createdAt).format("YYYY-MM-DD")}
                </td>
                <td className="p-3">
                  {moment(rule.validFrom).format("YYYY-MM-DD")}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ---------- FORM ---------- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-6"
      >
        <section className="grid gap-6 md:grid-cols-2">
          {/* Office Timings */}
          <div>
            <label>Morning Punch should be on or before</label>
            <input
              type="time"
              name="officeStartTime"
              value={formData.officeStartTime}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label>Evening Punch should be on or after</label>
            <input
              type="time"
              name="officeEndTime"
              value={formData.officeEndTime}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Rest of the input fields */}
          <div>
            <label>Total Working Hours per Day</label>
            <input
              type="number"
              name="workingHoursPerDay"
              value={formData.workingHoursPerDay}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label>Grace Time allowed for Late coming</label>
            <input
              type="number"
              name="graceTimeLate"
              value={formData.graceTimeLate}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label>Consider leave when late for more than</label>
            <div className="flex gap-3">
              <input
                type="number"
                name="absentWhenLateForDays"
                value={formData.absentWhenLateForDays}
                onChange={handleChange}
                className="input"
              />
              <select
                name="absentLateOption"
                value={formData.absentLateOption}
                onChange={handleChange}
                className="input"
              >
                {dropdownOptions}
              </select>
            </div>
          </div>

          <div>
            <label>Consider Half Day if total work is (mins)</label>
            <input
              type="number"
              name="calculateHalfDayMins"
              value={formData.calculateHalfDayMins}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label>Consider Leave if worked less than (mins)</label>
            <div className="flex gap-3">
              <input
                type="number"
                name="calculateAbsentMins"
                value={formData.calculateAbsentMins}
                onChange={handleChange}
                className="input"
              />
              <select
                name="calculateAbsentOption"
                value={formData.calculateAbsentOption}
                onChange={handleChange}
                className="input"
              >
                {dropdownOptions}
              </select>
            </div>
          </div>

          <div>
            <label>Total Permission Hours / Month</label>
            <input
              type="number"
              name="totalPermissionHoursPerMonth"
              value={formData.totalPermissionHoursPerMonth}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label>No. of Permissions / Month</label>
            <input
              type="number"
              name="noOfPermissionsPerMonth"
              value={formData.noOfPermissionsPerMonth}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label>Break Hours / Day</label>
            <input
              type="number"
              name="breakHoursPerDay"
              value={formData.breakHoursPerDay}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label>Casual Leave / Month</label>
            <input
              type="number"
              name="casualOrPaidLeavePerMonth"
              value={formData.casualOrPaidLeavePerMonth}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label>Saturday Off / Month</label>
            <input
              type="number"
              name="saturdayOffPerMonth"
              value={formData.saturdayOffPerMonth}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label>Daily Task Submit (after punch-in in mins)</label>
            <input
              type="number"
              name="dailyTaskSubmitMins"
              value={formData.dailyTaskSubmitMins}
              onChange={handleChange}
              className="input"
            />
          </div>
        </section>

        {/* Checkboxes */}
        <div className="grid md:grid-cols-2 gap-4">
          <label>
            <input
              type="checkbox"
              name="considerFirstLastPunch"
              checked={formData.considerFirstLastPunch}
              onChange={handleChange}
            />{" "}
            Consider 1st & Last Punch
          </label>
          <label>
            <input
              type="checkbox"
              name="deductBreakFromWork"
              checked={formData.deductBreakFromWork}
              onChange={handleChange}
            />{" "}
            Deduct Break from Work
          </label>
        </div>

        <div>
          <label>Mark Weekly Off & Holidays as Absent if:</label>
          <div className="flex flex-col gap-2">
            <label>
              <input
                type="checkbox"
                name="weeklyOffPrefixAbsent"
                checked={formData.weeklyOffPrefixAbsent}
                onChange={handleChange}
              />{" "}
              Prefix Day Absent
            </label>
            <label>
              <input
                type="checkbox"
                name="weeklyOffSuffixAbsent"
                checked={formData.weeklyOffSuffixAbsent}
                onChange={handleChange}
              />{" "}
              Suffix Day Absent
            </label>
            <label>
              <input
                type="checkbox"
                name="weeklyOffBothAbsent"
                checked={formData.weeklyOffBothAbsent}
                onChange={handleChange}
              />{" "}
              Both Prefix & Suffix Absent
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 text-center">
          <button type="submit" className="button-primary">
            {mode === "edit" ? "Update Rule" : "Save Rule"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="ml-4 button-secondary"
          >
            Reset
          </button>
        </div>
      </form>

      {loading && <p className="mt-4 text-center">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default RulesForm;
