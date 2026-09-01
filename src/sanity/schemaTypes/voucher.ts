import { defineType, defineField } from 'sanity';

export const voucher = defineType({
  name: 'voucher',
  title: 'Quản lý voucher',
  type: 'document',
  fields: [
    defineField({
      name: 'voucherCode',
      title: 'Mã giảm giá (Coupon Code)',
      description: 'Mã khuyến mãi trên Shopee (vd: FB22SALE, YOUTUBE20)',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bắt buộc nhập mã voucher'),
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Tên hiển thị trên nút bấm (Button Label)',
      description: 'Ví dụ: Mã FB 22%, Mã YouTube 20%, Mã IG',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bắt buộc nhập tên nút bấm'),
    }),
    defineField({
      name: 'channel',
      title: 'Kênh áp dụng',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook 22% (Mã FB 22)', value: 'fb_22' },
          { title: 'Facebook 20% (Mã FB 20)', value: 'fb_20' },
          { title: 'YouTube (Mã YouTube 20)', value: 'ytb' },
          { title: 'Instagram (Mã IG)', value: 'ig' },
          { title: 'Zalo / Nhóm Săn Sale', value: 'zalo' },
          { title: 'Áp dụng tất cả (All)', value: 'all' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'fb_22',
    }),
    defineField({
      name: 'discountPercent',
      title: 'Phần trăm giảm giá (%)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(100),
      initialValue: 20,
    }),
    defineField({
      name: 'maxDiscount',
      title: 'Giảm tối đa (VNĐ)',
      description: 'Ví dụ: 100000 (100k), 2000000 (2 triệu)',
      type: 'number',
      initialValue: 100000,
    }),
    defineField({
      name: 'minSpend',
      title: 'Đơn tối thiểu (VNĐ)',
      description: 'Ví dụ: 150000 (150k), 500000 (500k)',
      type: 'number',
      initialValue: 150000,
    }),
    defineField({
      name: 'description',
      title: 'Mô tả chi tiết voucher',
      description: 'Ví dụ: Giảm 22% tối đa 100k cho đơn từ 150k',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Trạng thái voucher',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Đang mở (Active)', value: 'active' },
          { title: '🔴 Hết mã (Expired)', value: 'expired' },
          { title: '🟡 Sắp mở (Incoming)', value: 'incoming' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'isHighlighted',
      title: 'Hiển thị huy hiệu HOT NHẤT 🔥',
      description: 'Gạt BẬT để hiển thị nhãn HOT NHẤT và hiệu ứng viền phát sáng màu cam',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'orderPriority',
      title: 'Thứ tự ưu tiên hiển thị (1 là cao nhất)',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'usageProgress',
      title: 'Tỉ lệ đã dùng (%)',
      description: 'Hiển thị thanh tiến trình độ hot (vd: 88%)',
      type: 'number',
      initialValue: 85,
    }),
  ],
  preview: {
    select: {
      title: 'buttonLabel',
      code: 'voucherCode',
      status: 'status',
      discount: 'discountPercent',
      hot: 'isHighlighted',
    },
    prepare({ title, code, status, discount, hot }) {
      const statusIcon = status === 'active' ? '🟢' : status === 'expired' ? '🔴' : '🟡';
      const hotTag = hot ? '🔥 [HOT]' : '';
      return {
        title: `${statusIcon} ${title} - Giảm ${discount}% ${hotTag}`,
        subtitle: `Mã: ${code} (${status})`,
      };
    },
  },
});
