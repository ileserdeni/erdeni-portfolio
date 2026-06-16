export default function CaseStudySection({ label, title, children, className = '' }) {
  return (
    <section className={className}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{label}</p>
      <h2 className="mt-2 text-xl font-medium tracking-tight text-zinc-100 sm:text-2xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
