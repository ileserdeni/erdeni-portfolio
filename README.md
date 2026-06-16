# Erdeni Iles — Portfolio

A sleek, minimal personal portfolio for a mechanical engineering student. Built with React, Vite, Tailwind CSS, and Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project structure

```
src/
├── components/
│   ├── background/     # Engineering grid & blueprint visuals
│   ├── layout/         # Navbar, Footer, SectionWrapper
│   ├── sections/       # Hero, About, Projects, Skills, Experience, Contact
│   └── ui/             # Button, ProjectCard
├── data/               # Projects, skills, experience content
├── App.jsx
├── main.jsx
└── index.css
```

## Customization

- **Content**: Edit files in `src/data/`
- **Project images**: Add JPGs to `public/projects/` (filenames match `src/data/projects.js`)
- **Resume**: Place PDF at `public/resume.pdf`
- **Social links**: Update placeholders in `src/components/sections/Contact.jsx`
- **Accent color**: Change `--color-accent` in `src/index.css`

## Build

```bash
npm run build
npm run preview
```
