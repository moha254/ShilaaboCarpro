import React from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Confirm Deletion
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete this booking? This action cannot be
          undone.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
