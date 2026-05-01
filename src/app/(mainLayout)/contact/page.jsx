"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuMail,
    LuPhone,
    LuMapPin,
    LuSend,
    LuClock,
    LuArrowRight,
    LuMessageCircle,
    LuCheck,
    LuHeadphones,
    LuSparkles,
    LuUser,
    LuAtSign,
    LuPenLine,
    LuChevronDown,
    LuShield,
    LuZap,
} from "react-icons/lu";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL as API_URL } from "@/config/api";

const ContactPage = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [messageSent, setMessageSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // === Dynamic Content (Demo defaults — overridden by API/admin panel) ===
    const [content, setContent] = useState({
        hero: {
            badge: "Get In Touch",
            badgeBn: "যোগাযোগ করুন",
            title1: "Let's ",
            title1Bn: "আমাদের সাথে ",
            title2: "Connect",
            title2Bn: "কথা বলুন",
            subtitle: "Have questions or feedback? We're here to listen. Reach out through any channel below.",
            subtitleBn: "প্রশ্ন আছে? পরামর্শ চান? আমরা আপনার কথা শুনতে প্রস্তুত। যেকোনো মাধ্যমে যোগাযোগ করুন।",
        },
        contactInfo: {
            email: "demo@example.com",
            phone: "+880 1XXX-XXXXXX",
            address: "Your City, Country",
            addressBn: "আপনার শহর, দেশ",
            officeHours: "Sat - Thu: 10:00 AM - 6:00 PM",
            officeHoursBn: "শনি - বৃহঃ: সকাল ১০টা - সন্ধ্যা ৬টা",
        },
        socialLinks: {
            facebook: "#",
            youtube: "#",
            linkedin: "#",
            whatsapp: "#",
            instagram: "#",
        },
        whatsappSection: {
            title: "Instant Chat",
            titleBn: "তাৎক্ষণিক চ্যাট",
            description: "Chat with us on WhatsApp for the fastest response and instant answers.",
            descriptionBn: "WhatsApp এ আমাদের সাথে চ্যাট করুন — সবচেয়ে দ্রুত সাড়া পাবেন।",
            buttonText: "Start Chat",
            buttonTextBn: "চ্যাট শুরু করুন",
        },
        // Generic Bangladesh view as demo — replace with real office location from admin panel
        mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d465004.5!2d90.3!3d23.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1704532086149!5m2!1sen!2sbd",
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`${API_URL}/design/contact`);
                const data = await res.json();
                if (data.success && data.data?.contactContent) {
                    const incoming = data.data.contactContent;
                    setContent((prev) => ({
                        hero: { ...prev.hero, ...(incoming.hero || {}) },
                        contactInfo: { ...prev.contactInfo, ...(incoming.contactInfo || {}) },
                        socialLinks: { ...prev.socialLinks, ...(incoming.socialLinks || {}) },
                        whatsappSection: { ...prev.whatsappSection, ...(incoming.whatsappSection || {}) },
                        mapEmbedUrl: incoming.mapEmbedUrl || prev.mapEmbedUrl,
                    }));
                }
            } catch (error) {
                console.error("Error fetching contact content:", error);
            }
        };
        fetchContent();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setMessageSent(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 800);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // === Contact Info Cards ===
    const contactCards = [
        {
            icon: LuMail,
            title: language === "bn" ? "ইমেইল" : "Email",
            subtitle: language === "bn" ? "যেকোনো সময় লিখুন" : "Write anytime",
            value: content.contactInfo.email,
            link: `mailto:${content.contactInfo.email}`,
            color: "#7A85F0",
        },
        {
            icon: LuPhone,
            title: language === "bn" ? "ফোন" : "Phone",
            subtitle: language === "bn" ? "শনি - বৃহঃ" : "Sat - Thu",
            value: content.contactInfo.phone,
            link: `tel:${content.contactInfo.phone.replace(/\s/g, "")}`,
            color: "#10B981",
        },
        {
            icon: LuMapPin,
            title: language === "bn" ? "অফিস" : "Office",
            subtitle: language === "bn" ? "সরাসরি দেখা করুন" : "Visit in person",
            value: language === "bn" ? content.contactInfo.addressBn : content.contactInfo.address,
            link: "#map",
            color: "#F59E0B",
        },
        {
            icon: LuClock,
            title: language === "bn" ? "সময়" : "Hours",
            subtitle: language === "bn" ? "অফিস খোলা" : "Office open",
            value: language === "bn" ? content.contactInfo.officeHoursBn : content.contactInfo.officeHours,
            link: null,
            color: "#8B5CF6",
        },
    ];

    const socialLinks = [
        { icon: FaFacebookF, href: content.socialLinks.facebook, label: "Facebook", hoverBg: "hover:bg-[#1877F2]", color: "#1877F2" },
        { icon: FaYoutube, href: content.socialLinks.youtube, label: "YouTube", hoverBg: "hover:bg-[#FF0000]", color: "#FF0000" },
        { icon: FaLinkedinIn, href: content.socialLinks.linkedin, label: "LinkedIn", hoverBg: "hover:bg-[#0A66C2]", color: "#0A66C2" },
        { icon: FaInstagram, href: content.socialLinks.instagram, label: "Instagram", hoverBg: "hover:bg-[#E4405F]", color: "#E4405F" },
    ];

    // === Quick FAQ ===
    const quickFaqs = [
        {
            q: language === "bn" ? "উত্তর পেতে কতক্ষণ লাগে?" : "How fast do you respond?",
            a: language === "bn" ? "ইমেইলে সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই। WhatsApp এ ১ ঘণ্টার মধ্যে।" : "Email replies within 24 hours. WhatsApp messages within 1 hour during business hours.",
        },
        {
            q: language === "bn" ? "অফিসে দেখা করা যাবে?" : "Can I visit your office?",
            a: language === "bn" ? "অবশ্যই। তবে আগে appointment করে আসলে আমরা বেশি সময় দিতে পারব।" : "Absolutely. However, please book an appointment in advance so we can give you full attention.",
        },
        {
            q: language === "bn" ? "জরুরি সমস্যার জন্য কী করব?" : "What for urgent issues?",
            a: language === "bn" ? "WhatsApp এ মেসেজ করুন বা সরাসরি ফোন করুন — তাড়াতাড়ি সাড়া পাবেন।" : "Message us on WhatsApp or call directly — you'll get the fastest response.",
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-poppins antialiased">

            {/* ===== Success Modal ===== */}
            <AnimatePresence>
                {messageSent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setMessageSent(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-md bg-white dark:bg-[#111] rounded-3xl shadow-2xl p-8 text-center border border-gray-100 dark:border-white/10"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                className="w-20 h-20 bg-gradient-to-br from-[#7A85F0] to-[#5A65D0] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#7A85F0]/30"
                            >
                                <LuCheck className="text-white text-3xl" strokeWidth={3} />
                            </motion.div>
                            <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                                {language === "bn" ? "বার্তা পাঠানো হয়েছে!" : "Message Sent!"}
                            </h3>
                            <p className={`text-gray-500 dark:text-gray-400 text-sm mb-6 ${bengaliClass}`}>
                                {language === "bn" ? "আমরা ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।" : "We'll get back to you within 24 hours."}
                            </p>
                            <button
                                onClick={() => setMessageSent(false)}
                                className={`px-7 py-3 rounded-full bg-[#7A85F0] hover:bg-[#5A65D0] text-white font-semibold text-sm shadow-lg shadow-[#7A85F0]/25 transition-all ${bengaliClass}`}
                            >
                                {language === "bn" ? "বন্ধ করুন" : "Close"}
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ===== HERO ===== */}
            <section className="relative py-12 lg:py-16 bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7A85F0]/5 via-transparent to-[#7A85F0]/5"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(122,133,240,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(122,133,240,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#7A85F0]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#7A85F0]/[0.06] rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-4 lg:px-32 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-[#7A85F0]/20 rounded-full shadow-sm mb-4">
                            <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A85F0] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7A85F0]"></span>
                            </span>
                            <span className={`text-[10px] font-medium text-slate-600 dark:text-slate-300 ${bengaliClass}`}>
                                {language === "bn" ? content.hero.badgeBn : content.hero.badge}
                            </span>
                        </div>

                        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? content.hero.title1Bn : content.hero.title1}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A85F0] to-[#6B74E8]">
                                {language === "bn" ? content.hero.title2Bn : content.hero.title2}
                            </span>
                        </h1>

                        <p className={`text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed ${bengaliClass}`}>
                            {language === "bn" ? content.hero.subtitleBn : content.hero.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ===== Contact Cards ===== */}
            <section className="py-10 lg:py-12 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                        {contactCards.map((item, idx) => {
                            const CardWrapper = item.link ? "a" : "div";
                            const wrapperProps = item.link ? { href: item.link } : {};

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                >
                                    <CardWrapper
                                        {...wrapperProps}
                                        className={`group block bg-white dark:bg-[#111] rounded-2xl p-5 lg:p-6 border border-gray-100 dark:border-gray-800 hover:border-[#7A85F0]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7A85F0]/5 transition-all ${item.link ? "cursor-pointer" : ""}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                                style={{ backgroundColor: `${item.color}15` }}
                                            >
                                                <item.icon size={20} style={{ color: item.color }} />
                                            </div>
                                            {item.link && (
                                                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                                                    <LuArrowRight size={13} className="text-[#7A85F0]" />
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1 ${bengaliClass}`}>
                                            {item.subtitle}
                                        </p>
                                        <h3 className={`text-base font-bold text-gray-900 dark:text-white mb-1 ${bengaliClass}`}>
                                            {item.title}
                                        </h3>
                                        <p className={`text-xs text-gray-600 dark:text-gray-300 break-words ${bengaliClass}`}>
                                            {item.value}
                                        </p>
                                    </CardWrapper>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== Form + Map ===== */}
            <section className="py-14 lg:py-20 bg-slate-50 dark:bg-[#050505]">
                <div className="container mx-auto px-4 lg:px-32">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 max-w-7xl mx-auto">

                        {/* === Form (3 cols) === */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-3 bg-white dark:bg-[#111] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/30 dark:shadow-black/20"
                        >
                            <div className="flex items-center gap-3 mb-7">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A85F0] to-[#5A65D0] flex items-center justify-center shadow-md shadow-[#7A85F0]/25">
                                    <LuSend size={16} className="text-white" />
                                </div>
                                <div>
                                    <h2 className={`text-lg lg:text-xl font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                                        {language === "bn" ? "একটি বার্তা পাঠান" : "Send Us a Message"}
                                    </h2>
                                    <p className={`text-xs text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                                        {language === "bn" ? "২৪ ঘণ্টার মধ্যে উত্তর পাবেন" : "We reply within 24 hours"}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className={`flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 ${bengaliClass}`}>
                                            <LuUser size={12} className="text-[#7A85F0]" />
                                            {language === "bn" ? "আপনার নাম" : "Your Name"}
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#7A85F0]/30 focus:border-[#7A85F0] outline-none transition-all text-gray-800 dark:text-white text-sm placeholder-gray-400 ${bengaliClass}`}
                                            placeholder={language === "bn" ? "জন ডো" : "John Doe"}
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className={`flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 ${bengaliClass}`}>
                                            <LuAtSign size={12} className="text-[#7A85F0]" />
                                            {language === "bn" ? "ইমেইল" : "Email"}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#7A85F0]/30 focus:border-[#7A85F0] outline-none transition-all text-gray-800 dark:text-white text-sm placeholder-gray-400"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className={`flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 ${bengaliClass}`}>
                                        <LuPenLine size={12} className="text-[#7A85F0]" />
                                        {language === "bn" ? "বিষয়" : "Subject"}
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#7A85F0]/30 focus:border-[#7A85F0] outline-none transition-all text-gray-800 dark:text-white text-sm placeholder-gray-400 ${bengaliClass}`}
                                        placeholder={language === "bn" ? "আমরা কিভাবে সাহায্য করতে পারি?" : "How can we help?"}
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className={`flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 ${bengaliClass}`}>
                                        <LuMessageCircle size={12} className="text-[#7A85F0]" />
                                        {language === "bn" ? "বার্তা" : "Message"}
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#7A85F0]/30 focus:border-[#7A85F0] outline-none transition-all text-gray-800 dark:text-white text-sm placeholder-gray-400 resize-none ${bengaliClass}`}
                                        placeholder={language === "bn" ? "আপনার বার্তা লিখুন..." : "Tell us about your project or question..."}
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7A85F0] hover:bg-[#5A65D0] text-white font-bold text-sm rounded-full shadow-lg shadow-[#7A85F0]/25 hover:shadow-[#7A85F0]/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${bengaliClass}`}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            <span>{language === "bn" ? "পাঠানো হচ্ছে..." : "Sending..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <LuSend size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            <span>{language === "bn" ? "বার্তা পাঠান" : "Send Message"}</span>
                                            <LuArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {/* Trust line */}
                                <div className={`flex items-center justify-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                                    <LuShield size={12} className="text-green-500" />
                                    {language === "bn"
                                        ? "আপনার তথ্য নিরাপদ ও এনক্রিপ্টেড"
                                        : "Your information is secure and encrypted"}
                                </div>
                            </form>
                        </motion.div>

                        {/* === Right Side (2 cols) === */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="lg:col-span-2 space-y-5"
                        >
                            {/* WhatsApp Quick Card */}
                            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#25D366] via-[#1FB855] to-[#128C7E] p-6 text-white shadow-xl shadow-green-500/20">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <FaWhatsapp size={22} />
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-bold ${bengaliClass}`}>
                                                {language === "bn" ? content.whatsappSection.titleBn : content.whatsappSection.title}
                                            </h3>
                                            <p className={`text-white/80 text-[11px] ${bengaliClass}`}>
                                                {language === "bn" ? "১ ঘণ্টায় উত্তর" : "Reply in 1 hour"}
                                            </p>
                                        </div>
                                    </div>

                                    <p className={`text-white/85 text-xs mb-5 leading-relaxed ${bengaliClass}`}>
                                        {language === "bn" ? content.whatsappSection.descriptionBn : content.whatsappSection.description}
                                    </p>

                                    <a
                                        href={content.socialLinks.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#128C7E] font-bold text-xs rounded-full hover:shadow-2xl hover:-translate-y-0.5 transition-all ${bengaliClass}`}
                                    >
                                        <FaWhatsapp size={14} />
                                        {language === "bn" ? content.whatsappSection.buttonTextBn : content.whatsappSection.buttonText}
                                        <LuArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>

                            {/* Stats / Trust */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white dark:bg-[#111] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
                                    <div className="w-10 h-10 mx-auto rounded-xl bg-[#EEF0FD] flex items-center justify-center mb-2">
                                        <LuZap size={16} className="text-[#7A85F0]" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">&lt; 1h</p>
                                    <p className={`text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide ${bengaliClass}`}>
                                        {language === "bn" ? "গড় উত্তর" : "Avg Response"}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-[#111] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
                                    <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-2">
                                        <LuHeadphones size={16} className="text-amber-600" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">24/7</p>
                                    <p className={`text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide ${bengaliClass}`}>
                                        {language === "bn" ? "সাপোর্ট" : "Support"}
                                    </p>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-white dark:bg-[#111] rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                                <h3 className={`text-sm font-bold text-gray-900 dark:text-white mb-1 ${bengaliClass}`}>
                                    {language === "bn" ? "আমাদের ফলো করুন" : "Follow Us"}
                                </h3>
                                <p className={`text-[11px] text-gray-500 dark:text-gray-400 mb-4 ${bengaliClass}`}>
                                    {language === "bn" ? "সর্বশেষ আপডেট পেতে" : "Stay updated with latest news"}
                                </p>
                                <div className="flex gap-2">
                                    {socialLinks.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            href={item.href}
                                            target="_blank"
                                            className={`group w-10 h-10 bg-gray-50 dark:bg-white/5 ${item.hoverBg} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5`}
                                            aria-label={item.label}
                                            style={{ "--hover-color": item.color }}
                                        >
                                            <item.icon className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== MAP ===== */}
            <section id="map" className="py-14 lg:py-20 bg-white dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bengaliClass}`}>
                            {language === "bn" ? "অবস্থান" : "Location"}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>আমাদের <span className="text-[#7A85F0]">খুঁজে পাবেন</span></>
                            ) : (
                                <>Find Us <span className="text-[#7A85F0]">Here</span></>
                            )}
                        </h2>
                        <p className={`text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto ${bengaliClass}`}>
                            {language === "bn" ? "সরাসরি আমাদের অফিসে এসে দেখা করতে পারেন।" : "Drop by our office and meet the team in person."}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/40 dark:shadow-black/30 max-w-6xl mx-auto"
                    >
                        <iframe
                            src={content.mapEmbedUrl}
                            width="100%"
                            height="450"
                            className="border-0 grayscale-[20%]"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Office Location"
                        />

                        {/* Floating address card */}
                        <div className="absolute top-6 left-6 bg-white dark:bg-[#111] rounded-2xl p-4 lg:p-5 shadow-2xl border border-gray-100 dark:border-gray-800 max-w-xs hidden md:block">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A85F0] to-[#5A65D0] flex items-center justify-center shrink-0 shadow-md shadow-[#7A85F0]/30">
                                    <LuMapPin size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest text-[#7A85F0] mb-1 ${bengaliClass}`}>
                                        {language === "bn" ? "আমাদের অফিস" : "Our Office"}
                                    </p>
                                    <h4 className={`text-sm font-bold text-gray-900 dark:text-white mb-1 ${bengaliClass}`}>
                                        Techlight IT Institute
                                    </h4>
                                    <p className={`text-xs text-gray-500 dark:text-gray-400 leading-relaxed ${bengaliClass}`}>
                                        {language === "bn" ? content.contactInfo.addressBn : content.contactInfo.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== Quick FAQ ===== */}
            <section className="py-14 lg:py-20 bg-slate-50 dark:bg-[#050505]">
                <div className="container mx-auto px-4 lg:px-32">
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4 ${bengaliClass}`}>
                            {language === "bn" ? "প্রশ্নোত্তর" : "Quick FAQ"}
                        </span>
                        <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${bengaliClass}`}>
                            {language === "bn" ? (
                                <>সাধারণ <span className="text-[#7A85F0]">প্রশ্ন</span></>
                            ) : (
                                <>Common <span className="text-[#7A85F0]">Questions</span></>
                            )}
                        </h2>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-3">
                        {quickFaqs.map((faq, i) => {
                            const isOpen = openFaq === i;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`bg-white dark:bg-[#111] rounded-xl border transition-all overflow-hidden ${isOpen ? "border-[#7A85F0]/40 shadow-md shadow-[#7A85F0]/10" : "border-gray-100 dark:border-gray-800 hover:border-[#7A85F0]/20"}`}
                                >
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? -1 : i)}
                                        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                                    >
                                        <h3 className={`text-sm lg:text-base text-gray-800 dark:text-gray-100 ${bengaliClass}`} style={{ fontWeight: 600 }}>
                                            {faq.q}
                                        </h3>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? "bg-[#7A85F0] text-white rotate-180" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                                            <LuChevronDown size={14} />
                                        </div>
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-4">
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

                    <div className="text-center mt-8">
                        <Link href="/faq">
                            <button className={`inline-flex items-center gap-2 text-sm font-semibold text-[#7A85F0] hover:text-[#5A65D0] transition-colors ${bengaliClass}`}>
                                {language === "bn" ? "সব প্রশ্ন দেখুন" : "View All Questions"}
                                <LuArrowRight size={14} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default ContactPage;
