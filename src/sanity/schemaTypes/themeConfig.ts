import { defineType, defineField } from 'sanity';

export const themeConfig = defineType({
  name: 'themeConfig',
  title: 'Cài đặt giao diện',
  type: 'document',
  groups: [
    {
      name: 'branding',
      title: '🎨 Logo & Nền Trang',
      default: true,
    },
    {
      name: 'banner',
      title: '🖼️ Slide Banner Quảng Cáo',
    },
    {
      name: 'home_sections',
      title: '⚡ Tiện Ích Trang Chủ & Lưu Ý',
    },
    {
      name: 'zalo_widget',
      title: '💬 Nhóm Zalo & Chatbox',
    },
    {
      name: 'seo',
      title: '🔍 Cấu hình SEO Meta',
    },
  ],
  fields: [
    // --- 1. LOGO & THƯƠNG HIỆU ---
    defineField({
      name: 'logoType',
      title: 'Kiểu Logo',
      type: 'string',
      group: 'branding',
      options: {
        list: [
          { title: '📝 Chữ (Text Logo)', value: 'text' },
          { title: '🖼️ Hình ảnh (Image Logo)', value: 'image' },
        ],
        layout: 'radio',
      },
      initialValue: 'text',
    }),
    defineField({
      name: 'logoText',
      title: 'Tên Logo chính (Text)',
      type: 'string',
      group: 'branding',
      initialValue: 'SALE',
      hidden: ({ parent }) => parent?.logoType === 'image',
    }),
    defineField({
      name: 'logoHighlightText',
      title: 'Chữ nổi bật (Màu cam)',
      type: 'string',
      group: 'branding',
      initialValue: 'HUNTER',
      hidden: ({ parent }) => parent?.logoType === 'image',
    }),
    defineField({
      name: 'logoBadge',
      title: 'Huy hiệu Logo (Badge nhỏ bên cạnh)',
      description: 'Ví dụ: VIP, PRO, SALE 9.9, HOT...',
      type: 'string',
      group: 'branding',
      initialValue: 'PRO',
    }),
    defineField({
      name: 'logoImage',
      title: 'Tải lên Hình ảnh Logo (Nếu chọn kiểu Image)',
      type: 'image',
      group: 'branding',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.logoType === 'text',
    }),
    defineField({
      name: 'subTitle',
      title: 'Slogan / Dòng chữ dưới logo',
      type: 'string',
      group: 'branding',
      initialValue: 'Sale Hunter Shopee',
    }),

    // --- 2. MÀU NỀN HOẶC HÌNH NỀN (BACKGROUND) ---
    defineField({
      name: 'backgroundType',
      title: 'Kiểu Nền Trang (Background Type)',
      type: 'string',
      group: 'branding',
      options: {
        list: [
          { title: '🎨 Màu đơn sắc (Solid Color)', value: 'solid' },
          { title: '🌈 Màu chuyển sắc (Gradient)', value: 'gradient' },
          { title: '🖼️ Hình nền ảnh (Background Image)', value: 'image' },
        ],
        layout: 'radio',
      },
      initialValue: 'gradient',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Màu nền chính (Mã Hex)',
      type: 'string',
      group: 'branding',
      initialValue: '#0b0f19',
      description: 'Ví dụ: #0b0f19 (Tối hiện đại), #000000 (Đen tuyền), #0f172a (Xanh đêm)...',
    }),
    defineField({
      name: 'gradientStart',
      title: 'Màu Gradient Bắt đầu (Top)',
      type: 'string',
      group: 'branding',
      initialValue: '#0b0f19',
      hidden: ({ parent }) => parent?.backgroundType !== 'gradient',
    }),
    defineField({
      name: 'gradientEnd',
      title: 'Màu Gradient Kết thúc (Bottom)',
      type: 'string',
      group: 'branding',
      initialValue: '#1c1008',
      hidden: ({ parent }) => parent?.backgroundType !== 'gradient',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Tải lên Hình Nền (Background Image)',
      description: 'Tải ảnh nền tùy ý (sẽ tự động phủ lớp tối mờ để chữ luôn nổi bật)',
      type: 'image',
      group: 'branding',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
    }),
    defineField({
      name: 'backgroundOverlayOpacity',
      title: 'Độ tối lớp phủ hình nền (%)',
      description: '0% là trong suốt, 85% là tối vừa phải để đọc chữ tốt nhất.',
      type: 'number',
      group: 'branding',
      initialValue: 85,
      validation: (Rule) => Rule.min(0).max(100),
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
    }),

    // --- 3. CÀI ĐẶT SLIDE BANNER HÌNH ẢNH (CAROUSEL & AFFILIATE LINK) ---
    defineField({
      name: 'showHeroBanner',
      title: 'Bật hiển thị Khối Slide Banner',
      description: 'Bật / Tắt toàn bộ khối banner quảng cáo trên trang chủ',
      type: 'boolean',
      group: 'banner',
      initialValue: true,
    }),
    defineField({
      name: 'bannerAutoSlide',
      title: 'Tự động chuyển Slide (Auto Play)',
      description: 'Tự động chạy slide tiếp theo sau khoảng thời gian cài đặt',
      type: 'boolean',
      group: 'banner',
      initialValue: true,
      hidden: ({ parent }) => parent?.showHeroBanner === false,
    }),
    defineField({
      name: 'bannerAutoSlideInterval',
      title: 'Thời gian chuyển Slide (Giây)',
      description: 'Khuyến nghị: 4 - 5 giây để người dùng kịp quan sát và click',
      type: 'number',
      group: 'banner',
      initialValue: 5,
      validation: (Rule) => Rule.min(2).max(20).warning('Thời gian nên từ 2 đến 20 giây'),
      hidden: ({ parent }) => parent?.showHeroBanner === false || parent?.bannerAutoSlide === false,
    }),
    defineField({
      name: 'bannerSlides',
      title: 'Danh sách Slide Banner (Kèm Link Nhận Hoa Hồng)',
      description: 'Thêm và kéo thả sắp xếp các slide banner quảng cáo. Bấm vào banner sẽ mở link Affiliate/Chiến dịch.',
      type: 'array',
      group: 'banner',
      hidden: ({ parent }) => parent?.showHeroBanner === false,
      of: [
        {
          type: 'object',
          name: 'bannerSlide',
          title: 'Slide Banner',
          fields: [
            defineField({
              name: 'title',
              title: 'Tên / Tiêu đề Slide (Quản lý & SEO Alt Text)',
              description: 'Ví dụ: Săn Siêu Sale Shopee 9.9 - Giảm 50%',
              type: 'string',
              validation: (Rule) => Rule.required().error('Vui lòng nhập tên/tiêu đề gợi nhớ cho slide'),
            }),
            defineField({
              name: 'image',
              title: '🖼️ Hình ảnh Banner (Dùng chung Desktop & Mobile)',
              description: 'Tải lên 1 hình ảnh dùng chung cho cả Máy tính & Điện thoại. Chuẩn kích thước tỉ lệ 10:3 (1200x360px hoặc 900x270px) để hiển thị trọn vẹn 100% không bị cắt.',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required().error('Vui lòng tải ảnh banner'),
            }),
            defineField({
              name: 'linkUrl',
              title: '🔗 Đường dẫn liên kết (Target Link Điều Hướng)',
              description: 'Link Affiliate Shopee, Link Mega Sale, hoặc Link Nhóm Zalo để nhận hoa hồng gián tiếp.',
              type: 'url',
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Mở liên kết trong tab mới',
              description: 'Nên bật để giữ nguyên tab dán link của người dùng',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'isActive',
              title: 'Kích hoạt slide này',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              linkUrl: 'linkUrl',
              media: 'image',
              desktopMedia: 'desktopImage',
              isActive: 'isActive',
            },
            prepare({ title, linkUrl, media, desktopMedia, isActive }) {
              const statusText = isActive === false ? '⛔ Đang tắt' : '🟢 Đang hoạt động';
              return {
                title: `${title || 'Chưa đặt tên'} (${statusText})`,
                subtitle: linkUrl ? `🔗 ${linkUrl}` : '⚠️ Chưa gắn link điều hướng',
                media: media || desktopMedia,
              };
            },
          },
        },
      ],
    }),

    // --- 4. CÁC TIỆN ÍCH TRÊN TRANG CHỦ & LƯU Ý VOUCHER ---
    defineField({
      name: 'voucherNoticeText',
      title: '⚠️ Đoạn Lưu ý cố định dưới danh sách Voucher',
      description: 'Nội dung hướng dẫn / xử lý sự cố hiển thị trong khung viền vàng nổi bật dưới các nút voucher',
      type: 'text',
      group: 'home_sections',
      rows: 2,
      initialValue: 'Nếu click link không thấy mã Youtube/Facebook/Instagram → cần xóa shopee tải lại hoặc đổi tài khoản khác do tài khoản của bạn đã bị lọc.',
    }),
    defineField({
      name: 'showSocialProofTicker',
      title: '🟢 Bật Dải tin Ticker (Khách vừa nhận mã)',
      description: 'Dải thông báo nhỏ nhấp nháy đèn xanh chạy dưới nút Dán & Lấy Mã',
      type: 'boolean',
      group: 'home_sections',
      initialValue: true,
    }),
    defineField({
      name: 'socialProofMessages',
      title: '📝 Danh sách thông báo Ticker (Khách vừa nhận mã)',
      description: 'Nhập các dòng thông báo thay phiên nhau chạy. Bấm "Add item" để thêm dòng mới, kéo thả để đổi thứ tự.',
      type: 'array',
      group: 'home_sections',
      of: [{ type: 'string' }],
      initialValue: [
        'Khách HN vừa nhận mã FB 22% (-65k)',
        'Khách HCM vừa áp mã YT 20% (-150k)',
        'Khách ĐN vừa nhận mã FB 25% (-120k)',
        '1.450+ lượt lấy mã thành công hôm nay',
        'Mã Shopee Live & Video vừa áp (-70k)',
      ],
      hidden: ({ parent }) => parent?.showSocialProofTicker === false,
    }),
    defineField({
      name: 'showVouchersTeaser',
      title: '🔥 Bật Bảng Mã Hot Đang Phát (Trang chủ)',
      description: 'Thẻ hiển thị các mã hot (FB 22%, YouTube 20%...) khi người dùng chưa dán link',
      type: 'boolean',
      group: 'home_sections',
      initialValue: true,
    }),
    defineField({
      name: 'showQuickGuide',
      title: '⚡ Bật Thanh 3 Bước Săn Mã Nhanh (1 dòng)',
      description: 'Thanh hướng dẫn tinh gọn: 1. Copy link ➔ 2. Bấm Dán ➔ 3. Nhận mã',
      type: 'boolean',
      group: 'home_sections',
      initialValue: true,
    }),

    // --- 5. CÀI ĐẶT THẺ NHÓM ZALO TRÊN TRANG CHỦ ---
    defineField({
      name: 'showZaloCard',
      title: 'Hiển thị Thẻ Nhóm Zalo Báo Mã Săn Sale',
      description: 'Bật / Tắt khối giới thiệu nhóm Zalo trên trang chủ',
      type: 'boolean',
      group: 'zalo_widget',
      initialValue: true,
    }),
    defineField({
      name: 'zaloCardTitle',
      title: 'Tiêu đề Thẻ Nhóm Zalo',
      type: 'string',
      group: 'zalo_widget',
      initialValue: 'Nhóm Zalo Báo Mã Săn Sale',
      hidden: ({ parent }) => parent?.showZaloCard === false,
    }),
    defineField({
      name: 'zaloCardSubtitle',
      title: 'Mô tả Thẻ Nhóm Zalo',
      type: 'string',
      group: 'zalo_widget',
      initialValue: 'Báo mã FB 22%, Shopee Live & Flash Sale trước 15 phút',
      hidden: ({ parent }) => parent?.showZaloCard === false,
    }),
    defineField({
      name: 'zaloCardMembers',
      title: 'Số lượng thành viên hiển thị',
      type: 'string',
      group: 'zalo_widget',
      initialValue: 'Hơn 15.000+ thành viên',
      hidden: ({ parent }) => parent?.showZaloCard === false,
    }),
    defineField({
      name: 'zaloCardButtonText',
      title: 'Chữ trên nút bấm Thẻ Zalo',
      type: 'string',
      group: 'zalo_widget',
      initialValue: 'Vào Nhóm Zalo Săn Sale (Miễn Phí)',
      hidden: ({ parent }) => parent?.showZaloCard === false,
    }),

    // --- 6. CÀI ĐẶT CHATBOX ZALO NỔI Ở GÓC MÀN HÌNH ---
    defineField({
      name: 'showFloatingZalo',
      title: 'Bật Chatbox Zalo nổi ở góc màn hình (Floating Widget)',
      description: 'Bật / Tắt nút tròn Zalo nhấp nháy phát sáng ở góc dưới bên phải',
      type: 'boolean',
      group: 'zalo_widget',
      initialValue: true,
    }),
    defineField({
      name: 'floatingZaloText',
      title: 'Nội dung bong bóng Chatbox Zalo',
      type: 'string',
      group: 'zalo_widget',
      initialValue: 'Nhận mã 22% & mã Live sớm nhất! 💬',
      hidden: ({ parent }) => parent?.showFloatingZalo === false,
    }),

    // --- 7. CÀI ĐẶT SEO & CHIA SẺ MẠNG XÃ HỘI (METADATA) ---
    defineField({
      name: 'metaTitle',
      title: 'Tiêu đề SEO (Meta Title)',
      description: 'Tiêu đề hiển thị trên Google và tab trình duyệt (Khuyên dùng: 50-70 ký tự)',
      type: 'string',
      group: 'seo',
      initialValue: 'Sale Hunter - Săn Mã Shopee & Chuyển Đổi Link Nhận Voucher FB 22% & YouTube 20%',
      validation: (Rule) => Rule.max(70).warning('Nên dưới 70 ký tự để hiển thị tốt nhất trên Google'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Mô tả SEO (Meta Description)',
      description: 'Mô tả ngắn gọn hiển thị trên kết quả tìm kiếm Google (Khuyên dùng: 120-160 ký tự)',
      type: 'text',
      group: 'seo',
      rows: 3,
      initialValue: 'Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền và nhận ưu đãi tốt nhất.',
      validation: (Rule) => Rule.max(160).warning('Nên dưới 160 ký tự để tránh bị Google cắt bớt'),
    }),
    defineField({
      name: 'metaKeywords',
      title: 'Từ khóa SEO (Keywords)',
      description: 'Các từ khóa ngăn cách bằng dấu phẩy. Ví dụ: săn mã shopee, mã giảm giá shopee, voucher shopee 22%, mã shopee live',
      type: 'string',
      group: 'seo',
      initialValue: 'săn mã shopee, chuyển đổi link shopee, mã giảm giá shopee, voucher shopee 22%, mã shopee live, mã youtube shopee, săn sale shopee',
    }),
    defineField({
      name: 'ogImage',
      title: 'Ảnh xem trước khi chia sẻ (OpenGraph / Social Image)',
      description: 'Ảnh hiển thị khi chia sẻ link lên Zalo, Facebook, Messenger, Telegram. Khuyến nghị tỉ lệ chuẩn 1200x630px',
      type: 'image',
      group: 'seo',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Tên miền chính thức (Canonical URL)',
      description: 'Ví dụ: https://sanmakhuyenmai.vn (Để trống sẽ tự động nhận diện theo domain truy cập)',
      type: 'url',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'metaTitle',
      logoText: 'logoText',
      logoHighlightText: 'logoHighlightText',
      subtitle: 'subTitle',
    },
    prepare({ title, logoText, logoHighlightText, subtitle }) {
      const brand = `${logoText || ''}${logoHighlightText || ''}`.trim() || 'Theme Settings';
      return {
        title: `Cài đặt giao diện: ${brand}`,
        subtitle: title || subtitle || 'Theme Settings',
      };
    },
  },
});
