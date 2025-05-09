"use client";
import React from "react";

interface CustomAlertProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ open, message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <div className="text-red-600 text-lg font-bold mb-2">Error</div>
        <div className="mb-4">{message}</div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};