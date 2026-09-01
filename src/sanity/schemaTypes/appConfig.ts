import { defineType, defineField } from 'sanity';

export const appConfig = defineType({
  name: 'appConfig',
  title: 'Cài đặt hệ thống',
  type: 'document',
  fields: [
    defineField({
      name: 'affiliateId',
      title: 'Shopee Affiliate ID (an_XXXXXXXXXXX)',
      description: 'Mã định danh duy nhất của bạn. Hệ thống tự động ghép vào link của khách.',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bắt buộc phải nhập Affiliate ID'),
      initialValue: 'an_17387060372',
    }),
    defineField({
      name: 'defaultSubId',
      title: 'Mã chiến dịch mặc định (Sub ID)',
      type: 'string',
      initialValue: 'web_converter',
    }),
    defineField({
      name: 'savingsNotice',
      title: 'Thông báo tiết kiệm',
      type: 'string',
      initialValue: 'Áp dụng mã trên App Shopee để nhận ưu đãi cao nhất!',
    }),
    defineField({
      name: 'zaloGroupUrl',
      title: 'Link Nhóm Zalo Săn Sale',
      type: 'url',
      initialValue: 'https://zalo.me/g/kczvyi443',
    }),
    defineField({
      name: 'autoBlinkTopDiscount',
      title: 'Tự động nhấp nháy mã giảm sâu nhất',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'facebookSampleUrls',
      title: 'Danh sách Link Facebook Mẫu (Pool Token FB)',
      description:
        'Nhập các đường link Shopee lấy từ Facebook (tối đa 10 link). Hệ thống sẽ tự động bóc tách Token và chọn ngẫu nhiên để gắn Tag FB cho khách.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'facebookSampleItem',
          title: 'Link Facebook Mẫu',
          fields: [
            {
              name: 'url',
              title: 'Đường link Facebook đầy đủ (chứa encrypted_payload)',
              type: 'text',
              rows: 3,
              validation: (Rule: any) =>
                Rule.required()
                  .custom((url: string) => {
                    if (!url) return 'Vui lòng nhập link';
                    if (!url.includes('shopee.vn') && !url.includes('shp.ee')) {
                      return 'Link phải là link Shopee';
                    }
                    if (!url.includes('encrypted_payload')) {
                      return 'Cảnh báo: Link này chưa có tham số encrypted_payload của Facebook';
                    }
                    return true;
                  }),
            },
            {
              name: 'label',
              title: 'Ghi chú nguồn link',
              type: 'string',
              description: 'Ví dụ: Link FB Reels 1, Link Post Nhóm...',
              initialValue: 'Link FB Mẫu',
            },
            {
              name: 'isActive',
              title: 'Bật sử dụng link này',
              type: 'boolean',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              title: 'label',
              url: 'url',
              active: 'isActive',
            },
            prepare({ title, url, active }: any) {
              const status = active !== false ? '🟢 [ĐANG BẬT]' : '⚪ [TẮT]';
              return {
                title: `${status} ${title || 'Link FB'}`,
                subtitle: url ? `${url.substring(0, 60)}...` : 'Chưa có link',
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(10).error('Tối đa 10 link mẫu'),
    }),
    defineField({
      name: 'enableTelegramNotify',
      title: 'Bật thông báo lượt Click về Telegram',
      description: 'Gửi tin nhắn tức thời đến Telegram Bot mỗi khi người dùng click vào nút voucher mở App Shopee.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'telegramBotToken',
      title: 'Telegram Bot Token',
      description: 'Mã Token của Bot do @BotFather cấp (ví dụ: 7812345678:AAH...)',
      type: 'string',
      hidden: ({ parent }) => !parent?.enableTelegramNotify,
    }),
    defineField({
      name: 'telegramChatId',
      title: 'Telegram Chat ID / Group ID',
      description: 'ID người nhận hoặc Group Telegram nhận thông báo (ví dụ: -100123456789 hoặc 987654321)',
      type: 'string',
      hidden: ({ parent }) => !parent?.enableTelegramNotify,
    }),
    defineField({
      name: 'telegramCooldownSeconds',
      title: 'Thời gian giãn cách chống spam (Giây)',
      description: 'Khoảng thời gian tối thiểu giữa 2 lần gửi thông báo cho cùng 1 sản phẩm từ 1 người dùng (Mặc định: 30 giây).',
      type: 'number',
      initialValue: 30,
      hidden: ({ parent }) => !parent?.enableTelegramNotify,
    }),
  ],
  preview: {
    select: {
      title: 'affiliateId',
      subtitle: 'zaloGroupUrl',
    },
    prepare({ title, subtitle }) {
      return {
        title: `Cài đặt hệ thống: ${title || 'Chưa nhập ID'}`,
        subtitle: subtitle || 'App Settings',
      };
    },
  },
});
