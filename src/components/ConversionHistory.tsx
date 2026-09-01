'use client';

import React from 'react';
import Image from 'next/image';
import { ShopeeProduct } from '@/lib/types';
import { History, Trash2 } from 'lucide-react';

interface ConversionHistoryProps {
  history: Array<{
    product: ShopeeProduct;
    timestamp: string;
  }>;
  onSelect: (url: string) => void;
  onClear: () => void;
}

export default function ConversionHistory({
  history,
  onSelect,
  onClear,
}: ConversionHistoryProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-surface p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <History className="h-4 w-4 text-orange-400" />
          <span>Sản phẩm vừa xem ({history.length})</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
          <span>Xóa</span>
        </button>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {history.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelect(item.product.originalUrl || item.product.canonicalUrl)}
            className="flex h-20 w-52 shrink-0 items-center gap-2.5 rounded-2xl border border-white/10 bg-surface-light/50 p-2.5 cursor-pointer transition-all hover:border-orange-500/40 active:scale-95"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface border border-white/5">
              {item.product.imageUrl ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.productName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
                  Shopee
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between overflow-hidden">
              <p className="line-clamp-2 text-xs font-medium text-slate-200">
                {item.product.productName}
              </p>
              <span className="text-[10px] text-orange-400 font-semibold">
                Lấy lại mã →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
