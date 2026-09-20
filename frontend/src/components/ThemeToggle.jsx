import React from 'react';
import { useTheme } from '../context/themeContext';

const ThemeToggle = ({ className = '', showLabel = true }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted hover:text-registry transition-colors ${className}`}
    >
      <span aria-hidden="true">{isDark ? '◐' : '○'}</span>
      {showLabel && <span>{isDark ? 'Day' : 'Night'}</span>}
    </button>
  );
};

export default ThemeToggle;