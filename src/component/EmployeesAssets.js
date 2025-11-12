import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisV,faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";


const EmployeesAssets = () => {
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [menuOpen, setMenuOpen] = useState();
  const nav=useNavigate()

  const getAssets = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/getAssets`);
      res = res.data;
      console.log(res.data);
      setAssets(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getEmployees = async () => {
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API_URL}/getAllEmployees`
      );
      res = res.data;
      console.log(res.data);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // utils.js or same component file
  const getProfileImage = (employees, empId, apiUrl) => {
    const empData = employees.find(
      (e) => String(e.employeeId) === String(empId)
    );
    const profileUrl = empData?.profileUrl;

    if (!profileUrl) return "/default-user.png"; // fallback for missing photo

    // If already a full URL, return as is
    if (profileUrl.startsWith("http://") || profileUrl.startsWith("https://")) {
      return profileUrl;
    }

    // Otherwise, assume it’s from multer uploads folder
    return `${apiUrl}/uploads/Images/${profileUrl}`;
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Do you want to delete?")) {
      try {
        const result = await axios.delete(
          `${process.env.REACT_APP_API_URL}/deleteAsset/${id}`
        );
        if (result.data.status === "Success") {
          alert("Deleted Successfully");
          getAssets();
        } else {
          alert("Something went wrong");
        }
      } catch (err) {
        alert(err);
        console.log(err);
      }
    }
  };

  const handleReturned = async (id) => {
    if (window.confirm("Are they returned ?")) {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/updateAsset/${id}`,
          {
            returnDate: moment().format("YYYY-MM-DD"),
          }
        );
        if (res.data.status === "Success") {
          alert("Returned Successfully");
          getAssets();
        }
      } catch (err) {
        alert("Something went wrong");
        console.log(err);
      }
    }
  };
  useEffect(() => {
    getAssets();
    getEmployees();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="space-y-6">
        {assets.map((emp) => (
          <div
            key={emp[0]}
            className={`bg-white rounded-xl shadow-md p-4 md:p-6`}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-x-4">
                <img
                  src={getProfileImage(
                    employees,
                    emp[0],
                    process.env.REACT_APP_API_URL
                  )}
                  alt={employees.find((e) => e.employeeId === emp[0])?.name}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div className="flex flex-col justify-center items-start">
                  <h2 className="text-lg font-semibold text-gray-800 m-0">
                    {employees.map((e) => {
                      if (emp[0] === e.employeeId) {
                        return e.name;
                      }
                      return null;
                    })}
                  </h2>
                  <p className="text-[12px] text-gray-500">
                    Total Assets : {emp[1].length}
                  </p>
                </div>
              </div>
            </div>

            {/* Asset List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {emp[1].map((asset) => (
                <div
                  key={asset.assetId}
                  className={`border ${
                    asset.returnDate ? "bg-red-50" : "bg-green-50"
                  } rounded-lg p-4  relative`}
                >
                  <div className=" text-[12px] text-gray-500">
                    <p className="text-[14px] text-gray-900 mb-1">
                      <strong>Name:</strong> {asset.assetName}
                    </p>
                    <p>
                      <strong>Type:</strong> {asset.assetType}
                    </p>
                    <p>
                      <strong>Model:</strong> {asset.serialNumber}
                    </p>
                    <p>
                      <strong>Qty:</strong> {asset.qty}
                    </p>
                    <p>
                      <strong>Remarks:</strong> {asset.remarks}
                    </p>
                    <p>
                      <strong>issueDate:</strong>{" "}
                      {moment(asset.issueDate).format("YYYY-MM-DD")}
                    </p>
                    <p>
                      <strong>returnDate:</strong>{" "}
                      {asset.returnDate
                        ? moment(asset.returnDate).format("YYYY-MM-DD")
                        : "Not returned yet"}
                    </p>
                  </div>

                  {/* Three-dot menu */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() =>
                        menuOpen === asset.assetId
                          ? setMenuOpen(null)
                          : setMenuOpen(asset.assetId)
                      }
                      className="text-gray-600 hover:text-gray-800 p-4"
                    >
                     {menuOpen === asset.assetId ? <FontAwesomeIcon icon={faXmark} /> :<FontAwesomeIcon icon={faEllipsisV}/>}  
                    </button>

                    {menuOpen === asset.assetId && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-md z-10">
                        <button onClick={()=> nav("/dashboard/EmployeeAssetFormEdit/"+asset.assetId) } className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            asset.returnDate
                              ? alert("Already returned")
                              : handleReturned(asset.assetId);
                            setMenuOpen(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                        >
                          Returned
                        </button>
                        <button
                          onClick={() => {
                            deleteHandler(asset.assetId);
                            setMenuOpen(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-10 right-10">
        <Link to="/dashboard/EmployeeAssetForm">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-md flex items-center gap-2 shadow-lg">
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Asset</span>
          </button>
        </Link>
      </div>
    </div>
  );
};
export default EmployeesAssets;
