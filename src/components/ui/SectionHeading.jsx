export default function SectionHeading({ label, title, className = '' }) {
  return (
    <div className={`mb-10 sm:mb-12 ${className}`}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {label}
      </p>
      <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-100 sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
