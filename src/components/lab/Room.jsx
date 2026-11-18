import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { achievement, stationById, stations, terminal } from '../../content/lab';
import { site } from '../../content/site';
import XRay from '../xray/XRay';
import * as art from './art';
import Cluster from './Cluster';
import Scenery from './Scenery';
import useLab from './useLab';

// Station placement in stage percentages (stage is 16:9, cropped to cover the
// viewport). `depth` drives parallax; `side` is where the cluster opens.
const LAYOUT = {
  drawings: { x: 34.5, y: 6.5, w: 32.5, h: 36.7, depth: 0.3, side: 'right', label: { right: '103%', top: '2%', alignItems: 'flex-end', textAlign: 'right' }, lens: 110 },
  experience: { x: 77, y: 27, w: 16.25, h: 44.4, depth: 0.6, side: 'left', label: { left: '-6%', top: '-14%' }, lens: 80 },
  research: { x: 6.5, y: 33, w: 45, h: 39, depth: 0.6, side: 'right', label: { left: '1%', top: '19%' }, lens: 90 },
  projects: { x: 52, y: 36, w: 25, h: 36.7, depth: 0.6, side: 'left', label: { left: '58%', top: '95%' }, lens: 90 },
  piano: { x: 2.5, y: 67, w: 47.5, h: 36.7, depth: 1, side: 'right', label: { left: '101%', top: '30%' }, lens: 120 },
};

// DOM (and tab) order follows the station numbers; stacking comes from `z`.
const ORDER = stations.map((s) => s.id);
const Z = { drawings: 1, experience: 2, research: 3, projects: 3, piano: 4 };

function StationArt({ id }) {
  const a = art[id];
  const props = id === 'experience' ? { records: terminal.lines, kinds: terminal.kinds } : {};
  return { exterior: <a.Exterior {...props} />, interior: <a.Interior {...props} />, ratio: a.viewBox.split(' ').slice(2).join(' / ') };
}

export default function Room() {
  const lab = useLab();
  const { active, pinned } = lab;
  const roomRef = useRef(null);
  const stationEls = useRef({});
  const clusterRef = useRef(null);
  const headingRef = useRef(null);
  const itemEls = useRef([]);
  const lineEls = useRef([]);
  const focusOnPin = useRef(false);

  /* pointer: parallax (smoothed) + proximity light, written to CSS variables */
  useEffect(() => {
    const room = roomRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rects = [];
    let frame = 0;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let pointer = null;

    const measure = () => {
      rects = ORDER.map((id) => {
        const el = stationEls.current[id];
        const r = el.getBoundingClientRect();
        return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2, rad: Math.min(r.width, r.height) / 2 };
      });
    };

    const tick = () => {
      frame = 0;
      if (pointer) {
        for (const r of rects) {
          const d = Math.max(0, Math.hypot(pointer.x - r.cx, pointer.y - r.cy) - r.rad);
          r.el.style.setProperty('--near', Math.max(0, 1 - d / 240).toFixed(2));
        }
      }
      if (reduce || room.dataset.active !== undefined) return;
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      room.style.setProperty('--px', cur.x.toFixed(4));
      room.style.setProperty('--py', cur.y.toFixed(4));
      if (Math.abs(target.x - cur.x) > 0.001 || Math.abs(target.y - cur.y) > 0.001) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      const box = room.getBoundingClientRect();
      pointer = { x: e.clientX, y: e.clientY };
      target.x = ((e.clientX - box.left) / box.width - 0.5) * 2;
      target.y = ((e.clientY - box.top) / box.height - 0.5) * 2;
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      target.x = 0;
      target.y = 0;
      rects.forEach((r) => r.el.style.setProperty('--near', '0'));
      schedule();
    };

    measure();
    room.addEventListener('pointermove', onMove);
    room.addEventListener('pointerenter', measure);
    room.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      room.removeEventListener('pointermove', onMove);
      room.removeEventListener('pointerenter', measure);
      room.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', measure);
    };
  }, []);

  /* place the cluster beside the active station and draw its leader lines */
  const place = useCallback(() => {
    const room = roomRef.current;
    const cluster = clusterRef.current;
    const st = active && stationEls.current[active];
    lineEls.current.forEach((p) => p?.setAttribute('d', ''));
    if (!room || !cluster || !st) return;
    const box = room.getBoundingClientRect();
    const hit = st.querySelector('.station__frame') ?? st;
    const s = hit.getBoundingClientRect();
    const side = LAYOUT[active].side;
    const cw = cluster.offsetWidth;
    const ch = cluster.offsetHeight;
    const gap = 64;
    let x = side === 'right' ? s.right - box.left + gap : s.left - box.left - gap - cw;
    let y = s.top - box.top + s.height / 2 - ch / 2;
    x = Math.min(Math.max(x, 20), box.width - cw - 20);
    y = Math.min(Math.max(y, 76), box.height - ch - 64);
    cluster.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

    const dir = side === 'right' ? 1 : -1;
    const ax = (side === 'right' ? s.right - s.width * 0.12 : s.left + s.width * 0.12) - box.left;
    const ay = s.top + s.height * 0.5 - box.top;
    itemEls.current.forEach((el, i) => {
      const path = lineEls.current[i];
      if (!el || !path) return;
      const r = el.getBoundingClientRect();
      const tx = (side === 'right' ? r.left : r.right) - box.left - dir * 4;
      const ty = r.top + r.height / 2 - box.top;
      const mx = tx - dir * 22;
      path.setAttribute('d', `M ${ax} ${ay} L ${ax + dir * 14} ${ay} L ${mx} ${ty} L ${tx} ${ty}`);
    });
  }, [active]);

  useLayoutEffect(() => {
    itemEls.current.length = active ? Math.max(1, stationById[active].items.length) : 0;
    place();
    const cluster = clusterRef.current;
    if (!cluster) return undefined;
    const raf = requestAnimationFrame(place);
    const ro = new ResizeObserver(place);
    ro.observe(cluster);
    window.addEventListener('resize', place);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [active, pinned, place]);

  /* focus management + Escape */
  useEffect(() => {
    if (pinned && focusOnPin.current) {
      focusOnPin.current = false;
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [pinned]);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      const owner = stationEls.current[active]?.querySelector('button');
      if (pinned) lab.unpin();
      else lab.clear();
      owner?.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, pinned, lab]);

  const activeStation = active ? stationById[active] : null;
  const clusterId = 'lab-cluster';

  return (
    <section
      ref={roomRef}
      className="room"
      aria-labelledby="lab-title"
      data-active={active ?? undefined}
      data-pinned={pinned ?? undefined}
      onClick={(e) => {
        if (pinned && e.target.closest('[data-backdrop]')) lab.unpin();
      }}
    >
      <div className="room__stage">
        <Scenery />

        <div className="room__layer room__sign" style={{ '--d': 0.4 }}>
          <div className="room__signage">
            <p className="mono-sm text-ice">Personal lab · {site.location}</p>
            <h1 id="lab-title" className="display mt-[0.6cqw] text-[4.6cqw] text-bone">
              {site.name}
            </h1>
            <p className="display-wide mt-[0.8cqw] text-[1.05cqw] text-ice-bright">{site.disciplines.join(' / ')}</p>
            <p className="mt-[1.1cqw] max-w-[22cqw] text-[max(13px,0.86cqw)] leading-snug text-bone-dim">{site.labline}</p>
            {achievement && (
              <Link to={achievement.to} className="room__award mono-sm mt-[1cqw] inline-flex min-h-10 items-center gap-2 text-ice-bright">
                <span>
                  {achievement.award} · {achievement.title}
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>

        {ORDER.map((id) => (
          <Station
            key={id}
            id={id}
            lab={lab}
            refEl={(el) => {
              stationEls.current[id] = el;
            }}
            onPin={() => {
              focusOnPin.current = true;
              lab.pin(id);
            }}
            controls={clusterId}
          />
        ))}

        <div className="room__layer room__fore" style={{ '--d': 1.35 }} aria-hidden="true">
          <div className="room__lensring" />
          <div className="room__cable" />
        </div>
      </div>

      <div className="room__vignette" aria-hidden="true" />

      <svg className="room__lines" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <path
            key={i}
            ref={(el) => {
              lineEls.current[i] = el;
            }}
          />
        ))}
      </svg>

      {activeStation && (
        <Cluster
          key={activeStation.id}
          ref={clusterRef}
          id={clusterId}
          station={activeStation}
          pinned={pinned === activeStation.id}
          headingRef={headingRef}
          itemRef={(i, el) => {
            itemEls.current[i] = el;
          }}
          onClose={() => {
            const owner = stationEls.current[activeStation.id]?.querySelector('button');
            lab.unpin();
            owner?.focus({ preventScroll: true });
          }}
          onPointerEnter={() => !pinned && lab.hold(activeStation.id)}
          onPointerLeave={() => !pinned && lab.release()}
          onFocus={() => !pinned && lab.hold(activeStation.id)}
          onBlur={() => !pinned && lab.release()}
        />
      )}

      <div className="room__hud">
        <p className="mono-sm flex items-center gap-3 text-ice">
          <svg width="18" height="18" viewBox="0 0 26 26" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="13" cy="13" r="8" />
            <path d="M13 0v6M13 20v6M0 13h6M20 13h6" />
          </svg>
          {pinned ? 'Esc or Close to step back' : 'Approach a station to look inside · click or press Enter to open it'}
        </p>
        <p className="mono-sm hidden items-center gap-5 text-ash xl:flex">
          <span>
            <span aria-hidden="true" className="text-ice">▣</span> Real render / photo
          </span>
          <span>
            <span aria-hidden="true" className="text-ice">┄</span> Illustration
          </span>
        </p>
        <Link to="/work" className="mono link-line inline-flex min-h-10 items-center gap-2 text-bone">
          View all work <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

function Station({ id, lab, refEl, onPin, controls }) {
  const s = stationById[id];
  const L = LAYOUT[id];
  const on = lab.active === id;
  const pinned = lab.pinned === id;
  const { exterior, interior, ratio } = StationArt({ id });

  return (
    <div className="room__layer" style={{ '--d': L.depth, zIndex: Z[id] }}>
      <div
        ref={refEl}
        className="station"
        data-station={id}
        data-on={on ? '' : undefined}
        style={{ left: `${L.x}%`, top: `${L.y}%`, width: `${L.w}%`, height: `${L.h}%` }}
      >
        <span className="station__glow" aria-hidden="true" />
        <button
          type="button"
          className="station__button"
          aria-expanded={pinned}
          aria-controls={controls}
          aria-label={`${s.label} station, ${s.object}. ${pinned ? 'Close' : 'Open'} related work`}
          onPointerEnter={(e) => e.pointerType !== 'touch' && !lab.pinned && lab.hold(id)}
          onPointerLeave={(e) => e.pointerType !== 'touch' && !lab.pinned && lab.release()}
          onFocus={() => !lab.pinned && lab.hold(id)}
          onBlur={() => !lab.pinned && lab.release()}
          onClick={onPin}
        >
          <span className="station__frame">
            <XRay as="span" className="xr--bare" ratio={ratio} exterior={exterior} interior={interior} revealed={on} lens={L.lens} readout={s.number} />
          </span>
          <span className="station__label" style={L.label}>
            <span className="mono-sm text-ice">{s.number}</span>
            <span className="station__name display">{s.label}</span>
            <span className="station__object mono-sm">{s.object}</span>
            <span className="station__invite mono-sm">{s.invitation}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
