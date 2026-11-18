import { usePageTitle } from '../components/layout/ScrollManager';
import { ArrowLink, Container, PageHeader } from '../components/ui';
import { activities, experience } from '../content/experience';
import { site } from '../content/site';

export default function Experience() {
  usePageTitle('Experience');
  const items = [...experience].sort((a, b) => (a.start < b.start ? 1 : -1));
  let lastYear = null;

  return (
    <>
      <PageHeader
        index="03 — Experience"
        title="Experience"
        accent="in order, newest first"
        aside={
          <ArrowLink href={site.resume.href} external className="mt-6">
            Full résumé (PDF)
          </ArrowLink>
        }
      >
        <p>Research, consulting, and teaching. The résumé has the same facts on one page.</p>
      </PageHeader>

      <Container as="section" aria-label="Chronology" className="pb-10">
        <ol className="relative">
          {items.map((item) => {
            const year = item.start.slice(0, 4);
            const showYear = year !== lastYear;
            lastYear = year;
            return (
              <li key={item.id} id={item.id} className="scroll-mt-24 grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-8 lg:py-14">
                <div className="flex items-baseline gap-4 lg:col-span-2 lg:flex-col lg:gap-2">
                  <span className={`display text-[3.2rem] leading-none ${showYear ? 'text-ice' : 'text-transparent [-webkit-text-stroke:1px_var(--color-line-strong)]'}`} aria-hidden={!showYear}>
                    {year}
                  </span>
                  <span className="mono-sm border border-line-strong px-2 py-1 text-bone-dim">{item.kind}</span>
                </div>
                <div className="lg:col-span-4">
                  <h2 className="display-wide text-[clamp(1.7rem,3vw,2.5rem)] text-bone">{item.role}</h2>
                  <p className="mt-2 text-bone-dim">{item.organization}</p>
                  <p className="mono mt-3 text-ash">
                    {item.dates} · {item.location}
                  </p>
                </div>
                <div className="lg:col-span-5 lg:col-start-8">
                  <ul className="flex flex-col gap-3">
                    {item.points.map((p) => (
                      <li key={p.slice(0, 30)} className="flex gap-3 leading-relaxed text-bone-dim">
                        <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-ice" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  {item.link && (
                    <ArrowLink to={item.link.to} className="mt-4">
                      {item.link.label}
                    </ArrowLink>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </Container>

      <Container as="section" aria-labelledby="activities" className="border-t border-line py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mono text-ice">Alongside</p>
            <h2 id="activities" className="display mt-3 text-[2.8rem] text-bone">
              Leadership & activities
            </h2>
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {activities.map((a) => (
              <li key={a.organization} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                <p>
                  <span className="text-bone">{a.role}</span>
                  <span className="text-bone-dim"> — {a.organization}</span>
                </p>
                <p className="mono text-ash">{a.dates}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
