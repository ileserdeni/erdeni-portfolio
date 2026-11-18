import { useId, useState } from 'react';
import Picture, { mediaRatio } from '../media/Picture';
import XRay from './XRay';
import { photoInteriors } from './layers';

export function ViewInsideButton({ pressed, onToggle, controls, className = '' }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-controls={controls}
      onClick={onToggle}
      className={`mono inline-flex min-h-11 items-center gap-2 border border-line-strong px-3 text-ice transition-colors hover:border-ice hover:bg-ice/10 ${
        pressed ? 'bg-ice/15' : ''
      } ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor">
        <circle cx="7" cy="7" r="4.5" />
        <path d="M7 0v3M7 11v3M0 7h3M11 7h3" />
        {pressed && <circle cx="7" cy="7" r="1.6" fill="currentColor" />}
      </svg>
      View inside
    </button>
  );
}

/** X-ray of a manifest photo with its registered interior layer. */
export function PhotoXRay({ image, alt, xray, sizes, priority, revealed, lens, rest, readout, className }) {
  const Interior = photoInteriors[xray];
  const exterior = <Picture image={image} alt={alt} sizes={sizes} fit="cover" priority={priority} />;
  if (!Interior) {
    return (
      <div className={className} style={{ aspectRatio: mediaRatio(image) }}>
        {exterior}
      </div>
    );
  }
  return (
    <XRay
      ratio={mediaRatio(image)}
      exterior={exterior}
      interior={<Interior />}
      revealed={revealed}
      lens={lens}
      rest={rest}
      readout={readout}
      className={className}
    />
  );
}

/** Large figure with an X-ray, a toggle for touch/keyboard, and an honest caption. */
export function XRayFigure({ image, alt, xray, note, sizes = '(min-width: 1024px) 66vw, 100vw', priority, className = '' }) {
  const [revealed, setRevealed] = useState(false);
  const id = useId();
  const hasInterior = Boolean(photoInteriors[xray]);

  return (
    <figure className={className}>
      <div id={id} className="corners">
        <PhotoXRay image={image} alt={alt} xray={xray} sizes={sizes} priority={priority} revealed={revealed} lens={150} />
      </div>
      <figcaption className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {hasInterior ? (
          <>
            <p className="mono-sm max-w-xl leading-relaxed text-ash">
              <span className="hidden text-ice [@media(hover:hover)]:inline">Move over the image to look inside. </span>
              {note}
            </p>
            <ViewInsideButton pressed={revealed} onToggle={() => setRevealed((v) => !v)} controls={id} className="self-start" />
          </>
        ) : (
          note && <p className="mono-sm text-ash">{note}</p>
        )}
      </figcaption>
    </figure>
  );
}
