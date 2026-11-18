import { C, Callout, Interior, Stamp } from './common';

// 1024×768 rendition of projects/mircolense-1. The inset shows the general
// two-photon polymerization principle, not this machine's optical layout.
export default function NanoscribeInterior() {
  const cx = 880;
  const cy = 190;
  const layers = Array.from({ length: 7 }, (_, i) => {
    const y = cy + 50 - i * 9;
    const half = Math.sqrt(Math.max(0, 1 - (i / 7) ** 2)) * 46;
    return <line key={i} x1={cx - half} y1={y} x2={cx + half} y2={y} stroke={C.bright} strokeWidth="1.6" />;
  });

  return (
    <Interior ghost="projects/mircolense-1" viewBox="0 0 1024 768">
      {/* holder, objective, stage */}
      <rect x="405" y="130" width="200" height="200" stroke={C.ice} />
      <rect x="465" y="200" width="75" height="62" stroke={C.bright} />
      <circle cx="501" cy="230" r="17" stroke={C.bright} className="xr-glow" />
      <ellipse cx="486" cy="397" rx="34" ry="19" stroke={C.bright} />
      <ellipse cx="486" cy="397" rx="18" ry="9" stroke={C.ice} />
      <rect x="370" y="440" width="320" height="50" stroke={C.dim} />
      <rect x="385" y="495" width="205" height="20" stroke={C.dim} />

      {/* illustrative beam */}
      <path d="M486,768 L486,560" stroke={C.ice} strokeDasharray="8 6" />
      <path d="M470,560 L470,410 M502,560 L502,410" stroke={C.ice} strokeDasharray="3 5" opacity="0.7" />

      {/* principle inset */}
      <line x1="540" y1="231" x2={cx - 104} y2={cy + 30} stroke={C.dim} strokeDasharray="3 5" />
      <circle cx={cx} cy={cy} r="110" stroke={C.ice} fill="rgba(6,16,27,0.82)" />
      <circle cx={cx} cy={cy} r="116" stroke={C.faint} />
      <rect x={cx - 80} y={cy + 56} width="160" height="8" stroke={C.bone} />
      <path d={`M${cx - 48},${cy + 108} L${cx},${cy + 20} L${cx + 48},${cy + 108}`} stroke={C.ice} strokeDasharray="4 4" />
      {layers}
      <circle cx={cx} cy={cy + 20} r="4" fill={C.bright} stroke="none" className="xr-glow" />
      <text x={cx} y={cy - 72} fill={C.bright} stroke="none" fontSize="12" textAnchor="middle">
        Two-photon principle
      </text>
      <text x={cx} y={cy - 56} fill={C.ice} stroke="none" fontSize="10" textAnchor="middle" opacity="0.75">
        Resin cures only at the focus
      </text>
      <text x={cx + 54} y={cy + 24} fill={C.ice} stroke="none" fontSize="10" opacity="0.8">
        voxel
      </text>
      <text x={cx} y={cy + 84} fill={C.ice} stroke="none" fontSize="10" textAnchor="middle" opacity="0.8">
        substrate
      </text>

      <Callout x={501} y={230} dx={-150} dy={-120} label="Sample holder" />
      <Callout x={486} y={397} dx={-200} dy={60} label="Objective" sub="focuses the laser" />
      <Callout x={605} y={460} dx={120} dy={70} label="Stage" />
      <Stamp x={1004} y={748} anchor="end">Annotated photo · inset is a general principle</Stamp>
    </Interior>
  );
}
