import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import ProjectImage from '../ui/ProjectImage';
import YouTubeEmbed from '../ui/YouTubeEmbed';
import CaseStudySection from './CaseStudySection';
import SystemFlow from './SystemFlow';

function LabeledImage({ src, label, title }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-surface-raised">
      <div className="flex items-center justify-center bg-[#0e0e11] p-3 sm:p-4">
        <ProjectImage
          src={src}
          title={title}
          className="max-h-[min(70vh,520px)] w-full object-contain"
        />
      </div>
      {label && (
        <figcaption className="border-t border-border-subtle px-4 py-2.5 font-mono text-[11px] text-zinc-500">
          {label}
        </figcaption>
      )}
    </figure>
  );
}

export default function ProjectCaseStudy({ project }) {
  const cs = project.caseStudy;

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
      {cs.subtitle && (
        <p className="mt-2 font-mono text-sm text-zinc-500">{cs.subtitle}</p>
      )}

      {(project.role || project.timeline) && (
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
          {project.role && <p>{project.role}</p>}
          {project.timeline && (
            <p className="font-mono text-xs text-zinc-600">{project.timeline}</p>
          )}
        </div>
      )}

      {cs.tagline && (
        <p className="mt-6 inline-block rounded-lg border border-accent/25 bg-accent/5 px-3 py-1.5 font-mono text-xs text-accent">
          {cs.tagline}
        </p>
      )}

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-[#0e0e11]">
        <ProjectImage
          src={project.thumbnail}
          title={project.title}
          className="mx-auto max-h-[min(72vh,560px)] w-full object-contain p-3 sm:p-4"
        />
      </div>

      <div className="mt-16 space-y-16">
        <CaseStudySection label="01 — Overview" title="What we built">
          <p className="max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            {cs.overview}
          </p>
        </CaseStudySection>

        <CaseStudySection label="02 — System" title="How it works">
          <SystemFlow steps={cs.systemFlow} />
        </CaseStudySection>

        <CaseStudySection label="03 — Mechanical" title="Housing & fabrication">
          <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            {cs.housing.description}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {cs.housing.gallery.map((item) => (
              <LabeledImage
                key={item.label}
                src={item.src}
                label={item.label}
                title={`${project.title} — ${item.label}`}
              />
            ))}
          </div>
        </CaseStudySection>

        <CaseStudySection label="04 — Hardware" title="Key components">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cs.components.map((component) => (
              <div
                key={component.name}
                className="rounded-xl border border-border bg-surface-raised px-4 py-3.5"
              >
                <p className="text-sm font-medium text-zinc-200">{component.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {component.detail}
                </p>
              </div>
            ))}
          </div>
        </CaseStudySection>

        <CaseStudySection label="05 — Electronics" title="Wiring & integration">
          <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            {cs.wiring}
          </p>
          {cs.wiringImage && (
            <div className="mt-6">
              <LabeledImage
                src={cs.wiringImage}
                label="Consolidated baseplate wiring"
                title={`${project.title} — wiring`}
              />
            </div>
          )}
        </CaseStudySection>

        <CaseStudySection label="06 — Architecture" title="System block diagram">
          <LabeledImage
            src={cs.blockDiagram}
            label="Primary information flow for gameplay loop"
            title={`${project.title} — block diagram`}
          />
        </CaseStudySection>

        <CaseStudySection label="07 — Iteration" title="Prototype evolution">
          <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            {cs.prototypeIteration}
          </p>
        </CaseStudySection>

        <CaseStudySection label="08 — Testing" title="Results & limits">
          <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            {cs.testingResults}
          </p>
          {cs.testingImage && (
            <div className="mt-6">
              <LabeledImage
                src={cs.testingImage}
                label="Switch reliability testing — actuation vs. release"
                title={`${project.title} — testing`}
              />
            </div>
          )}
        </CaseStudySection>

        <CaseStudySection label="09 — Role" title="My contribution">
          <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            {cs.contribution}
          </p>
        </CaseStudySection>

        {cs.prototypeDemo && (
          <CaseStudySection label="10 — Demo" title="Working final product">
            <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              {cs.prototypeDemo.description}
            </p>
            <div className="mx-auto mt-6 max-w-4xl">
              <YouTubeEmbed
                src={cs.prototypeDemo.youtubeEmbedUrl}
                title={`${project.title} — prototype demo`}
              />
            </div>
          </CaseStudySection>
        )}

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
            Tools & Skills
          </p>
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
      </div>

      <Button to="/#projects" variant="secondary" className="mt-16">
        Back to Projects
      </Button>
    </motion.article>
  );
}
