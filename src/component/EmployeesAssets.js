import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const EmployeesAssets = () => {
  // Dummy employee + asset data (replace with API later)
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Anandh",
      image: "https://i.pravatar.cc/80?img=1",
      assets: [
        {
          id: 1,
          si: 1,
          name: "Laptop",
          type: "Electronics",
          model: "Dell XPS 13",
          qty: 1,
          remarks: "Company issued",
        },
        {
          id: 2,
          si: 2,
          name: "Mouse",
          type: "Accessory",
          model: "Logitech M331",
          qty: 1,
          remarks: "Wireless",
        },
      ],
    },
    {
      id: 2,
      name: "Priya",
      image: "https://i.pravatar.cc/80?img=2",
      assets: [
        {
          id: 1,
          si: 1,
          name: "Phone",
          type: "Electronics",
          model: "iPhone 14",
          qty: 1,
          remarks: "Official contact",
        },
      ],
    },
  ]);

  // Form state
  const [newAsset, setNewAsset] = useState({
    si: "",
    name: "",
    type: "",
    model: "",
    qty: "",
    remarks: "",
  });

  const [selectedEmp, setSelectedEmp] = useState(null);

  // Add Asset
  const handleAddAsset = (empId) => {
    if (!newAsset.name) return alert("Please fill asset name");
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId
          ? {
              ...emp,
              assets: [
                ...emp.assets,
                {
                  ...newAsset,
                  id: Date.now(),
                  si: emp.assets.length + 1,
                },
              ],
            }
          : emp
      )
    );
    setNewAsset({
      si: "",
      name: "",
      type: "",
      model: "",
      qty: "",
      remarks: "",
    });
    setSelectedEmp(null);
  };

  // Delete Asset
  const handleDeleteAsset = (empId, assetId) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId
          ? { ...emp, assets: emp.assets.filter((a) => a.id !== assetId) }
          : emp
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-xl shadow-md p-4 md:p-6 "
          >
            {/* Employee Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-x-4">
                <img
                  src={emp.image}
                  alt={emp.name}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div className="flex flex-col gap-y-[2px]   justify-center">
                  <h2 className="text-md font-semibold text-gray-800 flex items-center m-0">
                    {emp.name}
                  </h2>
                  <p className="text-[12px] text-gray-500 flex items-center">
                    Total Assets: {emp.assets.length}
                  </p>
                </div>
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                onClick={() =>
                  setSelectedEmp(selectedEmp === emp.id ? null : emp.id)
                }
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Asset</span>
              </button>
            </div>

            {/* Asset List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {emp.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="border rounded-lg p-4 bg-gray-50 flex flex-col justify-between relative"
                >
                  <div className="space-y-1 text-[12px] text-gray-700">
                    <p>
                      <strong>Name : </strong> {asset.name}
                    </p>
                    <p>
                      <strong>Type : </strong> {asset.type}
                    </p>
                    <p>
                      <strong>Model : </strong> {asset.model}
                    </p>
                    <p>
                      <strong>Qty : </strong> {asset.qty}
                    </p>
                    <p>
                      <strong>Remarks : </strong> {asset.remarks}
                    </p>
                  </div>
                  <div className="flex justify-end mt-3 gap-3 absolute bottom-3 right-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(emp.id, asset.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Asset Form */}
            {selectedEmp === emp.id && (
              <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-3">
                  Add New Asset
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Asset Name"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={newAsset.name}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Type"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={newAsset.type}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, type: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={newAsset.model}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, model: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={newAsset.qty}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, qty: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Remarks"
                    className="border rounded-md px-3 py-2 text-sm"
                    value={newAsset.remarks}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, remarks: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleAddAsset(emp.id)}
                    className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm hover:bg-blue-700"
                  >
                    Save Asset
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesAssets;
