import { projects } from '../../data/projects';
import SectionWrapper from '../layout/SectionWrapper';
import ProjectCard from '../ui/ProjectCard';
import SectionHeading from '../ui/SectionHeading';

export default function Projects() {
  return (
    <SectionWrapper id="projects" className="border-t border-border-subtle py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading label="02 — Projects" title="Selected work" />

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
