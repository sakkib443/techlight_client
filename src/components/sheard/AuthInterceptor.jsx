'use client';

// ===================================================================
// Global Auth Interceptor
// Wraps window.fetch once. When ANY of our API calls returns 401
// (e.g. "Token expired. Please login again."), it auto-logs-out the
// user — clears token/user from localStorage, shows a toast, and
// redirects to the login page. Only acts for logged-in users so it
// never redirects guests on public pages.
// ===================================================================

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/config/api';

export default function AuthInterceptor() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.__authFetchPatched) return; // avoid double-wrapping
    window.__authFetchPatched = true;

    const originalFetch = window.fetch.bind(window);
    let redirecting = false;

    const getUrl = (input) => {
      try {
        if (typeof input === 'string') return input;
        if (input instanceof Request) return input.url;
        return input?.url || '';
      } catch {
        return '';
      }
    };

    const isApiCall = (url) =>
      url && (url.includes(API_BASE_URL) || url.includes('/api/'));

    const handleExpired = () => {
      if (redirecting) return;
      // Only logged-in users get logged out + redirected
      const hadToken = localStorage.getItem('token');
      if (!hadToken) return;

      redirecting = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const path = window.location.pathname;
      if (!path.startsWith('/login') && !path.startsWith('/register')) {
        toast.error('Session expired. Please login again.');
        router.replace('/login');
      }
      // allow future handling once navigation settles
      setTimeout(() => {
        redirecting = false;
      }, 3000);
    };

    window.fetch = async (...args) => {
      const res = await originalFetch(...args);
      try {
        if (res.status === 401 && isApiCall(getUrl(args[0]))) {
          handleExpired();
        }
      } catch {
        /* never break the original request */
      }
      return res;
    };

    return () => {
      window.fetch = originalFetch;
      window.__authFetchPatched = false;
    };
  }, [router]);

  return null;
}
