import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId, isMockMode } from './sanity';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || 'mock_id',
  dataset: dataset || 'production',
});

export const urlForImage = (source: any) => {
  if (isMockMode) return null;
  if (!source || !source.asset || !source.asset._ref) return null;
  // If it is a mock reference, return null to let ImageWithFallback render the high-quality preset URL
  if (source.asset._ref.startsWith('mock')) return null;
  
  try {
    return imageBuilder.image(source);
  } catch (error) {
    return null;
  }
};
