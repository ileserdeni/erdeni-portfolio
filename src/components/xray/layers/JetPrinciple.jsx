import { C } from './common';

// Generic pulsed-jet principle, used only for orientation on /research.
export default function JetPrinciple() {
  return (
    <svg viewBox="0 0 640 300" className="h-full w-full" fill="none" stroke={C.ice} strokeWidth="1.3" role="img" aria-label="Generic diagram: a chamber contracts and expels a jet of fluid, producing thrust in the opposite direction.">
      <rect width="640" height="300" fill="#08111c" stroke="none" />
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke={C.faint} />
      ))}
      <path d="M120,150 C120,80 210,60 300,82 L400,128 L400,172 L300,218 C210,240 120,220 120,150 Z" stroke={C.bright} />
      <path d="M150,150 C150,104 214,92 290,108 L370,140 L370,160 L290,192 C214,208 150,196 150,150 Z" stroke={C.dim} strokeDasharray="5 5" />
      <path d="M200,64 l0,30 m-8,-10 l8,10 l8,-10 M200,236 l0,-30 m-8,10 l8,-10 l8,10" stroke={C.ice} />
      <path d="M410,150 L580,150" stroke={C.bright} strokeWidth="2" className="xr-glow" />
      <path d="M580,150 l-14,-8 m14,8 l-14,8" stroke={C.bright} strokeWidth="2" />
      <path d="M440,132 C480,124 520,128 560,120 M440,168 C480,176 520,172 560,180" stroke={C.dim} strokeDasharray="3 6" />
      <path d="M100,150 L40,150 m0,0 l14,-8 m-14,8 l14,8" stroke={C.ice} />
      <g fill={C.bright} stroke="none" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="1">
        <text x="160" y="40">CHAMBER CONTRACTS</text>
        <text x="460" y="110">JET OUT</text>
        <text x="30" y="132">THRUST</text>
        <text x="20" y="286" fill={C.ice} opacity="0.7">GENERIC PRINCIPLE · NOT THE LAB'S DESIGN</text>
      </g>
    </svg>
  );
}
