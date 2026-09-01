import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sanmakhuyenmai.vn'),
  title: {
    default: 'Săn Mã Shopee - Chuyển Đổi Link Nhận Voucher FB 22% & YouTube 20%',
    template: '%s | Săn Mã Shopee',
  },
  description: 'Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền và nhận ưu đãi tốt nhất.',
  keywords: ['săn mã shopee', 'chuyển đổi link shopee', 'mã giảm giá shopee', 'voucher shopee 22%', 'mã shopee live'],
  authors: [{ name: 'Voucher Hunter' }],
  creator: 'Voucher Hunter Team',
  publisher: 'Shopee Affiliate Converter',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Săn Mã Shopee',
  },
  manifest: '/manifest.webmanifest',
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
