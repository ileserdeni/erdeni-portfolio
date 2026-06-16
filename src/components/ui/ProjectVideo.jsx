import { useState } from 'react';

export default function ProjectVideo({ src, label }) {
  const [hasError, setHasError] = useState(false);

  if (!src) return null;

  const isMov = src.toLowerCase().endsWith('.mov');

  if (hasError) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-surface-raised px-4 py-6 text-center">
        <p className="font-mono text-xs text-zinc-500">
          Video could not be loaded. Try opening{' '}
          <a href={src} className="text-accent hover:underline">
            {src}
          </a>{' '}
          directly.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-raised">
      <div className="bg-[#0e0e11]">
        <video
          key={src}
          controls
          playsInline
          preload="metadata"
          className="mx-auto aspect-video max-h-[min(70vh,560px)] w-full object-contain"
          onError={() => setHasError(true)}
        >
          {isMov ? (
            <>
              <source src={src} type="video/mp4" />
              <source src={src} type="video/quicktime" />
            </>
          ) : (
            <source src={src} type="video/mp4" />
          )}
        </video>
      </div>
      {label && (
        <p className="border-t border-border-subtle px-4 py-2.5 font-mono text-[11px] text-zinc-500">
          {label}
        </p>
      )}
    </div>
  );
}
