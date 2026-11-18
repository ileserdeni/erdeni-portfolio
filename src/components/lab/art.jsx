// Station objects for the lab room. Every station has an Exterior (what you see at
// rest) and an Interior (its structure, through the X-ray) in the same viewBox, so
// the two register. Projects is built from the real photo and CAD render; the other
// stations are illustrations modelled in the shared room camera (room3d.js).

import * as drawingsStation from './stations/drawings';
import * as experienceStation from './stations/experience';
import * as pianoStation from './stations/piano';
import * as projectsStation from './stations/projects';
import * as researchStation from './stations/research';

const station = (m) => ({ viewBox: m.viewBox, Exterior: m.Exterior, Interior: m.Interior });

export const research = station(researchStation);
export const projects = station(projectsStation);
export const experience = station(experienceStation);
export const drawings = station(drawingsStation);
export const piano = station(pianoStation);
