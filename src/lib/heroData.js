// ===================================================================
// Hero data prefetch + default
// -------------------------------------------------------------------
// The hero media is stored in the backend (/design/hero). To avoid a
// placeholder flash on first paint, DEFAULT_HERO mirrors the banner that
// is currently configured in the backend — so the correct image shows
// instantly. Live data (if the admin changes it) overrides this once the
// fetch resolves. The Preloader kicks off prefetchHero() the moment the
// app mounts, so by the time the preloader finishes the data is ready.
// ===================================================================

import { API_URL } from '@/config/api';

// Current banner configured in the backend (used as the instant default).
export const DEFAULT_HERO = {
    mediaType: 'image', // 'image' | 'video' | 'youtube'
    bannerImage:
        'https://res.cloudinary.com/dkdp9sjty/image/upload/v1781915911/hiictpark/general/1781915911176-Your%20paragraph%20text.jpg',
    videoUrl: '',
    youtubeUrl: '',
};

let heroPromise = null;

// Kick off the hero fetch once; repeated calls share the same in-flight request.
export const prefetchHero = () => {
    if (heroPromise) return heroPromise;
    if (typeof window === 'undefined') return Promise.resolve(DEFAULT_HERO);
    heroPromise = fetch(`${API_URL}/design/hero`)
        .then((r) => r.json())
        .then((data) => {
            const hc =
                data?.success && data?.data?.heroContent ? data.data.heroContent : null;
            return hc ? { ...DEFAULT_HERO, ...hc } : DEFAULT_HERO;
        })
        .catch((error) => {
            console.error('Error fetching hero design:', error);
            return DEFAULT_HERO;
        });
    return heroPromise;
};
