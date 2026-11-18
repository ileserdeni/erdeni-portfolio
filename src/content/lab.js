// The five stations in the homepage lab. Cluster items are built from the other
// content files, so adding a project, drawing, or recording there makes it appear
// here too. Nothing in this file should describe work that isn't documented elsewhere.

import { drawings } from './drawings';
import { experience } from './experience';
import { piano } from './piano';
import { getWork, labs, work } from './work';

const fromWork = (slug, extra = {}) => {
  const w = getWork(slug);
  return {
    id: slug,
    title: w.shortTitle,
    meta: w.award ? w.team : [w.year, w.status === 'ongoing' ? 'Ongoing' : 'Completed'].filter(Boolean).join(' · '),
    desc: w.summary,
    image: w.hero.image,
    plate: w.hero.plate,
    award: w.award,
    to: `/${w.section}/${w.slug}`,
    ...extra,
  };
};

const aip = labs.find((l) => l.id === 'aip');
const morphable = labs.find((l) => l.id === 'morphable');
const fluidic = aip.workstreams.find((s) => !s.slug);

export const stations = [
  {
    id: 'research',
    number: '01',
    label: 'Research',
    object: 'Optical bench',
    invitation: 'Fiber, film, and light',
    summary: 'Two BU labs: thin-film optics and microfabrication, plus soft-robotics and jet-propulsion work.',
    to: '/research',
    all: 'All research',
    items: [
      fromWork('thermocapillary-thin-film-research'),
      fromWork('microlens-fabrication-nanoscribe', { image: 'projects/microlense1' }),
      {
        id: 'fluidic-shaping',
        title: 'Fluidic shaping',
        meta: `${aip.name.replace('Applied ', '')} · Ongoing`,
        desc: fluidic.body,
        to: '/research#lab-aip',
      },
      {
        id: 'morphable',
        title: 'Jet-propulsion mechanism',
        meta: morphable.name,
        desc: morphable.summary,
        to: '/research#lab-morphable',
      },
    ],
  },
  {
    id: 'projects',
    number: '02',
    label: 'Projects',
    object: 'Prototype bench',
    invitation: 'Beacons, arms, solenoids',
    summary:
      'Recent hackathon hardware and health-data tools, plus an automated production cell, a rhythm game, a gearbox, and a temperature monitor.',
    to: '/projects',
    all: 'All projects',
    items: [
      fromWork('heimdall'),
      fromWork('threshold'),
      fromWork('epic-box'),
      fromWork('electromechanical-rhythm-game'),
    ],
  },
  {
    id: 'experience',
    number: '03',
    label: 'Experience',
    object: 'Archive terminal',
    invitation: 'Records, 2024 –',
    summary: 'Lab research, teaching, and consulting, newest first.',
    to: '/experience',
    all: 'Full record',
    items: experience.map((e) => ({
      id: e.id,
      title: e.role,
      meta: `${e.organization} · ${e.dates}`,
      desc: e.points[0],
      to: `/experience#${e.id}`,
      record: e.kind,
    })),
  },
  {
    id: 'drawings',
    number: '04',
    label: 'Drawings',
    object: 'Light box',
    invitation: 'Sheets on the light',
    summary: 'Drawing is how I learned to look carefully.',
    to: '/drawings',
    all: 'Open the gallery',
    items: drawings.slice(0, 4).map((d, i) => ({
      id: d.image,
      title: d.title,
      meta: [d.year, d.medium].filter(Boolean).join(' · '),
      image: d.image,
      to: `/drawings?piece=${i + 1}`,
    })),
    empty: 'No drawings are published yet. The light box is waiting for the first sheets.',
  },
  {
    id: 'piano',
    number: '05',
    label: 'Piano',
    object: 'Piano action',
    invitation: 'Hammers and strings',
    summary: piano.intro,
    to: '/piano',
    all: 'Play the mechanism',
    items: piano.recordings.slice(0, 4).map((r, i) => ({
      id: `rec-${i}`,
      title: r.title,
      meta: [r.composer, r.date].filter(Boolean).join(' · '),
      desc: r.caption,
      to: `/piano#recording-${i + 1}`,
    })),
    empty: 'No recordings yet. Meanwhile the keyboard on the piano page is playable, with sound off until you turn it on.',
  },
];

// The one award on the site, for the small link in the homepage identity block.
export const achievement = (() => {
  const w = work.find((entry) => entry.award);
  return w && { award: w.award, title: w.shortTitle, to: `/${w.section}/${w.slug}` };
})();

export const stationById = Object.fromEntries(stations.map((s) => [s.id, s]));

// What the archive terminal shows: one line per real role, plus the drawer tabs.
export const terminal = {
  lines: experience.map((e) => `${e.start.slice(0, 4)}  ${e.kind} — ${e.short ?? e.organization}`.toUpperCase()),
  kinds: experience.map((e) => e.kind),
};
