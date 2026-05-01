"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LuCheck,
    LuX,
    LuSparkles,
    LuArrowRight,
    LuCrown,
    LuRocket,
    LuZap,
    LuShield,
    LuHeadphones,
    LuAward,
    LuUsers,
    LuStar,
    LuPhone,
    LuMessageCircle,
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const PricingPage = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | yearly

    // ==== Plan data ====
    const plans = [
        {
            id: "free",
            icon: LuZap,
            name: language === "bn" ? "ফ্রি" : "Free",
            tagline: language === "bn" ? "শুরু করার জন্য" : "Get started for free",
            priceMonthly: 0,
            priceYearly: 0,
            popular: false,
            color: "#9CA3AF",
            features: [
                { text: language === "bn" ? "৫টি বেসিক কোর্সে অ্যাক্সেস" : "Access to 5 basic courses", included: true },
                { text: language === "bn" ? "কমিউনিটি সাপোর্ট" : "Community support", included: true },
                { text: language === "bn" ? "মোবাইল অ্যাপ অ্যাক্সেস" : "Mobile app access", included: true },
                { text: language === "bn" ? "বেসিক প্রজেক্ট অ্যাক্সেস" : "Basic project access", included: true },
                { text: language === "bn" ? "সার্টিফিকেট" : "Course certificate", included: false },
                { text: language === "bn" ? "প্রিমিয়াম কোর্স" : "Premium courses", included: false },
                { text: language === "bn" ? "১:১ মেন্টরশিপ" : "1-on-1 mentorship", included: false },
                { text: language === "bn" ? "জব প্লেসমেন্ট সাপোর্ট" : "Job placement support", included: false },
            ],
            cta: language === "bn" ? "ফ্রি শুরু করুন" : "Start Free",
            href: "/register",
        },
        {
            id: "basic",
            icon: LuRocket,
            name: language === "bn" ? "বেসিক" : "Basic",
            tagline: language === "bn" ? "শিক্ষার্থীদের জন্য সেরা" : "Best for learners",
            priceMonthly: 999,
            priceYearly: 9999,
            popular: true,
            color: "#7A85F0",
            features: [
                { text: language === "bn" ? "সব ফ্রি ফিচার" : "Everything in Free", included: true },
                { text: language === "bn" ? "৫০+ প্রিমিয়াম কোর্সে অ্যাক্সেস" : "Access to 50+ premium courses", included: true },
                { text: language === "bn" ? "ভেরিফাইড সার্টিফিকেট" : "Verified certificate", included: true },
                { text: language === "bn" ? "ডাউনলোড করে অফলাইনে দেখুন" : "Download for offline viewing", included: true },
                { text: language === "bn" ? "প্রোজেক্ট ফিডব্যাক" : "Project feedback", included: true },
                { text: language === "bn" ? "অগ্রাধিকার সাপোর্ট" : "Priority support", included: true },
                { text: language === "bn" ? "১:১ মেন্টরশিপ" : "1-on-1 mentorship", included: false },
                { text: language === "bn" ? "জব প্লেসমেন্ট সাপোর্ট" : "Job placement support", included: false },
            ],
            cta: language === "bn" ? "বেসিক প্ল্যান নিন" : "Get Basic",
            href: "/checkout?plan=basic",
        },
        {
            id: "premium",
            icon: LuCrown,
            name: language === "bn" ? "প্রিমিয়াম" : "Premium",
            tagline: language === "bn" ? "ক্যারিয়ার বিল্ডারদের জন্য" : "For career builders",
            priceMonthly: 1999,
            priceYearly: 19999,
            popular: false,
            color: "#F59E0B",
            features: [
                { text: language === "bn" ? "সব বেসিক ফিচার" : "Everything in Basic", included: true },
                { text: language === "bn" ? "১০০+ প্রিমিয়াম কোর্সে আনলিমিটেড অ্যাক্সেস" : "Unlimited access to 100+ courses", included: true },
                { text: language === "bn" ? "সাপ্তাহিক লাইভ ক্লাস" : "Weekly live classes", included: true },
                { text: language === "bn" ? "১:১ মেন্টরশিপ সেশন" : "1-on-1 mentorship sessions", included: true },
                { text: language === "bn" ? "জব প্লেসমেন্ট সাপোর্ট" : "Job placement support", included: true },
                { text: language === "bn" ? "রিজিউমে রিভিউ" : "Resume review", included: true },
                { text: language === "bn" ? "ইন্টারভিউ প্রিপারেশন" : "Interview preparation", included: true },
                { text: language === "bn" ? "লাইফটাইম সাপোর্ট" : "Lifetime support", included: true },
            ],
            cta: language === "bn" ? "প্রিমিয়াম নিন" : "Get Premium",
            href: "/checkout?plan=premium",
        },
    ];

    // ==== Feature comparison ====
    const comparisonRows = [
        {
            label: language === "bn" ? "কোর্স অ্যাক্সেস" : "Course Access",
            free: language === "bn" ? "৫টি বেসিক" : "5 basic",
            basic: language === "bn" ? "৫০+ প্রিমিয়াম" : "50+ premium",
            premium: language === "bn" ? "আনলিমিটেড" : "Unlimited",
        },
        {
            label: language === "bn" ? "সার্টিফিকেট" : "Certificate",
            free: false,
            basic: true,
            premium: true,
        },
        {
            label: language === "bn" ? "অফলাইন ডাউনলোড" : "Offline Download",
            free: false,
            basic: true,
            premium: true,
        },
        {
            label: language === "bn" ? "প্রজেক্ট ফিডব্যাক" : "Project Feedback",
            free: false,
            basic: true,
            premium: true,
        },
        {
            label: language === "bn" ? "লাইভ ক্লাস" : "Live Classes",
            free: false,
            basic: language === "bn" ? "মাসে ২টি" : "2/month",
            premium: language === "bn" ? "সাপ্তাহিক" : "Weekly",
        },
        {
            label: language === "bn" ? "১:১ মেন্টরশিপ" : "1-on-1 Mentorship",
            free: false,
            basic: false,
            premium: true,
        },
        {
            label: language === "bn" ? "জব প্লেসমেন্ট" : "Job Placement",
            free: false,
            basic: false,
            premium: true,
        },
        {
            label: language === "bn" ? "ইন্টারভিউ প্রিপ" : "Interview Prep",
            free: false,
            basic: false,
            premium: true,
        },
        {
            label: language === "bn" ? "সাপোর্ট" : "Support",
            free: language === "bn" ? "কমিউনিটি" : "Community",
            basic: language === "bn" ? "অগ্রাধিকার" : "Priority",
            premium: language === "bn" ? "২৪/৭ ডেডিকেটেড" : "24/7 Dedicated",
        },
    ];

    // ==== Trust features ====
    const trustFeatures = [
        {
            icon: LuShield,
            title: language === "bn" ? "১০০% সিকিউর" : "100% Secure",
            desc: language === "bn" ? "SSL এনক্রিপ্টেড পেমেন্ট" : "SSL encrypted payments",
        },
        {
            icon: LuAward,
            title: language === "bn" ? "ভেরিফাইড সার্টিফিকেট" : "Verified Certificates",
            desc: language === "bn" ? "ইন্ডাস্ট্রি স্বীকৃত" : "Industry recognized",
        },
        {
            icon: LuHeadphones,
            title: language === "bn" ? "২৪/৭ সাপোর্ট" : "24/7 Support",
            desc: language === "bn" ? "যেকোনো সময় সাহায্য" : "Help whenever you need",
        },
        {
            icon: LuUsers,
            title: language === "bn" ? "৫০হাজার+ শিক্ষার্থী" : "50k+ Students",
            desc: language === "bn" ? "সফল কমিউনিটি" : "Thriving community",
        },
    ];

    const yearlyDiscount = 17; // ~17% yearly discount

    const formatPrice = (n) => {
        if (n === 0) return language === "bn" ? "ফ্রি" : "Free";
        return `৳${n.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-poppins antialiased">

            {/* ===== Hero Section ===== */}
            <section className="relative py-12 lg:py-16 bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7A85F0]/5 via-transparent to-[#7A85F0]/5"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(122,133,240,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(122,133,240,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#7A85F0]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#7A85F0]/[0.06] rounded-full blur-3xl pointer-events-none"></div>
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-[#7A85F0]/20 rounded-full shadow-sm mb-4">
                            <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A85F0] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7A85F0]"></span>
                            </span>
                            <span className={`text-[10px] font-medium text-slate-600 dark:text-slate-300 ${bengaliClass}`}>
                                {language === "bn" ? "প্রাইসিং প্ল্যান" : "Pricing Plans"}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>আপনার জন্য সঠিক <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A85F0] to-[#7A85F0]">প্ল্যান</span></>
                            ) : (
                                <>Choose Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A85F0] to-[#7A85F0]">Plan</span></>
                            )}
                        </h1>

                        {/* Description */}
                        <p className={`text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed mb-5 ${bengaliClass}`}>
                            {language === "bn"
                                ? "যেকোনো প্ল্যান ৭ দিন ফ্রি ট্রায়াল। কোনো লুকানো চার্জ নেই, যেকোনো সময় ক্যানসেল করতে পারবেন।"
                                : "Start with a 7-day free trial on any plan. No hidden fees, cancel anytime — no questions asked."}
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center gap-1 p-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full shadow-sm">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${billingCycle === "monthly"
                                    ? "bg-[#7A85F0] text-white shadow-md"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                    } ${bengaliClass}`}
                            >
                                {language === "bn" ? "মাসিক" : "Monthly"}
                            </button>
                            <button
                                onClick={() => setBillingCycle("yearly")}
                                className={`relative px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${billingCycle === "yearly"
                                    ? "bg-[#7A85F0] text-white shadow-md"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                    } ${bengaliClass}`}
                            >
                                {language === "bn" ? "বার্ষিক" : "Yearly"}
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${billingCycle === "yearly"
                                    ? "bg-amber-300 text-amber-900"
                                    : "bg-green-100 text-green-700"
                                    }`}>
                                    {language === "bn" ? `${yearlyDiscount}% সাশ্রয়` : `Save ${yearlyDiscount}%`}
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== Pricing Cards ===== */}
            <section className="py-10 lg:py-14 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
                        {plans.map((plan, idx) => {
                            const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
                            const isPopular = plan.popular;

                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className={`relative rounded-2xl p-6 lg:p-7 transition-all flex flex-col ${isPopular
                                        ? "bg-gradient-to-br from-[#7A85F0] via-[#6B74E8] to-[#5A63D0] text-white shadow-2xl shadow-[#7A85F0]/25 lg:scale-[1.03]"
                                        : "bg-white dark:bg-[#111] text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 shadow-md shadow-gray-200/40 dark:shadow-black/20 hover:border-[#7A85F0]/30 hover:shadow-lg"
                                        }`}
                                >
                                    {/* Best Value Badge */}
                                    {isPopular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-wider shadow-md ${bengaliClass}`}>
                                                <LuStar size={10} className="fill-amber-900" />
                                                {language === "bn" ? "জনপ্রিয়" : "Most Popular"}
                                            </span>
                                        </div>
                                    )}

                                    {/* Header: Icon + Name */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPopular ? "bg-white/15 backdrop-blur-sm" : ""
                                            }`} style={!isPopular ? { backgroundColor: `${plan.color}15` } : {}}>
                                            <plan.icon size={18} style={!isPopular ? { color: plan.color } : { color: "white" }} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className={`text-base font-bold leading-tight ${bengaliClass}`} style={{ fontWeight: 700 }}>
                                                {plan.name}
                                            </h3>
                                            <p className={`text-[11px] leading-tight ${isPopular ? "text-white/70" : "text-gray-500 dark:text-gray-400"} ${bengaliClass}`}>
                                                {plan.tagline}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-5 pb-5 border-b border-dashed" style={{ borderColor: isPopular ? "rgba(255,255,255,0.2)" : undefined }}>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl lg:text-[40px]" style={{ fontWeight: 700, lineHeight: 1 }}>
                                                {formatPrice(price)}
                                            </span>
                                            {price > 0 && (
                                                <span className={`text-xs font-medium ${isPopular ? "text-white/70" : "text-gray-400"} ${bengaliClass}`}>
                                                    /{billingCycle === "monthly"
                                                        ? language === "bn" ? "মাস" : "mo"
                                                        : language === "bn" ? "বছর" : "yr"}
                                                </span>
                                            )}
                                        </div>
                                        {billingCycle === "yearly" && price > 0 ? (
                                            <p className={`text-[11px] mt-1.5 font-medium ${isPopular ? "text-amber-300" : "text-emerald-600 dark:text-emerald-400"} ${bengaliClass}`}>
                                                {language === "bn" ? `মাসে ৳${Math.round(price / 12).toLocaleString()}` : `৳${Math.round(price / 12).toLocaleString()}/mo billed yearly`}
                                            </p>
                                        ) : (
                                            <p className={`text-[11px] mt-1.5 ${isPopular ? "text-white/60" : "text-gray-400 dark:text-gray-500"} ${bengaliClass}`}>
                                                {price === 0
                                                    ? language === "bn" ? "ক্রেডিট কার্ড লাগবে না" : "No credit card required"
                                                    : language === "bn" ? "৭ দিন ফ্রি ট্রায়াল" : "7-day free trial"}
                                            </p>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <Link href={plan.href} className="block mb-5">
                                        <button className={`group w-full py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 ${isPopular
                                            ? "bg-white text-[#7A85F0] hover:shadow-lg hover:-translate-y-0.5"
                                            : "bg-[#7A85F0] text-white hover:bg-[#5A65D0] shadow-md shadow-[#7A85F0]/20"
                                            } ${bengaliClass}`} style={{ fontWeight: 600 }}>
                                            {plan.cta}
                                            <LuArrowRight className="group-hover:translate-x-0.5 transition-transform" size={13} />
                                        </button>
                                    </Link>

                                    {/* Features label */}
                                    <p className={`text-[10px] uppercase tracking-widest mb-3 ${isPopular ? "text-white/60" : "text-gray-400 dark:text-gray-500"} ${bengaliClass}`} style={{ fontWeight: 600 }}>
                                        {idx === 0
                                            ? language === "bn" ? "যা পাচ্ছেন" : "What's included"
                                            : language === "bn" ? "নিচের সব কিছু" : "Everything below"}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2.5 flex-1">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${feature.included
                                                    ? isPopular
                                                        ? "bg-white/20"
                                                        : "bg-[#EEF0FD] dark:bg-[#7A85F0]/15"
                                                    : isPopular
                                                        ? "bg-white/5"
                                                        : "bg-gray-100 dark:bg-gray-800"
                                                    }`}>
                                                    {feature.included ? (
                                                        <LuCheck size={10} className={isPopular ? "text-white" : "text-[#7A85F0]"} strokeWidth={3.5} />
                                                    ) : (
                                                        <LuX size={10} className={isPopular ? "text-white/30" : "text-gray-400"} />
                                                    )}
                                                </div>
                                                <span className={`text-[13px] leading-snug ${feature.included
                                                    ? isPopular
                                                        ? "text-white/95"
                                                        : "text-gray-700 dark:text-gray-300"
                                                    : isPopular
                                                        ? "text-white/40 line-through"
                                                        : "text-gray-400 dark:text-gray-600 line-through"
                                                    } ${bengaliClass}`}>
                                                    {feature.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== Trust Features ===== */}
            <section className="py-12 lg:py-16 bg-slate-50 dark:bg-[#050505]">
                <div className="container mx-auto px-4 lg:px-32">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
                        {trustFeatures.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-[#111] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-[#7A85F0]/30 transition-all text-center"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#EEF0FD] flex items-center justify-center mx-auto mb-3">
                                    <item.icon size={20} className="text-[#7A85F0]" />
                                </div>
                                <h4 className={`text-sm font-bold text-gray-900 dark:text-white mb-1 ${bengaliClass}`}>
                                    {item.title}
                                </h4>
                                <p className={`text-xs text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Comparison Table ===== */}
            <section className="py-16 lg:py-20 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bengaliClass}`}>
                            {language === "bn" ? "তুলনা" : "Compare"}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>সব <span className="text-[#7A85F0]">ফিচার</span> তুলনা করুন</>
                            ) : (
                                <>Compare All <span className="text-[#7A85F0]">Features</span></>
                            )}
                        </h2>
                        <p className={`text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto ${bengaliClass}`}>
                            {language === "bn"
                                ? "প্রতিটি প্ল্যানে আপনি কী পাচ্ছেন বিস্তারিত দেখুন।"
                                : "See exactly what you get with each plan."}
                        </p>
                    </motion.div>

                    {/* Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/30 dark:shadow-black/20 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800">
                                        <th className={`text-left px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                                            {language === "bn" ? "ফিচার" : "Features"}
                                        </th>
                                        <th className="px-6 py-5">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`text-sm font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                                                    {language === "bn" ? "ফ্রি" : "Free"}
                                                </span>
                                                <span className="text-[11px] text-gray-400 font-medium">৳0</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 bg-[#EEF0FD]/50 dark:bg-[#7A85F0]/10">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`text-sm font-bold text-[#7A85F0] ${bengaliClass}`}>
                                                    {language === "bn" ? "বেসিক" : "Basic"}
                                                </span>
                                                <span className="text-[11px] text-[#7A85F0]/70 font-medium">৳999/mo</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`text-sm font-bold text-amber-600 ${bengaliClass}`}>
                                                    {language === "bn" ? "প্রিমিয়াম" : "Premium"}
                                                </span>
                                                <span className="text-[11px] text-amber-600/70 font-medium">৳1999/mo</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonRows.map((row, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className={`px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 ${bengaliClass}`}>
                                                {row.label}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {typeof row.free === "boolean" ? (
                                                    row.free ? (
                                                        <LuCheck size={18} className="text-green-500 mx-auto" strokeWidth={3} />
                                                    ) : (
                                                        <LuX size={18} className="text-gray-300 dark:text-gray-700 mx-auto" />
                                                    )
                                                ) : (
                                                    <span className={`text-xs text-gray-600 dark:text-gray-400 ${bengaliClass}`}>{row.free}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center bg-[#EEF0FD]/30 dark:bg-[#7A85F0]/5">
                                                {typeof row.basic === "boolean" ? (
                                                    row.basic ? (
                                                        <LuCheck size={18} className="text-[#7A85F0] mx-auto" strokeWidth={3} />
                                                    ) : (
                                                        <LuX size={18} className="text-gray-300 dark:text-gray-700 mx-auto" />
                                                    )
                                                ) : (
                                                    <span className={`text-xs font-semibold text-[#7A85F0] ${bengaliClass}`}>{row.basic}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {typeof row.premium === "boolean" ? (
                                                    row.premium ? (
                                                        <LuCheck size={18} className="text-amber-500 mx-auto" strokeWidth={3} />
                                                    ) : (
                                                        <LuX size={18} className="text-gray-300 dark:text-gray-700 mx-auto" />
                                                    )
                                                ) : (
                                                    <span className={`text-xs font-semibold text-amber-600 ${bengaliClass}`}>{row.premium}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== Mini FAQ ===== */}
            <section className="py-16 lg:py-20 bg-slate-50 dark:bg-[#050505]">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bengaliClass}`}>
                            {language === "bn" ? "প্রশ্নোত্তর" : "FAQ"}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>সাধারণ <span className="text-[#7A85F0]">প্রশ্ন</span></>
                            ) : (
                                <>Common <span className="text-[#7A85F0]">Questions</span></>
                            )}
                        </h2>
                    </motion.div>

                    <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-5">
                        {[
                            {
                                q: language === "bn" ? "ফ্রি ট্রায়াল কীভাবে কাজ করে?" : "How does the free trial work?",
                                a: language === "bn"
                                    ? "যেকোনো paid প্ল্যানে ৭ দিন ফ্রি ট্রায়াল পাবেন। এই সময়ে যখন খুশি ক্যানসেল করতে পারবেন, কোনো চার্জ লাগবে না।"
                                    : "Get 7 days free on any paid plan. Cancel anytime during the trial — you won't be charged.",
                            },
                            {
                                q: language === "bn" ? "প্ল্যান আপগ্রেড করা যাবে?" : "Can I upgrade my plan?",
                                a: language === "bn"
                                    ? "অবশ্যই। যেকোনো সময় প্ল্যান আপগ্রেড বা ডাউনগ্রেড করতে পারবেন। বাকি দিনের জন্য proportionally চার্জ হবে।"
                                    : "Absolutely. Upgrade or downgrade anytime. We'll prorate the difference for the remaining days.",
                            },
                            {
                                q: language === "bn" ? "রিফান্ড পাব কি?" : "Do you offer refunds?",
                                a: language === "bn"
                                    ? "৭ দিনের মধ্যে ৭০% এর কম কন্টেন্ট দেখলে ১০০% রিফান্ড দেই। কোনো প্রশ্ন ছাড়াই।"
                                    : "Yes, 100% refund within 7 days if you've consumed less than 70% of the content. No questions asked.",
                            },
                            {
                                q: language === "bn" ? "পেমেন্ট মেথড কোনগুলো?" : "What payment methods do you accept?",
                                a: language === "bn"
                                    ? "bKash, Nagad, Rocket, Visa/Mastercard, এবং ইন্টারন্যাশনাল কার্ড (Stripe)। সব পেমেন্ট ১০০% সিকিউর।"
                                    : "bKash, Nagad, Rocket, Visa/Mastercard, and international cards via Stripe. All payments are 100% secure.",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-[#7A85F0]/30 transition-all"
                            >
                                <h4 className={`text-base font-bold text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                                    {item.q}
                                </h4>
                                <p className={`text-sm text-gray-500 dark:text-gray-400 leading-relaxed ${bengaliClass}`}>
                                    {item.a}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/faq">
                            <button className={`inline-flex items-center gap-2 text-sm font-semibold text-[#7A85F0] hover:text-[#5A65D0] transition-colors ${bengaliClass}`}>
                                {language === "bn" ? "সব প্রশ্ন দেখুন" : "View All Questions"}
                                <LuArrowRight size={14} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== Final CTA ===== */}
            <section className="py-16 lg:py-20 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-[2rem] overflow-hidden max-w-5xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#7A85F0] via-[#6B74E8] to-[#5A63D0]" />

                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
                            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full" />
                        </div>

                        <div className="relative z-10 px-8 py-12 lg:px-16 lg:py-16 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6">
                                <LuUsers size={14} className="text-white/90" />
                                <span className={`text-xs font-semibold text-white/90 uppercase tracking-wider ${bengaliClass}`}>
                                    {language === "bn" ? "১০,০০০+ শিক্ষার্থী" : "10,000+ Students"}
                                </span>
                            </div>

                            <h2 className={`text-2xl lg:text-4xl font-bold text-white mb-4 leading-tight ${bengaliClass}`}>
                                {language === "bn" ? (
                                    <>শিখতে <span className="text-amber-300">প্রস্তুত</span>?</>
                                ) : (
                                    <>Ready to <span className="text-amber-300">Get Started</span>?</>
                                )}
                            </h2>

                            <p className={`text-white/80 text-sm lg:text-base max-w-xl mx-auto mb-8 leading-relaxed ${bengaliClass}`}>
                                {language === "bn"
                                    ? "আজই ফ্রি ট্রায়াল শুরু করুন। কোনো ক্রেডিট কার্ড লাগবে না।"
                                    : "Start your free trial today. No credit card required."}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/register">
                                    <button className={`group px-8 py-3.5 rounded-full bg-white text-[#7A85F0] font-bold text-sm shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 ${bengaliClass}`}>
                                        {language === "bn" ? "ফ্রি শুরু করুন" : "Start Free Trial"}
                                        <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                    </button>
                                </Link>

                                <Link href="/contact">
                                    <button className={`group px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white font-bold text-sm hover:bg-white/20 transition-all duration-300 flex items-center gap-2.5 ${bengaliClass}`}>
                                        <LuMessageCircle size={16} />
                                        {language === "bn" ? "সেলস টিমের সাথে কথা বলুন" : "Talk to Sales"}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default PricingPage;
