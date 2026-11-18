# Erdeni Iles — Portfolio

Personal portfolio built around one idea: *beneath the surface*. The homepage is an
X-ray lab with five stations (research bench, prototype bench, archive terminal,
light box, piano). Hovering or focusing a station brings it into focus, reveals its
interior, and previews related work; clicking or pressing Enter pins it open.
Detail pages are inspection views: a dominant plate with an X-ray layer, a
magnifier, process thumbnails, and a short fact panel above the full case study.

On phones (or short screens) the same stations stack vertically and open inline on
tap. `/work` lists everything without the room.

### URLs

- `/?station=research` opens a station pinned (`research`, `projects`,
  `experience`, `drawings`, `piano`). Pinning pushes a history entry, so Back closes it.
- `/drawings?piece=2` opens a drawing in the lightbox.
- `/experience#<id>` and `/piano#recording-<n>` jump to an entry.

Vite + React 19 + Tailwind CSS v4 + React Router. Deployed on Vercel.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview
```

## Editing content

All copy and facts live in `src/content/`. Pages read from these files; you rarely
need to touch components.

| File | What it holds |
|------|---------------|
| `site.js` | Name, intro, email, LinkedIn, résumé path, nav |
| `work.js` | Research and project entries (detail pages) and the lab descriptions |
| `experience.js` | Roles and activities, newest first |
| `about.js` | About paragraphs, education, skills |
| `lab.js` | The five lab stations: labels, invitations, and which entries each one shows |
| `drawings.js` | Drawing gallery (empty until artwork is added) |
| `piano.js` | Piano recordings (empty until recordings are added) |

Each file has a comment describing the fields it expects. Leave a field `null` or
omit it when it isn't known; the pages skip empty values instead of guessing.

### Résumé

Replace `public/files/Erdeni-Iles-Resume.pdf` (keep the filename, or update
`resume.href` in `src/content/site.js`).

### Images

1. Put the original image in `media-src/` (for example `media-src/drawings/still-life.jpg`).
2. Run `npm run media`. This writes resized WebP files to `public/media/` and an
   entry in `src/content/media-manifest.json`.
3. Reference the image by its key: the path under `media-src/`, lowercased, without
   the extension, with spaces and underscores turned into dashes
   (`drawings/still-life`).

Commit both `media-src/` and the generated `public/media/` files; the build does not
run the media step.

The media step also makes cutouts for the lab scene (see `CUTOUTS` in
`scripts/build-media.mjs`). Each cutout gets a toned exterior (`*-cut.webp`) and a
radiograph plate for the X-ray (`*-xray.webp`, edges and density from the photo).
A render on white is cut out by flood fill; a photo is cut out along a traced
`polygon`, and `straighten` removes part of the camera tilt so it matches the room
camera. The transform used is written to `src/components/lab/stations/cutouts.json`,
and the station maps its traced internals through it, so they stay registered
when the cutout is rebuilt. The Rhythm Punch and the gearbox are made this way.

`hero.focus` on a work entry (`{ x, y, label }`, 0–1 of the image) sets where the
inspection magnifier looks.

### Drawings

Add entries to `src/content/drawings.js`:

```js
{ image: 'drawings/still-life', title: 'Still life', year: 2025, medium: 'Graphite', alt: '…' }
```

Add `sketch: 'drawings/still-life-sketch'` if you have a photo of an earlier stage
taken at the same framing; that piece then gets an X-ray reveal.

### Piano recordings

Add entries to `recordings` in `src/content/piano.js`. Audio files go in
`public/media/audio/`. Nothing autoplays; every recording waits for the visitor to
press play.

### X-ray interiors

Interiors are SVGs in `src/components/xray/layers/`, drawn in the photo's pixel
coordinates so they line up with the exterior. Anything that isn't real
documentation must say so on the drawing (for example "Illustrative cutaway").

Lab stations live in `src/components/lab/stations/`, one file each, listed in
`art.jsx`. Projects uses the real photo and CAD render. The other four are models
in centimetres drawn through one shared camera and light (`room3d.js`, rendered by
`kit3d.jsx`); the bench in `Scenery.jsx` uses the same camera, so everything shares
one perspective. Each model is drawn twice: lit for the room, and as a radiograph
of the same faces for the X-ray. `kit.jsx` holds the shared tonal ramp, filters
and labels. Illustrated stations carry an "Illustration" tag and the room's key
marks which parts are real renders or photos.

The light box shows sheets from `drawings.js` when there are any (and their
`sketch` stage through the X-ray); with no entries the sheets stay blank.

### Awards

An entry with `award` (see Threshold in `work.js`) gets the featured layout on the
Projects page, an award line in the lab cluster and on its detail page, and the
small link under the name on the homepage. Keep the award wording exact. `event`,
`date`, `role`, `contribution` and `teammates` are `null` until supplied; they show
up automatically once filled in. Add screenshots by giving the entry a
`hero.image` and removing `hero.plate`.

## Deployment

`vercel.json` rewrites all routes to `index.html` so deep links work, and caches
`/media/*` for a week.
