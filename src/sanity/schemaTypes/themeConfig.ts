import { defineType, defineField } from 'sanity';

export const themeConfig = defineType({
  name: 'themeConfig',
  title: 'Cài đặt giao diện',
  type: 'document',
  fields: [
    // --- 1. LOGO & THƯƠNG HIỆU ---
    defineField({
      name: 'logoType',
      title: 'Kiểu Logo',
      type: 'string',
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
      initialValue: 'SALE',
      hidden: ({ parent }) => parent?.logoType === 'image',
    }),
    defineField({
      name: 'logoHighlightText',
      title: 'Chữ nổi bật (Màu cam)',
      type: 'string',
      initialValue: 'SỐC',
      hidden: ({ parent }) => parent?.logoType === 'image',
    }),
    defineField({
      name: 'logoBadge',
      title: 'Huy hiệu Logo (Badge nhỏ bên cạnh)',
      description: 'Ví dụ: VIP, PRO, SALE 9.9, HOT...',
      type: 'string',
      initialValue: 'PRO',
    }),
    defineField({
      name: 'logoImage',
      title: 'Tải lên Hình ảnh Logo (Nếu chọn kiểu Image)',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.logoType === 'text',
    }),
    defineField({
      name: 'subTitle',
      title: 'Slogan / Dòng chữ dưới logo',
      type: 'string',
      initialValue: 'Voucher Hunter Shopee',
    }),

    // --- 2. MÀU NỀN HOẶC HÌNH NỀN (BACKGROUND) ---
    defineField({
      name: 'backgroundType',
      title: 'Kiểu Nền Trang (Background Type)',
      type: 'string',
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
      initialValue: '#0b0f19',
      description: 'Ví dụ: #0b0f19 (Tối hiện đại), #000000 (Đen tuyền), #0f172a (Xanh đêm)...',
    }),
    defineField({
      name: 'gradientStart',
      title: 'Màu Gradient Bắt đầu (Top)',
      type: 'string',
      initialValue: '#0b0f19',
      hidden: ({ parent }) => parent?.backgroundType !== 'gradient',
    }),
    defineField({
      name: 'gradientEnd',
      title: 'Màu Gradient Kết thúc (Bottom)',
      type: 'string',
      initialValue: '#1c1008',
      hidden: ({ parent }) => parent?.backgroundType !== 'gradient',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Tải lên Hình Nền (Background Image)',
      description: 'Tải ảnh nền tùy ý (sẽ tự động phủ lớp tối mờ để chữ luôn nổi bật)',
      type: 'image',
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
      initialValue: 85,
      validation: (Rule) => Rule.min(0).max(100),
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
    }),

    // --- 3. NỘI DUNG HERO & BANNER ---
    defineField({
      name: 'bannerBadgeText',
      title: 'Dòng chữ huy hiệu đầu trang',
      type: 'string',
      initialValue: 'Tự động kích hoạt mã giảm giá sâu nhất',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Tiêu đề chính (Hero Title)',
      type: 'string',
      initialValue: 'Chuyển Đổi Link Shopee',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Mô tả phụ dưới tiêu đề',
      type: 'text',
      rows: 2,
      initialValue: 'Dán link sản phẩm Shopee để nhận ngay mã FB 22%, YouTube 20% độc quyền.',
    }),

    // --- 4. CÀI ĐẶT THẺ NHÓM ZALO TRÊN TRANG CHỦ ---
    defineField({
      name: 'showZaloCard',
      title: 'Hiển thị Thẻ Nhóm Zalo Báo Mã Săn Sale',
      description: 'Bật / Tắt khối giới thiệu nhóm Zalo trên trang chủ',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'zaloCardTitle',
      title: 'Tiêu đề Thẻ Nhóm Zalo',
      type: 'string',
      initialValue: 'Nhóm Zalo Báo Mã Săn Sale',
      hidden: ({ parent }) => parent?.showZaloCard === false,
    }),
    defineField({
      name: 'zaloCardSubtitle',
      title: 'Mô tả Thẻ Nhóm Zalo',
      type: 'string',
      initialValue: 'Báo mã FB 22%, Shopee Live & Flash Sale trước 15 phút',
      hidden: ({ parent }) => parent?.showZaloCard === false,
    }),
    defineField({
      name: 'zaloCardMembers',
      title: 'Số lượng thành viên hiển thị',
      type: 'string',
      initialValue: 'Hơn 15.000+ thành viên',
      hidden: ({ parent }) => parent?.showZaloCard === false,
    }),
    defineField({
      name: 'zaloCardButtonText',
      title: 'Chữ trên nút bấm Thẻ Zalo',
      type: 'string',
      initialValue: 'Vào Nhóm Zalo Săn Sale (Miễn Phí)',
      hidden: ({ parent }) => parent?.showZaloCard === false,
    }),

    // --- 5. CÀI ĐẶT CHATBOX ZALO NỔI Ở GÓC MÀN HÌNH ---
    defineField({
      name: 'showFloatingZalo',
      title: 'Bật Chatbox Zalo nổi ở góc màn hình (Floating Widget)',
      description: 'Bật / Tắt nút tròn Zalo nhấp nháy phát sáng ở góc dưới bên phải',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'floatingZaloText',
      title: 'Nội dung bong bóng Chatbox Zalo',
      type: 'string',
      initialValue: 'Nhận mã 22% & mã Live sớm nhất! 💬',
      hidden: ({ parent }) => parent?.showFloatingZalo === false,
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
      subtitle: 'subTitle',
    },
    prepare({ title, subtitle }) {
      return {
        title: `Cài đặt giao diện: ${title || 'Chưa đặt tiêu đề'}`,
        subtitle: subtitle || 'Theme Settings',
      };
    },
  },
});
