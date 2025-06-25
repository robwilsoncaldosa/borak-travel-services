import React from "react";

interface ModalMessagePromptProps {
  type: "success" | "error"; // Type of the message
  message: string; // Message to display
  onClose: () => void; // Function to close the modal
}

export const ModalMessagePrompt: React.FC<ModalMessagePromptProps> = ({ type, message, onClose }) => {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-lg p-6 max-w-md w-full ${isSuccess ? "border-green-500" : "border-red-500"} border-2`}>
        <h2 className={`text-xl font-semibold ${isSuccess ? "text-green-800" : "text-red-800"}`}>
          {isSuccess ? "Success" : "Error"}
        </h2>
        <p className="text-sm text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className={`mt-4 w-full py-2 px-4 rounded ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white`}
        >
          Close
        </button>
      </div>
    </div>
  );
};