/** An award line, worded exactly as in content/work.js. */
export function AwardBadge({ award, className = '' }) {
  if (!award) return null;
  return (
    <p className={`mono inline-flex min-h-9 items-center gap-2.5 border border-ice/50 bg-ice/[0.07] px-3 text-ice-bright ${className}`}>
      <svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <path d="M1 1.5 6 0.8l5 0.7v7.2L6 12.8 1 8.7z" />
        <path d="M3.5 12 2 15.2M8.5 12 10 15.2" />
      </svg>
      {award}
    </p>
  );
}

/** Outbound project links. Only renders links that are filled in. */
export function ExternalLinks({ links, className = '' }) {
  const list = (links ?? []).filter((l) => l.href);
  if (!list.length) return null;
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className}`}>
      {list.map((l) => (
        <li key={l.href}>
          <a href={l.href} target="_blank" rel="noopener noreferrer" className="mono link-line inline-flex min-h-11 items-center gap-2 text-bone hover:text-ice-bright">
            {l.label} <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Event facts that have been supplied: event, date, team, role. */
export function AwardFacts({ entry, className = '' }) {
  const rows = [
    ['Event', entry.event],
    ['Date', entry.date],
    ['Team', entry.team],
    ['Teammates', entry.teammates],
    ['My role', entry.role],
  ].filter(([, v]) => v);
  if (!rows.length) return null;
  return (
    <dl className={`grid gap-x-6 ${className}`}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-4 border-b border-line py-2.5">
          <dt className="mono w-28 shrink-0 text-ash">{k}</dt>
          <dd className="text-bone">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
