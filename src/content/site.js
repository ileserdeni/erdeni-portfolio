// Site-wide facts. Edit here; every page reads from this file.

export const site = {
  name: 'Erdeni Iles',
  disciplines: ['Mechanical Engineering', 'Robotics', 'Art'],
  location: 'Boston, MA',
  intro:
    'I study mechanical engineering at Boston University. In the lab I build hardware for thin-film optics experiments and print microscale parts on a Nanoscribe; outside it, I prototype machines, draw, and play piano. Most of what I make starts with wanting to see how something works on the inside.',
  // One line on the wall of the homepage lab.
  labline: 'Most of what I make starts with wanting to see how something works on the inside.',
  email: 'iles.erdeni@gmail.com',
  linkedin: 'https://www.linkedin.com/in/erdeni-iles-674a17272/',
  // Replace the PDF at this path to update the résumé everywhere.
  resume: {
    href: '/files/Erdeni-Iles-Resume.pdf',
    label: 'Résumé (PDF)',
  },
};

// Section pages, used by the footer and the mobile menu.
export const nav = [
  { label: 'Research', to: '/research' },
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Drawings', to: '/drawings' },
  { label: 'Piano', to: '/piano' },
  { label: 'About', to: '/about' },
];
