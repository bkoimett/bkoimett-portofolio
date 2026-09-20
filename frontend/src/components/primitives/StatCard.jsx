import React from 'react';

const StatCard = ({ value, label, index, className = '' }) => {
  return (
    <div className={`ledger-row ${className}`}>
      {index && <span className="file-index-sm block">{index}</span>}
      <p className="mt-1 font-serif text-[2.5rem] font-semibold leading-none text-ink">
        {value}
      </p>
      <p className="file-index-sm mt-2">{label}</p>
    </div>
  );
};

export default StatCard;