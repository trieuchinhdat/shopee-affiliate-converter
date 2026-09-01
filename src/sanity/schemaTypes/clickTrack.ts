import { defineType, defineField } from 'sanity';

export const clickTrack = defineType({
  name: 'clickTrack',
  title: 'Lượt click',
  type: 'document',
  fields: [
    defineField({
      name: 'channel',
      title: 'Kênh bấm nút',
      type: 'string',
    }),
    defineField({
      name: 'targetUrl',
      title: 'Đường link Universal Link đã mở',
      type: 'url',
    }),
    defineField({
      name: 'productName',
      title: 'Tên sản phẩm liên quan',
      type: 'string',
    }),
    defineField({
      name: 'conversionLogId',
      title: 'ID Lượt dán tương ứng',
      type: 'string',
    }),
    defineField({
      name: 'ip',
      title: 'Địa chỉ IP',
      type: 'string',
    }),
    defineField({
      name: 'userAgent',
      title: 'Trình duyệt / Thiết bị',
      type: 'string',
    }),
    defineField({
      name: 'device',
      title: 'Loại Thiết Bị',
      type: 'string',
    }),
    defineField({
      name: 'clickedAt',
      title: 'Thời gian bấm nút',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'channel',
      subtitle: 'productName',
      date: 'clickedAt',
    },
    prepare({ title, subtitle, date }) {
      return {
        title: `Click: ${title?.toUpperCase() || 'UNKNOWN'}`,
        subtitle: `${subtitle || ''} (${date ? new Date(date).toLocaleTimeString('vi-VN') : ''})`,
      };
    },
  },
});
