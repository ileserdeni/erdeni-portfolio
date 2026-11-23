import { lazy, Suspense, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectBySlug } from '../data/projects';
import { normalizeImages } from '../data/projectMedia';
import Button from '../components/ui/Button';
import GalleryFigure from '../components/ui/GalleryFigure';
import ProjectVideo from '../components/ui/ProjectVideo';
import ProjectCaseStudy from '../components/projects/ProjectCaseStudy';

const FourBarInteractive = lazy(
  () => import('../components/projects/FourBarInteractive'),
);

function Section({ label, children }) {
  if (!children) return null;
  return (
    <section className="mt-12 max-w-3xl">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {label}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
        {children}
      </div>
    </section>
  );
}

function Paragraphs({ text }) {
  if (!text) return null;
  return text.split('\n\n').map((paragraph) => (
    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
  ));
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = project
      ? `${project.title} - Erdeni Iles`
      : 'Project Not Found - Erdeni Iles';
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
    project.images?.length > 0
      ? project.images
      : project.interactive || project.videos?.length
        ? []
        : [{ src: project.thumbnail, caption: null }],
  );

  const videos = project.videos?.length
    ? project.videos
    : project.video
      ? [{ src: project.video, label: 'Project video' }]
      : [];

  const hasEngineeringSections =
    project.problem ||
    project.decisions ||
    project.build ||
    project.result ||
    project.technical;

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
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
          {project.role && <p>{project.role}</p>}
          {project.timeline && (
            <p className="font-mono text-xs text-zinc-600">{project.timeline}</p>
          )}
        </div>
      )}

      <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
        {project.description}
      </p>

      {project.interactive === 'four-bar' && (
        <div className="mt-10">
          <Suspense
            fallback={
              <div className="rounded-xl border border-border bg-surface-raised px-4 py-16 text-center font-mono text-xs text-zinc-500">
                Loading 3D assembly…
              </div>
            }
          >
            <FourBarInteractive />
          </Suspense>
        </div>
      )}

      {videos.length > 0 && (
        <div className="mt-10 space-y-6">
          {videos.map((item) => (
            <ProjectVideo key={item.src} src={item.src} label={item.label} />
          ))}
        </div>
      )}

      {hasEngineeringSections ? (
        <>
          <Section label="Problem">
            <Paragraphs text={project.problem} />
          </Section>
          <Section label="Decisions">
            <Paragraphs text={project.decisions} />
          </Section>
          <Section label="Build">
            <Paragraphs text={project.build} />
          </Section>
          <Section label="Result">
            <Paragraphs text={project.result} />
          </Section>
          {project.technical && (
            <Section label="Technical">
              <Paragraphs text={project.technical} />
            </Section>
          )}
        </>
      ) : (
        <div className="mt-12 max-w-3xl space-y-5">
          <Paragraphs text={project.detailedDescription} />
        </div>
      )}

      {galleryImages.length > 0 && (
        <div className="mt-14">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
            Evidence
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {galleryImages.map((image, index) => (
              <GalleryFigure
                key={`${image.src}-${index}`}
                src={image.src}
                caption={image.caption}
                title={`${project.title} - ${index + 1}`}
                className={galleryImages.length === 1 ? 'sm:col-span-2' : ''}
              />
            ))}
          </div>
        </div>
      )}

      {project.codeNote && (
        <div className="mt-10 max-w-3xl rounded-xl border border-border bg-surface-raised p-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Notes
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {project.codeNote}
          </p>
        </div>
      )}

      <div className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
          Tools
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
