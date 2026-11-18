import { C, Callout, Interior, Stamp } from './common';

// 1024×768 rendition of projects/thin-film-water-tank.
const FILM_Y = 402;
const HOT_X = 540;

export default function ThinFilmInterior() {
  // Zig-zag ray guided inside the film, deflected after the heated region.
  const ray = [];
  let x = 336;
  let up = true;
  while (x < 684) {
    const bend = x > HOT_X ? (x - HOT_X) * 0.09 : 0;
    ray.push(`${x},${FILM_Y + (up ? -3 : 3) + bend}`);
    x += 22;
    up = !up;
  }

  return (
    <Interior ghost="projects/thin-film-water-tank" viewBox="0 0 1024 768">
      {/* tank and water */}
      <g stroke={C.bone} strokeWidth="1" opacity="0.7">
        <polyline points="0,232 1024,232" strokeDasharray="2 6" />
        <polyline points="0,628 1024,628" />
        <line x1="120" y1="232" x2="120" y2="628" opacity="0.4" />
        <line x1="900" y1="232" x2="900" y2="628" opacity="0.4" />
      </g>

      {/* holder and base plate */}
      <rect x="315" y="345" width="383" height="115" stroke={C.ice} />
      <rect x="330" y="360" width="353" height="85" stroke={C.dim} strokeDasharray="5 4" />
      <rect x="268" y="462" width="502" height="44" stroke={C.dim} />
      <line x1="356" y1="342" x2="360" y2="600" stroke={C.dim} />
      <line x1="662" y1="342" x2="666" y2="600" stroke={C.dim} />

      {/* film, thickness exaggerated, thinned around the heated spot */}
      <path
        d={`M330,${FILM_Y - 5} L${HOT_X - 60},${FILM_Y - 5} C${HOT_X - 25},${FILM_Y - 5} ${HOT_X - 15},${FILM_Y - 1.5} ${HOT_X},${FILM_Y - 1.5} C${HOT_X + 15},${FILM_Y - 1.5} ${HOT_X + 25},${FILM_Y - 5} ${HOT_X + 60},${FILM_Y - 5} L684,${FILM_Y - 5}
            L684,${FILM_Y + 5} L${HOT_X + 60},${FILM_Y + 5} C${HOT_X + 25},${FILM_Y + 5} ${HOT_X + 15},${FILM_Y + 1.5} ${HOT_X},${FILM_Y + 1.5} C${HOT_X - 15},${FILM_Y + 1.5} ${HOT_X - 25},${FILM_Y + 5} ${HOT_X - 60},${FILM_Y + 5} L330,${FILM_Y + 5} Z`}
        stroke={C.bright}
        fill="rgba(169,232,255,0.12)"
      />

      {/* fiber input and guided light */}
      <path d={`M0,286 C150,286 230,${FILM_Y} 330,${FILM_Y}`} stroke={C.bright} strokeWidth="3" className="xr-glow" />
      <polyline points={`330,${FILM_Y} ${ray.join(' ')}`} stroke={C.bright} strokeWidth="1.3" className="xr-glow" />
      <path d={`M684,${FILM_Y + 13} L760,${FILM_Y + 26}`} stroke={C.bright} strokeDasharray="3 4" />

      {/* infrared heating */}
      <path d={`M${HOT_X - 46},0 L${HOT_X - 4},${FILM_Y - 6} M${HOT_X + 46},0 L${HOT_X + 4},${FILM_Y - 6}`} stroke={C.ice} strokeDasharray="7 6" />
      <circle cx={HOT_X} cy={FILM_Y} r="13" stroke={C.bright} />
      <circle cx={HOT_X} cy={FILM_Y} r="24" stroke={C.dim} />
      <path d={`M${HOT_X - 30},${FILM_Y - 14} l-26,0 m6,-5 l-6,5 l6,5 M${HOT_X + 30},${FILM_Y - 14} l26,0 m-6,-5 l6,5 l-6,5`} stroke={C.ice} strokeWidth="1" />

      <Callout x={120} y={300} dx={30} dy={-120} label="Optical fiber" sub="light coupled into film edge" />
      <Callout x={HOT_X + 18} y={60} dx={90} dy={20} label="Infrared heating" sub="absorbed by the oil" />
      <Callout x={HOT_X} y={FILM_Y + 2} dx={-70} dy={150} anchor="end" label="Local thickness change" sub="thermocapillary flow" />
      <Callout x={640} y={FILM_Y + 6} dx={110} dy={120} label="Guided light, steered" />
      <Callout x={420} y={FILM_Y - 4} dx={-80} dy={-120} anchor="end" label="Silicone oil film" sub="thickness exaggerated" />
      <Callout x={698} y={455} dx={120} dy={-150} label="Film holder" />
      <Stamp x={1004} y={748} anchor="end">Schematic over the real tank · not to scale</Stamp>
    </Interior>
  );
}
