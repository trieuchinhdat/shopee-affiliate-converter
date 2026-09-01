import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, HelpCircle, Zap, ChevronRight, ShieldCheck, Tag, Smartphone, Check } from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Hỏi Đáp Thường Gặp (FAQ) - Giải Đáp Về Mã Giảm Giá Shopee | Shopee Converter',
  description:
    'Tổng hợp câu hỏi và giải đáp chi tiết về cách lấy mã giảm giá Shopee 22%, tính an toàn, hỗ trợ mở app và mẹo săn voucher độc quyền.',
};

const faqs = [
  {
    q: 'Tại sao công cụ lại có mã giảm giá 22% mà trên sàn Shopee thông thường không thấy?',
    a: 'Mã giảm giá 22% (FB22) và 20% (YouTube/FB) là các chương trình liên kết độc quyền giữa Shopee và các kênh mạng xã hội (Facebook Reels, YouTube Shopping, KOL Voucher). Hệ thống của chúng tôi bóc tách và gắn đúng mã định danh Universal Link để kích hoạt các mã ưu đãi độc quyền này cho sản phẩm của bạn.',
  },
  {
    q: 'Sử dụng công cụ này có an toàn và miễn phí không?',
    a: 'Hoàn toàn 100% MIỄN PHÍ và AN TOÀN TUYỆT ĐỐI. Khi bạn bấm dùng mã, hệ thống chỉ tạo đường link điều hướng mở trực tiếp Ứng Dụng Shopee chính thức trên điện thoại của bạn. Chúng tôi KHÔNG BAO GIỜ yêu cầu bạn đăng nhập mật khẩu hay thông tin thẻ ngân hàng trên website này.',
  },
  {
    q: 'Tôi bấm nút "DÙNG MÃ" nhưng không mở được App Shopee thì xử lý thế nào?',
    a: 'Nếu bạn đang dùng trình duyệt tích hợp (như Messenger, Zalo, Facebook In-app Browser), hãy bấm vào biểu tượng dấu 3 chấm góc trên bên phải màn hình và chọn "Mở bằng trình duyệt" (Safari trên iOS hoặc Chrome trên Android). Sau đó bấm lại nút DÙNG MÃ, ứng dụng Shopee sẽ tự động kích hoạt.',
  },
  {
    q: 'Mã giảm giá có áp dụng được cho tất cả sản phẩm trên Shopee không?',
    a: 'Hầu hết các sản phẩm thuộc Shopee Mall, Shop Yêu Thích và các ngành hàng Thời trang, Đời sống, Công nghệ, Mỹ phẩm... đều áp dụng tốt. Một số ít sản phẩm bị hạn chế theo quy định pháp luật (như sữa trẻ em dưới 2 tuổi, thẻ cào điện thoại, vàng bạc tích lũy...) sẽ không áp dụng được mã.',
  },
  {
    q: 'Một đơn hàng có thể kết hợp nhiều loại mã giảm giá cùng lúc không?',
    a: 'Hoàn toàn ĐƯỢC! Shopee cho phép bạn áp dụng đồng thời 3 tầng voucher trong 1 đơn hàng: (1) Shopee Voucher giảm 22% từ công cụ, (2) Voucher Miễn Phí Vận Chuyển Freeship Xtra, và (3) Voucher riêng của Người Bán (Shop Voucher). Hãy áp dụng đủ cả 3 để có giá rẻ nhất!',
  },
  {
    q: 'Làm sao để nhận thông báo mỗi khi có mã giảm giá mới nhất?',
    a: 'Bạn có thể tham gia vào Nhóm Zalo Săn Sale Cộng Đồng được liên kết trên website để được Admin cập nhật mã mới real-time và hỗ trợ ghim mã vào khung giờ săn sale vàng.',
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 flex flex-col items-center">
      {/* Header */}
      <header className="w-full border-b border-white/10 bg-[#111827]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Trang chủ</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md shadow-orange-500/30">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-black text-sm text-white">
              SALE<span className="text-orange-400">SỐC</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-xl px-4 py-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Banner */}
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-500/15 via-blue-950/10 to-transparent p-5 sm:p-6 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Hỗ Trợ & Giải Đáp</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Hỏi Đáp Thường Gặp (FAQ)
            </h1>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Tổng hợp câu hỏi và hướng dẫn chi tiết giúp bạn an tâm săn mã Shopee an toàn và tiết kiệm nhất.
            </p>
          </div>

          {/* FAQs Accordion/Cards */}
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm transition-all hover:border-white/20"
              >
                <div className="flex items-start gap-2.5 font-bold text-sm text-white">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 text-xs font-black">
                    Q{idx + 1}
                  </span>
                  <span className="leading-snug">{faq.q}</span>
                </div>
                <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center space-y-3">
            <p className="text-xs text-slate-400">
              Bạn đã sẵn sàng tận hưởng ưu đãi giảm giá lên đến 22% cho đơn hàng tiếp theo?
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-500 transition-colors"
            >
              <span>Dán link săn mã ngay</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6">
          <Footer />
        </div>
      </main>
    </div>
  );
}
