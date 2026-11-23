import { skillGroups } from '../../data/skills';
import SectionWrapper from '../layout/SectionWrapper';
import SectionHeading from '../ui/SectionHeading';

export default function Skills() {
  const primary = skillGroups.slice(0, 3);
  const secondary = skillGroups.slice(3);

  return (
    <SectionWrapper id="skills" className="border-t border-border-subtle py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading label="04 / Skills" title="Technical toolkit" />

        <div className="flex flex-col gap-5">
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {primary.map((group) => (
              <SkillCard key={group.title} group={group} />
            ))}
          </div>

          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {secondary.map((group) => (
              <SkillCard key={group.title} group={group} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function SkillCard({ group }) {
  return (
    <div className="h-fit rounded-xl border border-border bg-surface-raised p-5 transition-colors hover:border-accent/20">
      <h3 className="text-sm font-medium text-zinc-200">{group.title}</h3>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {group.skills.map((skill) => (
          <li
            key={skill}
            className="max-w-full break-words rounded-md border border-border-subtle bg-surface px-2.5 py-1 font-mono text-[11px] leading-snug text-zinc-500"
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
