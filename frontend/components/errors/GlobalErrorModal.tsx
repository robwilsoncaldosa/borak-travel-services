'use client';

import React from 'react';

interface GlobalErrorModalProps {
  open: boolean;
  onClose: () => void;
  type?: 'network' | 'notfound' | 'unauthorized' | 'generic';
  message?: string;
}

const defaultMessages = {
  network: "Network error. Please check your connection.",
  notfound: "The requested resource was not found.",
  unauthorized: "You are not authorized to access this page.",
  generic: "Something went wrong. Please try again later."
};

export const GlobalErrorModal: React.FC<GlobalErrorModalProps> = ({
  open,
  onClose,
  type = 'generic',
  message
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-xs flex flex-col items-center">
        <div className="mb-3 text-2xl text-red-500">
          {type === 'network' && <span>🌐</span>}
          {type === 'notfound' && <span>🔍</span>}
          {type === 'unauthorized' && <span>🔒</span>}
          {type === 'generic' && <span>⚠️</span>}
        </div>
        <div className="mb-4 text-center text-gray-800 font-medium">
          {message || defaultMessages[type]}
        </div>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-gradient-to-r from-[#2E2E2E] to-[#444444] text-white rounded shadow hover:shadow-md transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};