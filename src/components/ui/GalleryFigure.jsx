import ProjectImage from './ProjectImage';

export default function GalleryFigure({
  src,
  caption,
  title,
  className = '',
}) {
  return (
    <figure
      className={`overflow-hidden rounded-xl border border-border bg-surface-raised ${className}`}
    >
      <div className="flex items-center justify-center bg-[#0e0e11] p-3 sm:p-4">
        <ProjectImage
          src={src}
          title={title}
          className="max-h-[min(70vh,520px)] w-full object-contain"
        />
      </div>
      {caption && (
        <figcaption className="border-t border-border-subtle px-4 py-3 text-sm leading-relaxed text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
