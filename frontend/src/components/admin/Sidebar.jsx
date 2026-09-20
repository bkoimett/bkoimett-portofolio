import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const navItems = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'projects', name: 'Projects' },
  { id: 'settings', name: 'Settings' },
];

const Sidebar = ({ active, onSelect, onLogout }) => {
  const { isAuthenticated } = useAuth();

  return (
    <aside className="fixed inset-y-14 left-0 z-30 hidden w-56 flex-col border-r border-rule bg-paper-strong lg:flex">
      <div className="border-b border-rule px-5 py-4">
        <p className="font-serif text-lg font-semibold text-ink">B. Koimett</p>
        <p className="file-index-sm mt-0.5">Administration</p>
      </div>

      {isAuthenticated && (
        <div className="border-b border-rule px-5 py-3">
          <span className="inline-block border border-registry px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-registry">
            Session active
          </span>
        </div>
      )}

      <nav className="flex-1 px-3 py-4" aria-label="Registry administration">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={active === item.id ? 'page' : undefined}
            className={`mb-1 flex w-full items-center justify-between px-3 py-2 text-left text-[15px] transition-colors border rounded-[2px] ${
              active === item.id
                ? 'border-registry bg-registry text-on-registry font-semibold'
                : 'border-transparent text-ink-muted hover:border-rule-strong hover:text-ink'
            }`}
          >
            {item.name}
            <span aria-hidden="true" className="font-mono text-[11px]">
              {active === item.id ? '●' : '·'}
            </span>
          </button>
        ))}
      </nav>

      <div className="border-t border-rule px-3 py-3">
        <Link
          to="/"
          className="flex w-full items-center gap-2 px-3 py-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted hover:text-registry"
        >
          ← Back to site
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="mt-1 flex w-full items-center justify-between rounded-[2px] border border-rule-strong px-3 py-2 text-[14px] text-ink hover:border-stamp hover:text-stamp"
        >
          Log out
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;