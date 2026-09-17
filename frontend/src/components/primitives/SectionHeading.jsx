import React from 'react';

const SectionHeading = ({ children }) => {
  return (
    <h2 className="headline-md font-semibold text-on-surface mb-4">
      {children}
    </h2>
  );
};

export default SectionHeading;