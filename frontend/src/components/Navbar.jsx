import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
];

const getActivePath = (pathname) => {
  if (pathname === '/') return '/';
  if (pathname.startsWith('/projects')) return '/projects';
  if (pathname === '/about') return '/about';
  return pathname;
};

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  const activePath = getActivePath(location.pathname);

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMenuOpen(false);
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="h-16 bg-border/10 backdrop-blur-xl border-b border-border/20">
        <div className="max-w-container-max mx-auto h-full px-gutter">
          <div className="flex h-full items-center justify-between gap-6">
            <Link
              to="/"
              className="whitespace-nowrap font-headline-md text-headline-md font-bold text-ink hover:opacity-90 transition-opacity duration-200"
              aria-label="benjieDev home"
            >
              benjieDev
            </Link>

            <div className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
              {navItems.map((item) => {
                const isActive = item.path === activePath;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`text-body-md transition-colors duration-200 ${
                      isActive
                        ? 'border-b-2 border-accent pb-1 text-accent'
                        : 'text-muted hover:text-accent'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <a
                href="mailto:koimettb@gmail.com"
                className="hidden md:block rounded-full bg-accent px-6 py-2 text-on-accent font-label-md hover:scale-95 transition-all duration-200"
              >
                Hire Me
              </a>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-surface/50 border border-border/20 text-ink hover:bg-surface/70 hover:text-accent transition-colors duration-200"
              >
                {menuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-80' : 'max-h-0'
        }`}
      >
        <div className="rounded-xl bg-surface/50 border border-border/20 px-gutter py-stack-md">
          <div className="max-w-container-max mx-auto space-y-stack-sm" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const isActive = item.path === activePath;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block rounded-lg px-4 py-3 text-body-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-surface/60 hover:text-accent'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <a
              href="mailto:koimettb@gmail.com"
              onClick={() => setMenuOpen(false)}
              className="block rounded-full bg-accent px-4 py-3 text-center text-on-accent font-label-md hover:brightness-110 transition-all duration-200"
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;