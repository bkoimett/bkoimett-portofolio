import React from 'react';

const StatCard = ({ value, label, className }) => {
  return (
    <div className={`glass-card rounded-lg p-8 text-center ${className}`}>
      <p className="text-on-surface-variant text-sm mb-2">{label}</p>
      <p className="text-4xl font-bold text-primary">{value}</p>
    </div>
  );
};

export default StatCard;