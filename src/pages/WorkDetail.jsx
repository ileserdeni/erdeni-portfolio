import { Link } from 'react-router-dom';
import { usePageTitle } from '../components/layout/ScrollManager';
import Gallery from '../components/media/Gallery';
import Picture from '../components/media/Picture';
import { LocalVideo, YouTubeLite } from '../components/media/Video';
import Inspection from '../components/inspect/Inspection';
import { Container } from '../components/ui';
import { workIn } from '../content/work';
import { AwardBadge, AwardFacts, ExternalLinks } from '../components/work/Award';
import ThresholdPlate from '../components/work/ThresholdPlate';

function Section({ index, title, children }) {
  return (
    <section className="grid gap-6 border-t border-line py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
      <div className="lg:col-span-3">
        <p className="mono text-ice">{index}</p>
        <h2 className="display mt-3 text-[2.4rem] text-bone lg:text-[2.8rem]">{title}</h2>
      </div>
      <div className="lg:col-span-8 lg:col-start-5">{children}</div>
    </section>
  );
}

const paragraphs = (list) => list.map((p) => <p key={p.slice(0, 32)}>{p}</p>);

export default function WorkDetail({ entry }) {
  usePageTitle(entry.title);

  const siblings = workIn(entry.section);
  const next = siblings[(siblings.indexOf(entry) + 1) % siblings.length];
  const sectionLabel = entry.section === 'research' ? 'Research' : 'Projects';

  const sections = [];
  const add = (title, content) => sections.push({ title, content });

  if (entry.problem?.length) add('The problem', <div className="prose-body">{paragraphs(entry.problem)}</div>);

  if (entry.systemFlow?.length) {
    add(
      'How it plays',
      <ol className="grid gap-px border border-line bg-line sm:grid-cols-5">
        {entry.systemFlow.map((step, i) => (
          <li key={step} className="bg-ink p-4">
            <span className="mono-sm text-ice">{String(i + 1).padStart(2, '0')}</span>
            <p className="mt-3 text-[0.95rem] leading-snug text-bone">{step}</p>
          </li>
        ))}
      </ol>,
    );
  }

  if (entry.decisions?.length || entry.iterations?.length) {
    add(
      'Decisions & iterations',
      <div className="flex flex-col gap-10">
        {entry.decisions?.length > 0 && (
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {entry.decisions.map((d) => (
              <li key={d.title} className="border-l border-line-strong pl-5">
                <h3 className="display-wide text-lg text-bone">{d.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-bone-dim">{d.body}</p>
              </li>
            ))}
          </ul>
        )}
        {entry.iterations?.length > 0 && (
          <ol className="grid gap-6 sm:grid-cols-2">
            {entry.iterations.map((it, i) => (
              <li key={it.label} className="relative border border-line p-5">
                <p className="mono text-ice">
                  v{i + 1} — {it.label}
                </p>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-bone-dim">{it.body}</p>
              </li>
            ))}
          </ol>
        )}
      </div>,
    );
  }

  if (entry.components?.length) {
    add(
      'Inside the box',
      <dl className="grid gap-x-10 sm:grid-cols-2">
        {entry.components.map((c) => (
          <div key={c.name} className="flex gap-4 border-b border-line py-3">
            <dt className="mono w-36 shrink-0 pt-0.5 text-ice">{c.name}</dt>
            <dd className="text-[0.95rem] text-bone-dim">{c.detail}</dd>
          </div>
        ))}
      </dl>,
    );
  }

  if (entry.code) add('The code', <div className="prose-body">{paragraphs([entry.code.body])}</div>);

  if (entry.gallery?.length || entry.video || entry.embed) {
    add(
      'Process',
      <div className="flex flex-col gap-12">
        {entry.embed && <YouTubeLite id={entry.embed.youtubeId} title={`${entry.title} demo`} poster={entry.embed.poster} caption={entry.embed.caption} />}
        {entry.video && <LocalVideo src={entry.video.src} poster={entry.video.poster} caption={entry.video.caption} />}
        <Gallery items={entry.gallery} label={`${entry.title} process images`} />
      </div>,
    );
  }

  if (entry.outcomes) {
    add(
      entry.status === 'ongoing' ? 'Where it stands' : 'Outcomes & lessons',
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="prose-body">
          <p>{entry.outcomes.body}</p>
        </div>
        {entry.outcomes.image && (
          <figure>
            <div className="corners bg-bone/95 p-2">
              <Picture image={entry.outcomes.image.image} alt={entry.outcomes.image.alt} sizes="(min-width: 1024px) 30vw, 100vw" />
            </div>
            <figcaption className="mono-sm mt-3 text-ash">{entry.outcomes.image.caption}</figcaption>
          </figure>
        )}
      </div>,
    );
  }

  return (
    <article>
      <Container className="pt-24 lg:pt-28">
        <nav aria-label="Breadcrumb" className="mono flex items-center gap-2 text-ash">
          <Link to={`/${entry.section}`} className="link-line inline-flex min-h-11 items-center hover:text-bone">
            ← {sectionLabel}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-bone-dim">{entry.shortTitle}</span>
        </nav>

        <header className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <p className="mono text-ash">{entry.kicker}</p>
            <h1 className="display mt-3 text-[clamp(2.8rem,7vw,6.2rem)] text-bone">{entry.title}</h1>
          </div>
          {entry.subtitle && <p className="serif-accent pb-2 text-[clamp(1.3rem,2.4vw,2rem)] text-ice">{entry.subtitle}</p>}
        </header>
        {entry.award && <AwardBadge award={entry.award} className="mt-6" />}

        {entry.hero.plate ? (
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <figure className="lg:col-span-8">
              <div className="corners overflow-hidden border border-line">
                <ThresholdPlate award={entry.award} title={entry.hero.alt} className="block h-auto w-full" />
              </div>
              <figcaption className="mono-sm mt-3 text-ash">Designed preview built from the project description. App screenshots to follow.</figcaption>
            </figure>
            <div className="lg:col-span-4">
              <AwardFacts entry={entry} />
              <ExternalLinks links={entry.links} className="mt-6" />
            </div>
          </div>
        ) : (
          <Inspection entry={entry} />
        )}

        <div id="case-study" className="mt-16 scroll-mt-20 lg:mt-24">
          <p className="mono mb-2 text-ice">Full case study</p>
          <Section index="A" title="Overview">
            <div className="prose-body">{paragraphs(entry.overview)}</div>
            {entry.contribution && (
              <div className="mt-10 border border-ice/40 bg-ice/[0.04] p-6">
                <p className="mono text-ice">My contribution</p>
                <p className="mt-3 text-[1.05rem] leading-relaxed text-bone">{entry.contribution}</p>
              </div>
            )}
          </Section>
          {sections.map((s, i) => (
            <Section key={s.title} index={String.fromCharCode(66 + i)} title={s.title}>
              {s.content}
            </Section>
          ))}
        </div>

        {next && next !== entry && (
          <Link to={`/${next.section}/${next.slug}`} className="group mt-8 flex flex-col gap-3 border-y border-line py-10 hover:bg-ice/[0.03] sm:flex-row sm:items-end sm:justify-between">
            <span className="mono text-ash">Next in {sectionLabel.toLowerCase()}</span>
            <span className="display text-[clamp(2.4rem,6vw,5rem)] text-bone group-hover:text-ice-bright">
              {next.shortTitle} <span aria-hidden="true">→</span>
            </span>
          </Link>
        )}
      </Container>
    </article>
  );
}
