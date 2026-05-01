"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
    LuTarget,
    LuUsers,
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
import { FaLinkedinIn, FaTwitter, FaFacebookF } from "react-icons/fa";
import Lenis from "lenis";

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

    // === Stats ===
    const stats = [
        { num: 50, suffix: "K+", label: language === "bn" ? "শিক্ষার্থী" : "Active Students", icon: LuUsers, color: "#7A85F0" },
        { num: 120, suffix: "+", label: language === "bn" ? "এক্সপার্ট মেন্টর" : "Expert Mentors", icon: LuGraduationCap, color: "#F59E0B" },
        { num: 500, suffix: "+", label: language === "bn" ? "প্রিমিয়াম কোর্স" : "Premium Courses", icon: LuBookOpen, color: "#10B981" },
        { num: 98, suffix: "%", label: language === "bn" ? "সফলতার হার" : "Success Rate", icon: LuTrendingUp, color: "#EF4444" },
    ];

    // === Why Choose Us ===
    const features = [
        {
            icon: LuLightbulb,
            title: language === "bn" ? "ইন্ডাস্ট্রি এক্সপার্ট" : "Industry Experts",
            desc: language === "bn" ? "টেক ইন্ডাস্ট্রির শীর্ষ পেশাদারদের কাছ থেকে শিখুন।" : "Learn from top professionals in the tech industry.",
            color: "#7A85F0",
        },
        {
            icon: LuRocket,
            title: language === "bn" ? "প্র্যাকটিকাল প্রজেক্ট" : "Practical Projects",
            desc: language === "bn" ? "রিয়েল-ওয়ার্ল্ড প্রজেক্টে কাজ করে portfolio গড়ুন।" : "Build a portfolio by working on real-world projects.",
            color: "#F59E0B",
        },
        {
            icon: LuAward,
            title: language === "bn" ? "ভেরিফাইড সার্টিফিকেট" : "Verified Certificates",
            desc: language === "bn" ? "ইন্ডাস্ট্রি স্বীকৃত সার্টিফিকেট পান যা LinkedIn এ যুক্ত করা যায়।" : "Earn industry-recognized certificates you can showcase on LinkedIn.",
            color: "#10B981",
        },
        {
            icon: LuHeart,
            title: language === "bn" ? "১:১ মেন্টরশিপ" : "1-on-1 Mentorship",
            desc: language === "bn" ? "ব্যক্তিগত গাইডেন্স এবং সাপ্তাহিক মেন্টরিং সেশন।" : "Personal guidance and weekly mentorship sessions.",
            color: "#EF4444",
        },
        {
            icon: LuShield,
            title: language === "bn" ? "লাইফটাইম অ্যাক্সেস" : "Lifetime Access",
            desc: language === "bn" ? "একবার ভর্তি হলে সারাজীবন কোর্স এবং আপডেট পাবেন।" : "Enroll once and get lifetime access to courses and updates.",
            color: "#8B5CF6",
        },
        {
            icon: LuZap,
            title: language === "bn" ? "জব প্লেসমেন্ট" : "Job Placement",
            desc: language === "bn" ? "ক্যারিয়ার সাপোর্ট, ইন্টারভিউ প্রিপ এবং প্লেসমেন্ট সহায়তা।" : "Career support, interview prep, and placement assistance.",
            color: "#06B6D4",
        },
    ];

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

    // === Journey Milestones ===
    const milestones = [
        { year: "2020", title: language === "bn" ? "যাত্রা শুরু" : "Founded", desc: language === "bn" ? "ছোট কোডিং বুটক্যাম্প হিসেবে শুরু" : "Started as a small coding bootcamp" },
        { year: "2021", title: language === "bn" ? "১০হাজার+ শিক্ষার্থী" : "10K+ Students", desc: language === "bn" ? "প্রথম বছরেই বিশাল সাড়া" : "Massive response in first year" },
        { year: "2023", title: language === "bn" ? "বিশ্বব্যাপী সম্প্রসারণ" : "Global Expansion", desc: language === "bn" ? "৫টি দেশে সেবা চালু" : "Launched in 5 countries" },
        { year: "2025", title: language === "bn" ? "AI-চালিত প্ল্যাটফর্ম" : "AI-Powered Platform", desc: language === "bn" ? "AI mentor এবং personalized learning" : "AI mentor and personalized learning" },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-poppins antialiased overflow-x-hidden">

            {/* ===== 1. HERO ===== */}
            <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 bg-slate-50 dark:bg-[#050505] overflow-hidden">
                {/* Soft gradient blobs */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-[#7A85F0]/10 rounded-full blur-3xl pointer-events-none" />
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
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-[#7A85F0]/20 rounded-full shadow-sm mb-5">
                                <span className="flex h-1.5 w-1.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A85F0] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7A85F0]"></span>
                                </span>
                                <span className={`text-[10px] font-medium text-slate-600 dark:text-slate-300 ${bengaliClass}`}>
                                    {language === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.15] mb-5 ${bengaliClass}`}>
                                {language === "bn" ? (
                                    <>দক্ষতা গড়ে তোলে <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A85F0] to-[#6B74E8]">ক্যারিয়ার পাল্টায়</span></>
                                ) : (
                                    <>Building Skills, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A85F0] to-[#6B74E8]">Shaping Futures</span></>
                                )}
                            </h1>

                            {/* Description */}
                            <p className={`text-slate-500 dark:text-slate-400 text-sm lg:text-base leading-relaxed mb-7 max-w-lg ${bengaliClass}`}>
                                {language === "bn"
                                    ? "টেকলাইট আইটি ইনস্টিটিউট ২০২০ সাল থেকে হাজারো শিক্ষার্থীকে ক্যারিয়ারের পথে এগিয়ে দিচ্ছে। ইন্ডাস্ট্রি এক্সপার্ট মেন্টর, প্র্যাকটিকাল কারিকুলাম এবং রিয়েল প্রজেক্ট দিয়ে আমরা ভবিষ্যৎ গড়ছি।"
                                    : "Since 2020, Techlight IT Institute has helped thousands of students transform their careers. With industry-expert mentors, practical curriculum, and real-world projects — we build futures."}
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-wrap items-center gap-4 mb-10">
                                <Link href="/courses">
                                    <button className="group px-7 py-3 rounded-full bg-[#7A85F0] hover:bg-[#5A65D0] text-white text-sm font-bold shadow-lg shadow-[#7A85F0]/25 hover:shadow-[#7A85F0]/40 transition-all flex items-center gap-2">
                                        {language === "bn" ? "কোর্স দেখুন" : "Explore Courses"}
                                        <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={15} />
                                    </button>
                                </Link>
                                <button className="group flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-[#7A85F0] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <LuPlay size={14} className="text-[#7A85F0] ml-0.5" fill="currentColor" />
                                    </div>
                                    <span className={`text-sm font-semibold ${bengaliClass}`}>
                                        {language === "bn" ? "ভিডিও দেখুন" : "Watch Video"}
                                    </span>
                                </button>
                            </div>

                            {/* Mini stats inline */}
                            <div className="flex items-center gap-8 pt-6 border-t border-slate-200 dark:border-white/10">
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">5+</p>
                                    <p className={`text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium ${bengaliClass}`}>
                                        {language === "bn" ? "বছরের অভিজ্ঞতা" : "Years Experience"}
                                    </p>
                                </div>
                                <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
                                <div>
                                    <p className="text-2xl font-bold text-[#7A85F0]">50K+</p>
                                    <p className={`text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium ${bengaliClass}`}>
                                        {language === "bn" ? "সন্তুষ্ট শিক্ষার্থী" : "Happy Students"}
                                    </p>
                                </div>
                                <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
                                <div>
                                    <p className="text-2xl font-bold text-amber-500">4.9</p>
                                    <p className={`text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium ${bengaliClass}`}>
                                        {language === "bn" ? "রেটিং" : "Rating"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right - Image Grid */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative grid grid-cols-12 gap-3 lg:gap-4">
                                {/* Big left */}
                                <div className="col-span-7 relative group">
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-white/60 dark:border-white/10">
                                        <img
                                            src="/images/57462951_2085649778223584_3709857119512559616_n.jpg"
                                            alt="Classroom"
                                            className="w-full h-[300px] lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                                            <p className="text-[9px] font-bold text-[#7A85F0] uppercase tracking-widest">Live Class</p>
                                            <p className="text-[11px] font-semibold text-gray-700">50+ Students</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right column stack */}
                                <div className="col-span-5 flex flex-col gap-3 lg:gap-4">
                                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/60 dark:border-white/10 group">
                                        <img
                                            src="/images/58068385_2070681143053781_5367478869567733760_n.jpg"
                                            alt="Seminar"
                                            className="w-full h-[140px] lg:h-[200px] object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                                            <div className="w-5 h-5 bg-[#7A85F0] rounded-full flex items-center justify-center">
                                                <span className="text-white text-[8px]">🎓</span>
                                            </div>
                                            <span className="text-white text-[9px] font-bold">Seminar</span>
                                        </div>
                                    </div>
                                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/60 dark:border-white/10 group">
                                        <img
                                            src="/images/58383539_2073583652763530_1902712555562860544_n.jpg"
                                            alt="Exam"
                                            className="w-full h-[140px] lg:h-[200px] object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-[8px]">📝</span>
                                            </div>
                                            <span className="text-white text-[9px] font-bold">Exam Hall</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badges */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="absolute -top-3 -left-3 bg-white rounded-2xl px-3 py-2 shadow-xl border border-gray-100 z-20"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-500 text-sm font-bold">✓</span>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-400 font-medium">Success Rate</p>
                                            <p className="font-bold text-xs text-gray-800">98%</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.3, duration: 0.5 }}
                                    className="absolute -bottom-3 left-[35%] bg-white rounded-2xl px-3 py-2 shadow-xl border border-gray-100 z-20"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1.5">
                                            <div className="w-6 h-6 rounded-full bg-[#7A85F0] flex items-center justify-center text-white text-[9px] font-bold border-2 border-white">S</div>
                                            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-[9px] font-bold border-2 border-white">A</div>
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[9px] font-bold border-2 border-white">R</div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-400 font-medium">Students</p>
                                            <p className="font-bold text-[11px] text-gray-800">50k+ Joined</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
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
                                className="group relative bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-[#7A85F0]/30 hover:shadow-xl hover:shadow-[#7A85F0]/5 transition-all overflow-hidden"
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
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bengaliClass}`}>
                            {language === "bn" ? "আমাদের যাত্রা" : "Our Purpose"}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>উদ্দেশ্য চালিত, <span className="text-[#7A85F0]">পরিশ্রমী</span></>
                            ) : (
                                <>Driven by Purpose, <span className="text-[#7A85F0]">Fueled by Passion</span></>
                            )}
                        </h2>
                        <p className={`text-gray-500 dark:text-gray-400 text-sm max-w-2xl mx-auto ${bengaliClass}`}>
                            {language === "bn"
                                ? "আমরা বিশ্বাস করি শিক্ষার রূপান্তরকারী শক্তিতে। আমাদের প্ল্যাটফর্ম উচ্চাকাঙ্ক্ষী শিক্ষার্থীদের ইন্ডাস্ট্রি এক্সপার্টদের সাথে সংযুক্ত করে।"
                                : "We believe in the transformative power of education. Our platform connects ambitious learners with industry experts."}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#7A85F0]/10 transition-all group overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7A85F0]/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7A85F0] to-[#5A65D0] flex items-center justify-center mb-5 shadow-lg shadow-[#7A85F0]/30">
                                    <LuTarget size={24} className="text-white" />
                                </div>
                                <h3 className={`text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 ${bengaliClass}`}>
                                    {language === "bn" ? "আমাদের লক্ষ্য" : "Our Mission"}
                                </h3>
                                <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 ${bengaliClass}`}>
                                    {language === "bn"
                                        ? "প্রত্যেকের জন্য মানসম্মত টেক শিক্ষাকে সুলভ ও সাশ্রয়ী করে তোলা। আমরা চাই কোনো প্রতিভা যেন সংস্থানের অভাবে নষ্ট না হয়।"
                                        : "To democratize quality tech education globally. We want every talented mind to flourish, regardless of resources."}
                                </p>
                                <div className="space-y-2.5">
                                    {[
                                        language === "bn" ? "সাশ্রয়ী মূল্যে প্রিমিয়াম কোর্স" : "Affordable premium courses",
                                        language === "bn" ? "সবার জন্য সমান সুযোগ" : "Equal opportunity for all",
                                        language === "bn" ? "ইন্ডাস্ট্রি-রেডি কারিকুলাম" : "Industry-ready curriculum",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-[#7A85F0]/15 flex items-center justify-center shrink-0">
                                                <LuCheck size={10} className="text-[#7A85F0]" strokeWidth={3} />
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
                                    {language === "bn" ? "আমাদের দৃষ্টিভঙ্গি" : "Our Vision"}
                                </h3>
                                <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 ${bengaliClass}`}>
                                    {language === "bn"
                                        ? "এমন একটি বিশ্ব গড়া যেখানে যে কেউ তার স্বপ্নের ক্যারিয়ার গড়তে পারে। দক্ষিণ এশিয়ার সেরা টেক শিক্ষা প্ল্যাটফর্ম হওয়া।"
                                        : "A world where anyone can build their dream career. To become South Asia's leading tech education platform."}
                                </p>
                                <div className="space-y-2.5">
                                    {[
                                        language === "bn" ? "১ মিলিয়ন ক্যারিয়ার রূপান্তর" : "Transform 1M+ careers",
                                        language === "bn" ? "বিশ্বব্যাপী টেক হাব তৈরি" : "Build global tech hubs",
                                        language === "bn" ? "AI-চালিত পার্সোনালাইজড লার্নিং" : "AI-powered personalized learning",
                                    ].map((item, i) => (
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
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bengaliClass}`}>
                            {language === "bn" ? "কেন আমরা" : "Why Choose Us"}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>যা আমাদের <span className="text-[#7A85F0]">আলাদা</span> করে</>
                            ) : (
                                <>What Makes Us <span className="text-[#7A85F0]">Different</span></>
                            )}
                        </h2>
                        <p className={`text-gray-500 dark:text-gray-400 text-sm max-w-2xl mx-auto ${bengaliClass}`}>
                            {language === "bn"
                                ? "আমাদের প্রতিটি কোর্স ও সাপোর্ট সিস্টেম এমনভাবে ডিজাইন করা হয়েছে যাতে আপনি সফল হতে পারেন।"
                                : "Every course and support system is designed to set you up for success."}
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
                                className="group relative bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-[#7A85F0]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7A85F0]/5 transition-all"
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
                                    <span className={`text-xs font-semibold text-[#7A85F0] flex items-center gap-1 ${bengaliClass}`}>
                                        {language === "bn" ? "আরো জানুন" : "Learn more"}
                                        <LuArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 5. JOURNEY / TIMELINE ===== */}
            <section className="py-16 lg:py-24 bg-slate-50 dark:bg-[#050505] overflow-hidden">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bengaliClass}`}>
                            {language === "bn" ? "মাইলফলক" : "Milestones"}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>আমাদের <span className="text-[#7A85F0]">যাত্রা</span></>
                            ) : (
                                <>Our <span className="text-[#7A85F0]">Journey</span></>
                            )}
                        </h2>
                    </motion.div>

                    <div className="relative max-w-5xl mx-auto">
                        {/* Connector line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#7A85F0]/30 to-transparent hidden lg:block" />

                        <div className="space-y-10 lg:space-y-16">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`relative flex flex-col lg:flex-row items-center gap-6 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                                >
                                    <div className={`lg:w-1/2 ${i % 2 === 0 ? "lg:text-right lg:pr-12" : "lg:text-left lg:pl-12"}`}>
                                        <div className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/30 dark:shadow-black/20 hover:shadow-xl transition-shadow">
                                            <span className="inline-block px-3 py-1 bg-[#EEF0FD] text-[#7A85F0] rounded-full text-xs font-bold mb-3">
                                                {m.year}
                                            </span>
                                            <h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                                                {m.title}
                                            </h3>
                                            <p className={`text-sm text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                                                {m.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Center dot */}
                                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white dark:bg-[#0a0a0a] border-4 border-[#7A85F0] items-center justify-center shadow-lg z-10">
                                        <span className="w-3 h-3 rounded-full bg-[#7A85F0]" />
                                    </div>

                                    <div className="lg:w-1/2" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 6. TEAM ===== */}
            <section className="py-16 lg:py-24 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bengaliClass}`}>
                            {language === "bn" ? "আমাদের টিম" : "Our Team"}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>আপনাকে যারা <span className="text-[#7A85F0]">এগিয়ে নেবে</span></>
                            ) : (
                                <>Meet The People Who <span className="text-[#7A85F0]">Lead The Way</span></>
                            )}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-6xl mx-auto">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111] shadow-lg shadow-gray-200/30 dark:shadow-black/20 hover:shadow-2xl hover:shadow-[#7A85F0]/10 transition-all">
                                    {/* Image */}
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-100" />

                                        {/* Social on hover */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                                            {[FaLinkedinIn, FaTwitter, FaFacebookF].map((Icon, idx) => (
                                                <a key={idx} href="#" className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-[#7A85F0] hover:text-white transition-colors">
                                                    <Icon size={11} />
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3 className={`text-base font-bold text-gray-900 dark:text-white mb-0.5 ${bengaliClass}`}>
                                            {member.name}
                                        </h3>
                                        <p className={`text-xs font-semibold text-[#7A85F0] mb-2 ${bengaliClass}`}>
                                            {member.role}
                                        </p>
                                        <p className={`text-xs text-gray-500 dark:text-gray-400 leading-relaxed ${bengaliClass}`}>
                                            {member.bio}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



        </div>
    );
};

export default AboutPage;
