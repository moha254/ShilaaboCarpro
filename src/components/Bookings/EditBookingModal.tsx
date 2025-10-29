import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { api } from "../../lib/api";

interface Client {
  _id: string;
  fullName: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  licensePlate: string;
}

interface Booking {
  _id: string;
  client: string;
  vehicle?: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Cancelled";
}

interface Props {
  isOpen: boolean;
  bookingId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const EditBookingModal: React.FC<Props> = ({
  isOpen,
  bookingId,
  onClose,
  onUpdate,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch booking details
  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${bookingId}`);
      if (res.data.success) setBooking(res.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients and vehicles
  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      if (res.data.success) setClients(res.data.data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };
  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      if (res.data.success) setVehicles(res.data.data);
    } catch (err) {
      console.error("Failed to fetch vehicles", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBooking();
      fetchClients();
      fetchVehicles();
    }
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Booking, value: any) => {
    setBooking((prev) => prev && { ...prev, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    try {
      setSaving(true);
      await api.put(`/bookings/${booking._id}`, booking);
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update booking");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading booking...</p>
        ) : booking ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <select
                value={booking.client}
                onChange={(e) => handleChange("client", e.target.value)}
                className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                value={booking.vehicle || ""}
                onChange={(e) => handleChange("vehicle", e.target.value)}
                className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">N/A</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.make} {v.model} ({v.licensePlate})
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={booking.startDate.split("T")[0]}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={booking.endDate.split("T")[0]}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={booking.status}
                onChange={(e) =>
                  handleChange("status", e.target.value as Booking["status"])
                }
                className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t mt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-500 text-center py-4">Booking not found.</p>
        )}
      </div>
    </div>
  );
};

export default EditBookingModal;
