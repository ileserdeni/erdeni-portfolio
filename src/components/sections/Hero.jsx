import { motion } from 'framer-motion';
import EngineeringBackground from '../background/EngineeringBackground';
import HeroMechanicalVisual from '../background/HeroMechanicalVisual';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-x-hidden pt-14">
      <EngineeringBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-8 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Portfolio
            </p>

            <h1 className="mt-4 text-4xl font-medium tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Erdeni Iles
            </h1>

            <p className="mt-3 text-lg text-zinc-400 sm:text-xl">
              Mechanical Engineering Student
            </p>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Mechanical design, robotics hardware, and experimental systems.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#projects">View Projects</Button>
              <Button href="#contact" variant="secondary">
                Contact Me
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full items-center justify-center overflow-visible px-2 sm:px-4 md:justify-end md:pl-2"
          >
            <HeroMechanicalVisual />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 sm:block"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              Scroll
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-accent/50 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
