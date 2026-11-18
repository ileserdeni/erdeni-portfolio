import { useEffect, useRef } from 'react';

const restListeners = new Set();
let restDismissed = false;

function dismissRest() {
  if (restDismissed) return;
  restDismissed = true;
  restListeners.forEach((fn) => fn());
  restListeners.clear();
}

/**
 * Layered reveal: `exterior` on top of an aligned `interior`, exposed through a
 * soft circular mask that follows a mouse or pen. Touch and keyboard users use
 * `revealed` (driven by a "View inside" toggle) to show the whole interior.
 *
 * Both layers fill the same box, so draw interiors in the exterior's coordinate
 * space (see layers/ for examples using the photo's pixel dimensions as viewBox).
 *
 * Pointer movement writes CSS custom properties directly; it never sets React state.
 */
export default function XRay({
  exterior,
  interior,
  ratio = '4 / 3',
  revealed = false,
  lens = 120,
  rest,
  readout = 'SC',
  className = '',
  style,
  as: Box = 'div',
}) {
  const ref = useRef(null);
  const readoutRef = useRef(null);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0, w: 1, h: 1 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      el.style.setProperty('--xr-full', `${Math.ceil(Math.hypot(width, height) / 2 / 0.7) + 8}px`);
      el.style.setProperty('--xr-size', `${Math.round(Math.min(lens, Math.max(width, height) * 0.36))}px`);
    });
    observer.observe(el);

    if (rest && !restDismissed) {
      el.dataset.rest = '';
      el.style.setProperty('--xr-x', `${rest.x * 100}%`);
      el.style.setProperty('--xr-y', `${rest.y * 100}%`);
      const clear = () => delete el.dataset.rest;
      restListeners.add(clear);
      return () => {
        observer.disconnect();
        restListeners.delete(clear);
      };
    }
    return () => observer.disconnect();
  }, [lens, rest]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const paint = () => {
    frame.current = 0;
    const el = ref.current;
    if (!el) return;
    const { x, y, w, h } = point.current;
    el.style.setProperty('--xr-x', `${x}px`);
    el.style.setProperty('--xr-y', `${y}px`);
    if (readoutRef.current) {
      readoutRef.current.textContent = `${readout} · X ${(x / w).toFixed(2)} Y ${(y / h).toFixed(2)}`;
    }
  };

  const track = (event) => {
    if (event.pointerType === 'touch') return;
    const rect = ref.current.getBoundingClientRect();
    point.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };
    if (!frame.current) frame.current = requestAnimationFrame(paint);
  };

  const enter = (event) => {
    if (event.pointerType === 'touch') return;
    dismissRest();
    track(event);
    ref.current.dataset.active = '';
  };

  const leave = () => {
    delete ref.current.dataset.active;
  };

  return (
    <Box
      ref={ref}
      className={`xr ${className}`}
      style={{ aspectRatio: ratio, ...style }}
      data-revealed={revealed ? '' : undefined}
      onPointerEnter={enter}
      onPointerMove={track}
      onPointerLeave={leave}
    >
      <Box className="xr__layer">{exterior}</Box>
      <Box className="xr__layer xr__inner" aria-hidden="true">
        {interior}
      </Box>
      <Box className="xr__scope" aria-hidden="true">
        <span ref={readoutRef} className="xr__readout mono-sm">
          {readout}
        </span>
      </Box>
    </Box>
  );
}
