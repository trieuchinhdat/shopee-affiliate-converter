import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Săn Mã Shopee - Chuyển Đổi Link Nhận Voucher Độc Quyền',
  description: 'Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền và nhận ưu đãi tốt nhất.',
  openGraph: {
    title: 'Săn Mã Shopee - Lấy Voucher Độc Quyền',
    description: 'Chuyển đổi link Shopee để nhận voucher giảm đến 22% và mã YouTube 20%.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
