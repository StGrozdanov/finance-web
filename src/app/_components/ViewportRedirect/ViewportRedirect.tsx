'use client';

import { useEffect } from 'react';

const MOBILE_MAX_WIDTH_PX = 1024;

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function getCookie(name: string): string | null {
  return (
    document.cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith(`${name}=`))
      ?.split('=')[1] ?? null
  );
}

export default function ViewportRedirect() {
  useEffect(() => {
    const handleContinueParam = () => {
      const url = new URL(window.location.href);
      const continueParam = url.searchParams.get('continue');

      if (continueParam === '1') {
        setCookie('df_desktop_optin', '1', 60 * 60 * 24); // 1 day
        url.searchParams.delete('continue');
        window.history.replaceState({}, '', url.toString());
      }
    };

    const evaluate = () => {
      const isMobileViewport = window.innerWidth < MOBILE_MAX_WIDTH_PX;

      setCookie(
        'df_vp',
        isMobileViewport ? 'mobile' : 'desktop',
        60 * 60 * 24 * 90,
      );

      const desktopOptIn = getCookie('df_desktop_optin') === '1';
      const path = window.location.pathname;

      if (isMobileViewport && !desktopOptIn && path !== '/mobile') {
        window.location.replace('/mobile');
      } else if (!isMobileViewport && path === '/mobile') {
        window.location.replace('/');
      }
    };

    handleContinueParam();
    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  return null;
}
