"use client";
import { API_URL } from '@/config/api';
import React, { useEffect, useState } from "react";

const Hero = () => {
    const [bannerImage, setBannerImage] = useState('/images/bg hero.png');

    useEffect(() => {
        const fetchHeroDesign = async () => {
            try {
                const res = await fetch(`${API_URL}/design/hero`);
                const data = await res.json();
                if (data.success && data.data?.heroContent?.bannerImage) {
                    setBannerImage(data.data.heroContent.bannerImage);
                }
            } catch (error) {
                console.error('Error fetching hero design:', error);
            }
        };
        fetchHeroDesign();
    }, []);

    return (
        <section className="w-full">
            {/* Full-width banner that always keeps its natural aspect ratio:
                width follows the screen, height auto-scales, so it never crops
                on the sides at any zoom level or viewport size. */}
            <img
                src={bannerImage}
                alt="Hero Banner"
                className="block w-full h-auto"
            />
        </section>
    );
};

export default Hero;
