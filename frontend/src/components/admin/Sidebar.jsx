import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Projects', path: '/admin/dashboard/projects', icon: 'folder_open' },
    { name: 'Settings', path: '/admin/dashboard/settings', icon: 'settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant flex flex-col p-2 z-40 transition-all duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Brand Header */}
      <div className="mb-2 border-b border-outline-variant/30">
        <h1 className="font-headline-sm text-headline-sm text-primary font-bold">B. Koimett</h1>
        <p className="font-label-md text-label-md text-on-surface-variant">Admin Console</p>
      </div>

      {/* Session Badge */}
      {isAuthenticated && (
        <div className="mb-2 p-2 bg-primary/10 border border-primary/20 rounded text-xs">
          <span className="material-symbols-outlined text-primary">badge</span>
          <span className="ml-2 text-primary">Active session</span>
        </div>
      )}

      {/* Mobile menu toggle */}
      {menuOpen && (
        <button
          onClick={toggleMenu}
          className="mt-2 flex items-center gap-2 px-3 py-2 rounded border outline-variant/30 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
          <span>Close menu</span>
        </button>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded border ${
              location.pathname === item.path
                ? 'bg-primary/10 border-primary text-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            } transition-colors`}
          >
            <span className="material-symbols-outlined text-sm">{item.icon}</span>
            <span className="font-label-md text-label-md">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => window.location.href='mailto:koimettb@gmail.com'}
          className="flex items-center gap-2 px-3 py-2 rounded bg-primary/10 border border-primary/20 text-on-surface-variant hover:text-primary transition-colors text-sm"
        >
          <span className="material-symbols-outlined">mail</span>
          Support
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary transition-colors text-sm group"
        >
          <span className="material-symbols-outlined text-xs">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;