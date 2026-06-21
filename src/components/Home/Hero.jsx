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
            <img
                src={bannerImage}
                alt="Hero Banner"
                className="block w-full h-auto object-contain md:h-[520px] md:object-cover lg:h-[640px]"
            />
        </section>
    );
};

export default Hero;
