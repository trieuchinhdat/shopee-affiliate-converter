import type { Metadata } from 'next';
import { getThemeConfig } from '@/lib/themeServer';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getThemeConfig();

  const title = theme.metaTitle || `${theme.heroTitle} - ${theme.logoText}${theme.logoHighlightText} Voucher Shopee`;
  const description =
    theme.metaDescription ||
    theme.heroSubtitle ||
    'Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền.';

  const keywords = theme.metaKeywords
    ? theme.metaKeywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [
        'săn mã shopee',
        'chuyển đổi link shopee',
        'mã giảm giá shopee',
        'voucher shopee 22%',
        'mã shopee live',
        'mã youtube shopee',
        'săn sale shopee',
      ];

  const ogImages = theme.ogImageUrl
    ? [
        {
          url: theme.ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ]
    : [];

  const siteUrl = theme.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanmakhuyenmai.vn';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: `${theme.logoText}${theme.logoHighlightText} ${theme.subTitle || 'Shopee Voucher Hunter'}`,
      images: ogImages,
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function HomePage() {
  const theme = await getThemeConfig();

  const siteUrl = theme.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://sanmakhuyenmai.vn';
  const appTitle = theme.metaTitle || `${theme.heroTitle} - ${theme.logoText}${theme.logoHighlightText} Voucher Shopee`;
  const appDesc =
    theme.metaDescription ||
    theme.heroSubtitle ||
    'Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền.';

  // Schema.org Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/#webapp`,
        name: appTitle,
        description: appDesc,
        url: siteUrl,
        applicationCategory: 'ShoppingApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'VND',
        },
        featureList: [
          'Chuyển đổi link Shopee gắn mã tiếp thị liên kết',
          'Tự động kích hoạt voucher độc quyền Facebook 22%',
          'Tự động áp dụng mã YouTube 20%',
          'Cập nhật mã Shopee Live & Flash Sale thời gian thực',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: `${theme.logoText}${theme.logoHighlightText} Shopee Voucher`,
        description: appDesc,
        inLanguage: 'vi-VN',
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Làm thế nào để lấy mã giảm giá Shopee 22% Facebook và 20% YouTube?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Bạn chỉ cần copy link sản phẩm Shopee, dán vào ô tìm kiếm trên trang web và bấm "Dán & Lấy mã ngay". Hệ thống sẽ tự động kích hoạt các mã giảm giá sâu nhất 22% và 20% cho bạn.',
            },
          },
          {
            '@type': 'Question',
            name: 'Công cụ chuyển đổi link Shopee này có miễn phí không?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Công cụ hoàn toàn miễn phí 100% cho mọi người dùng săn sale Shopee.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient initialTheme={theme} />
    </>
  );
}
