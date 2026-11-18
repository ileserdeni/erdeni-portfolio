import { Link } from 'react-router-dom';

export function StatusTag({ status }) {
  if (!status) return null;
  const ongoing = status === 'ongoing';
  return (
    <span
      className={`mono-sm inline-flex items-center gap-1.5 border px-2 py-1 ${
        ongoing ? 'border-ice/50 text-ice' : 'border-bone/30 text-bone-dim'
      }`}
    >
      <span aria-hidden="true" className={`inline-block h-1.5 w-1.5 rounded-full ${ongoing ? 'bg-ice' : 'bg-bone-dim'}`} />
      {ongoing ? 'Ongoing' : 'Completed'}
    </span>
  );
}

export function PageHeader({ index, title, accent, children, aside }) {
  return (
    <header className="relative mx-auto max-w-[1440px] px-5 pb-12 pt-28 sm:px-8 lg:px-12 lg:pb-16 lg:pt-36">
      <div className="flex items-center gap-4">
        <span className="mono text-ice">{index}</span>
        <span className="ticks-x w-24 sm:w-40" aria-hidden="true" />
      </div>
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
        <h1 className="display text-[clamp(3.6rem,13vw,11.5rem)] text-bone lg:col-span-8">
          {title}
          {accent && <span className="serif-accent block text-[0.36em] leading-tight text-ice">{accent}</span>}
        </h1>
        {(children || aside) && (
          <div className="lg:col-span-4 lg:pb-4">
            {children && <div className="prose-body">{children}</div>}
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}

export function Container({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function ArrowLink({ to, href, children, className = '', external }) {
  const content = (
    <>
      <span className="link-line">{children}</span>
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        {external ? '↗' : '→'}
      </span>
    </>
  );
  const cls = `group mono inline-flex min-h-11 items-center gap-2 text-ice hover:text-ice-bright ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {content}
    </a>
  );
}

export function MetaList({ items }) {
  const rows = items.filter((item) => item.value && (!Array.isArray(item.value) || item.value.length));
  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-1">
      {rows.map((item) => (
        <div key={item.label} className="border-t border-line pt-3">
          <dt className="mono-sm text-ash">{item.label}</dt>
          <dd className="mt-1.5 text-[0.95rem] leading-snug text-bone">
            {Array.isArray(item.value) ? item.value.join(' · ') : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
