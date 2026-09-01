'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Monitor,
  Apple,
  Share2,
  PlusSquare,
} from 'lucide-react';

interface ShortcutViewProps {
  installPrompt: any;
  onTriggerInstall: () => void;
  onCloseDrawer: () => void;
}

export default function ShortcutView({
  installPrompt,
  onTriggerInstall,
  onCloseDrawer,
}: ShortcutViewProps) {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'desktop'>('ios');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin);
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

      const isIAB =
        /FBAN|FBAV|Instagram|TikTok|Line|Zalo|MicroMessenger/i.test(ua) ||
        (ua.includes('wv') && ua.includes('Android'));

      setIsInAppBrowser(isIAB);

      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      const isAndroid = /android/i.test(ua);

      if (isIOS) {
        setActiveTab('ios');
      } else if (isAndroid) {
        setActiveTab('android');
      } else {
        setActiveTab('desktop');
      }
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      const url = currentUrl || window.location.origin;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-3 animate-fadeIn text-slate-200">
      {/* In-App Browser Warning */}
      {isInAppBrowser && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>Mở bằng trình duyệt ngoài</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-tight">
            Bấm <b>⋯</b> ở góc trên và chọn <b>"Mở bằng Safari / Chrome"</b> để thêm ra màn hình chính.
          </p>
        </div>
      )}

      {/* PWA 1-Click Install */}
      {installPrompt && (
        <button
          type="button"
          onClick={onTriggerInstall}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-shopee-orange to-orange-500 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition-all hover:brightness-110 active:scale-95"
        >
          <Download className="h-4 w-4 animate-bounce" />
          <span>Cài Đặt App Ngay (1 Chạm)</span>
        </button>
      )}

      {/* Device Tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/40 p-1 border border-white/10 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('ios')}
          className={`flex items-center justify-center gap-1 py-1.5 font-bold rounded-lg transition-all ${
            activeTab === 'ios'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Apple className="h-3.5 w-3.5" />
          <span>iPhone</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('android')}
          className={`flex items-center justify-center gap-1 py-1.5 font-bold rounded-lg transition-all ${
            activeTab === 'android'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Android</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('desktop')}
          className={`flex items-center justify-center gap-1 py-1.5 font-bold rounded-lg transition-all ${
            activeTab === 'desktop'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="h-3.5 w-3.5" />
          <span>Máy tính</span>
        </button>
      </div>

      {/* Steps Container */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/90 p-3 space-y-2 text-xs">
        {activeTab === 'ios' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">1</span>
              <p className="text-[11px] text-slate-200">Bấm biểu tượng <b>Chia sẻ</b> (⎋) ở thanh dưới Safari.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">2</span>
              <p className="text-[11px] text-slate-200">Chọn <b>"Thêm vào MH chính"</b> (+).</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">3</span>
              <p className="text-[11px] text-slate-200">Bấm <b>"Thêm"</b> ở góc trên bên phải.</p>
            </div>
          </div>
        )}

        {activeTab === 'android' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">1</span>
              <p className="text-[11px] text-slate-200">Bấm biểu tượng <b>Menu 3 chấm (⋮)</b> góc trên Chrome.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">2</span>
              <p className="text-[11px] text-slate-200">Chọn <b>"Thêm vào màn hình chính"</b> (hoặc Cài đặt App).</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">3</span>
              <p className="text-[11px] text-slate-200">Xác nhận <b>"Cài đặt / Thêm"</b> để hoàn tất.</p>
            </div>
          </div>
        )}

        {activeTab === 'desktop' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">1</span>
              <p className="text-[11px] text-slate-200">Nhấn <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">Ctrl+D</kbd> (hoặc <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">Cmd+D</kbd>) để lưu Bookmark.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">2</span>
              <p className="text-[11px] text-slate-200">Hoặc bấm biểu tượng Cài đặt App ở thanh địa chỉ.</p>
            </div>
          </div>
        )}
      </div>

      {/* Copy link bar */}
      <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#111827]/90 p-1.5">
        <input
          type="text"
          readOnly
          value={currentUrl || 'https://sanmakhuyenmai.vn'}
          className="flex-1 bg-transparent px-2 text-[11px] font-mono text-slate-400 outline-none truncate"
        />
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/20 active:scale-95 transition-all shrink-0"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Đã chép' : 'Chép link'}</span>
        </button>
      </div>
    </div>
  );
}
