'use client';

import React from 'react';
import { Sparkles, ArrowUpRight, Flame } from 'lucide-react';
import { SuggestedVoucherItem } from '@/lib/types';
import { urlForImage } from '@/sanity/image';

interface SuggestedVouchersProps {
  vouchers?: SuggestedVoucherItem[];
  layout?: 'grid' | 'slide';
  title?: string;
  show?: boolean;
}

export default function SuggestedVouchers({
  vouchers = [],
  layout = 'slide',
  title = 'Gợi Ý Voucher Hot Hôm Nay',
  show = true,
}: SuggestedVouchersProps) {
  if (show === false || !vouchers || vouchers.length === 0) {
    return null;
  }

  // Filter only active vouchers
  const activeVouchers = vouchers.filter((v) => v.isActive !== false);
  if (activeVouchers.length === 0) return null;

  return (
    <section className="space-y-2.5 pt-1 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
          <Sparkles className="h-4 w-4 text-orange-400 fill-orange-400/20" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-orange-400 font-semibold bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
          <Flame className="h-3 w-3 animate-pulse text-orange-400 fill-orange-400" />
          <span>Mở App Lưu Ngay</span>
        </div>
      </div>

      {/* Vouchers container */}
      {layout === 'grid' ? (
        // Grid Layout
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeVouchers.map((v) => (
            <VoucherCard key={v._id || v.title} voucher={v} />
          ))}
        </div>
      ) : (
        // Slide / Carousel Layout
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none snap-x snap-mandatory -mx-1 px-1">
            {activeVouchers.map((v) => (
              <div
                key={v._id || v.title}
                className="min-w-[270px] sm:min-w-[310px] max-w-[330px] shrink-0 snap-start"
              >
                <VoucherCard voucher={v} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function VoucherCard({ voucher }: { voucher: SuggestedVoucherItem }) {
  const imageUrl = voucher.imageUrl || (voucher.image ? urlForImage(voucher.image) : '');

  return (
    <a
      href={voucher.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`Lưu voucher: ${voucher.title}`}
      className="group block relative rounded-2xl border border-white/10 bg-[#111827]/85 backdrop-blur-md overflow-hidden shadow-lg transition-all duration-300 hover:border-orange-500/50 hover:shadow-orange-500/15 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
    >
      {/* Voucher Ticket Image */}
      <div className="relative w-full aspect-[2.4/1] bg-slate-900/60 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={voucher.title}
            className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="text-center p-4 text-xs text-slate-400">
            <span>{voucher.title}</span>
          </div>
        )}

        {/* Optional Micro-Badge */}
        {voucher.badgeText && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/90 text-white shadow-sm border border-orange-400/40 backdrop-blur-sm">
            {voucher.badgeText}
          </span>
        )}
      </div>

      {/* Action Strip */}
      <div className="px-3 py-2 bg-[#0d1320] border-t border-white/5 flex items-center justify-between gap-2">
        <div className="truncate flex-1">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-200 truncate group-hover:text-orange-300 transition-colors">
            {voucher.title}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
          <span>Lưu mã</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  );
}
