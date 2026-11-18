import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectImage from './ProjectImage';

export default function ProjectCard({ project, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface-raised shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      >
        <div className="overflow-hidden">
          <ProjectImage
            src={project.thumbnail}
            title={project.title}
            imgClassName="transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div>
            <p className="font-mono text-xs tracking-wide text-accent">
              {project.category}
            </p>
            <h3 className="mt-2 text-lg font-medium tracking-tight text-zinc-100">
              {project.title}
            </h3>
          </div>

          <p className="flex-1 text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tools.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="rounded-md border border-border-subtle bg-surface px-2 py-0.5 font-mono text-[11px] text-zinc-500"
              >
                {tool}
              </span>
            ))}
          </div>

          <span className="mt-1 font-mono text-xs text-zinc-500 transition-colors group-hover:text-accent">
            Open project →
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
