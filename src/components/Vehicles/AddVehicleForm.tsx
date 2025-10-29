import React, { useState } from "react";
import { X, Save, RotateCcw } from "lucide-react";
import { api } from "../../lib/api";

interface AddVehicleFormProps {
  onClose: () => void;
  onVehicleAdded: () => void;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onClose, onVehicleAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    plateNumber: "",
    status: "Available",
    type: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/vehicles", formData);
      onVehicleAdded();
      onClose();
    } catch (err) {
      setError("Failed to add vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      model: "",
      plateNumber: "",
      status: "Available",
      type: "",
      capacity: "",
    });
    setError("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Add New Vehicle
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Toyota Prado"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <input
              type="text"
              name="model"
              placeholder="e.g. 2023"
              value={formData.model}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plate Number
            </label>
            <input
              type="text"
              name="plateNumber"
              placeholder="e.g. KDA 456C"
              value={formData.plateNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <input
              type="text"
              name="type"
              placeholder="e.g. SUV"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              placeholder="e.g. 7"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicleForm;
