"use client";
import { API_URL } from '@/config/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
    LuGraduationCap, LuCode2, LuGlobe, LuWrench,
    LuArrowUpRight, LuBookOpen, LuUsers, LuTrendingUp
} from 'react-icons/lu';
import { motion } from 'framer-motion';

const HomeCategory = () => {
    const [stats, setStats] = useState(null);
    const { language, t } = useLanguage();
    const bn = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const res = await fetch(`${API_URL}/stats/dashboard`);
                const data = await res.json();
                if (data.success && data.data) setStats(data.data);
            } catch (e) { console.error(e); }
        };
        fetch_();
    }, []);

    const count = (id) => {
        if (!stats?.breakdown) return '0';
        const b = stats.breakdown;
        return id === 'courses' ? b.courses : id === 'software' ? b.software : id === 'websites' ? b.websites : b.software;
    };

    return (
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #eef0fd 50%, #f8f9ff 100%)' }}>
            <div className="container mx-auto px-4 lg:px-32">

                {/* ── Header ── */}
                <motion.div
                    className={`text-center mb-14 ${bn}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-white border border-[#7A85F0]/20 mb-5 shadow-sm">
                        {language === 'bn' ? 'আমাদের ক্যাটাগরি' : 'Explore Categories'}
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                        {language === 'bn'
                            ? <>{t("home_sections.browseByCategory")} <span className="text-[#7A85F0]">{t("home_sections.categoryHighlight")}</span></>
                            : <>What Do You Want <br /><span className="text-[#7A85F0]">To Learn Today?</span></>
                        }
                    </h2>
                    <p className="text-gray-500 text-sm max-w-lg mx-auto">
                        {language === 'bn'
                            ? 'আপনার ক্যারিয়ার গড়তে সেরা কোর্স, সফটওয়্যার এবং টুলস খুঁজুন।'
                            : 'Thousands of courses, tools & resources — all built by industry experts to take your career to the next level.'}
                    </p>
                </motion.div>

                {/* ── Bento Grid ── */}
                <div className="grid grid-cols-12 grid-rows-2 gap-5 auto-rows-[220px]">

                    {/* Card 1 – Large Feature (spans 5 cols × 2 rows) */}
                    <motion.div
                        className="col-span-12 lg:col-span-5 row-span-2"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                    >
                        <Link href="/courses" className="group relative flex flex-col justify-between h-full rounded-3xl overflow-hidden p-8 bg-[#7A85F0] text-white shadow-xl shadow-[#7A85F0]/20 hover:shadow-[#7A85F0]/40 transition-shadow duration-400">
                            {/* BG glow */}
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                            {/* Icon */}
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-auto">
                                <LuGraduationCap size={32} className="text-white" />
                            </div>

                            {/* Text */}
                            <div className="relative z-10 mt-8">
                                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Professional Courses</p>
                                <h3 className={`text-3xl font-bold leading-tight mb-3 ${bn}`}>
                                    {language === 'bn' ? t("navbar.courses") : 'AI and\nAutomation'}
                                </h3>
                                <p className="text-white/70 text-sm mb-6">
                                    {language === 'bn' ? t("home_sections.professionalSkills") : 'Learn the skills that are shaping the future — from AI tools to full automation workflows.'}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-4xl font-black">{count('courses')}+</span>
                                    <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#7A85F0] transition-all duration-300">
                                        <LuArrowUpRight size={20} className="text-white group-hover:text-[#7A85F0] transition-colors duration-300" />
                                    </div>
                                </div>
                                <p className="text-white/50 text-xs mt-1">{language === 'bn' ? 'কোর্স পাওয়া যাচ্ছে' : 'Courses Available'}</p>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Card 2 – Art & Design (spans 4 cols × 1 row) */}
                    <motion.div
                        className="col-span-12 sm:col-span-6 lg:col-span-4 row-span-1"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Link href="/software" className="group relative flex flex-col justify-between h-full rounded-3xl overflow-hidden p-6 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                                    <LuCode2 size={24} className="text-amber-500" />
                                </div>
                                <div className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#7A85F0] group-hover:border-[#7A85F0] transition-all duration-300">
                                    <LuArrowUpRight size={16} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Creative</p>
                                <h3 className={`text-xl font-bold text-gray-900 mb-1 ${bn}`}>
                                    {language === 'bn' ? t("navbar.software") : 'Art & Design'}
                                </h3>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-2xl font-black text-[#7A85F0]">{count('software')}+</span>
                                    <span className="text-xs text-gray-400">{language === 'bn' ? 'আইটেম' : 'Items'}</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Card 3 – Stats highlight (spans 3 cols × 1 row) */}
                    <motion.div
                        className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        <div className="flex flex-col justify-between h-full rounded-3xl overflow-hidden p-6 bg-gray-900 text-white shadow-sm">
                            <LuUsers size={24} className="text-[#7A85F0]" />
                            <div>
                                <p className="text-gray-400 text-xs mb-1">{language === 'bn' ? 'মোট শিক্ষার্থী' : 'Total Students'}</p>
                                <p className="text-4xl font-black">10k+</p>
                                <p className="text-gray-500 text-xs mt-1">{language === 'bn' ? 'এনরোলড' : 'Enrolled'}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 4 – Programming (spans 4 cols × 1 row) */}
                    <motion.div
                        className="col-span-12 sm:col-span-6 lg:col-span-4 row-span-1"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link href="/website" className="group relative flex flex-col justify-between h-full rounded-3xl overflow-hidden p-6 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <LuGlobe size={24} className="text-emerald-500" />
                                </div>
                                <div className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#7A85F0] group-hover:border-[#7A85F0] transition-all duration-300">
                                    <LuArrowUpRight size={16} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Development</p>
                                <h3 className={`text-xl font-bold text-gray-900 mb-1 ${bn}`}>
                                    {language === 'bn' ? t("navbar.website") : 'Programming'}
                                </h3>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-2xl font-black text-[#7A85F0]">{count('websites')}+</span>
                                    <span className="text-xs text-gray-400">{language === 'bn' ? 'টেমপ্লেট' : 'Templates'}</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Card 5 – Digital Marketing (spans 3 cols × 1 row) */}
                    <motion.div
                        className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        <Link href="/tools" className="group relative flex flex-col justify-between h-full rounded-3xl overflow-hidden p-6 bg-[#EEF0FD] border border-[#7A85F0]/10 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 bg-[#7A85F0]/15 rounded-2xl flex items-center justify-center">
                                    <LuTrendingUp size={24} className="text-[#7A85F0]" />
                                </div>
                                <div className="w-9 h-9 rounded-full border border-[#7A85F0]/20 flex items-center justify-center group-hover:bg-[#7A85F0] group-hover:border-[#7A85F0] transition-all duration-300">
                                    <LuArrowUpRight size={16} className="text-[#7A85F0] group-hover:text-white transition-colors duration-300" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[#7A85F0]/60 text-[10px] uppercase tracking-widest mb-1">Marketing</p>
                                <h3 className={`text-xl font-bold text-gray-900 mb-1 ${bn}`}>
                                    {language === 'bn' ? t("home_sections.categoryHighlight") : 'Digital Marketing'}
                                </h3>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-2xl font-black text-[#7A85F0]">{count('tools')}+</span>
                                    <span className="text-xs text-gray-500">{language === 'bn' ? 'টুলস' : 'Tools'}</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                </div>

                {/* ── CTA ── */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#7A85F0] text-white text-sm font-semibold shadow-lg shadow-[#7A85F0]/30 hover:bg-[#6470e8] transition-all duration-300"
                    >
                        {language === 'bn' ? 'সব ক্যাটাগরি দেখুন' : 'View All Categories'}
                        <LuArrowUpRight size={16} />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
};

export default HomeCategory;
