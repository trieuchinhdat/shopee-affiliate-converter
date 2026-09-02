'use client';

import React from 'react';
import { Sparkles, Ticket, Flame, ArrowUpRight, Zap } from 'lucide-react';

interface HomeVouchersTeaserProps {
  onSelectVoucher?: () => void;
}

const TEASER_VOUCHERS = [
  {
    id: 'fb22',
    name: 'Mã Facebook 22%',
    discount: '-22%',
    maxDiscount: 'Giảm tối đa 300.000đ',
    condition: 'Đơn từ 0đ • Toàn ngành hàng',
    badge: 'ĐANG PHÁT',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    iconColor: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'yt20',
    name: 'Mã YouTube 20%',
    discount: '-20%',
    maxDiscount: 'Giảm tối đa 150.000đ',
    condition: 'Toàn sàn Shopee • Siêu ưu đãi',
    badge: 'CỰC HOT',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    iconColor: 'from-rose-600 to-red-600',
  },
  {
    id: 'live15',
    name: 'Mã Shopee Live & Video',
    discount: '-15%',
    maxDiscount: 'Giảm tối đa 70.000đ',
    condition: 'Đơn từ 0đ • Tự động gắn mã',
    badge: 'SẴN SÀNG',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    iconColor: 'from-amber-500 to-orange-600',
  },
];

export default function HomeVouchersTeaser({ onSelectVoucher }: HomeVouchersTeaserProps) {
  const handleClick = () => {
    if (onSelectVoucher) {
      onSelectVoucher();
    } else {
      const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/80 backdrop-blur-md p-3.5 sm:p-4 space-y-2.5 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
          <Flame className="h-4 w-4 text-orange-400 fill-orange-400 animate-pulse" />
          <span>Mã Giảm Giá Đang Phát Hôm Nay</span>
        </div>
        <span className="text-[10px] text-orange-400 font-semibold bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
          Cập nhật 1 phút trước
        </span>
      </div>

      <div className="space-y-2">
        {TEASER_VOUCHERS.map((v) => (
          <button
            key={v.id}
            onClick={handleClick}
            className="w-full text-left rounded-xl bg-white/[0.03] border border-white/5 p-2.5 sm:p-3 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div
                className={`h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br ${v.iconColor} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
              >
                <Ticket className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                    {v.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${v.badgeColor}`}
                  >
                    {v.badge}
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                  <strong className="text-orange-400 font-semibold">{v.maxDiscount}</strong> •{' '}
                  {v.condition}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-orange-400 group-hover:translate-x-0.5 transition-transform">
              <span className="text-sm">{v.discount}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-1">
        <p className="text-[11px] text-slate-400">
          👉 <span className="text-slate-300 font-medium">Chạm vào mã</span> hoặc{' '}
          <span className="text-orange-400 font-semibold">dán link sản phẩm</span> ở trên để nhận
          ngay!
        </p>
      </div>
    </div>
  );
}
