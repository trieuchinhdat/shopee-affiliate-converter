import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Lock,
  EyeOff,
  Smartphone,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Trung Tâm An Toàn & Bảo Mật | Shopee Converter',
  description:
    'Cam kết bảo vệ an toàn cho người dùng: 100% mở App Shopee chính hãng, không thu thập tài khoản ngân hàng hay mật khẩu, chống gian lận lừa đảo.',
};

export default function AnToanPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 flex flex-col items-center">
      {/* Top Header */}
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

      {/* Main Container */}
      <main className="w-full max-w-xl px-4 py-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Banner */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/15 via-emerald-950/10 to-transparent p-5 sm:p-6 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Cam Kết An Toàn & Minh Bạch</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Trung Tâm An Toàn Mua Sắm
            </h1>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Chúng tôi đặt sự an toàn, bảo mật thông tin và quyền lợi của người mua sắm lên hàng đầu.
            </p>
          </div>

          {/* 4 Core Pillars of Security */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              4 Tiêu Chuẩn Bảo Vệ Người Dùng
            </h2>

            {/* Pillar 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-white">1. Mở App Shopee Chính Hãng 100%</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mọi liên kết do hệ thống tạo ra đều sử dụng giao thức chính thức của Shopee (Universal Link / Deep Link). Bạn sẽ luôn được điều hướng về đúng ứng dụng Shopee chính chủ hoặc website <strong>shopee.vn</strong> an toàn.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <EyeOff className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-white">2. Không Lưu Mật Khẩu & Thẻ Ngân Hàng</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Website của chúng tôi <strong>tuyệt đối KHÔNG</strong> có chức năng đăng nhập tài khoản mua hàng, không yêu cầu mã OTP, số thẻ tín dụng hay bất kỳ thông tin thanh toán nào. Mọi thao tác thanh toán đều diễn ra hoàn toàn bên trong Shopee.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Smartphone className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-white">3. Không Cài Đặt File Lạ & Mã Độc</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Website hoạt động theo tiêu chuẩn Web hiện đại (Progressive Web App - PWA), không yêu cầu bạn tải về bất kỳ tập tin APK hay tiện ích can thiệp nào vào thiết bị. Thiết bị của bạn luôn được bảo vệ tối đa.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-white">4. Minh Bạch Tiếp Thị Liên Kết</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chúng tôi là đối tác tiếp thị liên kết (Shopee Affiliate Program). Khi bạn mua sắm qua các liên kết này và nhận mã giảm giá 22%, chúng tôi có thể nhận một khoản hoa hồng nhỏ từ Shopee mà <strong>không làm tăng thêm bất kỳ chi phí nào</strong> cho đơn hàng của bạn.
              </p>
            </div>
          </div>

          {/* Warning Callout */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertCircle className="h-4 w-4" />
              <span>Cảnh Báo Chống Lừa Đảo</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nếu có bất kỳ ai liên hệ yêu cầu bạn chuyển khoản trước để nhận mã giảm giá hoặc yêu cầu cung cấp OTP, hãy từ chối ngay lập tức. Tất cả mã giảm giá trên website của chúng tôi đều được cung cấp <strong>hoàn toàn miễn phí</strong>.
            </p>
          </div>

          {/* Back CTA */}
          <div className="pt-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3.5 px-6 font-extrabold text-white text-sm shadow-xl shadow-emerald-600/25 transition-all active:scale-[0.98]"
            >
              <span>An tâm săn mã Shopee ngay</span>
              <ChevronRight className="h-4 w-4" />
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
