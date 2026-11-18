import Picture from './Picture';
import { useLightbox } from './Lightbox';

/**
 * Process gallery: images keep their own aspect ratios in a staggered two-column
 * layout; each opens the lightbox.
 */
export default function Gallery({ items, label = 'Process' }) {
  const [open, lightbox] = useLightbox(items);
  if (!items?.length) return null;

  return (
    <section aria-label={label}>
      <ul className="columns-1 gap-6 sm:columns-2 lg:gap-10">
        {items.map((item, i) => (
          <li key={item.image + i} className={`mb-10 break-inside-avoid ${i % 2 === 1 ? 'sm:mt-16' : ''}`}>
            <figure>
              <button
                type="button"
                onClick={() => open(i)}
                className="group corners block w-full cursor-zoom-in text-left"
                aria-label={`Enlarge: ${item.caption ?? item.alt}`}
              >
                <Picture image={item.image} alt={item.alt} sizes="(min-width: 640px) 45vw, 100vw" className="bg-film" imgClassName="transition-transform duration-700 group-hover:scale-[1.015]" />
              </button>
              {item.caption && (
                <figcaption className="mt-3 flex gap-3 text-sm leading-snug text-bone-dim">
                  <span className="mono-sm pt-0.5 text-ice">{String(i + 1).padStart(2, '0')}</span>
                  {item.caption}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
      {lightbox}
    </section>
  );
}
