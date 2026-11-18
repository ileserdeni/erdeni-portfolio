import { usePageTitle } from '../components/layout/ScrollManager';
import { LocalVideo, YouTubeLite } from '../components/media/Video';
import Keyboard from '../components/piano/Keyboard';
import { Container, PageHeader } from '../components/ui';
import { piano } from '../content/piano';

export default function Piano() {
  usePageTitle('Piano');

  return (
    <>
      <PageHeader index="05 — Piano" title="Piano" accent="a machine you can play">
        <p>{piano.intro}</p>
      </PageHeader>

      <Container as="section" aria-label="Keyboard mechanism" className="pb-16">
        <Keyboard />
      </Container>

      <Container as="section" aria-labelledby="recordings" className="border-t border-line py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mono text-ice">Recordings</p>
            <h2 id="recordings" className="display mt-3 text-[clamp(2.6rem,5vw,4rem)] text-bone">
              Performances
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {piano.recordings.length === 0 ? (
              <EmptyRecordings />
            ) : (
              <ol className="flex flex-col">
                {piano.recordings.map((r, i) => (
                  <Recording key={r.title + i} recording={r} index={i} />
                ))}
              </ol>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

function Recording({ recording: r, index }) {
  return (
    <li id={`recording-${index + 1}`} className="scroll-mt-24 border-t border-line py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="display-wide text-[1.5rem] text-bone">
          <span className="mono-sm mr-3 text-ice">{String(index + 1).padStart(2, '0')}</span>
          {r.title}
        </h3>
        <p className="mono text-ash">{[r.composer, r.date].filter(Boolean).join(' · ')}</p>
      </div>
      {r.caption && <p className="mt-2 text-bone-dim">{r.caption}</p>}
      <div className="mt-5">
        {r.audio && (
          <audio controls preload="none" src={r.audio} className="w-full">
            <a href={r.audio}>Download the recording</a>
          </audio>
        )}
        {r.video && <LocalVideo src={r.video} caption={null} />}
        {r.youtubeId && <YouTubeLite id={r.youtubeId} title={r.title} />}
      </div>
    </li>
  );
}

function EmptyRecordings() {
  return (
    <div className="corners border border-line p-8 sm:p-10">
      <svg viewBox="0 0 400 60" className="h-12 w-full max-w-md text-ice" fill="none" stroke="currentColor" aria-hidden="true">
        {[10, 20, 30, 40, 50].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} strokeWidth="0.8" opacity="0.5" />
        ))}
        <line x1="398" y1="10" x2="398" y2="50" strokeWidth="1.2" />
        <line x1="392" y1="10" x2="392" y2="50" strokeWidth="0.8" />
      </svg>
      <p className="display-wide mt-6 text-[1.6rem] text-bone">No recordings yet.</p>
      <p className="mt-3 max-w-md leading-relaxed text-bone-dim">
        This is where performance recordings will go, each with a short note. Nothing plays on its own; every recording waits for you to press play.
      </p>
    </div>
  );
}
