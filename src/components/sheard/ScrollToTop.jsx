"use client";

import React, { useState, useEffect } from "react";
import { LuArrowUp } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Scroll-to-top button.
 * - Appears after scrolling 300px down
 * - Circular progress ring around the button shows scroll position
 * - Matches site brand: primary #7A85F0
 */
const ScrollToTop = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            setIsVisible(scrollTop > 300);
            setProgress(Math.min(scrollPercent, 100));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Progress ring math
    const size = 48;
    const strokeWidth = 2.5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (progress / 100) * circumference;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={scrollToTop}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    aria-label="Scroll to top"
                    className="fixed bottom-5 lg:bottom-6 right-5 lg:right-6 z-50 flex items-center gap-3 group cursor-pointer"
                >
                    {/* Tooltip */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, x: 8, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 8, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className={`hidden sm:flex items-center pl-4 pr-5 py-2.5 bg-white dark:bg-[#111] text-gray-800 dark:text-white text-xs rounded-full shadow-xl border border-gray-100 dark:border-gray-800 whitespace-nowrap pointer-events-none ${bengaliClass}`}
                                style={{ fontWeight: 600 }}
                            >
                                {language === "bn" ? "উপরে যান" : "Back to top"}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Button with progress ring */}
                    <div className="relative" style={{ width: size, height: size }}>
                        {/* Progress ring SVG */}
                        <svg
                            className="absolute inset-0 -rotate-90 pointer-events-none"
                            width={size}
                            height={size}
                        >
                            {/* Background track */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke="rgba(122, 133, 240, 0.15)"
                                strokeWidth={strokeWidth}
                            />
                            {/* Progress arc */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke="#7A85F0"
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
                            />
                        </svg>

                        {/* Inner button */}
                        <div className="absolute inset-1 rounded-full bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-lg shadow-[#7A85F0]/15 group-hover:shadow-[#7A85F0]/30 group-hover:bg-[#7A85F0] dark:group-hover:bg-[#7A85F0] transition-all duration-300 flex items-center justify-center">
                            <LuArrowUp
                                size={16}
                                className="text-[#7A85F0] group-hover:text-white transition-colors duration-300"
                                strokeWidth={2.5}
                            />
                        </div>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
