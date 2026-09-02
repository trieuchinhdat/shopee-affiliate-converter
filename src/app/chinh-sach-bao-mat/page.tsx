import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Lock,
  Zap,
  Shield,
  FileText,
  Eye,
  Server,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật Quyền Riêng Tư (Privacy Policy) | Shopee Converter',
  description:
    'Chính sách bảo vệ thông tin và quyền riêng tư của người dùng khi sử dụng công cụ chuyển đổi link Shopee Affiliate Converter.',
};

export default function ChinhSachBaoMatPage() {
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
              SALE<span className="text-orange-400">HUNTER</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-xl px-4 py-6 flex-1 flex flex-col justify-between text-slate-300 text-xs leading-relaxed">
        <div className="space-y-6">
          {/* Banner */}
          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-500/15 via-purple-950/10 to-transparent p-5 sm:p-6 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
              <Lock className="h-3.5 w-3.5" />
              <span>Quyền Riêng Tư & Bảo Mật Dữ Liệu</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Cập nhật lần cuối: Tháng 09/2026. Chúng tôi cam kết tôn trọng và bảo vệ quyền riêng tư của mọi người dùng.
            </p>
          </div>

          {/* Section 1 */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <FileText className="h-4 w-4 text-purple-400" />
              <h2>1. Mục đích và phạm vi áp dụng</h2>
            </div>
            <p>
              Chính sách bảo mật này giải thích cách chúng tôi xử lý các thông tin phát sinh khi bạn truy cập và sử dụng công cụ chuyển đổi link Shopee Affiliate Converter. Chúng tôi cam kết bảo vệ thông tin theo đúng các quy định pháp luật hiện hành.
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Eye className="h-4 w-4 text-purple-400" />
              <h2>2. Thông tin chúng tôi xử lý</h2>
            </div>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>
                <strong>Đường dẫn sản phẩm (URL Shopee):</strong> Chỉ dùng để bóc tách thông tin sản phẩm (mã shopId, itemId, tiêu đề sản phẩm) nhằm phục vụ chức năng tạo Universal Link và gợi ý voucher.
              </li>
              <li>
                <strong>Dữ liệu kỹ thuật ẩn danh:</strong> Thông tin về trình duyệt (User-Agent), loại thiết bị (iOS/Android/Desktop), và địa chỉ IP ẩn danh (đã che các byte cuối) nhằm chống spam, chống tấn công DDoS và tối ưu hiệu suất server.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Shield className="h-4 w-4 text-emerald-400" />
              <h2>3. Thông tin chúng tôi KHÔNG thu thập</h2>
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-emerald-300">
              <li>Không thu thập Họ tên, Số CMND/CCCD, Số điện thoại cá nhân.</li>
              <li>Không thu thập Mật khẩu tài khoản Shopee hay bất kỳ tài khoản nào.</li>
              <li>Không thu thập Thông tin thanh toán, Số tài khoản ngân hàng, Số thẻ Visa/Mastercard.</li>
              <li>Không thu thập Vị trí GPS chính xác hay danh bạ thiết bị.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Server className="h-4 w-4 text-blue-400" />
              <h2>4. Cookie & Bộ nhớ trình duyệt (Session Storage)</h2>
            </div>
            <p>
              Chúng tôi sử dụng <strong>Session Storage</strong> tạm thời trên trình duyệt của bạn với mục đích duy nhất là giãn cách thời gian bấm nút (cooldown chống click đúp trong 30 giây). Bộ nhớ này sẽ tự động xóa khi bạn đóng tab trình duyệt.
            </p>
          </div>

          {/* Section 5 */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <UserCheck className="h-4 w-4 text-orange-400" />
              <h2>5. Cam kết không chia sẻ dữ liệu</h2>
            </div>
            <p>
              Chúng tôi tuyệt đối <strong>không bán, không trao đổi, không thương mại hóa</strong> bất kỳ dữ liệu người dùng nào cho các bên thứ ba quảng cáo hay tổ chức khác.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-500 py-3.5 px-6 font-extrabold text-white text-sm shadow-xl shadow-purple-600/25 transition-all active:scale-[0.98]"
            >
              <span>Trở về Trang chủ</span>
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
