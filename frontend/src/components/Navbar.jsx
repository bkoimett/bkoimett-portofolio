import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
];

const getActivePath = (pathname) => {
  if (pathname === '/') return '/';
  if (pathname.startsWith('/projects')) return '/projects';
  if (pathname.startsWith('/blog')) return '/blog';
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
    <header className="sticky top-0 z-50 border-b border-rule border-t-[3px] border-t-registry bg-paper/95 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            to="/"
            className="flex items-baseline gap-2 font-serif text-lg font-semibold text-ink"
            aria-label="Benjamin K. Koimett – home"
          >
            Benjamin K. Koimett
            <span className="hidden font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-ink-muted sm:inline">
              BK / 026
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = item.path === activePath;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`font-serif text-[15px] transition-colors ${
                    isActive
                      ? 'border-b border-registry pb-0.5 font-semibold text-registry'
                      : 'text-ink-muted hover:text-registry'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-5">
            <a href="mailto:koimettb@gmail.com" className="btn btn-stroke text-sm">
              Hire Me
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation"
              className="inline-flex h-9 w-9 items-center justify-center border border-rule-strong text-ink md:hidden"
            >
              <span className="font-mono text-sm">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-rule transition-[max-height] duration-300 md:hidden ${
          menuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className="container-page py-4" aria-label="Mobile">
          <div className="flex flex-col">
            {navItems.map((item) => {
              const isActive = item.path === activePath;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`border-b border-rule py-3 font-serif text-lg ${
                    isActive ? 'font-semibold text-registry' : 'text-ink'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-end">
            <a href="mailto:koimettb@gmail.com" className="btn btn-stroke text-sm">
              Hire Me
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;