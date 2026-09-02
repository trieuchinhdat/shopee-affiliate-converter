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
      title: 'Danh sách Link Facebook Mẫu (Pool Token FB Sống)',
      description:
        'Nhập các đường link Shopee lấy từ Facebook Reels / Bài post (chấp nhận cả link rút gọn s.shopee.vn, vn.shp.ee hoặc link dài). Hệ thống sẽ tự động giải mã lấy Token bảo mật mới nhất và xoay tua áp mã Facebook cho khách.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'facebookSampleItem',
          title: 'Link Facebook Mẫu',
          fields: [
            {
              name: 'url',
              title: 'Đường link Shopee từ Facebook (s.shopee.vn, vn.shp.ee hoặc shopee.vn)',
              type: 'text',
              rows: 3,
              validation: (Rule: any) =>
                Rule.required()
                  .custom((url: string) => {
                    if (!url) return 'Vui lòng nhập link';
                    if (!url.includes('shopee.vn') && !url.includes('shp.ee') && !url.includes('shope.ee')) {
                      return 'Link phải là link Shopee (shopee.vn, s.shopee.vn, vn.shp.ee)';
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
      name: 'enableAffipad',
      title: '⚡ Bật hệ thống AffiPad Multi-Account (Tự động sinh link 100% hiện mã)',
      description:
        'Sử dụng API AffiPad để tự động tạo link Shopee có chứa credential_token riêng cho từng sản phẩm. Giúp 100% người dùng khi bấm mở App Shopee đều nhận được mã giảm giá.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'affipadAccounts',
      title: 'Danh sách Tài khoản AffiPad (Pool Xoay Tua & Dự Phòng)',
      description:
        'Thêm các tài khoản AffiPad (mỗi tài khoản miễn phí 1.000 lượt/tháng). Hệ thống sẽ tự động xoay tua (Round-Robin) và tự động đổi tài khoản khi hết hạn mức (Auto-Failover).',
      type: 'array',
      hidden: ({ parent }) => parent?.enableAffipad === false,
      of: [
        {
          type: 'object',
          name: 'affipadAccountItem',
          title: 'Tài khoản AffiPad',
          fields: [
            {
              name: 'label',
              title: 'Tên gợi nhớ tài khoản',
              type: 'string',
              description: 'Ví dụ: Tài khoản 1 (dat1@gmail.com)',
              initialValue: 'Tài khoản AffiPad',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'apiKey',
              title: 'API Key (Bearer Token)',
              type: 'string',
              description: 'Lấy tại https://my.affipad.com/settings (Mục API Keys)',
              validation: (Rule: any) => Rule.required().min(10).error('Vui lòng nhập API Key hợp lệ'),
            },
            {
              name: 'toolId',
              title: 'Tool ID',
              type: 'string',
              description: 'Mã Tool ID lấy trong mục Tools của AffiPad (dạng clx1abc...)',
              validation: (Rule: any) => Rule.required().error('Vui lòng nhập Tool ID'),
            },
            {
              name: 'isActive',
              title: 'Bật sử dụng tài khoản này',
              type: 'boolean',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              title: 'label',
              toolId: 'toolId',
              active: 'isActive',
            },
            prepare({ title, toolId, active }: any) {
              const status = active !== false ? '🟢 [ĐANG BẬT]' : '⚪ [TẮT]';
              return {
                title: `${status} ${title || 'Tài khoản AffiPad'}`,
                subtitle: toolId ? `Tool ID: ${toolId}` : 'Chưa nhập Tool ID',
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'affipadCacheTtlHours',
      title: 'Thời gian lưu Cache link đã chuyển đổi (Giờ)',
      description:
        'Số giờ lưu lại link sản phẩm đã convert. Khách tiếp theo dán cùng sản phẩm sẽ nhận link ngay lập tức mà KHÔNG tốn quota của AffiPad (Mặc định: 12 giờ).',
      type: 'number',
      initialValue: 12,
      hidden: ({ parent }) => parent?.enableAffipad === false,
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
