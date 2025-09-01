import React, { useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const Toast = ({ message, id }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000); // Toasts disappear after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  return (
    <div className="toast-item" role="alert">
      {message}
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Toast key={toast.id} id={toast.id} message={toast.message} />
      ))}
    </div>
  );
};
