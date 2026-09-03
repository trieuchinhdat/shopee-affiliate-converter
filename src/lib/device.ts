'use client';

import { useState, useEffect } from 'react';

/**
 * Accurately checks if the current browser session is running on a Desktop computer (PC/Mac/Linux).
 * Designed to NOT falsely flag iPads or touch tablets as desktop.
 */
export function isDesktopDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // 1. iPadOS 13+ reports as Macintosh, but has multi-touch
  const isIPadOS =
    navigator.userAgent.includes('Macintosh') &&
    typeof navigator.maxTouchPoints === 'number' &&
    navigator.maxTouchPoints > 1;
  if (isIPadOS) {
    return false; // Treat as tablet/mobile (can open Shopee App)
  }

  // 2. Standard Mobile User Agents
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;
  if (mobileRegex.test(navigator.userAgent)) {
    return false;
  }

  // 3. Desktop Operating Systems with mouse/touchpad
  const isDesktopOS = /Windows NT|Macintosh|Mac OS X|Linux x86_64|X11/i.test(navigator.userAgent);
  if (isDesktopOS && (!navigator.maxTouchPoints || navigator.maxTouchPoints <= 1)) {
    return true;
  }

  // 4. Pointer and screen width fallback
  if (typeof window.matchMedia === 'function') {
    const hasFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    const isWideScreen = window.innerWidth >= 1024;
    return Boolean(hasFinePointer && isWideScreen);
  }

  return false;
}

/**
 * React hook to detect desktop device safely without SSR hydration mismatch.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(isDesktopDevice());
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isDesktop;
}
