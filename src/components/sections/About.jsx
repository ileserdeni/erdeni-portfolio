import { motion } from 'framer-motion';
import SectionWrapper from '../layout/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';
import AboutPhoto from '../ui/AboutPhoto';

const infoCards = [
  { value: 'BU', label: 'Boston University' },
  { value: 'ME', label: 'Mechanical Engineering' },
  { value: 'May 2028', label: 'Expected Graduation' },
];

export default function About() {
  return (
    <SectionWrapper id="about" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_min(300px,32%)] lg:items-start lg:gap-x-14 lg:gap-y-12">
          <div className="order-1">
            <SectionHeading label="01 — About" title="Building systems with intent" />

            <p className="max-w-3xl text-base leading-relaxed text-muted sm:text-lg sm:leading-relaxed">
              I am a Mechanical Engineering student at Boston University interested
              in CAD design, experimental research, product development and design,
              and robotics hardware. My work combines hands-on prototyping, mechanical systems,
              electronics, and visual design. I am especially interested in building
              physical systems that are both technically functional and thoughtfully
              designed.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:justify-self-end"
          >
            <AboutPhoto />
          </motion.div>

          <div className="order-3 lg:col-start-1 lg:row-start-2">
            <div className="grid gap-4 sm:grid-cols-3">
              {infoCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-surface-raised px-5 py-4"
                >
                  <p className="font-mono text-lg text-accent">{item.value}</p>
                  <p className="mt-1 text-sm text-zinc-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
