"use client";

import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/config/api";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Floating WhatsApp button.
 * - Fetches the WhatsApp link from /designs/contact (admin-controlled)
 * - Falls back to "#" if no real number is configured
 * - Moves up smartly when ScrollToTop appears on scroll
 */
const FloatingWhatsAppButton = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [whatsappLink, setWhatsappLink] = useState("#");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Pull dynamic WhatsApp link from API
    useEffect(() => {
        const fetchLink = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/designs/contact`);
                const data = await res.json();
                const link = data?.data?.contactContent?.socialLinks?.whatsapp;
                if (link && typeof link === "string" && link.trim() !== "") {
                    setWhatsappLink(link.trim());
                }
            } catch {
                /* silently fail — button still shows with "#" fallback */
            }
        };
        fetchLink();
    }, []);

    // Track scroll to nudge button up when ScrollToTop appears
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact on WhatsApp"
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                bottom: isScrolled ? 88 : 24,
            }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed right-5 lg:right-6 z-[60] flex items-center gap-3 group"
            style={{ bottom: isScrolled ? 88 : 24 }}
        >
            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`hidden sm:flex items-center gap-2 pl-4 pr-5 py-2.5 bg-white dark:bg-[#111] text-gray-800 dark:text-white text-xs rounded-full shadow-xl border border-gray-100 dark:border-gray-800 whitespace-nowrap pointer-events-none ${bengaliClass}`}
                        style={{ fontWeight: 600 }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {language === "bn" ? "চ্যাট করুন" : "Chat with us"}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Button */}
            <div className="relative">
                {/* Subtle ping ring */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping" />

                {/* Outer ring on hover */}
                <span className="absolute inset-0 rounded-full ring-4 ring-[#25D366]/20 opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-110 transition-all duration-300" />

                {/* Main button */}
                <div className="relative w-12 h-12 lg:w-[52px] lg:h-[52px] bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/40 group-hover:-translate-y-0.5 transition-all duration-300">
                    <FaWhatsapp size={24} className="text-white" />
                </div>
            </div>
        </motion.a>
    );
};

export default FloatingWhatsAppButton;
