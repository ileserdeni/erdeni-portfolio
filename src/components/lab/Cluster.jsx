import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import Picture from '../media/Picture';
import ThresholdPlate from '../work/ThresholdPlate';

function Thumb({ item, number }) {
  if (item.plate) {
    return (
      <span className="cluster__thumb" aria-hidden="true">
        <ThresholdPlate compact className="block h-full w-full" />
      </span>
    );
  }
  if (item.image) {
    return (
      <span className="cluster__thumb">
        <Picture image={item.image} alt="" fit="cover" sizes="120px" />
      </span>
    );
  }
  return (
    <span className="cluster__thumb cluster__thumb--plate halftone" aria-hidden="true">
      <span className="mono-sm text-ice">{item.record ?? number}</span>
    </span>
  );
}

/**
 * Related work for one station. `pinned` adds the descriptions, the section link,
 * and a close control; a preview shows titles only so it stays light.
 */
const Cluster = forwardRef(function Cluster(
  { station, pinned, variant = 'room', id, headingRef, itemRef, onClose, onPointerEnter, onPointerLeave, onFocus, onBlur, style },
  ref,
) {
  const { items } = station;
  const full = pinned || variant === 'inline';

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className={`cluster cluster--${variant}${variant === 'room' ? ' lab-glass' : ''}`}
      data-pinned={pinned ? '' : undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      style={style}
    >
      {variant === 'room' && (
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="mono-sm text-ice">
              {station.number} · {station.object}
            </p>
            <h2 id={`${id}-title`} ref={headingRef} tabIndex={-1} className="display mt-1.5 text-[2rem] text-bone">
              {station.label}
            </h2>
          </div>
          {pinned && (
            <button type="button" onClick={onClose} className="mono inline-flex min-h-10 shrink-0 items-center gap-2 border border-line-strong px-3 text-bone hover:border-ice">
              Close <span aria-hidden="true">×</span>
            </button>
          )}
        </header>
      )}
      {variant === 'inline' && (
        <h3 id={`${id}-title`} className="sr-only">
          {station.label}: related work
        </h3>
      )}

      {full && <p className="mt-3 max-w-[34ch] text-[0.92rem] leading-snug text-bone-dim">{station.summary}</p>}

      {items.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={item.id} ref={itemRef ? (el) => itemRef(i, el) : undefined} className="cluster__item" style={{ '--i': i, '--n': items.length }}>
              <Link to={item.to} className="cluster__card group">
                <Thumb item={item} number={String(i + 1).padStart(2, '0')} />
                <span className="min-w-0">
                  <span className="display-wide block text-[1.02rem] text-bone group-hover:text-ice-bright">{item.title}</span>
                  {item.award && <span className="mono-sm mt-1 block text-ice-bright">{item.award}</span>}
                  {item.meta && <span className="mono-sm mt-1 block truncate text-ash">{item.meta}</span>}
                  {full && item.desc && <span className="cluster__desc mt-1.5 block text-[0.84rem] leading-snug text-bone-dim">{item.desc}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p ref={itemRef ? (el) => itemRef(0, el) : undefined} className="cluster__empty mt-4 border border-dashed border-line-strong p-4 text-[0.9rem] leading-snug text-bone-dim">
          {station.empty}
        </p>
      )}

      {full && (
        <Link to={station.to} className="mono link-line mt-4 inline-flex min-h-10 items-center gap-2 text-ice">
          {station.all} <span aria-hidden="true">→</span>
        </Link>
      )}
      {variant === 'room' && !pinned && (
        <p className="mono-sm mt-3 text-ash-dim">
          <span className="[@media(hover:none)]:hidden">Click the station to pin this open</span>
        </p>
      )}
    </section>
  );
});

export default Cluster;
