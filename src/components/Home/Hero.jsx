"use client";
import { API_URL } from '@/config/api';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LuBrain, LuAward, LuTarget, LuUsers, LuArrowRight, LuPlay } from "react-icons/lu";

const Hero = () => {
    const [heroData, setHeroData] = useState(null);

    const features = [
        { icon: LuBrain, title: 'Learn The', subtitle: 'Essential Skills' },
        { icon: LuAward, title: 'Earn Certificates', subtitle: 'And Degrees' },
        { icon: LuTarget, title: 'Get Ready for The', subtitle: 'Next Career' },
        { icon: LuUsers, title: 'Master at', subtitle: 'Different Areas' },
    ];

    useEffect(() => {
        const fetchHeroDesign = async () => {
            try {
                const res = await fetch(`${API_URL}/design/hero`);
                const data = await res.json();
                if (data.success && data.data?.heroContent) {
                    setHeroData(data.data.heroContent);
                }
            } catch (error) {
                console.error('Error fetching hero design:', error);
            }
        };
        fetchHeroDesign();
    }, []);

    const getBadgeText = () => heroData?.badge?.text || 'Welcome to Techlight IT';
    const getDescriptionText = () => heroData?.description?.text || 'Access thousands of premium courses, software, and digital products. Built by experts, ready for you to launch in minutes.';

    return (
        <section className="relative min-h-[75vh] overflow-hidden flex flex-col">
            {/* ===== Background Image ===== */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg hero.png')" }}
            />

            {/* ===== Animated Overlay Elements ===== */}



            {/* ===== Main Content ===== */}
            <div className="flex-1 container mx-auto px-4 lg:px-32 py-10 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                    {/* Left — Text Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                        }}
                        className="relative z-10"
                    >
                        {/* Badge — Light style */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="mb-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
                                <span className="text-[#7A85F0] text-sm">⚡</span>
                                <span className="text-gray-700 text-xs font-medium">
                                    {getBadgeText()}
                                </span>
                            </div>
                        </motion.div>

                        {/* Main Heading — Fixed 50px, 2 lines */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                            className="mb-6"
                        >
                            <h1 style={{ fontSize: '50px', lineHeight: '1.15', fontWeight: '600' }} className="text-gray-900 tracking-tight">
                                Start learning from the<br />
                                world&apos;s <span className="text-[#7A85F0]">best institutions</span>
                            </h1>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="mb-8"
                        >
                            <p className="text-gray-500 max-w-lg leading-relaxed" style={{ fontSize: '14px' }}>
                                {getDescriptionText()}
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            className="flex flex-wrap gap-5 items-center mb-10"
                        >
                            <Link href="/courses">
                                <button className="group px-8 py-3.5 rounded-full bg-[#7A85F0] hover:bg-[#5A65D0] text-white text-sm font-bold shadow-lg shadow-[#7A85F0]/25 hover:shadow-[#7A85F0]/40 transition-all duration-300 flex items-center gap-2.5">
                                    Get Started
                                    <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                </button>
                            </Link>

                            <button className="group flex items-center gap-3 text-gray-600 hover:text-[#7A85F0] transition-colors">
                                <div className="w-12 h-12 rounded-full bg-white shadow-lg shadow-gray-200/50 flex items-center justify-center group-hover:shadow-[#7A85F0]/20 transition-all">
                                    <LuPlay size={18} className="text-[#7A85F0] ml-0.5" />
                                </div>
                                <span className="text-sm font-semibold">Watch the video</span>
                            </button>
                        </motion.div>

                        {/* Stats bottom line — like SkillArt */}
                        <motion.div
                            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                            className="mb-6 text-base font-bold text-gray-800"
                        >
                            Explore{" "}
                            <span className="text-[#7A85F0]">1350+</span>{" "}
                            Courses within Subject
                        </motion.div>

                        {/* Enrollment Info */}
                        <motion.div
                            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                            className="flex items-center gap-4"
                        >
                            <div className="flex -space-x-2.5">
                                {['S', 'A', 'R', 'K'].map((letter, i) => (
                                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
                                        style={{ backgroundColor: ['#7A85F0', '#F59E0B', '#10B981', '#EF4444'][i] }}>
                                        {letter}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <span className="text-[#7A85F0] font-bold text-sm">10k+</span>
                                <span className="text-gray-500 text-sm ml-1">Enrollment</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right — Image Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-xl lg:max-w-2xl">
                            <div className="grid grid-cols-12 gap-4 relative">
                                {/* Main Large Image */}
                                <motion.div
                                    className="col-span-7 relative group"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.7 }}
                                >
                                    <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/10 border border-white/60">
                                        <img
                                            src="/images/57462951_2085649778223584_3709857119512559616_n.jpg"
                                            alt="Students Learning"
                                            className="w-full h-[320px] lg:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                                            <p className="text-[10px] font-bold text-[#7A85F0] uppercase tracking-widest">Live Class</p>
                                            <p className="text-xs font-semibold text-gray-700">50+ Students</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Right Column */}
                                <div className="col-span-5 flex flex-col gap-4">
                                    <motion.div
                                        className="relative group"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.7 }}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl shadow-xl border border-white/60">
                                            <img
                                                src="/images/58068385_2070681143053781_5367478869567733760_n.jpg"
                                                alt="Seminar"
                                                className="w-full h-[150px] lg:h-[190px] object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                                <div className="w-6 h-6 bg-[#7A85F0] rounded-full flex items-center justify-center">
                                                    <span className="text-white text-[10px]">🎓</span>
                                                </div>
                                                <span className="text-white text-[10px] font-bold drop-shadow-lg">Seminar</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="relative group"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9, duration: 0.7 }}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl shadow-xl border border-white/60">
                                            <img
                                                src="/images/58383539_2073583652763530_1902712555562860544_n.jpg"
                                                alt="Exam Hall"
                                                className="w-full h-[150px] lg:h-[190px] object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-[10px]">📝</span>
                                                </div>
                                                <span className="text-white text-[10px] font-bold drop-shadow-lg">Exam Hall</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Floating Badges */}
                            <motion.div
                                className="absolute -top-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 z-20"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-500 text-sm font-bold">✓</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-medium">Success Rate</p>
                                        <p className="font-bold text-sm text-gray-800">98%</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute -bottom-3 right-[30%] bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 z-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-[#7A85F0] flex items-center justify-center text-white text-xs font-bold border-2 border-white">S</div>
                                        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">A</div>
                                        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">R</div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-medium">Students</p>
                                        <p className="font-bold text-xs text-gray-800">50k+ Enrolled</p>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ===== Bottom Features Bar ===== */}
            <div className="hidden lg:block relative w-full z-20 bg-[#7A85F0] shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto px-4 lg:px-20 py-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 + index * 0.1 }}
                                className="flex items-center gap-4 justify-center md:justify-start group cursor-default"
                            >
                                <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
                                    <feature.icon size={22} />
                                </div>
                                <div className="text-white">
                                    <p className="text-[10px] md:text-xs font-medium text-blue-100 uppercase tracking-wider leading-none mb-1.5">{feature.title}</p>
                                    <p className="text-xs md:text-sm font-bold leading-none">{feature.subtitle}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
