export default function Footer() {
  return (
    <footer className="border-t border-border-subtle py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-faint sm:flex-row sm:px-8">
        <p className="font-mono text-xs tracking-wide">
          © {new Date().getFullYear()} Erdeni Iles
        </p>
        <p className="text-xs text-zinc-600">
          Mechanical Engineering · Boston University
        </p>
      </div>
    </footer>
  );
}
