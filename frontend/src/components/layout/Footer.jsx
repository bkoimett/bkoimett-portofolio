import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface-dim border-t border-outline-variant py-8">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-headline-md font-bold text-on-surface">
            benjieDev
          </div>

          <div className="flex gap-3 text-on-surface-variant text-sm">
            <a href="https://github.com/benjie" target="_blank" rel="noopener" aria-label="GitHub">
              <span className="material-symbols-outlined">github</span>
            </a>
            <a href="https://linkedin.com/in/benjie" target="_blank" rel="noopener" aria-label="LinkedIn">
              <span className="material-symbols-outlined">linked_in</span>
            </a>
            <a href="https://dev.to/benjie" target="_blank" rel="noopener" aria-label="Dev.to">
              <span className="material-symbols-outlined">dev_to</span>
            </a>
          </div>

          <p className="mt-2 md:mt-0 text-on-surface-variant text-xs">
            © {new Date().getFullYear()} Benjamin Kiprotich Koimett. Built with MERN & Go.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;