import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sale Hunter - Săn Mã Shopee FB 22% & YouTube 20%',
    short_name: 'Sale Hunter',
    description: 'Sale Hunter - Chuyển đổi link Shopee để tự động áp dụng mã giảm giá FB 22% và YouTube 20% độc quyền.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0f19',
    theme_color: '#ee4d2d',
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
