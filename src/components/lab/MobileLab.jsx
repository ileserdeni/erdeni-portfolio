import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { stations, terminal, achievement } from '../../content/lab';
import { site } from '../../content/site';
import XRay from '../xray/XRay';
import * as art from './art';
import Cluster from './Cluster';
import useLab from './useLab';

/** The lab for narrow screens: the same stations, stacked as bays down one dark room. */
export default function MobileLab() {
  const lab = useLab();
  const bays = useRef({});

  useEffect(() => {
    if (!lab.pinned) return;
    const el = bays.current[lab.pinned];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  }, [lab.pinned]);

  return (
    <section className="mlab" aria-labelledby="lab-title">
      <header className="mlab__intro">
        <p className="mono-sm text-ice">Personal lab · {site.location}</p>
        <h1 id="lab-title" className="display mt-3 text-[clamp(3.4rem,16vw,6rem)] text-bone">
          {site.name}
        </h1>
        <p className="display-wide mt-3 text-[1.05rem] text-ice-bright">{site.disciplines.join(' / ')}</p>
        <p className="mt-4 max-w-sm text-[0.98rem] leading-snug text-bone-dim">{site.labline}</p>
        {achievement && (
          <Link to={achievement.to} className="room__award mono-sm mt-4 inline-flex min-h-11 items-center gap-2 text-ice-bright">
            <span>
              {achievement.award} · {achievement.title}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
        <p className="mono-sm mt-6 flex items-center gap-3 text-ice">
          <span aria-hidden="true" className="inline-block h-px w-8 bg-ice" />
          Five stations · tap one to look inside
        </p>
      </header>

      <ol className="mlab__bays">
        {stations.map((s, i) => {
          const a = art[s.id];
          const props = s.id === 'experience' ? { records: terminal.lines, kinds: terminal.kinds } : {};
          const open = lab.pinned === s.id;
          const panelId = `bay-${s.id}`;
          return (
            <li
              key={s.id}
              ref={(el) => {
                bays.current[s.id] = el;
              }}
              className={`bay bay--${i % 2 ? 'right' : 'left'}`}
              data-open={open ? '' : undefined}
            >
              <button type="button" className="bay__button" aria-expanded={open} aria-controls={panelId} onClick={() => lab.pin(s.id)}>
                <span className="bay__label">
                  <span className="mono-sm text-ice">{s.number}</span>
                  <span className="display text-[2.4rem] leading-none text-bone">{s.label}</span>
                  <span className="mono-sm text-ash">{s.object}</span>
                </span>
                <span className={`bay__art bay__art--${s.id}`}>
                  <span className="bay__glow" aria-hidden="true" />
                  <XRay
                    as="span"
                    className="xr--bare"
                    ratio={a.viewBox.split(' ').slice(2).join(' / ')}
                    exterior={<a.Exterior {...props} />}
                    interior={<a.Interior {...props} />}
                    revealed={open}
                  />
                </span>
                <span className="bay__cue mono">
                  {open ? 'Close' : `${s.invitation} · open`}
                  <span aria-hidden="true">{open ? '×' : '+'}</span>
                </span>
              </button>
              {open && (
                <div className="bay__panel">
                  <Cluster id={panelId} station={s} pinned variant="inline" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mlab__all">
        <Link to="/work" className="mono inline-flex min-h-12 w-full items-center justify-between border border-line-strong px-4 text-bone">
          View all work <span aria-hidden="true">→</span>
        </Link>
      </p>
    </section>
  );
}
