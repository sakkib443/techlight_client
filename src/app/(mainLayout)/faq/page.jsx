"use client";

import React, { useState, useMemo } from "react";
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
    LuSparkles,
    LuLayers,
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const FAQPage = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [openIndex, setOpenIndex] = useState(0);

    const categories = [
        {
            id: "all",
            icon: LuLayers,
            label: language === "bn" ? "সব প্রশ্ন" : "All Questions",
        },
        {
            id: "enrollment",
            icon: LuGraduationCap,
            label: language === "bn" ? "ভর্তি" : "Enrollment",
        },
        {
            id: "payment",
            icon: LuCreditCard,
            label: language === "bn" ? "পেমেন্ট" : "Payment",
        },
        {
            id: "certificate",
            icon: LuAward,
            label: language === "bn" ? "সার্টিফিকেট" : "Certificate",
        },
        {
            id: "course",
            icon: LuBookOpen,
            label: language === "bn" ? "কোর্স" : "Course",
        },
        {
            id: "technical",
            icon: LuMonitor,
            label: language === "bn" ? "টেকনিক্যাল" : "Technical",
        },
    ];

    const faqs = [
        // Enrollment
        {
            category: "enrollment",
            q: language === "bn"
                ? "টেকলাইট আইটি ইনস্টিটিউটে কীভাবে ভর্তি হব?"
                : "How do I enroll at Techlight IT Institute?",
            a: language === "bn"
                ? "ভর্তি প্রক্রিয়া খুবই সহজ। আমাদের ওয়েবসাইটে গিয়ে রেজিস্ট্রেশন করুন, পছন্দের কোর্স সিলেক্ট করুন, পেমেন্ট করুন — ব্যাস! আপনি অবিলম্বে কোর্স অ্যাক্সেস পেয়ে যাবেন।"
                : "The enrollment process is simple. Register on our website, select your preferred course, complete the payment — and you'll get instant access to your course materials.",
        },
        {
            category: "enrollment",
            q: language === "bn" ? "ভর্তির জন্য কি কোনো যোগ্যতা প্রয়োজন?" : "Are there any prerequisites for enrollment?",
            a: language === "bn"
                ? "বেশিরভাগ বিগিনার কোর্সের জন্য কোনো পূর্ব অভিজ্ঞতা প্রয়োজন নেই। তবে অ্যাডভান্সড কোর্সের জন্য বেসিক কম্পিউটার জ্ঞান এবং ইংরেজি পড়ার দক্ষতা থাকা ভালো।"
                : "Most beginner courses require no prior experience. However, advanced courses recommend basic computer literacy and reading proficiency in English.",
        },
        {
            category: "enrollment",
            q: language === "bn" ? "একসাথে একাধিক কোর্সে ভর্তি হওয়া যাবে?" : "Can I enroll in multiple courses at once?",
            a: language === "bn"
                ? "অবশ্যই। আপনি যত খুশি কোর্সে একসাথে ভর্তি হতে পারবেন। তবে আমরা সাজেস্ট করি একসাথে ২-৩টির বেশি কোর্স না নিতে — তাহলে শেখার মান ভালো থাকে।"
                : "Absolutely. You can enroll in as many courses as you like. However, we recommend not taking more than 2-3 courses simultaneously to ensure quality learning.",
        },
        {
            category: "enrollment",
            q: language === "bn" ? "ভর্তির ডেডলাইন আছে কি?" : "Is there an enrollment deadline?",
            a: language === "bn"
                ? "আমাদের অনলাইন কোর্সগুলো বছরজুড়ে যেকোনো সময় শুরু করা যায়। লাইভ কোর্সের জন্য ব্যাচ অনুযায়ী নির্দিষ্ট তারিখ থাকে — কোর্স পেজে দেখুন।"
                : "Our online courses can be started anytime year-round. Live courses follow batch schedules with specific start dates — check the course page for details.",
        },

        // Payment
        {
            category: "payment",
            q: language === "bn" ? "কোন কোন পেমেন্ট মেথড সাপোর্ট করেন?" : "What payment methods do you accept?",
            a: language === "bn"
                ? "আমরা bKash, Nagad, Rocket, Visa/Mastercard, এবং Stripe (international) সাপোর্ট করি। সব পেমেন্ট ১০০% সিকিউর এবং SSL এনক্রিপ্টেড।"
                : "We accept bKash, Nagad, Rocket, Visa/Mastercard, and Stripe (international). All payments are 100% secure and SSL encrypted.",
        },
        {
            category: "payment",
            q: language === "bn" ? "ইনস্টলমেন্টে পেমেন্ট করা যাবে?" : "Can I pay in installments?",
            a: language === "bn"
                ? "হ্যাঁ, প্রিমিয়াম কোর্সগুলোতে ২-৩ কিস্তিতে পেমেন্ট করার সুবিধা আছে। চেকআউট পেজে অপশন দেখা যাবে অথবা আমাদের সাথে যোগাযোগ করুন।"
                : "Yes, premium courses offer 2-3 installment options. You'll see this option at checkout, or contact our support team for details.",
        },
        {
            category: "payment",
            q: language === "bn" ? "রিফান্ড পলিসি কী?" : "What is your refund policy?",
            a: language === "bn"
                ? "কোর্স কেনার ৭ দিনের মধ্যে ৭০% এর কম কন্টেন্ট দেখলে ১০০% রিফান্ড পাওয়া যাবে। বিস্তারিত আমাদের রিফান্ড পেজে আছে।"
                : "If you've consumed less than 70% of the content within 7 days of purchase, you're eligible for a 100% refund. See our refund policy page for full details.",
        },
        {
            category: "payment",
            q: language === "bn" ? "কুপন কোড কোথায় ব্যবহার করব?" : "Where do I apply a coupon code?",
            a: language === "bn"
                ? "চেকআউট পেজে \"Apply Coupon\" বক্স আছে। সেখানে কোডটি লিখে \"Apply\" বাটনে ক্লিক করলেই ডিসকাউন্ট auto-apply হবে।"
                : "On the checkout page, you'll find an \"Apply Coupon\" box. Enter your code and click \"Apply\" — the discount will be applied automatically.",
        },

        // Certificate
        {
            category: "certificate",
            q: language === "bn" ? "সার্টিফিকেট কখন পাব?" : "When will I receive my certificate?",
            a: language === "bn"
                ? "কোর্স ১০০% কমপ্লিট করার পর ফাইনাল কুইজ পাস করলেই সাথে সাথে ডিজিটাল সার্টিফিকেট জেনারেট হবে। ড্যাশবোর্ড থেকে PDF ডাউনলোড করতে পারবেন।"
                : "Once you complete 100% of the course and pass the final quiz, your digital certificate is generated instantly. Download the PDF from your dashboard.",
        },
        {
            category: "certificate",
            q: language === "bn" ? "সার্টিফিকেট কি ভেরিফাই করা যাবে?" : "Are the certificates verifiable?",
            a: language === "bn"
                ? "হ্যাঁ। প্রতিটি সার্টিফিকেটে একটি unique verification ID আছে। যেকেউ আমাদের /certification পেজে গিয়ে ID দিয়ে যাচাই করতে পারবে।"
                : "Yes. Every certificate has a unique verification ID. Anyone can verify it by entering the ID on our /certification page.",
        },
        {
            category: "certificate",
            q: language === "bn" ? "সার্টিফিকেট কি LinkedIn এ যুক্ত করা যাবে?" : "Can I add the certificate to LinkedIn?",
            a: language === "bn"
                ? "অবশ্যই। আমাদের সার্টিফিকেট LinkedIn-এর Licenses & Certifications সেকশনে সরাসরি অ্যাড করার অপশন থাকে।"
                : "Absolutely. Our certificates come with a direct \"Add to LinkedIn\" button for the Licenses & Certifications section.",
        },

        // Course
        {
            category: "course",
            q: language === "bn" ? "কোর্সে কি লাইফটাইম অ্যাক্সেস থাকবে?" : "Do I get lifetime access to courses?",
            a: language === "bn"
                ? "হ্যাঁ, একবার কোর্স কিনলে সারাজীবন অ্যাক্সেস থাকবে। সব আপডেট, বোনাস কন্টেন্ট, এবং ভবিষ্যতের নতুন মডিউলও ফ্রিতে পাবেন।"
                : "Yes, once you purchase a course, you have lifetime access — including all updates, bonus content, and any future modules at no extra cost.",
        },
        {
            category: "course",
            q: language === "bn" ? "মোবাইলে কোর্স দেখা যাবে?" : "Can I watch courses on mobile?",
            a: language === "bn"
                ? "হ্যাঁ, আমাদের প্ল্যাটফর্ম ১০০% রেসপন্সিভ। মোবাইল, ট্যাবলেট, ল্যাপটপ — সব ডিভাইসে স্মুথলি কাজ করে।"
                : "Yes, our platform is fully responsive and works smoothly on mobile, tablet, and desktop devices.",
        },
        {
            category: "course",
            q: language === "bn" ? "কোর্স কি বাংলায় আছে?" : "Are courses available in Bangla?",
            a: language === "bn"
                ? "হ্যাঁ, আমাদের বেশিরভাগ কোর্সই বাংলায়। কিছু অ্যাডভান্সড টেকনিক্যাল কোর্সে English-Bangla mix থাকতে পারে।"
                : "Yes, most of our courses are in Bangla. Some advanced technical courses may use a mix of English and Bangla.",
        },
        {
            category: "course",
            q: language === "bn" ? "ইন্সট্রাক্টরের সাথে যোগাযোগ করা যাবে?" : "Can I contact instructors directly?",
            a: language === "bn"
                ? "অবশ্যই। প্রতিটি কোর্সে Q&A সেকশন আছে। এছাড়াও প্রিমিয়াম স্টুডেন্টদের জন্য weekly live mentorship সেশন আছে।"
                : "Absolutely. Every course has a Q&A section, and premium students get access to weekly live mentorship sessions.",
        },

        // Technical
        {
            category: "technical",
            q: language === "bn" ? "ভিডিও বাফার করছে — কী করব?" : "Videos are buffering — what should I do?",
            a: language === "bn"
                ? "ভিডিও কোয়ালিটি 720p বা 480p তে নামিয়ে দেখুন। ইন্টারনেট স্পিড কমপক্ষে 5 Mbps থাকা ভালো। সমস্যা থাকলে support@techlight.com এ মেইল করুন।"
                : "Try lowering the video quality to 720p or 480p. We recommend at least 5 Mbps internet speed. If issues persist, email support@techlight.com.",
        },
        {
            category: "technical",
            q: language === "bn" ? "পাসওয়ার্ড ভুলে গেছি — কীভাবে রিসেট করব?" : "I forgot my password — how do I reset it?",
            a: language === "bn"
                ? "লগইন পেজে \"Forgot Password\" এ ক্লিক করুন। ইমেইলে রিসেট লিংক যাবে — সেখান থেকে নতুন পাসওয়ার্ড সেট করতে পারবেন।"
                : "Click \"Forgot Password\" on the login page. We'll send a reset link to your email — use it to set a new password.",
        },
        {
            category: "technical",
            q: language === "bn" ? "অফলাইনে কোর্স দেখা যাবে?" : "Can I download courses for offline viewing?",
            a: language === "bn"
                ? "প্রিমিয়াম প্ল্যানে অফলাইন ডাউনলোডের সুবিধা আছে আমাদের মোবাইল অ্যাপে। ডাউনলোড করা ভিডিও এনক্রিপ্টেড থাকে এবং অ্যাপের ভেতরেই চলে।"
                : "Premium plans support offline downloads via our mobile app. Downloaded videos are encrypted and play only within the app.",
        },
    ];

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
    }, [activeCategory, searchTerm]);

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
                                {language === "bn" ? "সাহায্য কেন্দ্র" : "Help Center"}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>প্রায়শই জিজ্ঞাসিত <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A85F0] to-[#7A85F0]">প্রশ্নাবলী</span></>
                            ) : (
                                <>Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A85F0] to-[#7A85F0]">Questions</span></>
                            )}
                        </h1>

                        {/* Description */}
                        <p className={`text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed mb-5 ${bengaliClass}`}>
                            {language === "bn"
                                ? "আপনার সমস্ত প্রশ্নের উত্তর এক জায়গায়। কোনো উত্তর না পেলে সরাসরি যোগাযোগ করুন।"
                                : "All your questions answered in one place. Can't find what you're looking for? Reach out to us directly."}
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
                                placeholder={language === "bn" ? "প্রশ্ন খুঁজুন..." : "Search for a question..."}
                                className={`w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-[#7A85F0] focus:ring-2 focus:ring-[#7A85F0]/20 outline-none text-xs lg:text-sm text-slate-700 dark:text-white placeholder:text-slate-400 shadow-sm transition-all ${bengaliClass}`}
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
                                        ? "bg-[#7A85F0] text-white border-[#7A85F0] shadow-lg shadow-[#7A85F0]/25"
                                        : "bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-[#7A85F0]/40 hover:text-[#7A85F0]"
                                        } ${bengaliClass}`}
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

                        {filteredFaqs.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#EEF0FD] flex items-center justify-center mx-auto mb-4">
                                    <LuSearch size={24} className="text-[#7A85F0]" />
                                </div>
                                <h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                                    {language === "bn" ? "কোনো প্রশ্ন পাওয়া যায়নি" : "No questions found"}
                                </h3>
                                <p className={`text-gray-500 dark:text-gray-400 text-sm ${bengaliClass}`}>
                                    {language === "bn"
                                        ? "অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন বা ক্যাটাগরি বদলান।"
                                        : "Try different keywords or change the category."}
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
                                                ? "border-[#7A85F0]/40 shadow-md shadow-[#7A85F0]/10"
                                                : "border-gray-100 dark:border-gray-800 hover:border-[#7A85F0]/20"
                                                }`}
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                                                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <span className={`text-xs font-semibold shrink-0 transition-colors ${isOpen ? "text-[#7A85F0]" : "text-gray-400"
                                                        }`}>
                                                        {String(i + 1).padStart(2, "0")}
                                                    </span>
                                                    <h3 className={`text-sm lg:text-base text-gray-800 dark:text-gray-100 pr-2 ${bengaliClass}`} style={{ fontWeight: 600 }}>
                                                        {faq.q}
                                                    </h3>
                                                </div>
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen
                                                    ? "bg-[#7A85F0] text-white rotate-180"
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
                                                            <div className="border-l-2 border-[#7A85F0]/30 pl-3.5">
                                                                <p className={`text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed ${bengaliClass}`}>
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
                        <div className="absolute inset-0 bg-gradient-to-br from-[#7A85F0] via-[#6B74E8] to-[#5A63D0]" />

                        {/* Decorative circles */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
                            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full" />
                        </div>

                        <div className="relative z-10 px-8 py-12 lg:px-16 lg:py-16 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6">
                                <LuMessageCircle size={14} className="text-white/90" />
                                <span className={`text-xs font-semibold text-white/90 uppercase tracking-wider ${bengaliClass}`}>
                                    {language === "bn" ? "আরও সাহায্য দরকার?" : "Need More Help?"}
                                </span>
                            </div>

                            <h2 className={`text-2xl lg:text-4xl font-bold text-white mb-4 leading-tight ${bengaliClass}`}>
                                {language === "bn" ? (
                                    <>উত্তর খুঁজে <span className="text-amber-300">পাচ্ছেন না</span>?</>
                                ) : (
                                    <>Still Have <span className="text-amber-300">Questions</span>?</>
                                )}
                            </h2>

                            <p className={`text-white/80 text-sm lg:text-base max-w-xl mx-auto mb-8 leading-relaxed ${bengaliClass}`}>
                                {language === "bn"
                                    ? "আমাদের সাপোর্ট টিম ২৪/৭ আপনার সেবায়। সরাসরি যোগাযোগ করুন এবং সাথে সাথেই উত্তর পান।"
                                    : "Our support team is available 24/7. Reach out directly and get instant answers from our experts."}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/contact">
                                    <button className={`group px-8 py-3.5 rounded-full bg-white text-[#7A85F0] font-bold text-sm shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 ${bengaliClass}`}>
                                        <LuMessageCircle size={16} />
                                        {language === "bn" ? "যোগাযোগ করুন" : "Contact Support"}
                                        <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                    </button>
                                </Link>

                                <a href="#">
                                    <button className={`group px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white font-bold text-sm hover:bg-white/20 transition-all duration-300 flex items-center gap-2.5 ${bengaliClass}`}>
                                        <LuPhone size={16} />
                                        {language === "bn" ? "কল করুন" : "Call Us"}
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
