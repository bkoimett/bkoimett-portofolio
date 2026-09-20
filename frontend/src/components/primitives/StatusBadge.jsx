import React from 'react';

const StatusBadge = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-block border border-rule-strong px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted rounded-[2px] ${className}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;