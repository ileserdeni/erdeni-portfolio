import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { stationById } from '../../content/lab';

const EXIT_DELAY = 380;

/**
 * Station state for the lab. A pinned station lives in the URL (?station=id) so it
 * survives reloads and the back button; a hover/focus preview is local and leaves
 * after a short delay, which lets the pointer cross from a station to its cluster.
 */
export default function useLab() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const requested = params.get('station');
  const pinned = stationById[requested] ? requested : null;

  const [preview, setPreview] = useState(null);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const hold = useCallback((id) => {
    clearTimeout(timer.current);
    setPreview(id);
  }, []);

  const release = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPreview(null), EXIT_DELAY);
  }, []);

  const clear = useCallback(() => {
    clearTimeout(timer.current);
    setPreview(null);
  }, []);

  const unpin = useCallback(() => {
    if (!pinned) return;
    clear();
    if (location.state?.lab) navigate(-1);
    else navigate({ search: '' }, { replace: true });
  }, [pinned, location.state, navigate, clear]);

  const pin = useCallback(
    (id) => {
      if (id === pinned) {
        unpin();
        return;
      }
      clear();
      // Switching stations replaces the entry (keeping how it was opened), so one
      // Back always returns to the closed room.
      navigate({ search: `?station=${id}` }, pinned ? { replace: true, state: location.state } : { state: { lab: true } });
    },
    [pinned, unpin, clear, navigate, location.state],
  );

  return { pinned, preview, active: pinned ?? preview, hold, release, clear, pin, unpin };
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}
