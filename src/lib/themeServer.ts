import { cache } from 'react';
import { getThemeConfigCached } from '@/lib/sanityCache';
import { ThemeConfig } from '@/lib/types';

export const getThemeConfig = cache(async (): Promise<ThemeConfig> => {
  return getThemeConfigCached(60);
});
