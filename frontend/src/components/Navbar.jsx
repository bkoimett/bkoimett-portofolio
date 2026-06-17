import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/projects' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 glass-panel border-b border-on-surface-variant h-20 z-40">
      <div className="max-w-5xl mx-auto px-6 py-4 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Brand / Logo */}
          <Link to="/" className="text-headline-sm text-primary font-bold tracking-tight hover:opacity-80 transition-opacity duration-300">
            ExpertMinimalist
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-body-md transition-colors duration-300 relative pb-1 ${
                    isActive 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side - Theme toggle placeholder */}
          <div className="flex items-center">
            {/* ThemeToggle is rendered separately in App.jsx */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
