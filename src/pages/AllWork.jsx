import { Link } from 'react-router-dom';
import { usePageTitle } from '../components/layout/ScrollManager';
import { Container, PageHeader } from '../components/ui';
import { stations } from '../content/lab';

/** Everything in the lab as a plain list, for visitors who'd rather not explore. */
export default function AllWork() {
  usePageTitle('All work');

  return (
    <>
      <PageHeader index="Index" title="All work" accent="without the room">
        <p>Every station in the lab, as a list. Each entry opens the same page the room links to.</p>
      </PageHeader>

      <Container className="pb-16">
        {stations.map((s) => (
          <section key={s.id} aria-labelledby={`all-${s.id}`} className="grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <p className="mono-sm text-ice">
                {s.number} · {s.object}
              </p>
              <h2 id={`all-${s.id}`} className="display mt-2 text-[2.6rem] text-bone">
                {s.label}
              </h2>
              <Link to={`/?station=${s.id}`} className="mono link-line mt-3 inline-flex min-h-10 items-center gap-2 text-ash hover:text-bone">
                Open in the lab <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="lg:col-span-9">
              {s.items.length > 0 ? (
                <ol>
                  {s.items.map((item, i) => (
                    <li key={item.id}>
                      <Link
                        to={item.to}
                        className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-b border-line py-4 hover:bg-ice/[0.04] sm:grid-cols-[3rem_1fr_auto]"
                      >
                        <span className="mono-sm text-ash-dim">{String(i + 1).padStart(2, '0')}</span>
                        <span>
                          <span className="display-wide block text-[1.3rem] text-bone group-hover:text-ice-bright">{item.title}</span>
                          {item.meta && <span className="mono-sm mt-1 block text-ash">{item.meta}</span>}
                        </span>
                        <span aria-hidden="true" className="text-ash group-hover:text-ice">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="max-w-xl border border-dashed border-line-strong p-5 text-bone-dim">{s.empty}</p>
              )}
              <Link to={s.to} className="mono link-line mt-5 inline-flex min-h-10 items-center gap-2 text-ice">
                {s.all} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
