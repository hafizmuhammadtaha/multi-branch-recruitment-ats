import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 border border-transparent rounded-lg text-white font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
