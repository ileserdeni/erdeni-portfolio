import { useState } from 'react';
import ProjectImagePlaceholder from './ProjectImagePlaceholder';

export default function ProjectImage({
  src,
  title,
  className = 'aspect-[16/10] w-full object-cover',
  imgClassName = '',
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <ProjectImagePlaceholder title={title} />;
  }

  return (
    <img
      src={src}
      alt={title}
      onError={() => setHasError(true)}
      className={`${className} ${imgClassName}`}
    />
  );
}
