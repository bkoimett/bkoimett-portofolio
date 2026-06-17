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
  const activePath = getActivePath(location.pathname);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-container-max mx-auto h-full px-gutter">
        <div className="flex h-full items-center justify-between gap-6">
          <Link
            to="/"
            className="whitespace-nowrap font-headline-md text-headline-md font-bold text-on-surface hover:opacity-90 transition-opacity duration-200"
            aria-label="ExpertMinimalist home"
          >
            ExpertMinimalist
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

          <a
            href="#contact"
            className="rounded-full bg-primary px-6 py-2 text-on-primary font-label-md hover:scale-95 transition-all duration-200"
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
