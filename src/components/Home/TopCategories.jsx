"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LuBrain, LuPalette, LuCode, LuMegaphone,
    LuFilm, LuServer, LuUsers, LuGraduationCap, LuArrowUpRight
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const categories = (language, t) => [
    {
        icon: LuBrain,
        title: language === 'bn' ? t("home_sections.aiAutomation") : 'AI & Automation',
        subtitle: language === 'bn' ? t("home_sections.shapeFuture") : 'Shape the Future',
        slug: 'ai-automation',
        color: '#7A85F0',
        light: '#EEF0FD',
    },
    {
        icon: LuPalette,
        title: language === 'bn' ? t("home_sections.artDesign") : 'Art & Design',
        subtitle: language === 'bn' ? t("home_sections.creativePlatform") : 'Platform for Creativity',
        slug: 'art-design',
        color: '#F59E0B',
        light: '#FEF3C7',
    },
    {
        icon: LuCode,
        title: language === 'bn' ? t("home_sections.programming") : 'Programming',
        subtitle: language === 'bn' ? t("home_sections.codeConfidence") : 'Code with Confidence',
        slug: 'programming',
        color: '#06B6D4',
        light: '#CFFAFE',
    },
    {
        icon: LuMegaphone,
        title: language === 'bn' ? t("home_sections.digitalMarketing") : 'Digital Marketing',
        subtitle: language === 'bn' ? t("home_sections.artInfluence") : 'The Art of Influence',
        slug: 'digital-marketing',
        color: '#EF4444',
        light: '#FEE2E2',
    },
    {
        icon: LuFilm,
        title: language === 'bn' ? t("home_sections.mediaFilm") : 'Media & Film',
        subtitle: language === 'bn' ? t("home_sections.storyMotion") : 'Storytelling in Motion',
        slug: 'media-film',
        color: '#10B981',
        light: '#D1FAE5',
    },
    {
        icon: LuServer,
        title: language === 'bn' ? t("home_sections.networkingServer") : 'Networking & Server',
        subtitle: language === 'bn' ? t("home_sections.protectorIT") : 'Protector of IT Industry',
        slug: 'networking-server',
        color: '#F97316',
        light: '#FFEDD5',
    },
    {
        icon: LuUsers,
        title: language === 'bn' ? t("home_sections.management") : 'Management',
        subtitle: language === 'bn' ? t("home_sections.leadStrategy") : 'Leading with Strategy',
        slug: 'management',
        color: '#8B5CF6',
        light: '#EDE9FE',
    },
    {
        icon: LuGraduationCap,
        title: language === 'bn' ? t("home_sections.diploma") : 'Diploma',
        subtitle: language === 'bn' ? t("home_sections.skillUpStandOut") : 'Skill Up, Stand Out',
        slug: 'diploma',
        color: '#EC4899',
        light: '#FCE7F3',
    },
];

const TopCategories = () => {
    const { language, t } = useLanguage();
    const bn = language === "bn" ? "hind-siliguri" : "";
    const cats = categories(language, t);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-32">

                {/* ── Header ── */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bn}`}>
                        {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
                    </span>
                    <h2 className={`text-4xl font-bold text-gray-900 leading-tight mb-4 ${bn}`}>
                        {language === 'bn'
                            ? <>{t("home_sections.browseByCategory")} <span className="text-[#7A85F0]">{t("home_sections.categoryHighlight")}</span></>
                            : <>Explore Top <span className="text-[#7A85F0]">Skills Categories</span></>
                        }
                    </h2>
                    <Link
                        href="/courses"
                        className={`inline-flex items-center gap-2 text-sm font-semibold text-[#7A85F0] hover:underline underline-offset-4 transition ${bn}`}
                    >
                        {language === 'bn' ? 'সব দেখুন' : 'View All'}
                        <LuArrowUpRight size={16} />
                    </Link>
                </motion.div>

                {/* ── Cards Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                    {/* ── Normal State (center column) ── */}
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

                                    {/* ── Hover State (horizontal row) ── */}
                                    <div className="absolute inset-0 flex items-center justify-between px-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        {/* Left: icon + text */}
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
                                        {/* Right: arrow */}
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
