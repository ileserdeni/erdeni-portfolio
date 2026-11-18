export const projects = [
  {
    id: 'thermocapillary',
    slug: 'thermocapillary-thin-film-research',
    title: 'Thermocapillary Thin Film Research',
    category: 'Research / Interfacial Phenomena / Optics / Fluids',
    description:
      'Developing an optical thin-film experiment using a silicone oil film suspended underwater and coupled to an optical fiber. The project explores how localized infrared heating creates thermocapillary thickness variations that modulate the film’s refractive index and steer guided green light. Current work focuses on stabilizing the underwater film using surfactants and designing supporting CAD fixtures, test hardware, and experimental setups.',
    detailedDescription:
      'I am working in an interfacial phenomena lab on an optical thin-film experiment using a silicone oil film suspended underwater. The film is coupled to an optical fiber that projects a beam of light through the film. When the film is thin enough, it can behave like an optical waveguide.\n\nThe experiment uses infrared illumination at an absorbing wavelength to locally heat the oil film. This creates a thermocapillary effect, changing the local thickness of the film. Since film thickness affects the optical behavior of the system, these changes can steer or shift the beam of light.\n\nMy current focus is stabilizing the underwater oil film using surfactants and designing the supporting experimental hardware. This includes CAD fixtures, test components, setup design, optical alignment, and troubleshooting the film formation process.',
    tools: [
      'Optics',
      'Thin films',
      'Interfacial phenomena',
      'Thermocapillary flow',
      'Surfactants',
      'CAD',
      'Experimental design',
    ],
    thumbnail: '/projects/thin-film-main.jpeg',
    images: [
      {
        src: '/projects/thin-film-main.jpeg',
        caption:
          'Green light coupled into the underwater thin-film experimental setup through an optical fiber.',
      },
      {
        src: '/projects/thin-film-holder-top.jpeg',
        caption:
          'Top view of the underwater thin-film experimental setup during film stabilization testing.',
      },
      {
        src: '/projects/thin-film-water-tank.jpeg',
        caption:
          'Side view of the underwater thin-film experimental setup during film stabilization testing.',
      },
    ],
    role: 'Research Assistant — Boston University College of Engineering',
    timeline: 'September 2025 — Present',
    process:
      'Thin-film stabilization, surfactant testing, CAD fixture design, optical fiber integration, infrared heating, and experimental troubleshooting.',
  },
  {
    id: 'microlens-nanoscribe',
    slug: 'microlens-fabrication-nanoscribe',
    title: 'Microlens Fabrication Using Nanoscribe',
    category: 'Microfabrication / Optics',
    description:
      'Designing and fabricating high-resolution microlenses and microscale optical components using a Nanoscribe two-photon polymerization system. This work supports thin-film optical experiments through custom microstructures, lab tools, and micro-optical components.',
    detailedDescription:
      'I use Boston University’s Nanoscribe two-photon polymerization system to fabricate highly detailed microscale structures, with a focus on developing a reliable manufacturing process for precision microlenses.\n\nBefore gaining access to the machine, I completed over 9 hours of required training to learn the full workflow, safety procedures, material handling, and system operation. My work involves preparing CAD models for nanoscale printing, setting print parameters, testing fabrication consistency, and evaluating print quality to improve repeatability.\n\nThe main goal of this project is to establish a dependable method for manufacturing extremely precise microlenses while gaining hands-on experience with advanced microfabrication technology and high-resolution additive manufacturing.',
    tools: [
      'Nanoscribe',
      'Two-photon polymerization',
      'Microlenses',
      'Microfabrication',
      'Optics',
      'CAD',
    ],
    thumbnail: '/projects/Mircolense_1.JPG',
    images: [
      {
        src: '/projects/microlense1.JPG',
        caption:
          'Nanoscribe-fabricated microlens/microstructure used for developing high-resolution optical component fabrication workflows.',
      },
      {
        src: '/projects/microlense2.JPG',
        caption:
          'Using a high resolution microscope to evaluate the fabrication quality of microstructures/microlenses.',
      },
      {
        src: '/projects/Mircolense_1.JPG',
        caption:
          'Open chamber of the Nanoscribe Photonic Professional GT during microlens fabrication setup.',
      },
      {
        src: '/projects/Microlense_2.JPG',
        caption:
          'Fabricated microscale structure on a glass substrate, shown next to a finger for scale.',
      },
      {
        src: '/projects/Microlense_3.JPG',
        caption:
          'Nanoscribe Photonic Professional GT system used for two-photon polymerization microlens fabrication.',
      },
      {
        src: '/projects/Microlense_4.JPG',
        caption:
          'NanoWrite interface and live camera feed during a Nanoscribe multilens print job.',
      },
    ],
    role: 'Research Assistant — Boston University College of Engineering',
    timeline: 'September 2025 — Present',
    process:
      'Nanoscribe training and certification, microlens fabrication, CAD preparation, print parameter setup, process optimization, repeatability testing, and microfabrication workflows.',
  },
  {
    id: 'heimdall',
    slug: 'heimdall',
    title: 'Heimdall',
    category: 'Hackathon / Search & Rescue / Embedded Systems',
    description:
      'Offline search-and-rescue station that finds coded acoustic beacons without GPS, internet, or cellular service, then aims a thermal camera toward the highest-priority victim. Finalist — Top 5 of 32 teams at Code Metal Forge.',
    detailedDescription:
      'Heimdall is an offline, sound-based search-and-rescue system built for disasters where networks may be down. Victims emit coded acoustic chirps from a phone web app or a small ESP32 Tag; the rescue station detects those chirps, estimates direction, and points a thermal camera toward the selected person.\n\nI led hardware integration for the station: assembling and wiring a Raspberry Pi 5, four-microphone array, thermal camera, and servo-driven pan-tilt head; soldering connections; and calibrating the array and pan-tilt for live demos.\n\nIn calibration tests at 4 m, the station decoded 95% of acoustic signals and estimated an 89.5° mean bearing for a source positioned at 90°.',
    tools: [
      'Raspberry Pi 5',
      'reSpeaker 4-mic array',
      'Thermal camera',
      'Servo pan-tilt',
      'ESP32',
      'Python',
      'FastAPI',
    ],
    thumbnail: '/projects/heimdall-station.jpg',
    images: [
      {
        src: '/projects/heimdall-station.jpg',
        caption:
          'Heimdall rescue-station prototype: Raspberry Pi, mic array, controller board, and thermal camera on a pan-tilt mount.',
      },
      {
        src: '/projects/heimdall-operator-ui.jpg',
        caption:
          'Operator UI over local Wi-Fi showing victims, bearing, and thermal feed.',
      },
      {
        src: '/projects/heimdall-thermal-pantilt.jpg',
        caption: 'Thermal camera on the servo-driven pan-tilt mount.',
      },
      {
        src: '/projects/heimdall-wiring.jpg',
        caption: 'Controller, breadboard, and sensor wiring during integration.',
      },
      {
        src: '/projects/heimdall-servo.jpg',
        caption: 'Pan-tilt servo wired for camera aiming.',
      },
    ],
    role: 'Hardware integration lead — Team 31',
    timeline: 'Fall 2026 · Code Metal Forge Hackathon · Finalist (Top 5 of 32)',
    process:
      'Hardware assembly, mic-array and pan-tilt calibration, acoustic decode testing, and live demo wiring.',
  },
  {
    id: 'threshold',
    slug: 'threshold',
    title: 'Threshold',
    category: 'Hackathon / Health Data',
    description:
      'Clinical-trial eligibility linter and patient finder covering 1,011 recruiting Massachusetts cancer trials. 2nd Place — Health & Biotech Track at Hackachusetts × DS+X.',
    detailedDescription:
      'Threshold reads the eligibility criteria of recruiting cancer trials with a Massachusetts site, flags rules that keep people out, and shows protocol teams more inclusive wording grounded in guidance. It pairs ClinicalTrials.gov records with county health and environmental-justice data.\n\nI led front-end and UI design for the dashboard: landscape of eligibility barriers, county map views, and the patient-facing trial finder.\n\nBuilt in about 11 hours with teammates Andria Chen, Arush Vyas, and Namig Mirzayev. Held-out extraction scored 92% recall and 98% precision on 10 unseen trials.',
    tools: [
      'Next.js',
      'ClinicalTrials.gov',
      'CDC PLACES',
      'MassGIS',
      'UI design',
    ],
    thumbnail: '/projects/threshold-home.png',
    images: [
      {
        src: '/projects/threshold-home.png',
        caption: 'Threshold home — Fair eligibility. More possibility.',
      },
      {
        src: '/projects/threshold-landscape.png',
        caption: 'Landscape view of restriction rates across 1,011 Massachusetts-linked trials.',
      },
      {
        src: '/projects/threshold-map.png',
        caption: 'County map comparing exclusions with health and environmental-justice data.',
      },
    ],
    role: 'Front-end and UI design lead — Team Threshold',
    timeline: 'Fall 2026 · Hackachusetts × DS+X · 2nd Place, Health & Biotech',
    process:
      'UI design, dashboard layout, and product framing for landscape, map, linter, and finder screens.',
  },
  {
    id: 'epic-box',
    slug: 'epic-box',
    title: 'EPIC Box',
    category: 'Manufacturing / Robotics / CAM',
    description:
      'Automated production process using three robotic arms, two Haas CNC mills, and a conveyor to machine a two-piece HDPE enclosure designed for robotic assembly.',
    detailedDescription:
      'For Computer Integrated Manufacturing at BU, I co-developed a production cell linking CNC machining, robotic tending, and assembly. Using Fusion 360 CAM, we machined a two-piece HDPE enclosure designed for robotic assembly.\n\nI programmed BUMES scripts for machine tending, part transfer, and assembly, and tested alternative production sequences to identify bottlenecks and reduce equipment idle time.',
    tools: [
      'Fusion 360 CAM',
      'Haas CNC',
      'Universal Robots',
      'Machine vision',
      'HDPE machining',
    ],
    thumbnail: '/projects/epic-box-lid.png',
    images: [
      {
        src: '/projects/epic-box-lid.png',
        caption: 'CAD top view of the pocketed HDPE lid designed for robotic assembly.',
      },
      {
        src: '/projects/epic-box-ur-pendant.jpg',
        caption: 'UR teach pendant with waypoints and digital I/O for machine-tending motion.',
      },
      {
        src: '/projects/epic-box-ur-program.jpg',
        caption: 'Polyscope program for pick/place and gripper actuation.',
      },
      {
        src: '/projects/epic-box-vision.jpg',
        caption: 'Machine-vision station checking parts on the line.',
      },
    ],
    role: 'CAM, robotic process, and enclosure design',
    timeline: 'Fall 2026 · Boston University',
    process:
      'Fusion 360 CAM, HDPE machining, UR programming, vision inspection, and production-sequence timing.',
  },
  {
    id: 'rhythm-game',
    slug: 'electromechanical-rhythm-game',
    title: 'Electromechanical Rhythm Game',
    category: 'Mechatronics / Product Design',
    description:
      'Rhythm Punch converts Guitar Hero-style tracks into physical gameplay with solenoid-actuated notes and limit-switch hit detection.',
    detailedDescription:
      'This project was a physical rhythm game inspired by Guitar Hero. Instead of displaying notes only on a screen, the system translated rhythm tracks into mechanical motion using solenoid-actuated notes.\n\nI worked on the CAD layout and physical prototype, including the structure, component placement, and mechanical packaging. The system integrated solenoids, limit switches, MOSFET drivers, speakers, an LED matrix, and display components.\n\nThe main challenge was combining mechanical design, electronics, and user interaction into one functional prototype. The final system turned digital rhythm input into a physical arcade-style experience.',
    tools: [
      'CAD',
      'Arduino',
      'Solenoids',
      'Limit switches',
      'MOSFET drivers',
      'Laser cutting',
      '3D printing',
      'Prototyping',
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
    role: 'Course Project',
    timeline: 'Spring 2026',
    process:
      'CAD layout, laser-cut housing, solenoid actuation, limit switch hit detection, electronics integration, Arduino-based control, and physical gameplay testing.',
    caseStudy: {
      subtitle: 'Rhythm Punch',
      tagline: 'Digital → Physical',
      overview:
        'Rhythm Punch is an electromechanical rhythm game that converts Guitar Hero-style tracks into physical gameplay. Instead of notes appearing only on a screen, solenoid-actuated buttons physically pop up in sync with the music, while limit switches detect player input and update the score.',
      systemFlow: [
        'User chooses a track and difficulty',
        'Track data is converted into timed note commands',
        'Microcontroller sends signals to solenoids',
        'Notes physically pop up in sync with music',
        'Hit sensors check timing and update the score',
      ],
      housing: {
        description:
          'The housing was designed as a laser-cut enclosure with internal supports for the actuation system and electronics. The design evolved from a rough prototype into a cleaner final build with better tolerances, 3D-printed buttons, mounting brackets, and a front-facing control panel.',
        gallery: [
          {
            src: '/projects/rhythm-game-housing.jpg',
            label: 'Outer box / housing prototype',
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
        { name: 'Solenoids', detail: 'Pull-type actuators that physically raise each note button.' },
        { name: 'Limit switches', detail: 'Roller switches for hit detection and timing input.' },
        { name: 'Microcontroller', detail: 'Runs sequencing, scoring, and actuator control.' },
        { name: 'LCD display', detail: 'Shows track selection, level, and score feedback.' },
        { name: 'LED matrix', detail: 'Visual note preview on the play surface.' },
        { name: 'SD card', detail: 'Stores level and audio track data.' },
        { name: 'Audio DAC', detail: 'Handles audio output during gameplay.' },
        { name: 'Power supply / drivers', detail: 'Powers solenoids and interface electronics.' },
      ],
      wiring:
        'The wiring was consolidated on a baseplate to keep the system organized and serviceable. Solenoids were connected through drivers and removable connectors for easier maintenance. The electronics integrated the microcontroller, switches, solenoid drivers, display components, and audio system.',
      wiringImage: '/projects/rhythm-game-wiring2.jpg',
      blockDiagram: '/projects/rhythm-game-block-diagram.jpg',
      prototypeIteration:
        'The first prototype used cardboard and tape and did not have enough measured tolerance. The final version improved mechanical fit, tolerance, control-panel placement, button design, and visual presentation.',
      testingResults:
        'Testing focused on switch reliability and end-to-end actuator performance for short notes and short gaps between notes. The results showed clear cutoff behavior, with stronger performance during actuation than release due to the difference between electromagnetic actuation and spring return.',
      testingImage: '/projects/rhythm-game-testing.jpg',
      contribution:
        'My work focused on CAD layout, mechanical packaging, housing fabrication, visual design of the enclosure, laser-cut structural parts, integration of buttons and interface components, and physical prototype assembly.',
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
    category: 'Mechanical Design / CAD',
    description:
      'Designed a gearbox assembly for a mechanical engineering CAD course, focusing on component modeling, assembly constraints, gear placement, shafts, housing design, and mechanical packaging.',
    detailedDescription:
      'For a mechanical engineering CAD course, I designed a complete gearbox assembly in SolidWorks. The project included individual part modeling, assembly constraints, gear placement, shaft design, housing geometry, and technical documentation.\n\nThe focus was on creating a clean mechanical assembly with realistic part relationships and organized CAD structure. I modeled the components with attention to alignment, packaging, and how the parts would fit together as a functional system.\n\nThis project strengthened my skills in parametric modeling, assemblies, technical drawings, and mechanical design communication.',
    tools: [
      'SolidWorks',
      'CAD assembly',
      'Mechanical design',
      'Gear systems',
      'Technical drawings',
    ],
    thumbnail: '/projects/gearbox.png',
    images: [
      {
        src: '/projects/gearbox.png',
        caption:
          'SolidWorks gearbox assembly showing the gear train, motors, shafts, mounting plates, and mechanical packaging.',
      },
    ],
    video: '/projects/gearbox-video.mp4',
    role: 'Course Project',
    timeline: 'Fall 2025',
    process:
      'SolidWorks part modeling, assembly constraints, gear and shaft placement, housing design, technical drawings, and mechanical packaging.',
  },
  {
    id: 'temperature-monitor',
    slug: 'room-temperature-monitoring-system',
    title: 'Room Temperature Monitoring System',
    category: 'Electronics / Embedded Systems',
    description:
      'Engineered a portable, real-time temperature monitoring system using an Arduino Uno and TMP36 sensor, with LCD output and a threshold-based alert system (70–80°F) using LED and buzzer feedback. Fabricated a custom laser-cut and 3D-printed enclosure.',
    detailedDescription:
      'I designed and built a portable room temperature monitoring system using an Arduino Uno and TMP36 temperature sensor. The system reads temperature data, processes it, and displays the result on an LCD screen.\n\nThe device includes a threshold-based alert system for the 70–80°F range. When the temperature moves outside the target range, LEDs and a buzzer provide feedback. I also designed and fabricated a custom enclosure to organize the electronics and make the device more portable.\n\nThis project combined circuit design, sensor integration, embedded programming, and physical enclosure design into a functional prototype.',
    tools: [
      'Arduino',
      'Sensors',
      'Circuits',
      'LCD',
      'Laser cutting',
      '3D printing',
    ],
    thumbnail: '/projects/thermostat_main_photo.jpg',
    galleryHeroCount: 2,
    images: [
      {
        src: '/projects/thermostat_main_photo.jpg',
        caption:
          'Portable Arduino-based temperature monitoring system with LCD display, LED indicators, buzzer feedback, and custom enclosure.',
      },
      {
        src: '/projects/thermostat_new_photo.jpg',
        caption:
          'Additional view of the completed thermostat prototype showing the enclosure and hardware layout.',
      },
      {
        src: '/projects/thermostat_code1.PNG',
        caption:
          'Arduino code for reading TMP36 temperature sensor data and processing temperature values.',
      },
      {
        src: '/projects/thermostat_code2.PNG',
        caption:
          'Arduino code for threshold-based LED/buzzer alerts and LCD output.',
      },
    ],
    video: '/projects/thermostat_video.MOV',
    codeNote:
      'The code reads voltage from the TMP36 temperature sensor, converts the signal into temperature, displays the reading on an LCD, and triggers LED/buzzer alerts when the temperature moves outside the target range.',
    role: 'Course Project',
    timeline: 'Spring 2025',
    process:
      'Arduino programming, TMP36 sensor integration, LCD output, LED/buzzer alerts, threshold logic, circuit prototyping, and custom enclosure fabrication.',
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
