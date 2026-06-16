import { Fragment } from 'react';

export default function SystemFlow({ steps }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
      {steps.map((step, index) => (
        <Fragment key={step}>
          <div className="flex flex-1 flex-col rounded-xl border border-border bg-surface-raised p-4">
            <span className="font-mono text-[10px] text-accent/80">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{step}</p>
          </div>
          {index < steps.length - 1 && (
            <div
              className="flex shrink-0 items-center justify-center py-1 font-mono text-sm text-accent/35 lg:px-1 lg:py-0"
              aria-hidden
            >
              <span className="lg:hidden">↓</span>
              <span className="hidden lg:inline">→</span>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
