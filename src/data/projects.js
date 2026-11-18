export const projects = [
  {
    id: 'heimdall',
    slug: 'heimdall',
    title: 'Heimdall',
    category: 'Hackathon · Search & Rescue · Embedded',
    description:
      'Offline search-and-rescue station that finds coded acoustic beacons without GPS or cellular, then aims a thermal camera at the highest-priority victim. Finalist — Top 5 of 32 at Code Metal Forge.',
    problem:
      'In a collapsed building or wildfire zone, phones may have no signal and GPS can be useless indoors. Rescuers still need a way to find people who can make sound — and aim a thermal camera at the right direction without guessing.',
    decisions:
      'We skipped cloud services and cellular entirely. Victims emit coded acoustic chirps from a phone web app or a small ESP32 Tag. The station listens with a four-mic array, estimates bearing, and drives a servo pan-tilt so the thermal camera points at the selected source.\n\nI owned hardware integration: Raspberry Pi 5, mic array, thermal camera, pan-tilt, soldering, cable routing, and calibration for a live demo that had to survive being picked up and walked around.',
    build:
      'The wearable station packs the Pi, glowing mic array, controller board, and thermal head onto a handheld frame. Operator UI runs over local Wi-Fi. Beacon phones expose SEND SOS plus floor, relay, and fall-detection settings so the demo could show multi-victim priority without pretending we had cell towers.',
    result:
      'At 4 m in calibration tests, the station decoded 95% of acoustic signals and estimated an 89.5° mean bearing for a source placed at 90°. That was enough for judges to watch the thermal head swing onto the correct person live.',
    tools: [
      'Raspberry Pi 5',
      'reSpeaker 4-mic',
      'Thermal camera',
      'Servo pan-tilt',
      'ESP32',
      'Python',
      'FastAPI',
    ],
    thumbnail: '/projects/heimdall-wearable.jpg',
    videos: [
      {
        src: '/projects/heimdall/demo.mp4',
        label: 'Live demo — acoustic decode and thermal pan-tilt',
      },
    ],
    images: [
      {
        src: '/projects/heimdall-wearable.jpg',
        caption:
          'Wearable station: Pi, mic array, and thermal pan-tilt on a handheld frame built for walking demos.',
      },
      {
        src: '/projects/heimdall-station-hand.jpg',
        caption:
          'Layout with Pi case, mic array, controller board, breadboard, and thermal camera.',
      },
      {
        src: '/projects/heimdall-sos-ui.jpg',
        caption: 'Victim beacon UI — SEND SOS with condition and people-with-you inputs.',
      },
      {
        src: '/projects/heimdall-operator-ui.jpg',
        caption: 'Operator view over local Wi-Fi: victims, bearing, and thermal feed.',
      },
      {
        src: '/projects/heimdall-tag-board.jpg',
        caption: 'ESP32 Tag prototype with Grove sensors, SOS button, and touch pads.',
      },
    ],
    role: 'Hardware integration lead — Team 31',
    timeline: 'Fall 2026 · Code Metal Forge · Finalist (Top 5 of 32)',
  },
  {
    id: 'cordganizer',
    slug: 'cordganizer',
    title: 'Cordganizer',
    category: 'CIM · Robotics · Production Planning',
    description:
      'Automated cell that machines and assembles a two-piece Cordganizer from raw stock using UR arms, Haas mills, AGVs, and conveyor — with BUMES scripts timed to keep the bottleneck mill fed.',
    problem:
      'In BU’s ADML cell, lid and body blanks have to move through inventory, conveyor, robot tenders (Mary / Edie / Rosie), two mill programs, and final assembly without deadlocking shared resources. Idle mill time kills throughput; releasing a robot too early collides with an unfinished cut.',
    decisions:
      'Lid (A/C) and body (B/D) run as separate parallel processes. Within each process, tasks stay sequential; across processes they overlap after startupTasksComplete() so the next lot can enter while the first is still machining.\n\nResource seize/release is explicit: seize Mary only for load/unload, release her during the mill cut so she can move a finished lid while Cayenne is still cutting. Unload waits on the mill program finishing — annotated as a hard safety boundary in the BUMES script.\n\nRouting analysis rounded steps to 10 s, counted empty pallets as WIP, and flagged body machining at 340 s / utilization 1.00 as the cell bottleneck.',
    build:
      'I wrote and annotated BUMES scripts for lid and body: AGV + Rosie move empty pallets onto the conveyor, Mary/Edie pull blanks from gravity feeders, load Haas toolpaths (MakeLid / MakeBody), unload, stage inventory, and hand off to Rosie for AssembleAToB.\n\nEpoch-timestamped BUMES reports logged every resourceSeize / urDashboard call so we could measure task times against the routing diagram instead of guessing where time went.',
    result:
      'Body machining was the clear bottleneck (340 s, utilization 1.0). Assembly took 130 s once both parts arrived. The cell produced finished Cordganizers through coordinated mill tending and robotic assembly rather than one-off teleop demos.',
    tools: [
      'BUMES',
      'Universal Robots',
      'Haas CNC',
      'AGV / conveyor',
      'Fusion 360 CAM',
      'Routing analysis',
    ],
    thumbnail: '/projects/cordganizer/thumb.jpg',
    videos: [
      {
        src: '/projects/cordganizer/assembly.mp4',
        label: 'Robotic assembly sequence — lid to body',
      },
      {
        src: '/projects/cordganizer/machining.mp4',
        label: 'CNC machining sequence for Cordganizer parts',
      },
    ],
    images: [
      {
        src: '/projects/cordganizer/machine-still.jpg',
        caption: 'Haas mill cutting Cordganizer stock in the ADML cell.',
      },
      {
        src: '/projects/cordganizer/routing-diagram.png',
        caption:
          'Routing diagram with step times and utilizations — body machining marked as bottleneck.',
      },
      {
        src: '/projects/cordganizer/bumes-lid-script.png',
        caption:
          'Annotated BUMES lid script: parallel processes, Mary release during mill cut, safety wait before unload.',
      },
      {
        src: '/projects/cordganizer/timing-analysis.png',
        caption: 'Task-level timing table derived from epoch timestamps in the BUMES report.',
      },
      {
        src: '/projects/cordganizer/bumes-body-script.png',
        caption: 'Body process script — Edie tends the longer mill program that sets cell takt.',
      },
    ],
    role: 'CIM process, BUMES scripting, and timing analysis',
    timeline: 'Fall 2026 · Boston University · ME345',
  },
  {
    id: 'epic-box',
    slug: 'epic-box',
    title: 'EPIC Box',
    category: 'Manufacturing · CAM · Robotic Assembly',
    description:
      'Two-piece HDPE enclosure designed for vise clamping and robot gripping, machined on Haas mills and assembled by UR arms in a three-robot production cell.',
    problem:
      'The enclosure had to be machinable from HDPE blanks, grippable by a UR5, and press-fit assemblable without human fingers in the loop. A pretty CAD model that needed hand finishing would fail the cell.',
    decisions:
      'Features were sized for vise jaws and robot fingers first, aesthetics second. Fusion 360 CAM owned the toolpaths; BUMES owned tending, transfer, and assembly order. We compared alternate production sequences specifically to cut idle time on the mills and arms.',
    build:
      'Base and lid were CAM’d, simulated, then cut on Haas mills. Cell layout used three UR5 stations, two mills, conveyor, and a vision check. Teach-pendant waypoints and digital I/O handled machine-tending motions.',
    result:
      'Finished HDPE assemblies came off the line with carabiner cutouts and mating features that robots could actually hold and press together — validated in CAM simulation and on the physical cell.',
    tools: [
      'Fusion 360 CAM',
      'Haas CNC',
      'Universal Robots',
      'Machine vision',
      'HDPE',
      'BUMES',
    ],
    thumbnail: '/projects/epic-box-machined.jpg',
    videos: [
      {
        src: '/projects/epic-box/cnc.mp4',
        label: 'CNC machining of EPIC Box parts',
      },
      {
        src: '/projects/epic-box-lid-simulation.mov',
        label: 'CAM simulation — lid toolpath',
      },
    ],
    images: [
      {
        src: '/projects/epic-box-machined.jpg',
        caption:
          'Machined HDPE assembly with carabiner cutout — designed around vise and gripper geometry.',
      },
      {
        src: '/projects/epic-box-cad-assembly.jpg',
        caption: 'Exploded CAD of lid and base.',
      },
      {
        src: '/projects/epic-box-cam.jpg',
        caption: 'Fusion 360 CAM simulation for the base.',
      },
      {
        src: '/projects/epic-box-cell-layout.png',
        caption: 'ADML cell: three UR5s, two Haas mills, conveyor, annotated part flow.',
      },
      {
        src: '/projects/epic-box-ur-pendant.jpg',
        caption: 'UR teach pendant — waypoints and I/O for tending.',
      },
      {
        src: '/projects/epic-box-vision.jpg',
        caption: 'Vision station checking parts on the line.',
      },
    ],
    role: 'CAM, robotic process, and enclosure design',
    timeline: 'Fall 2026 · Boston University',
  },
  {
    id: 'ur5-force-assembly',
    slug: 'ur5-force-guided-assembly',
    title: 'UR5 Force-Guided Assembly',
    category: 'Robotics · Force Control · Assembly',
    description:
      'Independently programmed and debugged a UR5 to align a lid, press-fit it onto an enclosure using force feedback, and unload the assembled part in a 60-second cycle.',
    problem:
      'Open-loop lid placement misses when parts sit a few millimeters off. Press-fitting by position alone either fails to seat or overloads the part and the robot. The cell needed a repeatable assemble-and-unload cycle without a human babysitting each press.',
    decisions:
      'Force feedback closed the loop on the press: approach in free space, then switch to force-guided seating so the lid finds the enclosure features instead of relying on perfect fixture tolerance. Cycle budget was hard-capped at 60 seconds including unload.',
    build:
      'I wrote and stepped through the UR program on the teach pendant — waypoint alignment, force-mode press, success/fail thresholds, and unload to the outbound pose. Debugging focused on contact detection false positives and press depth that looked fine in air but crushed soft stock.',
    result:
      'Stable 60-second cycles: align → force-guided press-fit → unload. The same force-guided mindset carried into larger CIM assembly sequences where position-only mating was not enough.',
    tools: [
      'UR5',
      'Force feedback',
      'Teach pendant',
      'Assembly sequencing',
    ],
    thumbnail: '/projects/epic-box-ur-pendant.jpg',
    images: [
      {
        src: '/projects/epic-box-ur-pendant.jpg',
        caption: 'UR teach pendant used to program and debug force-guided assembly motions.',
      },
      {
        src: '/projects/epic-box-machined.jpg',
        caption: 'Enclosure geometry the lid had to align to and press-fit against.',
      },
    ],
    role: 'Independent UR5 programming and debug',
    timeline: 'Fall 2026 · Boston University',
  },
  {
    id: 'threshold',
    slug: 'threshold',
    title: 'Threshold',
    category: 'Hackathon · Health Data',
    description:
      'Eligibility linter and patient finder across 1,011 recruiting Massachusetts cancer trials. 2nd Place — Health & Biotech at Hackachusetts × DS+X.',
    problem:
      'Trial eligibility text quietly excludes people. Protocol teams rarely see which rules drive the exclusion, or how those rules sit against county health data.',
    decisions:
      'Parse ClinicalTrials.gov criteria, flag restrictive language, and suggest more inclusive wording grounded in guidance. Pair barriers with CDC PLACES and MassGIS county layers so the map is not just geography — it is exclusion intensity next to health burden.',
    build:
      'I led front-end and UI: landscape of restriction rates, county map, and patient-facing finder. Built in ~11 hours with Andria Chen, Arush Vyas, and Namig Mirzayev.',
    result:
      'Held-out extraction hit 92% recall and 98% precision on 10 unseen trials. 2nd Place, Health & Biotech Track.',
    tools: ['Next.js', 'ClinicalTrials.gov', 'CDC PLACES', 'MassGIS', 'UI design'],
    thumbnail: '/projects/threshold-home.png',
    images: [
      {
        src: '/projects/threshold-home.png',
        caption: 'Threshold home — Fair eligibility. More possibility.',
      },
      {
        src: '/projects/threshold-landscape.png',
        caption: 'Restriction rates across 1,011 Massachusetts-linked trials.',
      },
      {
        src: '/projects/threshold-map.png',
        caption: 'County map: exclusions vs health and environmental-justice data.',
      },
    ],
    role: 'Front-end and UI design lead — Team Threshold',
    timeline: 'Fall 2026 · Hackachusetts × DS+X · 2nd Place, Health & Biotech',
  },
  {
    id: 'thermocapillary',
    slug: 'thermocapillary-thin-film-research',
    title: 'Thermocapillary Thin Film Research',
    category: 'Research · Optics · Fluids',
    description:
      'Underwater silicone-oil thin film coupled to an optical fiber — IR heating drives thermocapillary thickness change that steers guided green light.',
    problem:
      'A free underwater oil film wants to rupture or thicken unevenly. Without a stable film, there is no waveguide to heat, and no optical steering to measure.',
    decisions:
      'Stabilize the film with surfactants before chasing fancy optical results. IR wavelength is chosen to absorb in the oil so heating stays local. Fixtures are designed in CAD around the tank, fiber, and alignment constraints of a wet optical bench.',
    build:
      'Current work: surfactant trials, film formation troubleshooting, fiber coupling, and hardware for holding the underwater film without killing the optical path.',
    result:
      'Ongoing lab project — success metric is a repeatable film that holds long enough for IR-driven beam steering measurements.',
    tools: [
      'Optics',
      'Thin films',
      'Thermocapillary flow',
      'Surfactants',
      'CAD',
      'Experimental design',
    ],
    thumbnail: '/projects/thin-film-main.jpeg',
    images: [
      {
        src: '/projects/thin-film-main.jpeg',
        caption: 'Green light coupled into the underwater thin-film setup through an optical fiber.',
      },
      {
        src: '/projects/thin-film-holder-top.jpeg',
        caption: 'Top view during film stabilization testing.',
      },
      {
        src: '/projects/thin-film-water-tank.jpeg',
        caption: 'Side view of the underwater tank and fixture.',
      },
    ],
    role: 'Research Assistant — Applied Interfacial Phenomena Lab',
    timeline: 'September 2025 — Present',
  },
  {
    id: 'microlens-nanoscribe',
    slug: 'microlens-fabrication-nanoscribe',
    title: 'Microlens Fabrication Using Nanoscribe',
    category: 'Microfabrication · Optics',
    description:
      'Two-photon polymerization process for precision microlenses and lab fixtures on BU’s Nanoscribe — aimed at repeatable micro-optics, not one-off prints.',
    problem:
      'Microlenses for fluid-interface experiments need feature sizes and surface quality that ordinary 3D printers cannot hit. Process parameters that work once still fail the next day without a locked workflow.',
    decisions:
      'Treat Nanoscribe as a manufacturing process: CAD prep, print parameters, material choice, and inspection under microscope before claiming a “good” lens. Completed 9+ hours of required training before unsupervised runs.',
    build:
      'CAD for nanoscale printability, parameter sweeps, polymer comparisons for lens fabrication, and fixtures that support forming lenses at a fluid interface.',
    result:
      'Working high-resolution microstructures and an improving process window for microlens arrays used in the interfacial optics workstream.',
    tools: [
      'Nanoscribe',
      'Two-photon polymerization',
      'Microlenses',
      'Microfabrication',
      'CAD',
    ],
    thumbnail: '/projects/Mircolense_1.JPG',
    images: [
      {
        src: '/projects/microlense1.JPG',
        caption: 'Nanoscribe-fabricated microstructure for microlens process development.',
      },
      {
        src: '/projects/microlense2.JPG',
        caption: 'Microscope inspection of print quality.',
      },
      {
        src: '/projects/Mircolense_1.JPG',
        caption: 'Nanoscribe Photonic Professional GT chamber during setup.',
      },
      {
        src: '/projects/Microlense_2.JPG',
        caption: 'Printed structure on glass next to a finger for scale.',
      },
      {
        src: '/projects/Microlense_4.JPG',
        caption: 'NanoWrite interface and live camera during a multilens job.',
      },
    ],
    role: 'Research Assistant — Applied Interfacial Phenomena Lab',
    timeline: 'September 2025 — Present',
  },
  {
    id: 'rhythm-game',
    slug: 'electromechanical-rhythm-game',
    title: 'Electromechanical Rhythm Game',
    category: 'Mechatronics · Product Design',
    description:
      'Rhythm Punch turns Guitar Hero-style tracks into physical notes — solenoids pop buttons up; limit switches score the hits.',
    detailedDescription:
      'Instead of notes only on a screen, solenoids physically raise buttons in sync with the track while limit switches detect hits and update score.\n\nI owned CAD layout and mechanical packaging: laser-cut housing, 3D-printed buttons, MOSFET-driven solenoids, LED matrix, speakers, and display. Early cardboard prototypes failed tolerance; the final enclosure fixed mounting, wiring baseplate, and control-panel placement.\n\nTesting showed stronger actuation than release — electromagnetic pull vs spring return — which set the cutoff timing for short notes.',
    tools: [
      'CAD',
      'Arduino',
      'Solenoids',
      'Limit switches',
      'Laser cutting',
      '3D printing',
    ],
    thumbnail: '/projects/rhythm-game-main.jpg',
    images: [
      '/projects/rhythm-game-main.jpg',
      '/projects/rhythm-game-housing.jpg',
      '/projects/rhythm-game-controls.jpg',
      '/projects/rhythm-game-wiring2.jpg',
      '/projects/rhythm-game-block-diagram.jpg',
      '/projects/rhythm-game-testing.jpg',
    ],
    role: 'CAD, housing, and electromechanical integration',
    timeline: 'Spring 2026 · Boston University',
    caseStudy: {
      subtitle: 'Rhythm Punch',
      tagline: 'Digital → Physical',
      overview:
        'Rhythm Punch converts Guitar Hero-style tracks into physical gameplay. Solenoid-actuated buttons pop up in sync with the music; limit switches detect hits and update the score.',
      systemFlow: [
        'User chooses a track and difficulty',
        'Track data becomes timed note commands',
        'Microcontroller drives solenoids',
        'Notes physically pop up in sync with music',
        'Hit sensors check timing and update score',
      ],
      housing: {
        description:
          'Laser-cut enclosure with internal supports for actuators and electronics. Cardboard prototypes failed tolerance; the final build tightened fit, button mounts, and front-panel layout.',
        gallery: [
          {
            src: '/projects/rhythm-game-housing.jpg',
            label: 'Outer housing prototype',
          },
          {
            src: '/projects/rhythm-game-controls.jpg',
            label: 'Inner components & control panel',
          },
          {
            src: '/projects/rhythm-game-main.jpg',
            label: 'Final housing',
          },
        ],
      },
      components: [
        { name: 'Solenoids', detail: 'Pull-type actuators that raise each note button.' },
        { name: 'Limit switches', detail: 'Roller switches for hit detection.' },
        { name: 'Microcontroller', detail: 'Sequencing, scoring, actuator control.' },
        { name: 'LCD display', detail: 'Track, level, and score feedback.' },
        { name: 'LED matrix', detail: 'Visual note preview on the play surface.' },
        { name: 'SD card', detail: 'Level and audio track storage.' },
        { name: 'Audio DAC', detail: 'Gameplay audio output.' },
        { name: 'Power / drivers', detail: 'Solenoid drive and interface power.' },
      ],
      wiring:
        'Wiring consolidated on a baseplate. Solenoids use drivers and removable connectors so a failed coil can be swapped without rewiring the board.',
      wiringImage: '/projects/rhythm-game-wiring2.jpg',
      blockDiagram: '/projects/rhythm-game-block-diagram.jpg',
      prototypeIteration:
        'First prototype: cardboard and tape, poor tolerance. Final version: measured fits, better panel placement, 3D-printed buttons.',
      testingResults:
        'Switch reliability and short-note actuation were the gates. Actuation outperformed release because pull is electromagnetic and return is spring — that set timing cutoffs.',
      testingImage: '/projects/rhythm-game-testing.jpg',
      contribution:
        'CAD layout, mechanical packaging, laser-cut structure, button/interface integration, and physical assembly.',
      prototypeDemo: {
        description: 'Demo of the electromechanical rhythm game.',
        youtubeEmbedUrl: 'https://www.youtube.com/embed/upo_cHmujE0',
      },
    },
  },
  {
    id: 'gearbox',
    slug: 'gearbox-cad-design',
    title: 'Gearbox CAD Design',
    category: 'Mechanical Design · CAD',
    description:
      'Full gearbox assembly in SolidWorks — gears, shafts, housing, and packaging with assembly constraints that actually mate.',
    problem:
      'A gearbox model is useless if shafts float, gears don’t mesh on centers, or the housing can’t close around the stack.',
    decisions:
      'Model parts parametrically, constrain the assembly to real mate conditions, and document with technical drawings instead of screenshot-only submissions.',
    build:
      'Individual part models, gear train and shaft layout, housing geometry, and drawing package for a mechanical engineering CAD course.',
    result:
      'Clean, constrained assembly that communicates how the mechanism packs and turns.',
    tools: ['SolidWorks', 'Assemblies', 'Gear systems', 'Technical drawings'],
    thumbnail: '/projects/gearbox.png',
    images: [
      {
        src: '/projects/gearbox.png',
        caption: 'Gear train, motors, shafts, and mounting plates in one assembly.',
      },
    ],
    videos: [{ src: '/projects/gearbox-video.mp4', label: 'Gearbox assembly view' }],
    role: 'Course project',
    timeline: 'Fall 2025',
  },
  {
    id: 'temperature-monitor',
    slug: 'room-temperature-monitoring-system',
    title: 'Room Temperature Monitoring System',
    category: 'Electronics · Embedded',
    description:
      'Portable Arduino + TMP36 monitor with LCD readout and LED/buzzer alerts outside 70–80°F, in a laser-cut / 3D-printed enclosure.',
    problem:
      'A breadboard thermometer isn’t something you leave in a room. It needed a real enclosure, a clear display, and an obvious alert when temperature drifts.',
    decisions:
      'TMP36 into Arduino for the reading, LCD for the human, threshold logic for 70–80°F with LED + buzzer so you don’t have to stare at the screen.',
    build:
      'Sensor circuit, firmware for convert/display/alert, and a custom enclosure to hold the board and make it portable.',
    result:
      'Working handheld unit that reads continuously and alarms outside the band.',
    tools: ['Arduino', 'TMP36', 'LCD', 'Laser cutting', '3D printing'],
    thumbnail: '/projects/thermostat_main_photo.jpg',
    images: [
      {
        src: '/projects/thermostat_main_photo.jpg',
        caption: 'Completed monitor with LCD, LEDs, buzzer, and enclosure.',
      },
      {
        src: '/projects/thermostat_new_photo.jpg',
        caption: 'Alternate view of enclosure and layout.',
      },
      {
        src: '/projects/thermostat_code1.PNG',
        caption: 'TMP36 read and temperature conversion.',
      },
      {
        src: '/projects/thermostat_code2.PNG',
        caption: 'Threshold alerts and LCD output.',
      },
    ],
    videos: [
      { src: '/projects/thermostat_video.MOV', label: 'Monitor demo' },
    ],
    role: 'Course project',
    timeline: 'Spring 2025',
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
