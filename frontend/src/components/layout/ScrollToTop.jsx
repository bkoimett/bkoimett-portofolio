import React from 'react';

const ScrollToTop = () => {
  return (
    <button
      className="fixed bottom-6 right-6 sm:block bg-primary text-on-primary rounded-full p-2 shadow-lg transition-all duration-200"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

export default ScrollToTop;