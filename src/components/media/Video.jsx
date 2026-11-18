import { useState } from 'react';
import Picture, { largestSrc } from './Picture';

/** YouTube embed that loads nothing from YouTube until the visitor presses play. */
export function YouTubeLite({ id, title, poster, caption }) {
  const [active, setActive] = useState(false);
  return (
    <figure>
      <div className="corners relative aspect-video overflow-hidden bg-film">
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 block w-full" aria-label={`Play video: ${title}`}>
            {poster && <Picture image={poster} alt="" fit="cover" sizes="(min-width: 1024px) 60vw, 100vw" imgClassName="opacity-50 grayscale transition-opacity group-hover:opacity-70" />}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="mono flex min-h-14 items-center gap-3 border border-ice bg-ink/80 px-5 text-ice-bright group-hover:bg-ice group-hover:text-ink">
                <span aria-hidden="true">▶</span> Play video
              </span>
            </span>
          </button>
        )}
      </div>
      {caption && <figcaption className="mono-sm mt-3 text-ash">{caption} Loads from YouTube when played.</figcaption>}
    </figure>
  );
}

export function LocalVideo({ src, poster, caption }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure>
      <div className="corners overflow-hidden bg-film">
        {failed ? (
          <p className="mono flex aspect-video items-center justify-center text-ash">Video not available</p>
        ) : (
          <video controls playsInline preload="none" poster={largestSrc(poster)} className="aspect-video w-full object-contain" onError={() => setFailed(true)}>
            <source src={src} type="video/mp4" onError={() => setFailed(true)} />
          </video>
        )}
      </div>
      {caption && <figcaption className="mono-sm mt-3 text-ash">{caption}</figcaption>}
    </figure>
  );
}
