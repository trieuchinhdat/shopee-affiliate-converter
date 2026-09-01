import { getThemeConfig } from '@/lib/themeServer';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const theme = await getThemeConfig();

  return <HomeClient initialTheme={theme} />;
}
