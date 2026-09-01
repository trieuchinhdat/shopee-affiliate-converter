'use client';

import React from 'react';
import Image from 'next/image';
import { ShopeeProduct } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: ShopeeProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827] p-3.5 sm:p-4 shadow-2xl transition-all transform-gpu">
      <div className="flex gap-3 items-center">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.productName}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500 text-xs">
              Shopee
            </div>
          )}
          <span className="absolute bottom-1 left-1 rounded bg-[#ee4d2d] px-1 py-0.5 text-[8px] font-bold text-white uppercase shadow">
            Shopee Mall
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center overflow-hidden min-w-0">
          <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
            {product.productName}
          </h3>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            {product.formattedPrice ? (
              <span className="text-sm sm:text-base font-extrabold text-orange-400 font-mono">
                {product.formattedPrice}
              </span>
            ) : (
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Sản phẩm chính hãng Shopee</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
