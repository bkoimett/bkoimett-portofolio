import React, { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 inline-flex h-10 w-10 items-center justify-center border border-rule-strong bg-paper text-ink shadow-[0_1px_2px_rgba(0,0,0,0.12)] hover:border-registry hover:text-registry"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
};

export default ScrollToTop;