"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as LuIcons from "react-icons/lu";
import { LuGraduationCap, LuArrowUpRight } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";

// Color palette — cycled by index so each card keeps a distinct, professional look
const palette = [
    { color: '#F97316', light: '#FFEDD5' },
    { color: '#2563EB', light: '#DBEAFE' },
    { color: '#EC4899', light: '#FCE7F3' },
    { color: '#E31E27', light: '#FEE2E2' },
    { color: '#F59E0B', light: '#FEF3C7' },
    { color: '#06B6D4', light: '#CFFAFE' },
    { color: '#EF4444', light: '#FEE2E2' },
    { color: '#10B981', light: '#D1FAE5' },
];

// Resolve an icon name string (e.g. "LuMegaphone") stored on the category to its component
const resolveIcon = (name) => (name && LuIcons[name]) || LuGraduationCap;

// Show at most 8 categories on the homepage
const MAX_HOME_CATEGORIES = 8;

const TopCategories = () => {
    const { language, t } = useLanguage();
    const bn = language === "bn" ? "hind-siliguri" : "";

    const { items: allCategories = [] } = useSelector((state) => state.categories || {});

    // Course categories that the admin selected for the homepage, in homeOrder.
    // Fallback: if none are selected yet, show by general order so the section isn't empty.
    const courseCats = allCategories.filter((c) => c.type === 'course' && c.status === 'active');
    const selected = courseCats.filter((c) => c.showOnHome);
    const source = selected.length > 0 ? selected : courseCats;

    const cats = [...source]
        .sort((a, b) =>
            selected.length > 0
                ? (a.homeOrder ?? 0) - (b.homeOrder ?? 0)
                : (a.order ?? 0) - (b.order ?? 0)
        )
        .slice(0, MAX_HOME_CATEGORIES)
        .map((c, i) => ({
            icon: resolveIcon(c.icon),
            title: language === 'bn' ? (c.nameBn || c.name) : c.name,
            subtitle: language === 'bn' ? (c.description || '') : (c.descriptionEn || c.description || ''),
            slug: c.slug,
            color: palette[i % palette.length].color,
            light: palette[i % palette.length].light,
        }));

    if (cats.length === 0) return null;

    return (
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-red-50/40">

            {/* ── Large moving blobs ── */}
            <motion.div
                className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-red-200/25 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full bg-blue-200/20 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.25, 1], x: [0, -25, 0], y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.15, 1], x: [0, 20, -20, 0], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
            <motion.div
                className="absolute top-0 right-1/3 w-72 h-72 rounded-full bg-pink-200/15 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.3, 1], y: [0, 30, 0], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 6 }}
            />

            {/* ── Dot grid pattern ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    opacity: 0.07,
                }}
            />

            {/* ── Floating rings ── */}
            <motion.div
                className="absolute top-8 right-20 w-20 h-20 rounded-full border-2 border-red-300/40 pointer-events-none"
                animate={{ y: [0, -18, 0], rotate: [0, 360] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-8 right-20 w-12 h-12 rounded-full border border-red-200/30 pointer-events-none"
                style={{ top: '2.5rem', right: '5.5rem' }}
                animate={{ y: [0, -10, 0], rotate: [0, -360] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
                className="absolute bottom-10 left-24 w-14 h-14 rounded-full border-2 border-blue-300/35 pointer-events-none"
                animate={{ y: [0, 14, 0], rotate: [0, -360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
                className="absolute top-1/2 right-8 w-8 h-8 rounded-full border border-amber-300/40 pointer-events-none"
                animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* ── Floating squares / diamonds ── */}
            <motion.div
                className="absolute top-16 left-1/4 w-5 h-5 bg-red-300/30 pointer-events-none"
                style={{ borderRadius: '3px' }}
                animate={{ rotate: [0, 180, 360], y: [0, -14, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-20 right-1/4 w-4 h-4 bg-blue-300/30 pointer-events-none"
                style={{ borderRadius: '3px' }}
                animate={{ rotate: [0, -180, -360], y: [0, 12, 0], opacity: [0.25, 0.5, 0.25] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute top-1/3 right-1/3 w-3 h-3 bg-amber-400/35 pointer-events-none"
                style={{ borderRadius: '2px' }}
                animate={{ rotate: [45, 225, 45], y: [0, -10, 0], x: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
                className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-pink-300/25 pointer-events-none"
                style={{ borderRadius: '2px' }}
                animate={{ rotate: [0, 360], y: [0, 10, 0], opacity: [0.2, 0.45, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />

            {/* ── Small floating dots ── */}
            {[
                { top: '15%', left: '10%', color: '#E31E27', size: 6, delay: 0 },
                { top: '70%', left: '5%', color: '#2563EB', size: 5, delay: 1.2 },
                { top: '25%', right: '8%', color: '#F59E0B', size: 7, delay: 2.4 },
                { top: '80%', right: '15%', color: '#10B981', size: 5, delay: 0.6 },
                { top: '50%', left: '18%', color: '#EC4899', size: 4, delay: 3 },
                { top: '40%', right: '20%', color: '#06B6D4', size: 6, delay: 1.8 },
            ].map((dot, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        top: dot.top, left: dot.left, right: dot.right,
                        width: dot.size, height: dot.size,
                        backgroundColor: dot.color,
                        opacity: 0.35,
                    }}
                    animate={{ y: [0, -12, 0], opacity: [0.25, 0.55, 0.25], scale: [1, 1.4, 1] }}
                    transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
                />
            ))}

            {/* ── Animated gradient shimmer line ── */}
            <motion.div
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{
                    top: '50%',
                    background: 'linear-gradient(90deg, transparent, #E31E2715, #E31E2730, #E31E2715, transparent)',
                }}
                animate={{ opacity: [0, 1, 0], scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            <div className="container mx-auto px-4 lg:px-32 relative z-10">

                {/* ── Header ── */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E31E27] bg-[#FEE2E2] border border-[#E31E27]/20 mb-4 ${bn}`}>
                        {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
                    </span>
                    <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4 ${bn}`}>
                        {language === 'bn'
                            ? <>{t("home_sections.browseByCategory")} <span className="text-[#E31E27]">{t("home_sections.categoryHighlight")}</span></>
                            : <>Explore Top <span className="text-[#E31E27]">Skills Categories</span></>
                        }
                    </h2>
                    <Link
                        href="/courses"
                        className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E31E27] hover:underline underline-offset-4 transition ${bn}`}
                    >
                        {language === 'bn' ? 'সব দেখুন' : 'View All'}
                        <LuArrowUpRight size={16} />
                    </Link>
                </motion.div>

                {/* ── Cards Grid ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {cats.map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                            <motion.div
                                key={cat.slug}
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                            >
                                <Link
                                    href={`/courses?category=${cat.slug}`}
                                    className="group relative flex items-center justify-center min-h-[110px] px-5 py-5 rounded-2xl border border-gray-200 bg-white hover:shadow-lg hover:border-transparent transition-all duration-300 overflow-hidden"
                                >
                                    {/* ── Normal State ── */}
                                    <div className="flex flex-col items-center text-center gap-2 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: cat.light }}
                                        >
                                            <Icon size={20} style={{ color: cat.color }} />
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-bold text-gray-900 leading-snug ${bn}`}>
                                                {cat.title}
                                            </h3>
                                            <p className={`text-[11px] text-gray-400 mt-0.5 ${bn}`}>
                                                {cat.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ── Hover State ── */}
                                    <div className="absolute inset-0 flex items-center justify-between px-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: cat.light }}
                                            >
                                                <Icon size={18} style={{ color: cat.color }} />
                                            </div>
                                            <div>
                                                <h3 className={`text-sm font-bold text-gray-900 leading-snug ${bn}`}>
                                                    {cat.title}
                                                </h3>
                                                <p className={`text-[11px] text-gray-400 mt-0.5 ${bn}`}>
                                                    {cat.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: cat.light, color: cat.color }}
                                        >
                                            <LuArrowUpRight size={15} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TopCategories;
