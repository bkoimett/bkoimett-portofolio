import React from 'react';

const SectionHeading = ({ children, reference, className }) => {
  return (
    <header className={`mb-6 ${className || ''}`}>
      {reference && (
        <p className="file-index-sm mb-2">{reference}</p>
      )}
      <h2 className="text-heading text-ink font-semibold">{children}</h2>
      <div className="mt-4 w-24 border-t-2 border-rule-strong" aria-hidden="true"></div>
    </header>
  );
};

export default SectionHeading;