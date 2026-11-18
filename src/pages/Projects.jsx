import { Link } from 'react-router-dom';
import { usePageTitle } from '../components/layout/ScrollManager';
import Picture from '../components/media/Picture';
import { ArrowLink, Container, PageHeader, StatusTag } from '../components/ui';
import { XRayFigure } from '../components/xray/PhotoXRay';
import { workIn } from '../content/work';
import { AwardBadge, AwardFacts, ExternalLinks } from '../components/work/Award';
import ThresholdPlate from '../components/work/ThresholdPlate';

export default function Projects() {
  usePageTitle('Projects');
  const projects = workIn('projects');

  return (
    <>
      <PageHeader index="02 — Projects" title="Projects" accent="things that move, light up, or fit in a box">
        <p>
          Hackathon hardware and health-data tools, an automated production cell, and course builds: CAD,
          laser-cut and printed housings, and the electronics packed inside them.
        </p>
      </PageHeader>
      {projects.map((entry, i) => {
        const props = { entry, number: String(i + 1).padStart(2, '0') };
        if (entry.feature === 'award') return <Award key={entry.slug} {...props} />;
        if (entry.feature === 'lead') return <Lead key={entry.slug} {...props} />;
        if (entry.feature === 'wide') return <Wide key={entry.slug} {...props} />;
        return <Compact key={entry.slug} {...props} />;
      })}
    </>
  );
}

const path = (entry) => `/${entry.section}/${entry.slug}`;

function Award({ entry, number }) {
  return (
    <section aria-labelledby={`p-${entry.slug}`} className="border-t border-line">
      <Container className="py-14 lg:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="mono text-ice">P / {number} — Featured</p>
          <AwardBadge award={entry.award} />
        </div>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 id={`p-${entry.slug}`} className="display text-[clamp(3.4rem,6.4vw,6.6rem)] text-bone">
              <Link to={path(entry)} className="hover:text-ice-bright">
                {entry.title}
              </Link>
            </h2>
            <p className="serif-accent mt-2 text-[clamp(1.3rem,2.4vw,1.9rem)] text-ice">{entry.subtitle}</p>
            <p className="mt-8 text-[1.08rem] leading-relaxed text-bone">{entry.summary}</p>
            <AwardFacts entry={entry} className="mt-8" />
            <ExternalLinks links={entry.links} className="mt-6" />
            <ArrowLink to={path(entry)} className="mt-6">
              Open project
            </ArrowLink>
          </div>
          <Link to={path(entry)} className="group block self-start lg:col-span-7" aria-label={`${entry.title} — open project`}>
            <div className="corners overflow-hidden border border-line">
              {entry.hero.plate ? (
                <ThresholdPlate award={entry.award} title={entry.hero.alt} className="block h-auto w-full transition group-hover:brightness-110" />
              ) : (
                <Picture image={entry.hero.image} alt={entry.hero.alt} sizes="(min-width: 1024px) 56vw, 100vw" />
              )}
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function Lead({ entry, number }) {
  return (
    <section aria-labelledby={`p-${entry.slug}`} className="border-t border-line">
      <Container className="py-14 lg:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="mono text-ice">P / {number} — Featured</p>
          <p className="mono text-ash">
            {entry.dates} · {entry.organization}
          </p>
        </div>
        <h2 id={`p-${entry.slug}`} className="display mt-6 text-[clamp(4rem,14vw,13rem)] text-bone">
          <Link to={path(entry)} className="hover:text-ice-bright">
            {entry.title}
          </Link>
        </h2>
        <p className="serif-accent text-[clamp(1.4rem,3vw,2.4rem)] text-ice">{entry.subtitle}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <XRayFigure className="lg:col-span-8" image={entry.hero.image} alt={entry.hero.alt} xray={entry.hero.xray} note={entry.hero.xrayNote} />
          <div className="flex flex-col lg:col-span-4">
            <p className="text-[1.15rem] leading-relaxed text-bone">{entry.summary}</p>
            <p className="mono mt-8 text-ice">My part</p>
            <p className="mt-2 leading-relaxed text-bone-dim">{entry.contribution}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {entry.tools.map((t) => (
                <li key={t} className="mono-sm border border-line-strong px-2 py-1 text-bone-dim">
                  {t}
                </li>
              ))}
            </ul>
            <ArrowLink to={path(entry)} className="mt-8">
              Full case study: CAD, wiring, testing
            </ArrowLink>
          </div>
        </div>

        {entry.gallery?.length > 0 && (
          <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Process contact sheet">
            {entry.gallery.map((g, i) => (
              <li key={g.image}>
                <Link to={path(entry)} className="group block" aria-label={`${g.caption} — open case study`}>
                  <div className="aspect-[4/3] overflow-hidden bg-film">
                    <Picture image={g.image} alt={g.alt} fit="cover" sizes="25vw" imgClassName="opacity-80 grayscale-[35%] transition group-hover:opacity-100 group-hover:grayscale-0" />
                  </div>
                  <p className="mono-sm mt-2 text-ash">
                    <span className="text-ice">{String(i + 1).padStart(2, '0')}</span> {g.caption}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

function Wide({ entry, number }) {
  return (
    <section aria-labelledby={`p-${entry.slug}`} className="bg-bone text-ink">
      <Container className="py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mono text-[#2b5a73]">P / {number}</p>
            <h2 id={`p-${entry.slug}`} className="display mt-4 text-[clamp(3rem,8vw,6.5rem)]">
              <Link to={path(entry)} className="hover:text-[#2b5a73]">
                {entry.title}
              </Link>
            </h2>
            <p className="mono mt-4 text-[#4d5258]">
              {entry.dates} · {entry.tools.join(' · ')}
            </p>
            <p className="mt-6 max-w-sm leading-relaxed text-[#2a2d31]">{entry.summary}</p>
            <Link to={path(entry)} className="mono mt-6 inline-flex min-h-11 items-center gap-2 border-b border-ink">
              Open project <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="lg:col-span-8">
            <Picture image={entry.hero.image} alt={entry.hero.alt} sizes="(min-width: 1024px) 64vw, 100vw" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Compact({ entry, number }) {
  return (
    <section aria-labelledby={`p-${entry.slug}`} className="border-t border-line">
      <Container className="py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:col-start-2 lg:pt-16">
            <p className="mono text-ice">P / {number}</p>
            <h2 id={`p-${entry.slug}`} className="display-wide mt-4 text-[clamp(2rem,4vw,3.2rem)] text-bone">
              <Link to={path(entry)} className="hover:text-ice-bright">
                {entry.title}
              </Link>
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <StatusTag status={entry.status} />
              <span className="mono-sm text-ash">{entry.dates}</span>
            </div>
            <p className="mt-6 leading-relaxed text-bone-dim">{entry.summary}</p>
            <ArrowLink to={path(entry)} className="mt-6">
              Open project
            </ArrowLink>
          </div>
          <XRayFigure className="lg:col-span-5 lg:col-start-7" image={entry.hero.image} alt={entry.hero.alt} xray={entry.hero.xray} note={entry.hero.xrayNote} sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </Container>
    </section>
  );
}
