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
    <nav className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md z-40 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex justify-center items-center space-x-12">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;