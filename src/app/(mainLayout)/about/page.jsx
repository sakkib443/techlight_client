"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
    LuTarget,
    LuUsers,
    LuUser,
    LuBookOpen,
    LuHeart,
    LuRocket,
    LuShield,
    LuGlobe,
    LuAward,
    LuGraduationCap,
    LuArrowRight,
    LuPlay,
    LuCheck,
    LuTrendingUp,
    LuZap,
    LuLightbulb,
    LuCompass,
} from "react-icons/lu";
import { FaLinkedinIn, FaTwitter, FaFacebookF, FaGithub } from "react-icons/fa";
import Lenis from "lenis";
import { API_BASE_URL } from "@/config/api";
import { ABOUT_DEFAULTS, mergeAboutContent } from "@/config/aboutDefaults";

// === Animated Counter ===
const Counter = ({ end, suffix = "", duration = 2 }) => {
    const [count, setCount] = useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, end, duration]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}
            {suffix}
        </span>
    );
};

const AboutPage = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth > 768) {
            const lenis = new Lenis({
                duration: 1.0,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
            });
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            return () => lenis.destroy();
        }
    }, []);

    // === Mentors (dynamic) ===
    const [mentors, setMentors] = useState([]);
    const [mentorsLoading, setMentorsLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/instructors`);
                const data = await res.json();
                if (data.success) {
                    setMentors((data.data || []).filter((m) => m.isActive !== false));
                }
            } catch (err) {
                console.error("Error fetching mentors:", err);
            } finally {
                setMentorsLoading(false);
            }
        };
        fetchMentors();
    }, []);

    // === About page content (dynamic, admin-editable) ===
    // Starts from the bundled defaults, then merges whatever the admin saved.
    const [about, setAbout] = useState(() => mergeAboutContent({}));

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/design/about`);
                const data = await res.json();
                if (data.success) {
                    setAbout(mergeAboutContent(data.data?.aboutContent || {}));
                }
            } catch (err) {
                console.error("Error fetching about content:", err);
            }
        };
        fetchAbout();
    }, []);

    // === Stats === (icon & color fixed; numbers/labels come from admin content)
    const statsMeta = [
        { icon: LuUsers, color: "#E31E27" },
        { icon: LuGraduationCap, color: "#F59E0B" },
        { icon: LuBookOpen, color: "#10B981" },
        { icon: LuTrendingUp, color: "#EF4444" },
    ];
    const stats = statsMeta.map((m, i) => {
        const s = about.stats[i] || {};
        return {
            num: Number(String(s.value ?? "").replace(/[^0-9.]/g, "")) || 0,
            suffix: s.suffix || "",
            label: s.label || "",
            icon: m.icon,
            color: m.color,
        };
    });

    // === Why Choose Us === (icon & color fixed; text comes from admin content)
    const featureMeta = [
        { icon: LuLightbulb, color: "#E31E27" },
        { icon: LuRocket, color: "#F59E0B" },
        { icon: LuAward, color: "#10B981" },
        { icon: LuHeart, color: "#EF4444" },
        { icon: LuShield, color: "#8B5CF6" },
        { icon: LuZap, color: "#06B6D4" },
    ];
    const features = featureMeta.map((m, i) => {
        const f = about.whyChooseUs.features[i] || {};
        return { icon: m.icon, color: m.color, title: f.title || "", desc: f.desc || "" };
    });

    // === Team ===
    const team = [
        {
            name: "Shohel Rana",
            role: language === "bn" ? "ফাউন্ডার ও সিইও" : "Founder & CEO",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
            bio: language === "bn" ? "১০+ বছর টেক ইন্ডাস্ট্রি অভিজ্ঞতা।" : "10+ years of tech industry experience.",
        },
        {
            name: "Fatima Ahmed",
            role: language === "bn" ? "শিক্ষা প্রধান" : "Head of Education",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
            bio: language === "bn" ? "শিক্ষাবিদ এবং কারিকুলাম ডিজাইনার।" : "Educator and curriculum designer.",
        },
        {
            name: "Karim Hassan",
            role: language === "bn" ? "টেক লিড" : "Tech Lead",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
            bio: language === "bn" ? "Full-stack ডেভেলপার এবং আর্কিটেক্ট।" : "Full-stack developer and architect.",
        },
        {
            name: "Nusrat Jahan",
            role: language === "bn" ? "মার্কেটিং প্রধান" : "Head of Marketing",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
            bio: language === "bn" ? "ডিজিটাল মার্কেটিং স্পেশালিস্ট।" : "Digital marketing specialist.",
        },
    ];

    // Map dynamic mentors to the team-card shape; fall back to the static
    // team list when no mentors are available from the API.
    const apiTeam = mentors.map((m) => ({
        id: m._id,
        name: m.name,
        role: m.designation,
        image: m.image,
        bio: m.bio,
        socialLinks: m.socialLinks || {},
    }));
    // Always show at most 4 mentors on the About page.
    const displayTeam = (apiTeam.length > 0 ? apiTeam : team).slice(0, 4);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-poppins antialiased overflow-x-hidden">

            {/* ===== 1. HERO ===== */}
            <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 bg-slate-50 dark:bg-[#050505] overflow-hidden">
                {/* Soft gradient blobs */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-[#E31E27]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 lg:px-32 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        {/* Left - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E31E27]/20 rounded-full shadow-sm mb-5">
                                <span className="flex h-1.5 w-1.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31E27] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E31E27]"></span>
                                </span>
                                <span className={`text-[10px] font-medium text-slate-600 dark:text-slate-300 ${bengaliClass}`}>
                                    {about.hero.badge}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.15] mb-5 ${bengaliClass}`}>
                                {about.hero.titlePart1} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E31E27] to-[#CC1B24]">{about.hero.titleHighlight}</span>
                            </h1>

                            {/* Description */}
                            <p className={`text-slate-500 dark:text-slate-400 text-sm lg:text-base leading-relaxed mb-7 max-w-lg ${bengaliClass}`}>
                                {about.hero.description}
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-wrap items-center gap-4 mb-10">
                                <Link href={about.hero.primaryButtonLink || "/courses"}>
                                    <button className="group px-7 py-3 rounded-full bg-[#E31E27] hover:bg-[#C01920] text-white text-sm font-bold shadow-lg shadow-[#E31E27]/25 hover:shadow-[#E31E27]/40 transition-all flex items-center gap-2">
                                        {about.hero.primaryButtonText}
                                        <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={15} />
                                    </button>
                                </Link>
                            </div>

                            {/* Mini stats inline */}
                            <div className="flex items-center gap-8 pt-6 border-t border-slate-200 dark:border-white/10">
                                {about.hero.miniStats.map((s, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />}
                                        <div>
                                            <p className={`text-2xl font-bold ${i === 1 ? "text-[#E31E27]" : i === 2 ? "text-amber-500" : "text-slate-900 dark:text-white"}`}>{s.value}</p>
                                            <p className={`text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium ${bengaliClass}`}>
                                                {s.label}
                                            </p>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right - Single framed photo + floating cards (distinct from home grid) */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative lg:pr-6"
                        >
                            {/* Decorative accent frame + soft glow */}
                            <div className="absolute -top-4 -right-4 w-full h-full rounded-[2rem] border-2 border-[#E31E27]/15 -z-10 hidden sm:block" />
                            <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-amber-200/30 rounded-full blur-3xl -z-10" />

                            {/* Main framed image */}
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-black/10 border border-white/60 dark:border-white/10 group">
                                <img
                                    src="/images/57462951_2085649778223584_3709857119512559616_n.jpg"
                                    alt="Techlight IT Solution campus"
                                    className="w-full h-[340px] lg:h-[470px] object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                                <div className="absolute bottom-5 left-5 text-white">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Our Campus</p>
                                    <p className="text-base lg:text-lg font-bold leading-snug">Hands-on, project-based learning</p>
                                </div>
                            </div>

                            {/* Floating card — Established (top-left) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                                className="absolute -top-4 -left-4 bg-white dark:bg-[#111] rounded-2xl px-4 py-3 shadow-xl border border-gray-100 dark:border-gray-800 z-20"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 bg-[#FEE2E2] rounded-xl flex items-center justify-center">
                                        <LuAward size={17} className="text-[#E31E27]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide">Established</p>
                                        <p className="font-bold text-sm text-gray-800 dark:text-white">Since 2020</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating card — Rating (bottom-right) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                                className="absolute -bottom-5 -right-4 bg-white dark:bg-[#111] rounded-2xl px-4 py-3 shadow-xl border border-gray-100 dark:border-gray-800 z-20"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <span className="text-amber-500 text-base">★</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide">Rated 4.9 / 5</p>
                                        <p className="font-bold text-sm text-gray-800 dark:text-white">2,500+ Reviews</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating mini — Mentors (mid-left) */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.45, duration: 0.5 }}
                                className="absolute top-1/2 -translate-y-1/2 -left-5 bg-white dark:bg-[#111] rounded-2xl px-3 py-2.5 shadow-xl border border-gray-100 dark:border-gray-800 z-20 hidden lg:flex items-center gap-2"
                            >
                                <div className="flex -space-x-2">
                                    {["#E31E27", "#F59E0B", "#10B981"].map((c, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-gray-800 dark:text-white leading-none">120+</p>
                                    <p className="text-[9px] text-gray-400 font-medium">Mentors</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== 2. STATS ===== */}
            <section className="py-12 lg:py-16 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-[#E31E27]/30 hover:shadow-xl hover:shadow-[#E31E27]/5 transition-all overflow-hidden"
                            >
                                <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <stat.icon size={80} style={{ color: stat.color }} />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${stat.color}15` }}>
                                        <stat.icon size={20} style={{ color: stat.color }} />
                                    </div>
                                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                        <Counter end={stat.num} suffix={stat.suffix} />
                                    </h3>
                                    <p className={`text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium ${bengaliClass}`}>
                                        {stat.label}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 3. MISSION & VISION ===== */}
            <section className="py-16 lg:py-24 bg-slate-50 dark:bg-[#050505]">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E31E27] bg-[#FEE2E2] border border-[#E31E27]/20 mb-4 ${bengaliClass}`}>
                            {about.missionVision.badge}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {about.missionVision.headingPart1} <span className="text-[#E31E27]">{about.missionVision.headingHighlight}</span>
                        </h2>
                        <p className={`text-gray-500 dark:text-gray-400 text-sm max-w-2xl mx-auto ${bengaliClass}`}>
                            {about.missionVision.subtitle}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#E31E27]/10 transition-all group overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E31E27]/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E31E27] to-[#C01920] flex items-center justify-center mb-5 shadow-lg shadow-[#E31E27]/30">
                                    <LuTarget size={24} className="text-white" />
                                </div>
                                <h3 className={`text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 ${bengaliClass}`}>
                                    {about.missionVision.mission.title}
                                </h3>
                                <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 ${bengaliClass}`}>
                                    {about.missionVision.mission.description}
                                </p>
                                <div className="space-y-2.5">
                                    {about.missionVision.mission.points.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-[#E31E27]/15 flex items-center justify-center shrink-0">
                                                <LuCheck size={10} className="text-[#E31E27]" strokeWidth={3} />
                                            </div>
                                            <span className={`text-xs text-gray-600 dark:text-gray-400 ${bengaliClass}`}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-amber-500/10 transition-all group overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/30">
                                    <LuCompass size={24} className="text-white" />
                                </div>
                                <h3 className={`text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 ${bengaliClass}`}>
                                    {about.missionVision.vision.title}
                                </h3>
                                <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 ${bengaliClass}`}>
                                    {about.missionVision.vision.description}
                                </p>
                                <div className="space-y-2.5">
                                    {about.missionVision.vision.points.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                                                <LuCheck size={10} className="text-amber-600" strokeWidth={3} />
                                            </div>
                                            <span className={`text-xs text-gray-600 dark:text-gray-400 ${bengaliClass}`}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== 4. WHY CHOOSE US ===== */}
            <section className="py-16 lg:py-24 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E31E27] bg-[#FEE2E2] border border-[#E31E27]/20 mb-4 ${bengaliClass}`}>
                            {about.whyChooseUs.badge}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {about.whyChooseUs.headingPart1} <span className="text-[#E31E27]">{about.whyChooseUs.headingHighlight}</span>
                        </h2>
                        <p className={`text-gray-500 dark:text-gray-400 text-sm max-w-2xl mx-auto ${bengaliClass}`}>
                            {about.whyChooseUs.subtitle}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="group relative bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-[#E31E27]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E31E27]/5 transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110" style={{ backgroundColor: `${f.color}15` }}>
                                    <f.icon size={22} style={{ color: f.color }} />
                                </div>
                                <h3 className={`text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                                    {f.title}
                                </h3>
                                <p className={`text-sm text-gray-500 dark:text-gray-400 leading-relaxed ${bengaliClass}`}>
                                    {f.desc}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className={`text-xs font-semibold text-[#E31E27] flex items-center gap-1 ${bengaliClass}`}>
                                        {language === "bn" ? "আরো জানুন" : "Learn more"}
                                        <LuArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 5. TEAM ===== */}
            <section className="py-16 lg:py-24 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E31E27] bg-[#FEE2E2] border border-[#E31E27]/20 mb-4 ${bengaliClass}`}>
                            {language === "bn" ? "আমাদের টিম" : "Our Team"}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>আপনাকে যারা <span className="text-[#E31E27]">এগিয়ে নেবে</span></>
                            ) : (
                                <>Meet The People Who <span className="text-[#E31E27]">Lead The Way</span></>
                            )}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-6xl mx-auto">
                        {mentorsLoading ? (
                            // Loading skeletons
                            [...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111]"
                                >
                                    <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 animate-pulse" />
                                    <div className="p-5 space-y-2">
                                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            displayTeam.map((member, i) => {
                                // Only render social icons that actually have a link
                                const socials = [
                                    { key: "linkedin", Icon: FaLinkedinIn },
                                    { key: "twitter", Icon: FaTwitter },
                                    { key: "facebook", Icon: FaFacebookF },
                                    { key: "github", Icon: FaGithub },
                                ].filter((s) => member.socialLinks?.[s.key]);

                                const card = (
                                    <div className="relative h-full rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111] shadow-lg shadow-gray-200/30 dark:shadow-black/20 hover:shadow-2xl hover:shadow-[#E31E27]/10 transition-all">
                                        {/* Image */}
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E31E27] to-[#c41e18] text-white">
                                                    <LuUser size={56} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-100" />

                                            {/* Social on hover */}
                                            {socials.length > 0 && (
                                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                                                    {socials.map(({ key, Icon }) => (
                                                        <a
                                                            key={key}
                                                            href={member.socialLinks[key]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-[#E31E27] hover:text-white transition-colors"
                                                        >
                                                            <Icon size={11} />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-5">
                                            <h3 className={`text-base font-bold text-gray-900 dark:text-white mb-0.5 ${bengaliClass}`}>
                                                {member.name}
                                            </h3>
                                            <p className={`text-xs font-semibold text-[#E31E27] mb-2 ${bengaliClass}`}>
                                                {member.role}
                                            </p>
                                            <p className={`text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 ${bengaliClass}`}>
                                                {member.bio}
                                            </p>
                                        </div>
                                    </div>
                                );

                                return (
                                    <motion.div
                                        key={member.id || i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative"
                                    >
                                        {member.id ? (
                                            <Link href={`/mentors/${member.id}`}>{card}</Link>
                                        ) : (
                                            card
                                        )}
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* View all mentors CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center mt-12"
                    >
                        <Link href="/mentors">
                            <button className="group px-7 py-3 rounded-full bg-[#E31E27] hover:bg-[#C01920] text-white text-sm font-bold shadow-lg shadow-[#E31E27]/25 hover:shadow-[#E31E27]/40 transition-all flex items-center gap-2">
                                <span className={bengaliClass}>
                                    {language === "bn" ? "সকল মেন্টর দেখুন" : "View All Mentors"}
                                </span>
                                <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={15} />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>



        </div>
    );
};

export default AboutPage;
