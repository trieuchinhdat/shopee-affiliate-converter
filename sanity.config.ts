import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemaTypes';

export default defineConfig({
  basePath: '/studio',
  name: 'shopee_affiliate_converter',
  title: 'Shopee Affiliate Studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bcs6f8g2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Quản Trị Hệ Thống')
          .items([
            // Singleton: Cài đặt hệ thống
            S.listItem()
              .title('⚙️ Cài đặt hệ thống')
              .id('appConfig')
              .child(
                S.document()
                  .schemaType('appConfig')
                  .documentId('appConfigSingleton')
                  .title('Cài đặt hệ thống')
              ),

            // Singleton: Cài đặt giao diện & SEO
            S.listItem()
              .title('🎨 Cài đặt giao diện & SEO')
              .id('themeConfig')
              .child(
                S.document()
                  .schemaType('themeConfig')
                  .documentId('themeConfigSingleton')
                  .title('Cài đặt giao diện & SEO')
              ),

            S.divider(),

            // Collections
            S.documentTypeListItem('voucher').title('🎟️ Quản lý voucher'),
            S.documentTypeListItem('adminUser').title('👤 Quản lý user'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
