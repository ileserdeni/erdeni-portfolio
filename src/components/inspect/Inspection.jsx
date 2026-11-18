import { useState } from 'react';
import { useLightbox } from '../media/Lightbox';
import Picture, { getMedia, mediaRatio } from '../media/Picture';
import { StatusTag } from '../ui';
import { PhotoXRay, XRayFigure } from '../xray/PhotoXRay';
import { photoInteriors } from '../xray/layers';

const ZOOM = 2.6;
const WINDOW_RATIO = 4 / 3;

/** Magnified window onto the hero image (or its interior) around `focus`. */
function Loupe({ hero }) {
  const hasInside = Boolean(photoInteriors[hero.xray]);
  const [inside, setInside] = useState(false);
  const media = getMedia(hero.image);
  if (!media || !hero.focus) return null;

  const ratio = media.width / media.height;
  const halfX = 0.5 / ZOOM;
  const halfY = (ratio / WINDOW_RATIO) / ZOOM / 2;
  const fx = Math.min(Math.max(hero.focus.x, halfX), 1 - halfX);
  const fy = Math.min(Math.max(hero.focus.y, halfY), 1 - halfY);

  return (
    <figure>
      <div className="loupe corners" style={{ aspectRatio: '4 / 3' }}>
        <div className="loupe__inner" style={{ width: `${ZOOM * 100}%`, transform: `translate(${-fx * 100}%, ${-fy * 100}%)` }}>
          {hasInside ? (
            <PhotoXRay image={hero.image} alt="" xray={hero.xray} sizes="80vw" revealed={inside} lens={0} />
          ) : (
            <div className="relative" style={{ aspectRatio: mediaRatio(hero.image) }}>
              <Picture image={hero.image} alt="" fit="cover" sizes="80vw" />
            </div>
          )}
        </div>
        <span className="loupe__cross" aria-hidden="true" />
        <span className="mono-sm absolute left-3 top-3 bg-ink/80 px-1.5 py-0.5 text-ice-bright">
          ×{ZOOM} · {inside ? 'Inside' : 'Photo'}
        </span>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="mono-sm text-ash">
          Magnified: <span className="text-bone-dim">{hero.focus.label}</span>
          {inside && <span className="block pt-1 text-ash-dim">Inside view is illustrative.</span>}
        </p>
        {hasInside && (
          <div className="flex" role="group" aria-label="Magnified view">
            {[
              ['Photo', false],
              ['Inside', true],
            ].map(([label, value]) => (
              <button
                key={label}
                type="button"
                aria-pressed={inside === value}
                onClick={() => setInside(value)}
                className={`mono min-h-10 border border-line-strong px-3 ${inside === value ? 'bg-ice/15 text-ice-bright' : 'text-bone-dim hover:text-bone'} ${value ? '-ml-px' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

function Row({ label, children }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-line py-3">
      <dt className="mono-sm pt-0.5 text-ash">{label}</dt>
      <dd className="text-[0.94rem] leading-snug text-bone">{children}</dd>
    </div>
  );
}

const firstSentence = (text) => text?.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text;

/** Readable panel of verified facts; rows without data are skipped. */
function InfoPanel({ entry }) {
  const iterations = entry.iterations?.map((it) => it.label).join(' → ');
  return (
    <div className="border border-line-strong bg-ink/80 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusTag status={entry.status} />
        <span className="mono-sm text-ash">{entry.dates}</span>
      </div>
      <p className="mt-4 text-[1.02rem] leading-relaxed text-bone">{entry.summary}</p>
      <dl className="mt-4">
        <Row label="Role">{entry.role}</Row>
        <Row label="Where">{[entry.lab, entry.organization].filter(Boolean).join(', ')}</Row>
        <Row label="Tools">{entry.tools?.join(' · ')}</Row>
        <Row label="My part">{entry.contribution}</Row>
        <Row label="Constraint">{firstSentence(entry.problem?.[0])}</Row>
        <Row label="Iterations">{iterations}</Row>
        <Row label={entry.status === 'ongoing' ? 'Status' : 'Result'}>{entry.outcomes && firstSentence(entry.outcomes.body)}</Row>
      </dl>
      <a href="#case-study" className="mono mt-5 inline-flex min-h-11 w-full items-center justify-between border border-ice/60 px-4 text-ice hover:bg-ice/10">
        Read the full case study <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}

function ThumbStrip({ items, title }) {
  const [open, lightbox] = useLightbox(items);
  if (!items.length) return null;
  return (
    <div className="mt-8">
      <p className="mono-sm text-ash">Process · {items.length} frames</p>
      <ol className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-2" aria-label={`${title} process frames`}>
        {items.map((item, i) => (
          <li key={item.image} className="shrink-0">
            <button type="button" onClick={() => open(i)} className="group block w-40 text-left sm:w-48" aria-label={`Enlarge frame ${i + 1}: ${item.caption}`}>
              <span className="relative block aspect-[4/3] overflow-hidden border border-line group-hover:border-ice">
                <Picture image={item.image} alt="" fit="cover" sizes="200px" />
                <span className="mono-sm absolute left-1.5 top-1.5 bg-ink/80 px-1 text-ice">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className="mt-2 line-clamp-2 block text-[0.8rem] leading-snug text-ash group-hover:text-bone-dim">{item.caption}</span>
            </button>
          </li>
        ))}
      </ol>
      {lightbox}
    </div>
  );
}

/**
 * Opening "inspection" view of a project: the specimen, a magnified detail, the
 * facts, and a strip of process frames.
 */
export default function Inspection({ entry }) {
  const { hero } = entry;
  const frames = [...(entry.gallery ?? []), ...(entry.outcomes?.image ? [entry.outcomes.image] : [])];

  return (
    <section aria-label="Inspection" className="mt-8 lg:mt-10">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          {hero.xray ? (
            <XRayFigure image={hero.image} alt={hero.alt} xray={hero.xray} note={hero.xrayNote} priority sizes="(min-width: 1024px) 56vw, 100vw" />
          ) : (
            <div className="corners">
              <Picture image={hero.image} alt={hero.alt} sizes="(min-width: 1024px) 56vw, 100vw" priority className="bg-bone" />
            </div>
          )}
          <ThumbStrip items={frames} title={entry.title} />
        </div>
        <div className="flex flex-col gap-8 lg:col-span-5">
          <Loupe hero={hero} />
          <InfoPanel entry={entry} />
        </div>
      </div>
    </section>
  );
}
