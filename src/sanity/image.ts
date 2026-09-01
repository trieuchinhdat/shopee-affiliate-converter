import imageUrlBuilder from '@sanity/image-url';
import { projectId, dataset } from './client';

const builder = imageUrlBuilder({ projectId, dataset });

export function urlForImage(source: any) {
  if (!source || !source.asset) return '';
  return builder.image(source).auto('format').fit('max').url();
}
