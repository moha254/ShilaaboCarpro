import React, { useState, useMemo } from "react";
import { X, Calendar, AlertCircle } from "lucide-react";
import { api } from "../../lib/api";

interface Client {
  _id: string;
  fullName: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  dailyRate: number;
  licensePlate?: string; // Accept licensePlate as optional for better TS compatibility
}

interface Props {
  onClose: () => void;
  onBookingAdded: () => void;
  clients: Client[];
  vehicles: Vehicle[];
}

const getToday = () => new Date().toISOString().slice(0, 10);

const AddBookingForm: React.FC<Props> = ({
  onClose,
  onBookingAdded,
  clients,
  vehicles,
}) => {
  const [clientId, setClientId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Show selected vehicle details to help user.
  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v._id === vehicleId),
    [vehicleId, vehicles]
  );

  const selectedClient = useMemo(
    () => clients.find((c) => c._id === clientId),
    [clientId, clients]
  );

  const validate = (): string | null => {
    if (!clientId || !vehicleId || !startDate || !endDate)
      return "All fields are required";
    if (new Date(startDate) > new Date(endDate))
      return "Start date must be before end date";
    if (new Date(startDate) < new Date(getToday()))
      return "Start date cannot be in the past";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        client: clientId,
        vehicle: vehicleId,
        startDate,
        endDate,
      });
      if (res.data.success) {
        setSuccessMsg("Booking added successfully!");
        setTimeout(() => {
          setSuccessMsg("");
          onBookingAdded();
          onClose();
        }, 1200);
      } else {
        setError(res.data.message || "Failed to add booking");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to add booking. Please check for overlapping bookings or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Calendar className="inline w-6 h-6 text-blue-600" />
          Add New Booking
        </h2>

        {error && (
          <div className="flex items-center bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3 text-red-700 gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-md px-3 py-2 mb-3 text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Select client"
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.fullName}
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="text-xs text-gray-500 mt-1">
                <span className="font-medium">Selected: </span>
                {selectedClient.fullName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Vehicle <span className="text-red-500">*</span>
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Select vehicle"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.make} {v.model} {v.licensePlate ? `· ${v.licensePlate}` : ""}
                </option>
              ))}
            </select>
            {selectedVehicle && (
              <div className="text-xs text-gray-500 mt-1">
                <span className="font-medium">Selected: </span>
                {selectedVehicle.make} {selectedVehicle.model}
                {selectedVehicle.licensePlate && (
                  <>
                    {' · '}
                    <span className="font-mono">{selectedVehicle.licensePlate}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value && endDate && e.target.value > endDate) {
                    setEndDate(e.target.value);
                  }
                }}
                min={getToday()}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Booking start date"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Booking end date"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition border border-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60`}
              disabled={loading}
            >
              {loading ? "Booking..." : "Add Booking"}
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-400 mt-5">
          <span className="text-red-500 font-bold">*</span> Required fields.
        </p>
      </div>
    </div>
  );
};

export default AddBookingForm;
