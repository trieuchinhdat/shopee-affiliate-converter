'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, ArrowLeft, Zap, BookOpen, Smartphone } from 'lucide-react';
import { ThemeConfig } from '@/lib/types';
import MainMenuView from './MainMenuView';
import GuideView from './GuideView';
import ShortcutView from './ShortcutView';

export type DrawerView = 'menu' | 'guide' | 'shortcut';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeConfig;
}

export default function MenuDrawer({ isOpen, onClose, theme }: MenuDrawerProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [currentView, setCurrentView] = useState<DrawerView>('menu');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Control open/close animation lifecycle
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setCurrentView('menu');
      // Use short timeout to ensure initial off-screen translate-x-full is committed to DOM
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 25);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Capture PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (currentView !== 'menu') {
          setCurrentView('menu');
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentView, onClose]);

  const handleTriggerInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const handleNavigateHome = () => {
    onClose();
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Dark Blur Backdrop with smooth fade */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel from Right to Left */}
      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label="Menu Tiện Ích"
      >
        <div
          className={`pointer-events-auto w-screen max-w-sm sm:max-w-md bg-[#0f172a] border-l border-white/10 shadow-2xl flex flex-col transform-gpu transition-transform duration-300 ease-out ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-[#111827]/95">
            {currentView === 'menu' ? (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-shopee-orange to-orange-500 text-white shadow-md shadow-orange-500/30">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-tight text-white">
                    {theme?.logoText || 'SALE'}<span className="text-orange-400">{theme?.logoHighlightText || 'HUNTER'}</span>
                  </h2>
                  <p className="text-[10px] text-slate-400">Menu Tiện Ích Săn Mã</p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentView('menu')}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 min-h-[40px] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại menu</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              {currentView === 'guide' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                  <BookOpen className="h-3.5 w-3.5" /> Hướng dẫn
                </span>
              )}

              {currentView === 'shortcut' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-blue-400">
                  <Smartphone className="h-3.5 w-3.5" /> Tạo Shortcut
                </span>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Đóng menu"
                aria-label="Đóng menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none">
            {currentView === 'menu' && (
              <MainMenuView
                theme={theme}
                onNavigateHome={handleNavigateHome}
                onSelectView={(v) => setCurrentView(v)}
                onCloseDrawer={onClose}
              />
            )}

            {currentView === 'guide' && (
              <GuideView onCloseDrawer={handleNavigateHome} />
            )}

            {currentView === 'shortcut' && (
              <ShortcutView
                installPrompt={installPrompt}
                onTriggerInstall={handleTriggerInstall}
                onCloseDrawer={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
