import { useState, useEffect } from 'react';
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

  // Theme toggle state
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', !isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMenuOpen(false);
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="h-16 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto h-full px-gutter">
          <div className="flex h-full items-center justify-between gap-6">
            <Link
              to="/"
              className="whitespace-nowrap font-headline-md text-on-surface font-bold hover:opacity-90 transition-opacity duration-200"
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
                        ? 'border-b-2 border-primary pb-1 text-primary'
                        : 'text-on-surface-variant hover:text-primary'
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
                className="hidden md:block rounded-full bg-primary px-6 py-2 text-on-primary font-label-md hover:scale-95 transition-all duration-200"
              >
                Hire Me
              </a>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-2xl">brightness_7</span>
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
        <div className="glass-panel bg-surface-container-low/80 border-b border-outline-variant/30 px-gutter py-stack-md">
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
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <a
              href="mailto:koimettb@gmail.com"
              onClick={() => setMenuOpen(false)}
              className="block rounded-full bg-primary px-4 py-3 text-center text-on-primary font-label-md hover:brightness-110 transition-all duration-200"
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