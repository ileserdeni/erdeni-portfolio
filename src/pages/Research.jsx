import { Link } from 'react-router-dom';
import { usePageTitle } from '../components/layout/ScrollManager';
import { ArrowLink, Container, PageHeader, StatusTag } from '../components/ui';
import { XRayFigure } from '../components/xray/PhotoXRay';
import JetPrinciple from '../components/xray/layers/JetPrinciple';
import { getWork, labs } from '../content/work';

export default function Research() {
  usePageTitle('Research');

  return (
    <>
      <PageHeader index="01 — Research" title="Research" accent="light, films, and the hardware that holds them">
        <p>
          I build experimental hardware in two Boston University labs: fixtures, test parts, and microfabricated components for optics and fluids experiments, and support for a biorobotics jet-propulsion mechanism.
        </p>
      </PageHeader>

      {labs.map((lab, li) => (
        <section key={lab.id} aria-labelledby={`lab-${lab.id}`} className="border-t border-line">
          <Container className="py-14 lg:py-20">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <p className="mono text-ice">Lab {String.fromCharCode(65 + li)}</p>
                <h2 id={`lab-${lab.id}`} className="display mt-4 text-[clamp(2.4rem,5vw,4rem)] text-bone">
                  {lab.name}
                </h2>
                <p className="mono mt-4 text-ash">
                  {[lab.organization, lab.role, lab.dates].filter(Boolean).join(' · ')}
                </p>
                <div className="mt-4">
                  <StatusTag status={lab.status} />
                </div>
              </div>
              <p className="prose-body lg:col-span-6 lg:col-start-6 lg:pt-12">{lab.summary}</p>
            </div>

            {lab.workstreams.length > 0 && (
              <div className="mt-14 flex flex-col gap-20 lg:mt-20 lg:gap-28">
                {lab.workstreams.map((ws, i) =>
                  ws.slug ? <Workstream key={ws.slug} entry={getWork(ws.slug)} flip={i % 2 === 1} /> : <TextWorkstream key={ws.title} ws={ws} />,
                )}
              </div>
            )}

            {lab.diagram === 'jet-principle' && (
              <figure className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
                <div className="corners aspect-[640/300] lg:col-span-7">
                  <JetPrinciple />
                </div>
                <figcaption className="lg:col-span-4 lg:col-start-9">
                  <p className="mono text-ice">My part</p>
                  <ul className="mt-4 flex flex-col gap-3 text-bone-dim">
                    {lab.contributions.map((t) => (
                      <li key={t} className="border-b border-line pb-3">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="mono-sm mt-6 leading-relaxed text-ash">{lab.diagramNote}</p>
                </figcaption>
              </figure>
            )}
          </Container>
        </section>
      ))}
    </>
  );
}

function Workstream({ entry, flip }) {
  const to = `/${entry.section}/${entry.slug}`;
  return (
    <article className="grid gap-8 lg:grid-cols-12 lg:gap-8">
      <div className={`lg:col-span-8 ${flip ? 'lg:order-2 lg:col-start-5' : ''}`}>
        <XRayFigure image={entry.hero.image} alt={entry.hero.alt} xray={entry.hero.xray} note={entry.hero.xrayNote} />
      </div>
      <div className={`flex flex-col justify-end lg:col-span-4 ${flip ? 'lg:order-1' : ''}`}>
        <div className="flex items-center gap-3">
          <StatusTag status={entry.status} />
          <span className="mono-sm text-ash">{entry.dates}</span>
        </div>
        <h3 className="display-wide mt-4 text-[clamp(1.8rem,3vw,2.6rem)] text-bone">
          <Link to={to} className="hover:text-ice-bright">
            {entry.title}
          </Link>
        </h3>
        <p className="mt-4 leading-relaxed text-bone-dim">{entry.summary}</p>
        <p className="mono mt-6 text-ice">What I do</p>
        <p className="mt-2 leading-relaxed text-bone">{entry.contribution}</p>
        <ArrowLink to={to} className="mt-6">
          Read the full write-up
        </ArrowLink>
      </div>
    </article>
  );
}

function TextWorkstream({ ws }) {
  return (
    <article className="grid gap-6 border border-line p-6 sm:p-10 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">
        <StatusTag status={ws.status} />
        <h3 className="display-wide mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)] text-bone">{ws.title}</h3>
      </div>
      <div className="lg:col-span-7 lg:col-start-6">
        <p className="leading-relaxed text-bone-dim">{ws.body}</p>
        <p className="mono-sm mt-6 text-ash">No images published for this work yet.</p>
      </div>
    </article>
  );
}
