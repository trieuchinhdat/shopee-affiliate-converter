'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

const NOTIFICATIONS = [
  'Vừa có khách tại Hà Nội nhận mã FB 22% (tiết kiệm 65.000đ)',
  'Vừa có khách tại TP.HCM chuyển đổi thành công mã YouTube 20%',
  'Vừa có khách tại Đà Nẵng nhận mã FB 25% (tiết kiệm 120.000đ)',
  'Vừa có khách nhận mã Shopee Live giảm 70.000đ',
  '1.420+ lượt săn mã thành công trong ngày hôm nay',
];

export default function SocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-[11px] sm:text-xs text-orange-300 backdrop-blur-sm mx-auto w-fit max-w-full shadow-sm">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      <span className="truncate font-medium transition-all duration-300">
        {NOTIFICATIONS[currentIndex]}
      </span>
    </div>
  );
}
