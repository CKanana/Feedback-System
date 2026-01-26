import React, { useEffect } from 'react';
import './SuccessToast.css';

const SuccessToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-close after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-toast" style={{ borderLeft: '5px solid #B24592' }}>
      <div className="toast-icon" style={{ color: '#B24592' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <p className="toast-message">{message}</p>
      <button onClick={onClose} className="toast-close-btn" aria-label="Dismiss message">
        &times;
      </button>
    </div>
  );
};

export default SuccessToast;