import React from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from '../ThemeToggle';

const AdminLayout = ({ active, onSelect, onLogout, children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-rule border-t-[3px] border-t-registry bg-paper/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-gutter">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-[17px] font-semibold text-ink">
              Registry Console
            </span>
            <span className="file-index-sm hidden sm:inline">// ADMIN</span>
          </div>
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <a
              href="/"
              className="filigree text-[14px] font-medium"
            >
              View site
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar active={active} onSelect={onSelect} onLogout={onLogout} />
        <main className="min-h-[calc(100vh-3.5rem)] w-full overflow-x-auto px-gutter py-8 lg:ml-56">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;