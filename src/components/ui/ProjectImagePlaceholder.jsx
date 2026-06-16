export default function ProjectImagePlaceholder({ title, className = 'aspect-[16/10]' }) {
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden bg-[#0e0e11] ${className}`}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(91, 164, 201, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91, 164, 201, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      <svg
        viewBox="0 0 120 80"
        className="h-16 w-24 text-accent/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        aria-hidden
      >
        <rect x="10" y="20" width="40" height="40" rx="2" />
        <circle cx="70" cy="40" r="18" />
        <circle cx="70" cy="40" r="6" />
        <line x1="70" y1="22" x2="70" y2="30" />
        <line x1="70" y1="50" x2="70" y2="58" />
        <line x1="52" y1="40" x2="60" y2="40" />
        <line x1="80" y1="40" x2="88" y2="40" />
        <path d="M50 20 L58 12 L66 20" />
      </svg>
      <span className="sr-only">Placeholder image for {title}</span>
    </div>
  );
}
