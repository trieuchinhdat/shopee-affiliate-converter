import { defineType, defineField } from 'sanity';

export const conversionLog = defineType({
  name: 'conversionLog',
  title: 'Lịch sử convert',
  type: 'document',
  fields: [
    defineField({
      name: 'inputUrl',
      title: 'Đường link gốc người dùng dán',
      type: 'url',
    }),
    defineField({
      name: 'productName',
      title: 'Tên sản phẩm',
      type: 'string',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Ảnh sản phẩm',
      type: 'url',
    }),
    defineField({
      name: 'shopId',
      title: 'Shop ID',
      type: 'string',
    }),
    defineField({
      name: 'itemId',
      title: 'Item ID',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Giá sản phẩm (VNĐ)',
      type: 'number',
    }),
    defineField({
      name: 'affiliateIdUsed',
      title: 'Mã Affiliate ID đã gắn',
      type: 'string',
    }),
    defineField({
      name: 'ip',
      title: 'Địa chỉ IP',
      type: 'string',
    }),
    defineField({
      name: 'userAgent',
      title: 'Thông tin Trình duyệt / Thiết bị',
      type: 'string',
    }),
    defineField({
      name: 'device',
      title: 'Loại Thiết Bị',
      type: 'string',
    }),
    defineField({
      name: 'createdAt',
      title: 'Thời gian chuyển đổi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'productName',
      subtitle: 'createdAt',
      device: 'device',
    },
    prepare({ title, subtitle, device }) {
      return {
        title: title || 'Lượt dán link',
        subtitle: `${device || 'Mobile'} • ${subtitle ? new Date(subtitle).toLocaleString('vi-VN') : ''}`,
      };
    },
  },
});
