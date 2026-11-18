import { useState } from 'react';

export default function AboutPhoto() {
  const [hasError, setHasError] = useState(false);
  const src = '/about-photo.JPG';

  return (
    <figure className="relative mx-auto w-full max-w-[280px] sm:max-w-xs lg:mx-0 lg:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-[1.35rem] bg-accent/10 opacity-40 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-[0_16px_48px_rgba(0,0,0,0.42)]">
        <div
          aria-hidden
          className="h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent"
        />

        <div className="aspect-[4/5] overflow-hidden bg-[#0e0e11]">
          {!hasError ? (
            <img
              src={src}
              alt="Erdeni Iles"
              onError={() => setHasError(true)}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#0e0e11] px-6 text-center">
              <div
                className="h-12 w-12 rounded-lg border border-accent/20 bg-accent/5"
                aria-hidden
              />
              <p className="font-mono text-[11px] text-zinc-600">Photo unavailable</p>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
