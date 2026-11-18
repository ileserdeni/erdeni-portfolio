import { useState } from 'react';
import manifest from '../../content/media-manifest.json';

export function getMedia(key) {
  return key ? manifest[key] : undefined;
}

export function mediaRatio(key, fallback = '4 / 3') {
  const media = getMedia(key);
  return media ? `${media.width} / ${media.height}` : fallback;
}

export function largestSrc(key) {
  return getMedia(key)?.sources.at(-1)?.src;
}

/**
 * Responsive image from the media manifest.
 * `fit="cover"` fills its parent; otherwise the image keeps its own aspect ratio.
 */
export default function Picture({
  image,
  alt,
  sizes = '100vw',
  fit,
  priority = false,
  className = '',
  imgClassName = '',
  style,
}) {
  const media = getMedia(image);
  const [loaded, setLoaded] = useState(false);

  if (!media) {
    return <MissingMedia label={image} className={className} style={style} />;
  }

  const srcSet = media.sources.map((s) => `${s.src} ${s.w}w`).join(', ');
  const cover = fit === 'cover';

  return (
    <div
      className={`relative overflow-hidden ${cover ? 'h-full w-full' : ''} ${className}`}
      style={{
        aspectRatio: cover ? undefined : `${media.width} / ${media.height}`,
        backgroundImage: `url(${media.placeholder})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style,
      }}
    >
      <img
        src={media.sources[Math.min(1, media.sources.length - 1)].src}
        srcSet={srcSet}
        sizes={sizes}
        width={media.width}
        height={media.height}
        alt={alt ?? ''}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`img-fade h-full w-full ${cover ? 'object-cover' : 'object-contain'} ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
}

export function MissingMedia({ label, className = '', style }) {
  return (
    <div
      role="img"
      aria-label="Image not available"
      className={`corners flex h-full min-h-40 w-full flex-col items-center justify-center gap-2 border border-dashed border-line-strong bg-film text-center ${className}`}
      style={style}
    >
      <span className="mono text-ash">Image not available</span>
      {import.meta.env.DEV && label && <span className="mono-sm text-ash-dim">{label}</span>}
    </div>
  );
}
