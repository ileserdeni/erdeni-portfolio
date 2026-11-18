import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** Scroll to top on new pages, to #hash targets, and move focus for screen readers. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  const first = useRef(true);
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        requestAnimationFrame(() => target.scrollIntoView());
        return;
      }
    }
    // Query-only changes (?station=, ?piece=) manage their own focus.
    const samePage = lastPath.current === pathname;
    lastPath.current = pathname;
    if (first.current) {
      first.current = false;
      return;
    }
    if (samePage) return;
    if (navType !== 'POP') window.scrollTo(0, 0);
    const heading = document.querySelector('main h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }, [pathname, hash, navType]);

  return null;
}

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Erdeni Iles` : 'Erdeni Iles — Mechanical Engineering / Robotics / Art';
  }, [title]);
}
