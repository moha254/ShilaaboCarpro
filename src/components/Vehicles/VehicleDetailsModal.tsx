import React from "react";
import { X, Edit3, Car, Hash, Info, User } from "lucide-react";

interface Vehicle {
  _id: string;
  name: string;
  model: string;
  plateNumber: string;
  type: string;
  capacity: string;
  status: string;
  createdAt?: string;
}

interface VehicleDetailsModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onEdit: (vehicle: Vehicle) => void;
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  onClose,
  onEdit,
}) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-600" />
            Vehicle Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Info */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Vehicle Name</p>
              <p className="font-medium text-gray-800">{vehicle.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Model</p>
              <p className="font-medium text-gray-800">{vehicle.model}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plate Number</p>
              <p className="font-medium text-gray-800">{vehicle.plateNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium text-gray-800">{vehicle.type}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="font-medium text-gray-800">{vehicle.capacity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : vehicle.status === "Booked"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <Info className="w-4 h-4 mr-1" />
                {vehicle.status}
              </span>
            </div>
          </div>

          {vehicle.createdAt && (
            <div>
              <p className="text-sm text-gray-500">Added On</p>
              <p className="font-medium text-gray-800">
                {new Date(vehicle.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t mt-6">
          <button
            onClick={() => onEdit(vehicle)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsModal;
