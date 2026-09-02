import { defineType, defineField } from 'sanity';

export const voucher = defineType({
  name: 'voucher',
  title: 'Quản lý voucher',
  type: 'document',
  groups: [
    { name: 'general', title: '1. Thông tin chung', default: true },
    { name: 'discount', title: '2. Giá trị giảm giá' },
    { name: 'branding', title: '3. Cùi vé & Logo' },
    { name: 'badges', title: '4. Huy hiệu & Tiến độ' },
  ],
  fields: [
    // ==========================================
    // GROUP 1: THÔNG TIN CHUNG
    // ==========================================
    defineField({
      name: 'isActive',
      title: 'Bật / Tắt voucher này',
      description: 'Gạt BẬT để hiển thị mã trên web. Gạt TẮT để ẩn hoàn toàn.',
      type: 'boolean',
      initialValue: true,
      group: 'general',
    }),
    defineField({
      name: 'voucherCode',
      title: 'Mã giảm giá (Coupon Code)',
      description: 'Mã khuyến mãi trên Shopee (vd: FB22SALE, YOUTUBE20, SHOPEE15)',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bắt buộc nhập mã voucher'),
      group: 'general',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Tên hiển thị nội bộ (Button Label)',
      description: 'Tên nhận diện trong danh sách quản trị (vd: Mã FB 22%, Mã YouTube 20%)',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bắt buộc nhập tên hiển thị'),
      group: 'general',
    }),
    defineField({
      name: 'channel',
      title: 'Kênh áp dụng (Mở Deep Link Shopee)',
      description: 'Chọn kênh tương ứng để khi người dùng bấm sẽ mở đúng deep link Shopee',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook 25% (Mã FB 25)', value: 'fb_25' },
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
      group: 'general',
    }),
    defineField({
      name: 'status',
      title: 'Trạng thái hoạt động',
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
      group: 'general',
    }),
    defineField({
      name: 'orderPriority',
      title: 'Thứ tự ưu tiên hiển thị',
      description: 'Số nhỏ hơn sẽ xếp trước (1 là vị trí đầu tiên)',
      type: 'number',
      initialValue: 1,
      group: 'general',
    }),

    // ==========================================
    // GROUP 2: GIÁ TRỊ GIẢM GIÁ
    // ==========================================
    defineField({
      name: 'discountPercent',
      title: 'Phần trăm giảm giá (%)',
      description: 'Nhập số % giảm (vd: 22, 20, 18, 15)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
      group: 'discount',
    }),
    defineField({
      name: 'maxDiscount',
      title: 'Giảm tối đa (VNĐ)',
      description: 'Nhập số tiền giảm tối đa (vd: 300000 = 300k, 2000000 = 2 triệu). 💡 Để trống nếu giảm không giới hạn.',
      type: 'number',
      group: 'discount',
    }),
    defineField({
      name: 'minSpend',
      title: 'Đơn tối thiểu (VNĐ)',
      description: 'Nhập số tiền đơn tối thiểu (vd: 50000 = 50k, 0 = 0đ). 💡 Để trống nếu không muốn hiển thị dòng điều kiện.',
      type: 'number',
      group: 'discount',
    }),
    defineField({
      name: 'customTitle',
      title: 'Tiêu đề vé tùy chỉnh (Ghi đè)',
      description: '💡 Để trống hệ thống sẽ tự sinh: "giảm 22% Giảm tối đa 300kđ"',
      type: 'string',
      group: 'discount',
    }),
    defineField({
      name: 'customMinSpendText',
      title: 'Dòng điều kiện đơn tùy chỉnh (Ghi đè)',
      description: '💡 Để trống hệ thống sẽ tự sinh từ mục "Đơn tối thiểu"',
      type: 'string',
      group: 'discount',
    }),
    defineField({
      name: 'description',
      title: 'Ghi chú nội bộ (Không bắt buộc)',
      type: 'string',
      group: 'discount',
    }),

    // ==========================================
    // GROUP 3: CÙI VÉ & LOGO THƯƠNG HIỆU
    // ==========================================
    defineField({
      name: 'brandPreset',
      title: 'Thương hiệu / Logo cùi vé trái',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook (Logo FB tròn xanh)', value: 'facebook' },
          { title: 'YouTube (Logo YouTube đỏ)', value: 'youtube' },
          { title: 'Shopee (Logo Giỏ hàng Shopee)', value: 'shopee' },
          { title: 'Shopee Trendy (Logo Shopee Trendy sắc màu)', value: 'shopee_trendy' },
          { title: 'Shopee Live (Logo Shopee Live)', value: 'shopee_live' },
          { title: 'Shopee Video (Logo Shopee Video)', value: 'shopee_video' },
          { title: 'Zalo Săn Sale (Logo Zalo)', value: 'zalo' },
          { title: 'Tùy chỉnh (Tải ảnh logo lên)', value: 'custom' },
        ],
      },
      initialValue: 'facebook',
      group: 'branding',
    }),
    defineField({
      name: 'brandLabel',
      title: 'Chữ dưới logo cùi vé',
      description: 'Ví dụ: FACEBOOK, YouTube, SHOPEE, Toàn Ngành Hàng. 💡 Để trống sẽ tự lấy theo Thương hiệu đã chọn.',
      type: 'string',
      group: 'branding',
    }),
    defineField({
      name: 'customBrandLogo',
      title: 'Tải lên logo cùi vé tùy chỉnh',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.brandPreset !== 'custom',
      group: 'branding',
    }),

    // ==========================================
    // GROUP 4: HUY HIỆU & TIẾN ĐỘ
    // ==========================================
    defineField({
      name: 'badgeType',
      title: 'Kiểu Huy hiệu / Tag nổi bật',
      description: 'Chọn "Không hiển thị" nếu không muốn hiển thị tag trên vé',
      type: 'string',
      options: {
        list: [
          { title: '⚪ Không hiển thị', value: 'none' },
          { title: '⚡ Huy hiệu Tia chớp (Số lượng có hạn)', value: 'flash_sale' },
          { title: '🔴 Khung viền đỏ Độc quyền (Outline)', value: 'exclusive_outline' },
          { title: '🏷️ Tag tùy chỉnh', value: 'custom_tag' },
        ],
      },
      initialValue: 'none',
      group: 'badges',
    }),
    defineField({
      name: 'badgeText',
      title: 'Nội dung Huy hiệu / Tag',
      description: 'Ví dụ: Độc Quyền Facebook, Độc Quyền YouTube Shopping, Số lượng có hạn. 💡 Để trống sẽ không hiển thị tag.',
      type: 'string',
      hidden: ({ parent }) => !parent?.badgeType || parent?.badgeType === 'none',
      group: 'badges',
    }),
    defineField({
      name: 'usageProgress',
      title: 'Tiến độ đã dùng (%)',
      description: 'Nhập số % (vd: 82). 💡 Để trống hoặc nhập 0 nếu muốn ẨN thanh tiến trình.',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
      group: 'badges',
    }),
    defineField({
      name: 'urgencyType',
      title: 'Cảnh báo tình trạng mã',
      type: 'string',
      options: {
        list: [
          { title: '⚪ Không hiển thị', value: 'none' },
          { title: '🔥 Đang hết nhanh (Chữ đỏ)', value: 'running_out' },
          { title: '📊 Đã dùng X% (Lấy theo % tiến độ đã dùng)', value: 'percent_used' },
          { title: '✍️ Nhập text cảnh báo tùy chỉnh', value: 'custom' },
        ],
      },
      initialValue: 'none',
      group: 'badges',
    }),
    defineField({
      name: 'customUrgencyText',
      title: 'Nội dung cảnh báo tùy chỉnh',
      description: 'Ví dụ: Sắp hết lượt, Ưu đãi có hạn',
      type: 'string',
      hidden: ({ parent }) => parent?.urgencyType !== 'custom',
      group: 'badges',
    }),
    defineField({
      name: 'expiryText',
      title: 'Thời gian hết hạn',
      description: 'Ví dụ: Còn 13 giờ, Còn 1 ngày. 💡 Để trống sẽ ẨN dòng thông tin hết hạn.',
      type: 'string',
      group: 'badges',
    }),
  ],
  preview: {
    select: {
      title: 'buttonLabel',
      code: 'voucherCode',
      status: 'status',
      discount: 'discountPercent',
      active: 'isActive',
      brand: 'brandPreset',
      badge: 'badgeText',
    },
    prepare({ title, code, status, discount, active, brand, badge }) {
      const activeStatus = active !== false ? '🟢' : '⚪ [TẮT]';
      const brandStr = brand ? `[${brand.toUpperCase()}]` : '';
      const badgeStr = badge ? ` | Badge: ${badge}` : '';
      const discountStr = discount ? ` - Giảm ${discount}%` : '';
      return {
        title: `${activeStatus} ${brandStr} ${title || 'Voucher'}${discountStr}`,
        subtitle: `Mã: ${code}${badgeStr} (${active !== false ? status : 'Đang tắt'})`,
      };
    },
  },
});
