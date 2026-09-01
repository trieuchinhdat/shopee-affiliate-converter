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
