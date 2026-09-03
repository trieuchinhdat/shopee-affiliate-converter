import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sanmakhuyenmai.vn'),
  title: {
    default: 'Sale Hunter - Săn Mã Shopee & Chuyển Đổi Link Nhận Voucher FB 22% & YouTube 20%',
    template: '%s | Sale Hunter',
  },
  description: 'Sale Hunter - Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền và nhận ưu đãi tốt nhất.',
  keywords: ['săn mã shopee', 'chuyển đổi link shopee', 'sale hunter', 'mã giảm giá shopee', 'voucher shopee 22%', 'mã shopee live'],
  authors: [{ name: 'Sale Hunter' }],
  creator: 'Sale Hunter Team',
  publisher: 'Sale Hunter',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sale Hunter',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Sale Hunter - Săn Mã Shopee & Chuyển Đổi Link Nhận Voucher FB 22% & YouTube 20%',
    description: 'Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền và nhận ưu đãi tốt nhất.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sale Hunter - Săn Mã Shopee & Chuyển Đổi Link',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sale Hunter - Săn Mã Shopee & Chuyển Đổi Link Nhận Voucher FB 22% & YouTube 20%',
    description: 'Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền và nhận ưu đãi tốt nhất.',
    images: ['/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0b0f19',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-background min-h-screen text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
