'use client';

import React from 'react';
import { Flame, ArrowUpRight, Ticket } from 'lucide-react';

interface HomeVouchersTeaserProps {
  onSelectVoucher?: () => void;
}

const COMPACT_VOUCHERS = [
  {
    id: 'fb22',
    name: 'Mã Facebook',
    discount: '-22%',
    desc: 'Giảm max 300k • Đơn từ 0đ',
    badge: 'ĐANG PHÁT',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    iconBg: 'bg-blue-600',
  },
  {
    id: 'yt20',
    name: 'Mã YouTube',
    discount: '-20%',
    desc: 'Giảm max 150k • Toàn sàn',
    badge: 'CỰC HOT',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    iconBg: 'bg-rose-600',
  },
  {
    id: 'live15',
    name: 'Shopee Live & Video',
    discount: '-15%',
    desc: 'Giảm max 70k • Mọi shop',
    badge: 'SẴN SÀNG',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    iconBg: 'bg-amber-600',
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
    <div className="rounded-2xl border border-white/10 bg-[#111827]/80 backdrop-blur-md p-2.5 sm:p-3 space-y-2 shadow-lg">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1 text-xs font-bold text-white uppercase tracking-wide">
          <Flame className="h-3.5 w-3.5 text-orange-400 fill-orange-400 animate-pulse" />
          <span>Mã Hot Đang Phát</span>
        </div>
        <span className="text-[10px] text-orange-400 font-semibold bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.2 rounded-full">
          Live
        </span>
      </div>

      <div className="space-y-1.5">
        {COMPACT_VOUCHERS.map((v) => (
          <button
            key={v.id}
            onClick={handleClick}
            className="w-full text-left rounded-xl bg-white/[0.03] border border-white/5 p-2 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`h-7 w-7 shrink-0 rounded-lg ${v.iconBg} flex items-center justify-center text-white shadow-sm`}
              >
                <Ticket className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                    {v.name}
                  </span>
                  <span
                    className={`text-[8px] font-bold px-1 py-0.2 rounded border ${v.badgeColor}`}
                  >
                    {v.badge}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {v.desc}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-0.5 text-xs font-bold text-orange-400 group-hover:translate-x-0.5 transition-transform">
              <span>{v.discount}</span>
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
