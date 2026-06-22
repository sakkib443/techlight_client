"use client";
import { API_URL } from '@/config/api';
import React, { useEffect, useState } from "react";

// Extract the 11-char video id from any common YouTube URL shape
export const getYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const m = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/
    );
    return m ? m[1] : null;
};

const DEFAULT_BANNER = '/images/bg hero.png';

const Hero = () => {
    const [hero, setHero] = useState({
        mediaType: 'image',
        bannerImage: DEFAULT_BANNER,
        videoUrl: '',
        youtubeUrl: '',
    });

    useEffect(() => {
        const fetchHeroDesign = async () => {
            try {
                const res = await fetch(`${API_URL}/design/hero`);
                const data = await res.json();
                if (data.success && data.data?.heroContent) {
                    setHero((prev) => ({ ...prev, ...data.data.heroContent }));
                }
            } catch (error) {
                console.error('Error fetching hero design:', error);
            }
        };
        fetchHeroDesign();
    }, []);

    const mediaType = hero.mediaType || 'image';
    const ytId = getYouTubeId(hero.youtubeUrl);
    const bannerImage = hero.bannerImage || DEFAULT_BANNER;

    return (
        <section className="w-full">
            {/* Full-width banner area. Width follows the screen; an image keeps its
                natural aspect ratio (h-auto), a YouTube embed stays 16:9. */}
            {mediaType === 'video' && hero.videoUrl ? (
                <video
                    src={hero.videoUrl}
                    poster={bannerImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="block w-full h-auto"
                />
            ) : mediaType === 'youtube' && ytId ? (
                <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                    <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                        title="Hero Video"
                        frameBorder="0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            ) : (
                <img
                    src={bannerImage}
                    alt="Hero Banner"
                    className="block w-full h-auto"
                />
            )}
        </section>
    );
};

export default Hero;
