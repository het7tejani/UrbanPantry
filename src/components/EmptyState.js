import React from 'react';

const EmptyState = ({ title, message, ctaText, ctaAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.835l1.898-7.118a.75.75 0 0 0-.142-.882l-1.427-1.427a.75.75 0 0 0-.53-.22H6.372M16.5 21a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {ctaText && ctaAction && (
        <button className="button empty-state-button" onClick={ctaAction}>
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
