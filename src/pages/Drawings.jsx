import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '../components/layout/ScrollManager';
import { useLightbox } from '../components/media/Lightbox';
import Picture, { mediaRatio } from '../components/media/Picture';
import { Container, PageHeader } from '../components/ui';
import { ViewInsideButton } from '../components/xray/PhotoXRay';
import XRay from '../components/xray/XRay';
import { drawings } from '../content/drawings';

export default function Drawings() {
  usePageTitle('Drawings');
  const items = drawings.map((d) => ({ ...d, caption: [d.medium, d.size, d.year].filter(Boolean).join(' · ') }));
  const [open, lightbox] = useLightbox(items);
  const [params] = useSearchParams();
  const piece = Number(params.get('piece'));

  useEffect(() => {
    if (piece >= 1 && piece <= items.length) open(piece - 1);
  }, [piece, items.length, open]);

  return (
    <>
      <PageHeader index="04 — Drawings" title="Drawings" accent="the gallery">
        <p>Drawings shown at their own proportions and colour, with earlier stages, like the construction under a finished piece, where I kept them.</p>
      </PageHeader>

      <Container as="section" aria-label="Gallery" className="pb-10">
        {items.length === 0 ? (
          <EmptyWall />
        ) : (
          <ul className="grid grid-cols-1 items-start gap-x-8 gap-y-16 sm:grid-cols-12 lg:gap-x-12 lg:gap-y-24">
            {items.map((item, i) => (
              <Artwork key={item.image} item={item} index={i} onOpen={() => open(i)} />
            ))}
          </ul>
        )}
      </Container>
      {lightbox}
    </>
  );
}

const SPAN = {
  wide: 'sm:col-span-8',
  tall: 'sm:col-span-5',
  default: 'sm:col-span-6',
};

function Artwork({ item, index, onOpen }) {
  const [revealed, setRevealed] = useState(false);
  const span = SPAN[item.span] ?? SPAN.default;
  const offset = index % 3 === 1 ? 'sm:mt-24' : index % 3 === 2 ? 'sm:col-start-3' : '';
  const picture = <Picture image={item.image} alt={item.alt} fit={item.sketch ? 'cover' : undefined} sizes="(min-width: 640px) 60vw, 100vw" />;

  return (
    <li className={`${span} ${offset}`}>
      <figure>
        <button type="button" onClick={onOpen} className="block w-full cursor-zoom-in" aria-label={`Enlarge: ${item.title}`}>
          {item.sketch ? (
            <XRay
              ratio={mediaRatio(item.image)}
              exterior={picture}
              interior={<Picture image={item.sketch} alt="" fit="cover" />}
              revealed={revealed}
              lens={160}
              readout="DR"
            />
          ) : (
            picture
          )}
        </button>
        <figcaption className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="display-wide text-lg text-bone">{item.title}</p>
            <p className="mono-sm mt-1 text-ash">{item.caption}</p>
          </div>
          {item.sketch && <ViewInsideButton pressed={revealed} onToggle={() => setRevealed((v) => !v)} />}
        </figcaption>
      </figure>
    </li>
  );
}

function EmptyWall() {
  const frames = [
    { ratio: '3 / 4', className: 'sm:col-span-4' },
    { ratio: '4 / 3', className: 'sm:col-span-5 sm:mt-24' },
    { ratio: '1 / 1', className: 'sm:col-span-3 sm:mt-10' },
  ];
  return (
    <div className="border-t border-line pt-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-12" aria-hidden="true">
        {frames.map((f, i) => (
          <div key={i} className={`corners halftone border border-line ${i > 0 ? 'hidden sm:block' : ''} ${f.className}`} style={{ aspectRatio: f.ratio, opacity: 0.55 - i * 0.12 }} />
        ))}
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <p className="display-wide text-[clamp(1.6rem,3vw,2.4rem)] text-bone lg:col-span-6">The walls are up; the drawings aren’t hung yet.</p>
        <p className="mono-sm leading-relaxed text-ash lg:col-span-4 lg:col-start-8">
          No artwork has been published here yet. When it is, each piece will appear at its true aspect ratio and colour, and pieces with a saved earlier stage will get a “View inside” control.
        </p>
      </div>
    </div>
  );
}
