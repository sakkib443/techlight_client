"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { LuUsers, LuBookOpen, LuTrophy, LuGraduationCap } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

/* ── Animated Counter Hook ── */
const useCounter = (end, duration = 2000, start = false) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;
        let startTime = null;
        let raf;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(eased * end));
            if (progress < 1) raf = requestAnimationFrame(animate);
        };

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [end, duration, start]);

    return count;
};

/* ── Single Stat Item ── */
const StatItem = ({ icon: Icon, value, suffix, label, color, delay, inView }) => {
    const count = useCounter(value, 2200, inView);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="text-center group"
        >
            <div className="flex flex-col items-center">
                {/* Icon */}
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <Icon size={22} style={{ color }} />
                </div>

                {/* Number */}
                <div className="flex items-baseline gap-0.5 mb-1.5">
                    <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                        {count.toLocaleString()}
                    </span>
                    <span className="text-lg lg:text-xl font-bold" style={{ color }}>
                        {suffix}
                    </span>
                </div>

                {/* Label */}
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    {label}
                </p>
            </div>
        </motion.div>
    );
};

/* ── Main Component ── */
const StatsCounter = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    const stats = [
        {
            icon: LuUsers,
            value: 10000,
            suffix: '+',
            label: language === 'bn' ? 'শিক্ষার্থী' : 'Students Enrolled',
            color: '#7A85F0',
        },
        {
            icon: LuBookOpen,
            value: 50,
            suffix: '+',
            label: language === 'bn' ? 'কোর্স সমূহ' : 'Expert Courses',
            color: '#F59E0B',
        },
        {
            icon: LuGraduationCap,
            value: 95,
            suffix: '%',
            label: language === 'bn' ? 'সাফল্যের হার' : 'Success Rate',
            color: '#10B981',
        },
        {
            icon: LuTrophy,
            value: 20,
            suffix: '+',
            label: language === 'bn' ? 'এক্সপার্ট ইন্সট্রাক্টর' : 'Expert Instructors',
            color: '#EF4444',
        },
    ];

    return (
        <section ref={ref} className="py-16 lg:py-20 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
            {/* Subtle bg accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#7A85F0]/[0.03] rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/[0.03] rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 lg:px-32 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bengaliClass}`}>
                        {language === 'bn' ? 'আমাদের অর্জন' : 'Our Achievements'}
                    </span>
                    <h2 className={`text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight ${bengaliClass}`}>
                        {language === 'bn'
                            ? <>সংখ্যায় <span className="text-[#7A85F0]">আমাদের সাফল্য</span></>
                            : <>Our Success in <span className="text-[#7A85F0]">Numbers</span></>
                        }
                    </h2>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, i) => (
                        <StatItem key={i} {...stat} delay={i * 0.1} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
