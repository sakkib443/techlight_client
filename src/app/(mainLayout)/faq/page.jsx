"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuSearch,
    LuChevronDown,
    LuGraduationCap,
    LuCreditCard,
    LuAward,
    LuBookOpen,
    LuMonitor,
    LuMessageCircle,
    LuPhone,
    LuArrowRight,
    LuLayers,
} from "react-icons/lu";
import { API_BASE_URL } from "@/config/api";

const FAQPage = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [openIndex, setOpenIndex] = useState(0);

    // FAQ data from backend + loading state
    const [rawFaqs, setRawFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load active FAQs from backend
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/faqs`);
                const data = await res.json();
                if (active && data?.success && Array.isArray(data.data)) {
                    setRawFaqs(data.data);
                }
            } catch {
                if (active) setRawFaqs([]);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const categories = [
        { id: "all", icon: LuLayers, label: "All Questions" },
        { id: "enrollment", icon: LuGraduationCap, label: "Enrollment" },
        { id: "payment", icon: LuCreditCard, label: "Payment" },
        { id: "certificate", icon: LuAward, label: "Certificate" },
        { id: "course", icon: LuBookOpen, label: "Course" },
        { id: "technical", icon: LuMonitor, label: "Technical" },
    ];

    // Map backend FAQ to { category, q, a }
    const faqs = useMemo(() => {
        return rawFaqs.map((f) => ({
            category: f.category,
            q: f.question,
            a: f.answer,
        }));
    }, [rawFaqs]);

    // Filter FAQs
    const filteredFaqs = useMemo(() => {
        return faqs.filter((faq) => {
            const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
            const matchesSearch =
                searchTerm === "" ||
                faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [faqs, activeCategory, searchTerm]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-poppins antialiased">

            {/* ===== Hero Section ===== */}
            <section className="relative py-12 lg:py-16 bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E31E27]/5 via-transparent to-[#E31E27]/5"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(227,30,39,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(227,30,39,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#E31E27]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#E31E27]/[0.06] rounded-full blur-3xl pointer-events-none"></div>
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E31E27]/20 rounded-full shadow-sm mb-4">
                            <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31E27] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E31E27]"></span>
                            </span>
                            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                                Help Center
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 leading-tight">
                            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E31E27] to-[#E31E27]">Questions</span>
                        </h1>

                        {/* Description */}
                        <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed mb-5">
                            All your questions answered in one place. Can&apos;t find what you&apos;re looking for? Reach out to us directly.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <LuSearch size={15} />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for a question..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-[#E31E27] focus:ring-2 focus:ring-[#E31E27]/20 outline-none text-xs lg:text-sm text-slate-700 dark:text-white placeholder:text-slate-400 shadow-sm transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== Categories Tabs ===== */}
            <section className="py-10 lg:py-12 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {categories.map((cat, i) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <motion.button
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => {
                                        setActiveCategory(cat.id);
                                        setOpenIndex(0);
                                    }}
                                    className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all border ${isActive
                                        ? "bg-[#E31E27] text-white border-[#E31E27] shadow-lg shadow-[#E31E27]/25"
                                        : "bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-[#E31E27]/40 hover:text-[#E31E27]"
                                        }`}
                                >
                                    <cat.icon size={14} />
                                    {cat.label}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== FAQ Accordion ===== */}
            <section className="py-12 lg:py-16 bg-slate-50 dark:bg-[#050505]">
                <div className="container mx-auto px-4 lg:px-32">
                    <div className="max-w-7xl mx-auto">

                        {loading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start animate-pulse">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-16 bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-gray-800"
                                    />
                                ))}
                            </div>
                        ) : filteredFaqs.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
                                    <LuSearch size={24} className="text-[#E31E27]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    No questions found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Try different keywords or change the category.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                                {filteredFaqs.map((faq, i) => {
                                    const isOpen = openIndex === i;
                                    return (
                                        <motion.div
                                            key={`${activeCategory}-${i}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            className={`bg-white dark:bg-[#111] rounded-xl border transition-all overflow-hidden ${isOpen
                                                ? "border-[#E31E27]/40 shadow-md shadow-[#E31E27]/10"
                                                : "border-gray-100 dark:border-gray-800 hover:border-[#E31E27]/20"
                                                }`}
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                                                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <span className={`text-xs font-semibold shrink-0 transition-colors ${isOpen ? "text-[#E31E27]" : "text-gray-400"
                                                        }`}>
                                                        {String(i + 1).padStart(2, "0")}
                                                    </span>
                                                    <h3 className="text-sm lg:text-base text-gray-800 dark:text-gray-100 pr-2" style={{ fontWeight: 600 }}>
                                                        {faq.q}
                                                    </h3>
                                                </div>
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen
                                                    ? "bg-[#E31E27] text-white rotate-180"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                                                    }`}>
                                                    <LuChevronDown size={14} />
                                                </div>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-4 pl-[44px]">
                                                            <div className="border-l-2 border-[#E31E27]/30 pl-3.5">
                                                                <p className="text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed">
                                                                    {faq.a}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== Still Have Questions CTA ===== */}
            <section className="py-16 lg:py-20 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-[2rem] overflow-hidden max-w-5xl mx-auto"
                    >
                        {/* Gradient bg */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#E31E27] via-[#CC1B24] to-[#5A63D0]" />

                        {/* Decorative circles */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
                            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full" />
                        </div>

                        <div className="relative z-10 px-8 py-12 lg:px-16 lg:py-16 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6">
                                <LuMessageCircle size={14} className="text-white/90" />
                                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                                    Need More Help?
                                </span>
                            </div>

                            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                Still Have <span className="text-amber-300">Questions</span>?
                            </h2>

                            <p className="text-white/80 text-sm lg:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                                Our support team is available 24/7. Reach out directly and get instant answers from our experts.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/contact">
                                    <button className="group px-8 py-3.5 rounded-full bg-white text-[#E31E27] font-bold text-sm shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5">
                                        <LuMessageCircle size={16} />
                                        Contact Support
                                        <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                    </button>
                                </Link>

                                <a href="#">
                                    <button className="group px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white font-bold text-sm hover:bg-white/20 transition-all duration-300 flex items-center gap-2.5">
                                        <LuPhone size={16} />
                                        Call Us
                                    </button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default FAQPage;
