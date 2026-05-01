"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LuClock, LuHeadphones, LuSparkles, LuArrowRight } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const WhatWeProvide = () => {
    const { t, language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const features = [
        {
            icon: LuClock,
            title: language === 'bn' ? 'ফ্লেক্সিবল শিডিউল' : 'Flexible Schedule',
            desc: language === 'bn' ? 'আপনার সুবিধামতো সময়ে ক্লাস করুন' : 'Learn at your own pace and time',
        },
        {
            icon: LuHeadphones,
            title: language === 'bn' ? '২৪/৭ সাপোর্ট' : '24/7 Online Support',
            desc: language === 'bn' ? 'যেকোনো সমস্যায় সাহায্য পান' : 'Get help whenever you need it',
        },
        {
            icon: LuSparkles,
            title: language === 'bn' ? 'স্মার্ট লার্নিং' : 'Smart Learning Process',
            desc: language === 'bn' ? 'আধুনিক পদ্ধতিতে সহজে শিখুন' : 'Modern methods for easy learning',
        },
    ];

    return (
        <section className="py-16 lg:py-20 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-8 grid grid-cols-4 gap-2.5 opacity-[0.06]">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-[#7A85F0] rounded-full" />
                    ))}
                </div>
                <div className="absolute top-0 right-0 w-40 h-40 border-2 border-[#7A85F0]/[0.06] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-10 left-[5%] w-24 h-24 border-2 border-[#7A85F0]/[0.06] rounded-full" />
            </div>

            <div className="container mx-auto px-4 lg:px-32 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                    {/* ── Left: Image ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#7A85F0]/10">
                            <Image
                                src="/images/57462951_2085649778223584_3709857119512559616_n.jpg"
                                alt="Students learning at Techlight IT Institute"
                                width={600}
                                height={450}
                                className="w-full h-[350px] lg:h-[420px] object-cover"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>

                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="absolute -bottom-5 -right-3 lg:right-6 bg-white dark:bg-[#141414] rounded-xl px-5 py-3 shadow-xl border border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#EEF0FD] rounded-lg flex items-center justify-center">
                                    <LuSparkles size={18} className="text-[#7A85F0]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">
                                        {language === 'bn' ? 'সাফল্যের হার' : 'Success Rate'}
                                    </p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">95%</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative purple shape behind image */}
                        <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-[#7A85F0]/15 -z-10" />
                    </motion.div>

                    {/* ── Right: Content ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF0FD] border border-[#7A85F0]/20 mb-5">
                            <span className="text-[#7A85F0] text-xs">⚡</span>
                            <span className={`text-xs font-semibold text-[#7A85F0] uppercase tracking-wider ${bengaliClass}`}>
                                {language === 'bn' ? 'আমাদের প্ল্যাটফর্ম সম্পর্কে' : 'About Our Platform'}
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className={`text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-4 ${bengaliClass}`}>
                            {language === 'bn'
                                ? <>ভাষা ও প্রযুক্তির মাধ্যমে<br /><span className="text-[#7A85F0]">ক্যারিয়ার গড়ুন</span></>
                                : <>Breaking Barriers Through<br /><span className="text-[#7A85F0]">Language & Technology</span></>
                            }
                        </h2>

                        {/* Description */}
                        <p className={`text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 max-w-lg ${bengaliClass}`}>
                            {language === 'bn'
                                ? 'টেকলাইট আইটি ইনস্টিটিউটের মূল লক্ষ্য হলো শিক্ষার্থীদের প্রযুক্তিগত এবং ব্যবহারিক দক্ষতা দিয়ে ক্যারিয়ার গড়তে সাহায্য করা। আমাদের ইন্ডাস্ট্রি এক্সপার্ট ইন্সট্রাক্টরদের হাতে-কলমে শেখার সুযোগ নিন।'
                                : 'The core mission of Techlight IT Institute is to empower individuals with both technical and practical skills to enhance their career opportunities. Learn hands-on from our industry expert instructors.'}
                        </p>

                        {/* 3 Features Row */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {features.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="w-11 h-11 mx-auto mb-2.5 rounded-xl bg-[#EEF0FD] border border-[#7A85F0]/10 flex items-center justify-center group-hover:bg-[#7A85F0] transition-colors duration-300">
                                        <f.icon size={18} className="text-[#7A85F0] group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <p className={`text-xs font-bold text-gray-900 dark:text-white leading-tight ${bengaliClass}`}>
                                        {f.title}
                                    </p>
                                    <p className={`text-[10px] text-gray-400 mt-0.5 ${bengaliClass}`}>
                                        {f.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link href="/courses">
                                <button className={`group px-7 py-3 rounded-full bg-[#7A85F0] hover:bg-[#6B74E8] text-white text-sm font-semibold shadow-lg shadow-[#7A85F0]/20 hover:shadow-[#7A85F0]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 ${bengaliClass}`}>
                                    {language === 'bn' ? 'সকল কোর্স দেখুন' : 'Explore All Courses'}
                                    <LuArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhatWeProvide;
