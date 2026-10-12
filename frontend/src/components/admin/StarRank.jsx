import React from 'react';

const StarIcon = ({ filled }) => (
  <svg
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
    className="h-full w-full"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
  >
    <path d="M10 1.6l2.55 5.17 5.7.83-4.13 4.02.98 5.68L10 14.62l-5.1 2.68.98-5.68L1.75 7.6l5.7-.83L10 1.6z" />
  </svg>
);

const StarRank = ({ value = 0, onChange, size = 'sm', className = '' }) => {
  const dimension = size === 'md' ? 'h-6 w-6' : 'h-5 w-5';

  const select = (n) => {
    if (onChange) onChange(value === n ? 0 : n);
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="inline-flex items-center gap-0.5"
        role="group"
        aria-label="Project rank"
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = value >= n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => select(n)}
              aria-label={
                filled && value === n ? `Clear rank (currently ${n})` : `Rank ${n} of 5`
              }
              aria-pressed={filled}
              title={`${n} of 5`}
              className={`${dimension} rounded-[2px] p-0.5 transition-colors ${
                filled
                  ? 'text-registry hover:text-registry-dim'
                  : 'text-rule-strong hover:text-registry-dim'
              }`}
            >
              <StarIcon filled={filled} />
            </button>
          );
        })}
      </span>
      <span className="file-index-sm tabular-nums">{value}/5</span>
    </span>
  );
};

export default StarRank;
