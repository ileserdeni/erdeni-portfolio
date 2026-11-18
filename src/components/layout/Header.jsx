import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { stations } from '../../content/lab';
import { nav, site } from '../../content/site';

/** Station index: opens a station in the lab from anywhere on the site. */
function StationLink({ station, className, children }) {
  const { pathname, search, state } = useLocation();
  const current = pathname === '/' ? new URLSearchParams(search).get('station') : null;
  const onHomePinned = pathname === '/' && Boolean(current);
  return (
    <Link
      to={{ pathname: '/', search: `?station=${station.id}` }}
      state={onHomePinned ? state : { lab: true }}
      replace={onHomePinned}
      aria-current={current === station.id ? 'true' : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const buttonRef = useRef(null);
  const home = location.pathname === '/';

  useEffect(() => setOpen(false), [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${home && !open ? 'header--room' : 'border-b border-line bg-ink/92'}`}>
      <a href="#main" className="mono absolute left-3 top-2 z-10 -translate-y-20 bg-ice px-3 py-2 text-ink focus:translate-y-0">
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-[1680px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" className="group flex min-h-11 items-center gap-3" aria-label={`${site.name}, home`}>
          <Mark />
          <span className="display text-[1.3rem] leading-none text-bone [word-spacing:0.14em] group-hover:text-ice-bright">{site.name}</span>
          <span aria-hidden="true" className="mono-sm hidden text-ash xl:inline">
            ME / Robotics / Art
          </span>
        </Link>

        <nav aria-label="Lab stations" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {stations.map((s) => (
              <li key={s.id}>
                <StationLink
                  station={s}
                  className="mono link-line inline-flex min-h-11 items-center gap-1.5 text-bone-dim hover:text-bone aria-[current]:text-ice-bright"
                >
                  <span aria-hidden="true" className="text-ash-dim">
                    {s.number}
                  </span>
                  {s.label}
                </StationLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-5">
          <NavLink to="/work" className={({ isActive }) => `mono link-line hidden min-h-11 items-center md:inline-flex ${isActive ? 'text-ice-bright' : 'text-bone-dim hover:text-bone'}`}>
            All work
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `mono link-line hidden min-h-11 items-center md:inline-flex ${isActive ? 'text-ice-bright' : 'text-bone-dim hover:text-bone'}`}>
            About
          </NavLink>
          <a href={site.resume.href} target="_blank" rel="noopener noreferrer" className="mono hidden min-h-11 items-center border border-line-strong px-3 text-ice hover:border-ice hover:bg-ice/10 sm:inline-flex">
            Résumé ↗
          </a>
          <a href="#contact" className="mono link-line hidden min-h-11 items-center text-bone-dim hover:text-bone lg:inline-flex">
            Contact
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="mono inline-flex min-h-11 items-center gap-2 border border-line-strong bg-ink/60 px-3 text-bone lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-14 overflow-y-auto bg-ink lg:hidden">
          <nav aria-label="Primary mobile" className="px-5 py-8 sm:px-8">
            <p className="mono-sm text-ice">Lab stations</p>
            <ul className="mt-2 flex flex-col">
              {stations.map((s) => (
                <li key={s.id} className="border-b border-line">
                  <StationLink station={s} className="flex min-h-16 items-baseline gap-4 py-3 text-bone aria-[current]:text-ice-bright">
                    <span aria-hidden="true" className="mono text-ash-dim">
                      {s.number}
                    </span>
                    <span className="display text-5xl">{s.label}</span>
                  </StationLink>
                </li>
              ))}
            </ul>
            <ul className="mt-8 grid grid-cols-2 gap-x-6">
              {[{ label: 'All work', to: '/work' }, ...nav].map((item) => (
                <li key={item.to} className="border-b border-line">
                  <NavLink to={item.to} className={({ isActive }) => `mono flex min-h-12 items-center ${isActive ? 'text-ice-bright' : 'text-bone-dim'}`}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <a href={site.resume.href} target="_blank" rel="noopener noreferrer" className="mono inline-flex min-h-12 items-center justify-between border border-line-strong px-4 text-ice">
                {site.resume.label} <span aria-hidden="true">↗</span>
              </a>
              <a href={`mailto:${site.email}`} className="mono inline-flex min-h-12 items-center justify-between border border-line-strong px-4 text-bone">
                {site.email} <span aria-hidden="true">→</span>
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="mono inline-flex min-h-12 items-center justify-between border border-line-strong px-4 text-bone">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" className="text-ice" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M11 0v5M11 17v5M0 11h5M17 11h5" />
      <circle cx="11" cy="11" r="1.4" fill="currentColor" />
    </svg>
  );
}
