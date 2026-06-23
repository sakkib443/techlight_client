"use client";
import React, { useEffect, useState } from "react";
import { DEFAULT_HERO, prefetchHero } from "@/lib/heroData";

// Extract the 11-char video id from any common YouTube URL shape
export const getYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const m = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/
    );
    return m ? m[1] : null;
};

const Hero = () => {
    // Start from the current backend banner (no placeholder flash). The fetch is
    // prefetched during the preloader, so live data arrives ready/instant.
    const [hero, setHero] = useState(DEFAULT_HERO);

    useEffect(() => {
        let active = true;
        prefetchHero().then((data) => {
            if (active && data) setHero(data);
        });
        return () => {
            active = false;
        };
    }, []);

    const mediaType = hero.mediaType || 'image';
    const ytId = getYouTubeId(hero.youtubeUrl);
    const bannerImage = hero.bannerImage || DEFAULT_HERO.bannerImage;

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
