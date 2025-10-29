import React from "react";
import { X, Calendar, User, Car, CreditCard } from "lucide-react";

interface Client {
  _id: string;
  fullName: string;
  phone: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  licensePlate: string;
  dailyRate: number;
}

interface Booking {
  _id: string;
  client: Client;
  vehicle?: Vehicle;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

interface Props {
  booking: Booking;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<Props> = ({ booking, onClose }) => {
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const days = Math.ceil(
    Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const total = (booking.vehicle?.dailyRate ?? 0) * days;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Booking Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Info */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Client</h3>
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-blue-500" />
            <span>{booking.client.fullName}</span>
          </div>
          <p className="text-sm text-gray-500 ml-6">{booking.client.phone}</p>
        </div>

        {/* Vehicle Info */}
        {booking.vehicle && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Vehicle</h3>
            <div className="flex items-center gap-2 text-gray-700">
              <Car className="w-4 h-4 text-blue-500" />
              <span>
                {booking.vehicle.make} {booking.vehicle.model}
              </span>
            </div>
            <p className="text-sm text-gray-500 ml-6">
              Plate: {booking.vehicle.licensePlate}
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Dates</h3>
          <p className="text-gray-700 text-sm">
            {start.toLocaleDateString()} → {end.toLocaleDateString()} ({days} day
            {days > 1 && "s"})
          </p>
        </div>

        {/* Status & Total */}
        <div className="flex justify-between items-center mt-4 border-t pt-3">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              booking.status === "Active"
                ? "bg-green-100 text-green-700"
                : booking.status === "Completed"
                ? "bg-gray-100 text-gray-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {booking.status}
          </span>
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <CreditCard className="w-4 h-4 text-blue-500" /> KSH{" "}
            {total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
