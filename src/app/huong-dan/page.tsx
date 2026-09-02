import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Zap,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Hướng Dẫn Săn Mã Giảm Giá Shopee Độc Quyền 22% | Shopee Converter',
  description:
    'Hướng dẫn 3 bước đơn giản để lấy mã giảm giá Shopee độc quyền FB 22%, YouTube 20% giúp bạn tiết kiệm tối đa khi mua sắm online.',
};

export default function HuongDanPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 flex flex-col items-center">
      {/* Top Navigation Bar */}
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
              SALE<span className="text-orange-400">HUNTER</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-xl px-4 py-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/15 via-amber-950/10 to-transparent p-5 sm:p-6 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Cẩm Nang Mua Sắm Thông Minh</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Hướng Dẫn Săn Mã Giảm Giá Shopee 22%
            </h1>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Chỉ với 3 bước đơn giản, bạn có thể tự động kích hoạt các mã giảm giá ẩn (FB 22%, YouTube 20%) độc quyền chưa từng có trên sàn Shopee thông thường.
            </p>
          </div>

          {/* 3 Steps Guide Card */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Quy Trình 3 Bước Lấy Mã Nhanh Chóng
            </h2>

            {/* Step 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 flex items-start gap-3.5 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 font-black text-sm">
                1
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Sao chép link sản phẩm từ Shopee</span>
                  <Copy className="h-3.5 w-3.5 text-orange-400" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mở App Shopee hoặc web Shopee, tìm món hàng bạn muốn mua. Nhấn nút <strong>Chia sẻ</strong> (hình mũi tên) và chọn <strong>Sao chép liên kết</strong>.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 flex items-start gap-3.5 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black text-sm">
                2
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Dán vào công cụ và chọn mã giảm sâu nhất</span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Quay lại website, dán link vào ô tìm kiếm và bấm <strong>Lấy mã ngay</strong>. Hệ thống sẽ tự động phân tích sản phẩm và đề xuất các nút voucher giảm sâu nhất (như FB 22%, FB 20%, YouTube 20%).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 flex items-start gap-3.5 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-sm">
                3
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Mở App Shopee & Áp mã vào đơn hàng</span>
                  <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Nhấn vào nút <strong>DÙNG MÃ</strong>. Mã giảm giá sẽ tự động được copy vào bộ nhớ tạm và ứng dụng Shopee sẽ mở ra. Tại màn hình thanh toán Shopee, dán mã vào ô <strong>Shopee Voucher</strong> để được giảm tiền ngay!
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tips Box */}
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Zap className="h-4 w-4" />
              <span>Mẹo Săn Sale Cực Đỉnh Từ Cao Thủ</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Khung giờ vàng:</strong> Shopee thường làm mới lượt mã vào các khung 0h - 9h - 12h - 21h hàng ngày.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Gom đơn đạt tối thiểu:</strong> Ghép thêm các phụ kiện hoặc đồ dùng nhỏ để đạt mức đơn tối thiểu (150k hoặc 500k) nhằm áp dụng mã giảm giá 22% cao nhất.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Áp 3 tầng giảm giá:</strong> Kết hợp cùng lúc Mã Shopee + Mã Shop + Mã Miễn phí vận chuyển (Freeship Xtra) để đơn hàng có giá hời nhất.</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ee4d2d] via-orange-500 to-amber-500 py-3.5 px-6 font-extrabold text-white text-sm shadow-xl shadow-orange-500/25 hover:brightness-110 transition-all active:scale-[0.98]"
            >
              <span>Bắt đầu săn mã ngay bây giờ</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
