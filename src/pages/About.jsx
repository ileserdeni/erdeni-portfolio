import { usePageTitle } from '../components/layout/ScrollManager';
import Picture from '../components/media/Picture';
import { ArrowLink, Container } from '../components/ui';
import { about } from '../content/about';
import { site } from '../content/site';

export default function About() {
  usePageTitle('About');

  return (
    <>
      <Container as="header" className="grid gap-10 pb-14 pt-28 lg:grid-cols-12 lg:gap-8 lg:pt-36">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-4">
            <span className="mono text-ice">06 — About</span>
            <span className="ticks-x w-24 sm:w-40" aria-hidden="true" />
          </div>
          <h1 className="display mt-6 text-[clamp(3.6rem,12vw,10rem)] text-bone">
            Outside
            <span className="block pl-[0.3em]">
              <span className="serif-accent text-ice">&amp;</span> in
            </span>
          </h1>
          <div className="prose-body mt-10 text-[1.1rem]">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8">
            <ArrowLink href={site.resume.href} external>
              {site.resume.label}
            </ArrowLink>
            <ArrowLink href={`mailto:${site.email}`}>{site.email}</ArrowLink>
            <ArrowLink href={site.linkedin} external>
              LinkedIn
            </ArrowLink>
          </div>
        </div>
        <figure className="lg:col-span-4 lg:col-start-9 lg:mt-24">
          <div className="corners mx-auto max-w-sm lg:max-w-none">
            <Picture image={about.portrait.image} alt={about.portrait.alt} sizes="(min-width: 1024px) 30vw, 80vw" priority />
          </div>
          <figcaption className="mono-sm mt-3 text-ash">{site.name} · {site.location}</figcaption>
        </figure>
      </Container>

      <Container as="section" aria-labelledby="education" className="grid gap-8 border-t border-line py-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="mono text-ice">Education</p>
          <h2 id="education" className="display mt-3 text-[2.6rem] text-bone">
            {about.education.school}
          </h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="display-wide text-[1.6rem] text-bone">{about.education.degree}</p>
          <p className="mono mt-3 text-ash">{about.education.dates}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {about.education.notes.map((n) => (
              <li key={n} className="mono-sm border border-line-strong px-2 py-1 text-bone-dim">
                {n}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container as="section" aria-labelledby="skills" className="grid gap-8 border-t border-line py-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="mono text-ice">Selected skills</p>
          <h2 id="skills" className="display mt-3 text-[2.6rem] text-bone">
            Tools & methods
          </h2>
        </div>
        <dl className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {about.skills.map((group) => (
            <div key={group.title} className="border-t border-line pt-4">
              <dt className="mono text-ice">{group.title}</dt>
              <dd className="mt-3 leading-relaxed text-bone-dim">{group.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}
