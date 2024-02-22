import React from 'react';

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
        <p className="text-xl font-semibold mb-4">{message}</p>
        <button onClick={onClose} className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300 ease-in-out">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
