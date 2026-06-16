export function normalizeImage(image) {
  if (typeof image === 'string') {
    return { src: image, caption: null };
  }
  return image;
}

export function normalizeImages(images = []) {
  return images.map(normalizeImage);
}
