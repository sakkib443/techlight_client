"use client";

import React, { useRef, useEffect, useState } from 'react';
import { LuArrowRight, LuPlay, LuZap, LuSmile, LuTrophy } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { API_URL } from '@/config/api';

const DEFAULT_IMAGE1 = '/images/57462951_2085649778223584_3709857119512559616_n.jpg';
const DEFAULT_IMAGE2 = '/images/58068385_2070681143053781_5367478869567733760_n.jpg';
const DEFAULT_IMAGE3 = '/images/58383539_2073583652763530_1902712555562860544_n.jpg';

const AboutHero = () => {
    const { language, t } = useLanguage();
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const [images, setImages] = useState({ heroImage1: DEFAULT_IMAGE1, heroImage2: DEFAULT_IMAGE2, heroImage3: DEFAULT_IMAGE3 });

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch(`${API_URL}/design/about`);
                const data = await res.json();
                const content = data?.data?.aboutContent;
                if (content) {
                    setImages({
                        heroImage1: content.heroImage1 || DEFAULT_IMAGE1,
                        heroImage2: content.heroImage2 || DEFAULT_IMAGE2,
                        heroImage3: content.heroImage3 || DEFAULT_IMAGE3,
                    });
                }
            } catch (e) {
                console.error('Error fetching about images:', e);
            }
        };
        fetchImages();
    }, []);

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const bengaliClass = language === "bn" ? "font-hind-siliguri" : "font-poppins";
    const headingFont = "font-outfit";

    return (
        <section ref={containerRef} className="relative min-h-[80vh] flex items-center overflow-hidden bg-white dark:bg-[#0F172A] transition-colors duration-700 pt-8">
            {/* Background Texture & Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    style={{ y: y1 }}
                    className={`absolute -top-[5%] -left-[5%] text-[25vw] font-black text-gray-950/[0.03] dark:text-white/[0.01] select-none leading-none whitespace-nowrap ${headingFont}`}
                >
                    TECHLIGHT
                </motion.div>

                {/* Clean Geometric Accents */}
                <div className="absolute top-1/4 right-10 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container mx-auto px-4 lg:px-16 relative z-10 -mt-20">
                <div className="max-w-6xl">
                    {/* Professional Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gray-900/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6 backdrop-blur-md"
                    >
                        <LuZap className="text-red-500 animate-bounce" size={14} />
                        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 dark:text-gray-400 ${bengaliClass}`}>
                            {language === 'bn' ? t("aboutPage.badge") : 'THE STANDARD OF EXCELLENCE'}
                        </span>
                    </motion.div>

                    {/* Main Title - Premium Typography */}
                    <div className={`${headingFont} mb-6`}>
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl sm:text-7xl lg:text-[80px] font-black leading-[0.85] tracking-tight text-gray-900 dark:text-white"
                        >
                            {language === 'bn' ? <span className="text-[#E31E27]">{t("aboutPage.title1")}</span> : <span className="text-[#E31E27]">BEYOND</span>} <br />
                            <span className="text-red-500 italic font-serif inline-flex items-center gap-4">
                                {language === 'bn' ? t("aboutPage.title2") : 'ORDINARY'}
                                <span className="h-[3px] w-16 lg:w-32 bg-gray-900 dark:bg-white inline-block rounded-full" />
                            </span> <br />
                            {language === 'bn' ? 'EDUCATION' : 'EDUCATION'}
                        </motion.h1>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <p className={`text-base lg:text-lg text-gray-500 dark:text-gray-500 leading-relaxed mb-8 font-normal ${bengaliClass}`}>
                                {language === 'bn'
                                    ? t("aboutPage.description")
                                    : 'We don\'t just teach skills; we build the architectural foundation of your professional career. TECHLIGHT IT: Where ambition meets elite training.'
                                }
                            </p>

                            <div className="flex flex-wrap items-center gap-6">
                                <Link
                                    href="/courses"
                                    className="group relative px-10 py-5 bg-red-500 text-white rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/20"
                                >
                                    <span className={`relative z-10 flex items-center gap-3 ${headingFont}`}>
                                        {language === 'bn' ? t("aboutPage.exploreCourses") : 'EXPLORE COURSES'}
                                        <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>

                                <button className="flex items-center gap-4 group">
                                    <div className="w-14 h-14 rounded-2xl border-2 border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all duration-500">
                                        <LuPlay className="ml-1 text-[#E31E27]" />
                                    </div>
                                    <span className={`font-black text-sm tracking-[0.2em] uppercase text-gray-900 dark:text-white ${headingFont}`}>
                                        Showreel
                                    </span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Professional Image Mockup Formation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="hidden lg:block relative"
                        >
                            <div className="grid grid-cols-12 gap-4 relative">
                                {/* Main Large Image - Left */}
                                <motion.div
                                    className="col-span-7 relative group"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.7 }}
                                >
                                    <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 border-2 border-white/60 dark:border-white/10">
                                        <img
                                            src={images.heroImage1}
                                            alt="TECHLIGHT IT Classroom - Students Learning"
                                            className="w-full h-[280px] lg:h-[340px] object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                </motion.div>

                                {/* Right Column - 2 Stacked Images */}
                                <div className="col-span-5 flex flex-col gap-4">
                                    <motion.div
                                        className="relative group"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.0, duration: 0.7 }}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border-2 border-white/60 dark:border-white/10">
                                            <img
                                                src={images.heroImage2}
                                                alt="TECHLIGHT IT Seminar - Knowledge Sharing"
                                                className="w-full h-[130px] lg:h-[160px] object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="relative group"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2, duration: 0.7 }}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border-2 border-white/60 dark:border-white/10">
                                            <img
                                                src={images.heroImage3}
                                                alt="TECHLIGHT IT Exam - Student Assessment"
                                                className="w-full h-[130px] lg:h-[160px] object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Refined Professional Marquee with Brand Secondary Accents */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden py-10 z-20">
                <div className="relative border-y border-gray-100 dark:border-gray-700/50 bg-white/50 dark:bg-[#1E293B]/50 backdrop-blur-2xl py-6">
                    <div className="flex whitespace-nowrap animate-marquee-professional">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-16 px-8">
                                {[
                                    { text: 'TECHLIGHT', icon: LuZap, iconColor: 'text-[#E31E27]' },
                                    { text: 'Innovation', icon: LuTrophy, iconColor: 'text-red-500' },
                                    { text: 'Excellence', icon: LuSmile, iconColor: 'text-red-500' },
                                    { text: 'Elite Training', icon: LuZap, iconColor: 'text-[#E31E27]' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-16 group">
                                        <div className="flex items-center gap-4">
                                            <item.icon className={`${item.iconColor} opacity-70 group-hover:opacity-100 transition-opacity`} size={18} />
                                            <span className={`text-xl font-bold tracking-[0.1em] text-gray-800 dark:text-gray-200 uppercase ${headingFont}`}>
                                                {item.text}
                                            </span>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#E31E27]/50" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee-professional {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-professional {
                    animation: marquee-professional 40s linear infinite;
                    display: inline-flex;
                    width: max-content;
                }
            `}</style>
        </section>
    );
};

export default AboutHero;
