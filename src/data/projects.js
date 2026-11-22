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
      'No cloud, no cellular. Victims emit HEIMDALL-AC1 acoustic chirps from a phone web app or ESP32 Tag. A Seeed reSpeaker XVF3800 4-mic array feeds GCC-PHAT bearing estimation; a servo pan-tilt aims the thermal camera.\n\nI owned station hardware: Raspberry Pi 5 integration, mic-array geometry/mount, thermal + pan-tilt (Seeeduino serial), soldering, cable routing, and live-demo wiring that had to survive being carried.',
    build:
      'Station runs a modular FastAPI “Ear” on the Pi (HTTPS over a local HEIMDALL hotspot). Audio path: XVF3800 USB DFU firmware → 6ch @ 16 kHz → decode on the conference/ASR channel → GCC-PHAT on the four raw mics (6.65 cm square, cable = rear).\n\nPan-tilt auto mode ranks confirmed victims (critical > injured > no_response > ok), ignores low-confidence bearings, and holds ≥1.5 s between moves so servo noise does not wreck the mic array. Relayed frames publish no bearing — auto-aim never points at the relay phone.',
    result:
      'At 4 m: 95% decode rate, mean bearing 89.5° for a source at 90°. At 2 m calibration: +90° → 86.6 ± 0.9°, −90° → −99.7 ± 0.5° with the phone speaker aimed at the puck. Line-of-sight and speaker orientation mattered more than fancy post-processing.',
    technical:
      'Bearing estimator: band-limited cross-spectrum with partial PHAT weighting (β = 0.7, tuned on 2 m / 4 m recordings — full PHAT was brittle in room noise). Far-field τᵢⱼ = −(pᵢ − pⱼ) · û / c is scored on an upsampled lag grid; coarse curve over −180…180°, then optional multi-frame accumulation per victim id.\n\nMic coordinates (m, front = +x / 0°): ch4 (+0.03325, −0.03325), ch5 (+0.03325, +0.03325), ch2 (−0.03325, +0.03325), ch3 (−0.03325, −0.03325). bearing_offset_deg corrects mount error. New IDs stay unconfirmed until a second frame within 60 s.',
    tools: [
      'Raspberry Pi 5',
      'reSpeaker XVF3800',
      'GCC-PHAT',
      'Thermal + pan-tilt',
      'ESP32',
      'FastAPI / WebSocket',
      'Soldering',
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
          'Wearable station: Pi, mic array, and thermal pan-tilt on a handheld frame for walking demos.',
      },
      {
        src: '/projects/heimdall/wiring.jpg',
        caption:
          'Wiring harness — Pi power/data, mic USB (XMOS port), Seeeduino for pan-tilt/knock, routed for demo reliability.',
      },
      {
        src: '/projects/heimdall/thermal-pantilt.jpg',
        caption:
          'Thermal camera on the dual-servo pan-tilt head driven over USB serial from pantilt.py.',
      },
      {
        src: '/projects/heimdall/servo.jpg',
        caption: 'Pan-tilt mechanics and servo mounts under test before station integration.',
      },
      {
        src: '/projects/heimdall-operator-ui.jpg',
        caption: 'Operator UI over local Wi-Fi: victims, bearing, thermal MJPEG.',
      },
      {
        src: '/projects/heimdall-tag-board.jpg',
        caption: 'ESP32 Tag prototype — Grove sensors, SOS button, touch pads.',
      },
    ],
    role: 'Hardware integration lead — Team 31 (pantilt / thermal / station build)',
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
      'I wrote and annotated BUMES scripts for lid and body: AGV + Rosie move empty pallets onto the conveyor, Mary/Edie pull blanks from gravity feeders, load Haas toolpaths (MakeLid / MakeBody), unload, stage inventory, and hand off to Rosie for AssembleAToB.\n\nOn Mary’s Polyscope pendant I built the local UR program (thu8am_lab1): MoveJ to pHome / invA, MoveL approaches, Set DO[0] for the gripper, and beginForceSeek with If force() ≤ 65 so contact is sensed instead of hoping position alone seats the part. Program loops forever on the real robot for cell demos.\n\nEpoch-timestamped BUMES reports logged every resourceSeize / urDashboard call so we could measure task times against the routing diagram.',
    result:
      'Body machining was the clear bottleneck (340 s, utilization 1.0). Assembly took 130 s once both parts arrived. Force-seek on Mary kept press-fit assembly stable when fixture tolerance drifted.',
    technical:
      'Polyscope structure: Stack folders for palletize waypoints (StartPos / FromPos / ToPos), boolean part_found, Wait: 1.0 s settling, digital outputs for tooling, and force thresholding at 65 (UR force units) before committing the press. BUMES only calls urDashboard(.urp) after the matching resourceSeize — the pendant program owns the force logic.',
    tools: [
      'BUMES',
      'UR Polyscope',
      'Force seek',
      'Haas CNC',
      'AGV / conveyor',
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
        src: '/projects/cordganizer/mary.jpg',
        caption:
          'Mary’s teach pendant — Polyscope program with MoveJ/MoveL, DO gripper control, and beginForceSeek / force() ≤ 65.',
      },
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
    ],
    role: 'CIM process, BUMES scripting, UR Polyscope, timing analysis',
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
      'Base and lid were programmed in Fusion Manufacture: face, 2D adaptive / offset roughing, contour, bore, and chamfer ops (separate setups for Base_v2_CAM and lid). Simulated both, then cut HDPE on Haas mills. Cell used three UR5 stations, two mills, and conveyor for tending and assembly.',
    result:
      'Finished HDPE assemblies with carabiner cutouts and mating features sized for vise + gripper — validated in CAM comparison mode and on the physical cell.',
    technical:
      'Lid setup example: Face → Adaptive Roughing → Offset Roughing → Contour ×3 → Chamfer. Base setup: Face → Offset Roughing → Bore → Chamfer. Stock comparison colorization in simulation catches leftover material before a tool crashes the vise.',
    tools: [
      'Fusion 360 CAM',
      'Haas CNC',
      'Universal Robots',
      'HDPE',
      'BUMES',
    ],
    thumbnail: '/projects/epic-box/cnc-still.jpg',
    videos: [
      {
        src: '/projects/epic-box/cnc.mp4',
        label: 'CNC machining of EPIC Box parts on the Haas',
      },
      {
        src: '/projects/epic-box/base-simulation.mp4',
        label: 'Fusion CAM simulation — Base_v2_CAM (Face, Offset Roughing, Bore, Chamfer)',
      },
      {
        src: '/projects/epic-box-lid-simulation.mov',
        label: 'Fusion CAM simulation — lid toolpath',
      },
    ],
    images: [
      {
        src: '/projects/epic-box/cnc-still.jpg',
        caption: 'Haas mill cutting EPIC Box HDPE stock.',
      },
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
        src: '/projects/epic-box-cell-layout.png',
        caption: 'ADML cell: three UR5s, two Haas mills, conveyor, annotated part flow.',
      },
    ],
    role: 'CAM, robotic process, and enclosure design',
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
      'Trial protocols copy exclusions forward. Rules like “known HIV infection” or “must speak English” often are not science — they shut people out before anyone looks at their cancer. Protocol teams rarely see how often each rule appears or what it costs by county.',
    decisions:
      'Treat eligibility as a linter problem: extract restriction types from ClinicalTrials.gov free text, score them against FDA / guidance citations, and put rates next to CDC PLACES health and MassGIS environmental-justice layers.\n\nScreens: Landscape (13 restriction categories × 1,011 trials), Map (county rates + “who gets turned away” walkthrough), Linter (Claude or in-browser keyword rules), Find Trials (patient-side prototype).',
    build:
      'I led front-end and UI design for the Next.js dashboard — landscape bars, county map panel, linter layout, and patient finder. Built in ~11 hours with Andria Chen, Arush Vyas, and Namig Mirzayev.\n\nExtraction used the same prompt path as the offline corpus; every flag must quote the criteria word-for-word before it shows. Keyword-rules mode keeps confidential drafts in-browser.',
    result:
      'Held-out set (10 trials labeled blind after prompt tuning): 46/50 restrictions caught (recall 92%), 46/47 flags correct (precision 98%), F1 0.95. Across the corpus: 22% of phase 1–3 drug trials still exclude HIV outright; ~30% of supportive-care studies require a specific language. 2nd Place, Health & Biotech.',
    technical:
      'Human-labeled answer key on 42 trials (seeded sample by phase/sponsor/cancer + held-out 10). Weakest category called out openly (prior malignancy recall ~72% on the full 42). Data: ClinicalTrials.gov API v2, CDC PLACES 2023, MassGIS EJ 2020. Live app: patient-eligibility-linter.vercel.app.',
    tools: [
      'Next.js',
      'ClinicalTrials.gov API',
      'CDC PLACES',
      'MassGIS',
      'Claude extraction',
      'UI design',
    ],
    thumbnail: '/projects/threshold/main.png',
    images: [
      {
        src: '/projects/threshold/main.png',
        caption: 'Threshold — Fair eligibility. More possibility.',
      },
      {
        src: '/projects/threshold/landscape-desktop.png',
        caption:
          'Desktop Landscape — restriction rates across 1,011 MA cancer trials (HIV callout 34.3%).',
      },
      {
        src: '/projects/threshold/map-desktop.png',
        caption:
          'Desktop Map — county HIV restriction % with Suffolk detail (945 recruiting trials).',
      },
      {
        src: '/projects/threshold/linter-desktop.png',
        caption:
          'Desktop Criteria linter — paste inclusion/exclusion, Claude or keyword engine.',
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
    id: 'four-bar',
    slug: 'musical-four-bar-linkage',
    title: 'Musical Four-Bar Linkage',
    category: 'CAD · Kinematics · Laser Cutting',
    description:
      'Crank-rocker four-bar with laser-cut musical-note links — modeled and assembled in SolidWorks (Assem_final), then cut from DXF.',
    problem:
      'A four-bar is easy to draw and hard to get right: wrong link lengths lock, branch flips, or the transmission angle collapses. I wanted a mechanism that was both a valid Grashof crank-rocker and a laser-cuttable set of musical shapes.',
    decisions:
      'Model the full assembly in SolidWorks with pin joints and McMaster hardware, then export DXFs for laser cutting. Keep the kinematic skeleton a classic crank-rocker so one link can crank continuously while the rocker oscillates.',
    build:
      'Assem_final in SolidWorks: musical-note plates, spacers, screws, washers, and locknuts. The interactive viewer below is the exported GLB of that assembly; the clip shows the CAD motion study.',
    result:
      'A complete SolidWorks assembly that satisfies Grashof and is ready to laser-cut and pin together.',
    tools: [
      'SolidWorks',
      'Assemblies',
      'DXF / laser cutting',
      'Four-bar kinematics',
      'Grashof',
    ],
    thumbnail: '/projects/four-bar/thumb.jpg',
    interactive: 'four-bar',
    videos: [
      {
        src: '/projects/four-bar/assembly.mp4',
        label: 'Assem_final — SolidWorks motion / assembly view',
      },
    ],
    role: 'CAD course project — ME357',
    timeline: 'Fall 2025 · Boston University',
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
