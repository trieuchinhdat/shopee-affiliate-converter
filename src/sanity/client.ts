import { createClient } from '@sanity/client';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bcs6f8g2';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-01-01';

// Public fast client (bypasses CDN in local dev for instant updates, uses Edge CDN in production)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_READ_TOKEN || '',
  perspective: 'published',
});

// Draft client for live preview / admin studio (uncached)
export const sanityDraftClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || '',
  perspective: 'drafts',
});

// Write client for mutations in admin endpoints
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || '',
});
