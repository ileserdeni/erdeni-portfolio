import { motion } from 'framer-motion';
import { experience } from '../../data/experience';
import SectionWrapper from '../layout/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';

export default function Experience() {
  return (
    <SectionWrapper
      id="experience"
      className="border-t border-border-subtle py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading label="03 / Experience" title="Where I've worked" />

        <div className="relative">
          <div className="absolute left-[7px] top-2 hidden h-[calc(100%-16px)] w-px bg-border sm:block" />

          <div className="flex flex-col gap-6">
            {experience.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative rounded-xl border border-border bg-surface-raised p-5 sm:ml-8 sm:p-6"
              >
                <div className="absolute -left-8 top-7 hidden h-3.5 w-3.5 rounded-full border-2 border-accent bg-[#09090b] sm:block" />

                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-medium text-zinc-100">{item.role}</h3>
                    <p className="mt-1.5 text-sm text-accent">{item.organization}</p>
                    {item.location && (
                      <p className="mt-1 text-xs text-zinc-600">{item.location}</p>
                    )}
                  </div>
                  {item.period && (
                    <p className="mt-2 font-mono text-xs text-zinc-600 sm:mt-0 sm:text-right">
                      {item.period}
                    </p>
                  )}
                </div>

                {item.bullets?.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-border-subtle pt-4">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet.slice(0, 48)}
                        className="flex gap-2 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
