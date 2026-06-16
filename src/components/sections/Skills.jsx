import { skillGroups } from '../../data/skills';
import SectionWrapper from '../layout/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';

export default function Skills() {
  return (
    <SectionWrapper id="skills" className="border-t border-border-subtle py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading label="04 — Skills" title="Technical toolkit" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-xl border border-border bg-surface-raised p-5 transition-colors hover:border-accent/20"
            >
              <h3 className="text-sm font-medium text-zinc-200">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md border border-border-subtle bg-surface px-2.5 py-1 font-mono text-[11px] text-zinc-500"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
