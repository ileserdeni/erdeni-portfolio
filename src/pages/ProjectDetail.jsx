import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectBySlug } from '../data/projects';
import { normalizeImages } from '../data/projectMedia';
import Button from '../components/ui/Button';
import GalleryFigure from '../components/ui/GalleryFigure';
import ProjectVideo from '../components/ui/ProjectVideo';
import ProjectCaseStudy from '../components/projects/ProjectCaseStudy';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = project
      ? `${project.title} — Erdeni Iles`
      : 'Project Not Found — Erdeni Iles';
  }, [project, slug]);

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-32 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Not found
        </p>
        <h1 className="mt-3 text-2xl font-medium text-zinc-100">Project not found</h1>
        <p className="mt-4 text-muted">
          The project you are looking for does not exist or may have been moved.
        </p>
        <Button to="/#projects" variant="secondary" className="mt-8">
          Back to Projects
        </Button>
      </div>
    );
  }

  if (project.caseStudy) {
    return <ProjectCaseStudy project={project} />;
  }

  const galleryImages = normalizeImages(
    project.images?.length > 0 ? project.images : [{ src: project.thumbnail, caption: null }],
  );

  const heroCount = project.galleryHeroCount ?? 0;
  const heroImages =
    heroCount > 0 ? galleryImages.slice(0, heroCount) : [];
  const restImages =
    heroCount > 0 ? galleryImages.slice(heroCount) : galleryImages;

  const renderGalleryFigure = (image, index, titleSuffix) => (
    <GalleryFigure
      key={`${image.src}-${index}`}
      src={image.src}
      caption={image.caption}
      title={`${project.title} — ${titleSuffix}`}
      className={galleryImages.length === 1 && heroCount === 0 ? 'sm:col-span-2' : ''}
    />
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8"
    >
      <Link
        to="/#projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-accent"
      >
        ← Back to Projects
      </Link>

      <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {project.category}
      </p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight text-zinc-50 sm:text-4xl">
        {project.title}
      </h1>

      {(project.role || project.timeline) && (
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
          {project.role && <p>{project.role}</p>}
          {project.timeline && (
            <p className="font-mono text-xs text-zinc-600">{project.timeline}</p>
          )}
        </div>
      )}

      <div className="mt-10">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
          Gallery
        </p>
        {heroCount > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {heroImages.map((image, index) =>
                renderGalleryFigure(image, index, index + 1),
              )}
            </div>

            {project.codeNote && (
              <div className="mt-4 rounded-xl border border-border bg-surface-raised p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  Code overview
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {project.codeNote}
                </p>
              </div>
            )}

            {restImages.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {restImages.map((image, index) =>
                  renderGalleryFigure(image, heroCount + index, heroCount + index + 1),
                )}
              </div>
            )}
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {galleryImages.map((image, index) => (
              <div key={`${image.src}-${index}`} className="contents">
                {renderGalleryFigure(image, index, index + 1)}
                {index === 0 && project.codeNote && (
                  <div className="rounded-xl border border-border bg-surface-raised p-5 sm:col-span-2">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                      Code overview
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                      {project.codeNote}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {project.video && (
        <div className="mt-8">
          <ProjectVideo src={project.video} label="Project video" />
        </div>
      )}

      <div className="mt-12 max-w-3xl space-y-5">
        {project.detailedDescription.split('\n\n').map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="text-base leading-relaxed text-muted sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {project.process && (
        <div className="mt-12 max-w-3xl rounded-xl border border-border bg-surface-raised p-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Process & Notes
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            {project.process}
          </p>
        </div>
      )}

      <div className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
          Tools & Skills
        </h2>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-md border border-border-subtle bg-surface px-2.5 py-1 font-mono text-[11px] text-zinc-500"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      <Button to="/#projects" variant="secondary" className="mt-12">
        Back to Projects
      </Button>
    </motion.article>
  );
}
