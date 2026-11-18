import { C } from './common';

// Two octaves from C4, seen from above. Keys, hammers, dampers and strings
// share one layout so the interior lines up with the keys.
export const PIANO_W = 1000;
export const PIANO_H = 460;
export const KEY_TOP = 262;

const WHITE_MIDI = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83];
const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const WW = PIANO_W / WHITE_MIDI.length;
const BW = WW * 0.58;

export const pianoKeys = (() => {
  const keys = WHITE_MIDI.map((midi, i) => ({ midi, type: 'white', x: i * WW, w: WW }));
  WHITE_MIDI.forEach((midi, i) => {
    const pc = midi % 12;
    if ([0, 2, 5, 7, 9].includes(pc) && i < WHITE_MIDI.length - 1) {
      keys.push({ midi: midi + 1, type: 'black', x: (i + 1) * WW - BW / 2, w: BW });
    }
  });
  return keys
    .map((k) => ({ ...k, cx: k.x + k.w / 2, name: `${NAMES[k.midi % 12]}${Math.floor(k.midi / 12) - 1}` }))
    .sort((a, b) => a.midi - b.midi);
})();

const whites = pianoKeys.filter((k) => k.type === 'white');
const blacks = pianoKeys.filter((k) => k.type === 'black');

export function PianoExterior({ pressed = new Set() }) {
  return (
    <svg viewBox={`0 0 ${PIANO_W} ${PIANO_H}`} className="xr-art" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of piano keys under a closed black lid">
      <defs>
        <linearGradient id="lacquer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b0d11" />
          <stop offset="0.6" stopColor="#151a22" />
          <stop offset="1" stopColor="#07080a" />
        </linearGradient>
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#dff7ff" stopOpacity="0.09" />
          <stop offset="0.55" stopColor="#dff7ff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ivory" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9d3c6" />
          <stop offset="0.12" stopColor="#efe9dd" />
          <stop offset="1" stopColor="#e6e0d3" />
        </linearGradient>
      </defs>
      <rect width={PIANO_W} height={KEY_TOP} fill="url(#lacquer)" />
      <rect width={PIANO_W} height={KEY_TOP - 34} fill="url(#sheen)" />
      <rect y={KEY_TOP - 34} width={PIANO_W} height="30" fill="#0e1116" />
      <rect y={KEY_TOP - 5} width={PIANO_W} height="5" fill="#5a1d1d" />
      {whites.map((k) => (
        <rect
          key={k.midi}
          className="key-white"
          x={k.x + 1}
          y={KEY_TOP}
          width={k.w - 2}
          height={PIANO_H - KEY_TOP - 4}
          rx="3"
          fill={pressed.has(k.midi) ? '#c9c3b6' : 'url(#ivory)'}
        />
      ))}
      {blacks.map((k) => (
        <g key={k.midi}>
          <rect x={k.x} y={KEY_TOP} width={k.w} height="118" rx="3" fill={pressed.has(k.midi) ? '#2a2f37' : '#111318'} />
          <rect x={k.x + 5} y={KEY_TOP} width={k.w - 10} height="108" rx="2" fill="#1d2129" opacity={pressed.has(k.midi) ? 0.4 : 1} />
        </g>
      ))}
    </svg>
  );
}

export function PianoInterior({ pressed = new Set() }) {
  return (
    <div className="absolute inset-0">
      <div className="xr-tint" />
      <svg viewBox={`0 0 ${PIANO_W} ${PIANO_H}`} className="xr-svg" preserveAspectRatio="xMidYMid slice" fill="none" stroke={C.ice} strokeWidth="1.2">
        {/* strings and tuning pins */}
        {pianoKeys.map((k) => {
          const active = pressed.has(k.midi);
          return (
            <g key={k.midi} opacity={active ? 1 : 0.8}>
              {[-4, 0, 4].map((o) => (
                <line key={o} x1={k.cx + o} y1="0" x2={k.cx + o} y2="214" stroke={active ? C.bright : C.dim} strokeWidth={active ? 1.4 : 0.9} className={active ? 'xr-glow' : undefined} />
              ))}
              <circle cx={k.cx} cy="220" r="3" stroke={C.ice} />
              <rect
                x={k.cx - 9}
                y={active ? 116 : 124}
                width="18"
                height="18"
                rx="2"
                stroke={C.ice}
                fill={active ? 'rgba(169,232,255,0.05)' : 'rgba(169,232,255,0.15)'}
                opacity={active ? 0.5 : 1}
              />
              <rect
                x={k.cx - 11}
                y="168"
                width="22"
                height="24"
                rx="10"
                stroke={C.bright}
                fill={active ? 'rgba(223,247,255,0.55)' : 'rgba(223,247,255,0.12)'}
                className={active ? 'xr-glow' : undefined}
              />
            </g>
          );
        })}

        {/* key levers continue under the fallboard */}
        {whites.map((k) => (
          <rect key={k.midi} x={k.x + 2} y="150" width={k.w - 4} height={PIANO_H - 154} rx="2" stroke={C.dim} strokeDasharray="4 5" />
        ))}
        {blacks.map((k) => (
          <rect key={k.midi} x={k.x + 2} y="150" width={k.w - 4} height="230" rx="2" stroke={C.ice} strokeDasharray="2 4" />
        ))}
        <line x1="0" y1="300" x2={PIANO_W} y2="300" stroke={C.bright} strokeDasharray="10 6" />
        {pianoKeys.map((k) => (
          <circle key={k.midi} cx={k.cx} cy="300" r="2.5" fill={C.bright} stroke="none" />
        ))}

        <g fill={C.bright} stroke="none" fontSize="13">
          <text x="14" y="24">STRINGS ×3 PER NOTE</text>
          <text x="14" y="112">DAMPERS</text>
          <text x="14" y="162">HAMMERS</text>
          <text x="14" y="244">TUNING PINS</text>
          <text x="14" y="292">BALANCE RAIL</text>
          <text x="986" y="448" textAnchor="end" fill={C.ice} opacity="0.7">
            ILLUSTRATIVE ACTION · NOT TO SCALE
          </text>
        </g>
      </svg>
    </div>
  );
}
