import React from 'react';

const Modal = ({ isOpen, onClose, message, title, status }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 dark:text-white left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">

      <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
      <h2 className={`mb-5 text-xl ${status === 'success' ? 'text-green-500' : status === 'failure' ? 'text-red-500' : 'text-yellow-500'}`}>{title}</h2>
        <p className="text-lg font-medium mb-4">{message}</p>
        <button onClick={onClose} className="border border-grey-100 dark:border-white dark:text-white hover:bg-gray-700  hover:text-white px-4 py-2 rounded-md  transition duration-300 ease-in-out">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
