import { useCallback, useEffect, useRef, useState } from 'react';
import { getMedia } from './Picture';

/**
 * Accessible lightbox on <dialog>. `items` are { image, alt, caption, title? }.
 * Returns [open(index), element].
 */
export function useLightbox(items) {
  const [index, setIndex] = useState(null);
  const dialogRef = useRef(null);
  const returnFocus = useRef(null);

  const open = useCallback((i) => {
    returnFocus.current = document.activeElement;
    setIndex(i);
  }, []);

  const close = useCallback(() => setIndex(null), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const onClose = () => {
    setIndex(null);
    returnFocus.current?.focus?.();
  };

  const step = (delta) => setIndex((i) => (i + delta + items.length) % items.length);

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (items.length < 2) return;
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  };

  const item = index !== null ? items[index] : null;
  const media = item ? getMedia(item.image) : null;

  const element = (
    <dialog
      ref={dialogRef}
      className="lightbox"
      onClose={onClose}
      onKeyDown={onKeyDown}
      aria-label={item ? item.title ?? item.caption ?? 'Image' : 'Image viewer'}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {item && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
            <span className="mono text-ash">
              {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={close} className="mono inline-flex min-h-11 items-center border border-line-strong px-4 text-bone hover:border-ice" autoFocus>
              Close <span aria-hidden="true" className="ml-2">×</span>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
            {media ? (
              <img
                key={item.image}
                src={media.sources.at(-1).src}
                srcSet={media.sources.map((s) => `${s.src} ${s.w}w`).join(', ')}
                sizes="100vw"
                width={media.width}
                height={media.height}
                alt={item.alt ?? ''}
                className="max-h-full w-auto max-w-full object-contain"
              />
            ) : (
              <p className="mono text-ash">Image not available</p>
            )}
            {items.length > 1 && (
              <>
                <NavButton dir={-1} onClick={() => step(-1)} />
                <NavButton dir={1} onClick={() => step(1)} />
              </>
            )}
          </div>
          <div className="px-4 py-4 sm:px-8">
            {item.title && <p className="display-wide text-lg text-bone">{item.title}</p>}
            {item.caption && <p className="mt-1 max-w-3xl text-sm text-bone-dim">{item.caption}</p>}
          </div>
        </div>
      )}
    </dialog>
  );

  return [open, element];
}

function NavButton({ dir, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'Previous image' : 'Next image'}
      className={`mono absolute top-1/2 hidden min-h-12 min-w-12 -translate-y-1/2 items-center justify-center border border-line-strong bg-ink/70 text-bone hover:border-ice sm:inline-flex ${
        dir < 0 ? 'left-4' : 'right-4'
      }`}
    >
      {dir < 0 ? '←' : '→'}
    </button>
  );
}
