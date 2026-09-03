import { defineType, defineField } from 'sanity';
import { SparklesIcon } from '@sanity/icons';

export const suggestedVoucher = defineType({
  name: 'suggestedVoucher',
  title: 'Gợi ý voucher hot',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tên gợi nhớ',
      description: 'Ví dụ: Mã Video KOL 25% - Giảm 150k (để bạn dễ tìm và quản lý trong admin)',
      type: 'string',
      validation: (Rule) => Rule.required().error('Vui lòng nhập tên gợi nhớ cho voucher'),
    }),
    defineField({
      name: 'image',
      title: 'Ảnh chụp vé voucher',
      description: 'Tải ảnh chụp màn hình vé voucher từ App Shopee lên (hỗ trợ crop/hotspot để căn chỉnh tỉ lệ đẹp nhất)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('Vui lòng tải ảnh chụp vé voucher'),
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link điều hướng Shopee',
      description: 'Dán link voucher Shopee (ví dụ: https://shopee.vn/voucher/details?...). Khi người dùng điện thoại bấm vào sẽ tự động nhận diện mở App Shopee để lưu mã.',
      type: 'url',
      validation: (Rule) => Rule.required().error('Vui lòng nhập link điều hướng voucher Shopee'),
    }),
    defineField({
      name: 'badgeText',
      title: 'Huy hiệu nổi bật (Tùy chọn)',
      description: 'Ví dụ: ĐANG PHÁT, SẮP HẾT, HOT DEAL, SIÊU SALE... để gắn lên góc vé',
      type: 'string',
      initialValue: 'ĐANG PHÁT',
    }),
    defineField({
      name: 'orderPriority',
      title: 'Thứ tự hiển thị',
      description: 'Số nhỏ hơn sẽ xếp trước (1 là vị trí đầu tiên)',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'isActive',
      title: 'Bật / Tắt',
      description: 'Gạt BẬT để hiển thị vé trên trang chủ. Gạt TẮT khi mã đã hết hạn.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      active: 'isActive',
      priority: 'orderPriority',
      badge: 'badgeText',
      linkUrl: 'linkUrl',
    },
    prepare({ title, media, active, priority, badge, linkUrl }) {
      const status = active !== false ? '[BẬT]' : '[TẮT]';
      const badgeStr = badge ? `[${badge}] ` : '';
      return {
        title: `${status} #${priority || 1} - ${badgeStr}${title || 'Chưa đặt tên'}`,
        subtitle: linkUrl ? linkUrl : 'Chưa có link điều hướng',
        media,
      };
    },
  },
});
