import { motion, useReducedMotion } from 'framer-motion';

export default function EngineeringBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(91, 164, 201, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91, 164, 201, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Major grid lines */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(91, 164, 201, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91, 164, 201, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '192px 192px',
        }}
      />

      {/* Right-side ambient glow */}
      <motion.div
        className="absolute right-[-10%] top-1/2 h-[min(80vh,640px)] w-[min(60vw,560px)] -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(91,164,201,0.1) 0%, rgba(91,164,201,0.03) 50%, transparent 72%)',
        }}
        animate={reduceMotion ? {} : { opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Left subtle glow */}
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent/3 blur-3xl" />

      {/* Vignette - softer on right to let graphic breathe */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/80 via-transparent to-[#09090b]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/50 to-transparent md:via-[#09090b]/25" />
    </div>
  );
}
