import { C, Callout, Interior, Stamp } from './common';

// 1024×1020 rendition of projects/thermostat-new-photo. Parts are those visible
// in the open-lid photo; their placement under the lid is approximate.
export default function ThermostatInterior() {
  return (
    <Interior ghost="projects/thermostat-new-photo" viewBox="0 0 1024 1020">
      <path
        d="M120,28 L900,22 L940,70 L945,770 L880,815 L100,812 L48,770 L52,80 Z"
        stroke={C.bone}
        opacity="0.75"
      />
      {/* LCD module behind the window */}
      <rect x="180" y="282" width="610" height="208" stroke={C.ice} />
      <rect x="212" y="296" width="548" height="172" stroke={C.bright} className="xr-glow" />
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1={260 + i * 9} y1="282" x2={260 + i * 9} y2="270" stroke={C.ice} strokeWidth="1" />
      ))}

      {/* Arduino Uno, USB toward the front port */}
      <rect x="352" y="560" width="210" height="270" rx="8" stroke={C.bright} />
      <rect x="418" y="800" width="52" height="78" stroke={C.ice} />
      <rect x="372" y="580" width="12" height="150" stroke={C.ice} strokeWidth="1" />
      <rect x="532" y="600" width="12" height="190" stroke={C.ice} strokeWidth="1" />
      <rect x="430" y="640" width="70" height="40" stroke={C.dim} />

      {/* 9V battery */}
      <rect x="610" y="545" width="200" height="105" rx="6" stroke={C.ice} />
      <rect x="790" y="565" width="20" height="22" stroke={C.ice} />
      <rect x="790" y="608" width="20" height="22" stroke={C.ice} />

      {/* sensor, LED, switch */}
      <rect x="680" y="760" width="24" height="30" rx="4" stroke={C.bright} />
      <circle cx="338" cy="842" r="16" stroke={C.bright} className="xr-glow" />
      <rect x="196" y="836" width="66" height="50" stroke={C.ice} />

      {/* wiring */}
      <g stroke={C.ice} strokeWidth="1" opacity="0.65">
        <path d="M300,282 C300,420 400,480 420,560" />
        <path d="M330,282 C330,430 440,500 450,560" />
        <path d="M562,620 C600,640 640,700 692,760" />
        <path d="M352,760 C320,780 330,810 338,826" />
        <path d="M810,576 C860,620 700,500 562,600" />
        <path d="M352,700 C280,720 250,800 230,836" />
      </g>

      <Callout x={480} y={300} dx={-80} dy={-160} anchor="end" label="16×2 LCD" />
      <Callout x={457} y={700} dx={-220} dy={-80} label="Arduino Uno" />
      <Callout x={710} y={597} dx={120} dy={-60} label="9V battery" />
      <Callout x={692} y={775} dx={120} dy={60} label="TMP36" sub="position approx." />
      <Callout x={338} y={842} dx={-130} dy={110} anchor="end" label="Alert LED" />
      <Stamp x={1000} y={1000} anchor="end">Parts from the open-lid photo · layout approximate</Stamp>
    </Interior>
  );
}
