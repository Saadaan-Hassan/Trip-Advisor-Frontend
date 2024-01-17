import React, { useEffect, useRef } from 'react';

function Modal({ children, onClose, shouldClose }) {
  const modalRef = useRef();

  // Function to close the modal if there are no changes
  const handleClose = () => {
    if (shouldClose()) {
      onClose();
    }
  };

  // Function to handle outside click
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='fixed z-10 inset-0 overflow-y-auto'>
      <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true' onClick={handleClose}>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>

        <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
          &#8203;
        </span>

        <div ref={modalRef} className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-auto'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
