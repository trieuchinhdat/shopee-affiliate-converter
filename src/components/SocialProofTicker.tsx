'use client';

import React, { useState, useEffect } from 'react';

const SHORT_NOTIFICATIONS = [
  'Khách HN vừa nhận mã FB 22% (-65k)',
  'Khách HCM vừa áp mã YT 20% (-150k)',
  'Khách ĐN vừa nhận mã FB 25% (-120k)',
  '1.450+ lượt lấy mã thành công hôm nay',
  'Mã Shopee Live & Video vừa áp (-70k)',
];

export default function SocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHORT_NOTIFICATIONS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-300 backdrop-blur-sm mx-auto w-fit max-w-full shadow-sm">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>

      <span className="truncate font-medium transition-all duration-300">
        {SHORT_NOTIFICATIONS[currentIndex]}
      </span>
    </div>
  );
}
