import React from 'react';

const StatusBadge = ({ children, className }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ${className}`}>
      {children}
    </span>
  );
};

export default StatusBadge;