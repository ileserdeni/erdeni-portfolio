export default function YouTubeEmbed({ src, title }) {
  if (!src) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-raised">
      <div className="aspect-video w-full bg-[#0e0e11]">
        <iframe
          src={src}
          title={title}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
