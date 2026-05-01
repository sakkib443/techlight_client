"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuMail, LuArrowRight, LuSparkles, LuCircleCheck } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const Newsletter = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubmitted(true);
            setEmail("");
            setTimeout(() => setSubmitted(false), 4000);
        }
    };

    return (
        <section className="py-14 lg:py-16 bg-white dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-4 lg:px-32">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#7A85F0]/[0.06] via-white to-amber-50/30 dark:from-[#7A85F0]/[0.08] dark:via-[#0d0d0d] dark:to-[#0d0d0d] border border-gray-100 dark:border-gray-800"
                >
                    {/* Decorative elements */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#7A85F0]/[0.06] rounded-full blur-2xl" />
                        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-400/[0.06] rounded-full blur-2xl" />
                        <div className="absolute top-8 right-12 grid grid-cols-4 gap-2.5 opacity-[0.08]">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-[#7A85F0] rounded-full" />
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 px-8 py-14 lg:px-16 lg:py-16">
                        <div className="max-w-2xl mx-auto text-center">
                            {/* Icon */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EEF0FD] border border-[#7A85F0]/15 mb-6"
                            >
                                <LuMail size={24} className="text-[#7A85F0]" />
                            </motion.div>

                            {/* Heading */}
                            <motion.h2
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className={`text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 ${bengaliClass}`}
                            >
                                {language === 'bn'
                                    ? <>আমাদের <span className="text-[#7A85F0]">নিউজলেটার</span> সাবস্ক্রাইব করুন</>
                                    : <>Subscribe to Our <span className="text-[#7A85F0]">Newsletter</span></>
                                }
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className={`text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-md mx-auto ${bengaliClass}`}
                            >
                                {language === 'bn'
                                    ? 'নতুন কোর্স, অফার এবং টিপস সরাসরি আপনার ইনবক্সে পান।'
                                    : 'Get the latest courses, exclusive offers, and learning tips delivered to your inbox.'}
                            </motion.p>

                            {/* Form */}
                            <motion.form
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
                            >
                                <div className="relative flex-1 w-full">
                                    <LuMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={language === 'bn' ? 'আপনার ইমেইল দিন...' : 'Enter your email...'}
                                        required
                                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#7A85F0] focus:ring-2 focus:ring-[#7A85F0]/10 transition-all ${bengaliClass}`}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitted}
                                    className={`group w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#7A85F0]/20 hover:shadow-[#7A85F0]/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed ${
                                        submitted
                                            ? 'bg-emerald-500'
                                            : 'bg-[#7A85F0] hover:bg-[#6B74E8]'
                                    } ${bengaliClass}`}
                                >
                                    {submitted ? (
                                        <>
                                            <LuCircleCheck size={16} />
                                            {language === 'bn' ? 'সাবস্ক্রাইব হয়েছে!' : 'Subscribed!'}
                                        </>
                                    ) : (
                                        <>
                                            {language === 'bn' ? 'সাবস্ক্রাইব' : 'Subscribe'}
                                            <LuArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>

                            {/* Trust line */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7 }}
                                className="flex items-center justify-center gap-4 mt-6 text-[11px] text-gray-400"
                            >
                                <span className="flex items-center gap-1">
                                    <LuSparkles size={12} className="text-[#7A85F0]" />
                                    {language === 'bn' ? 'স্প্যাম নেই' : 'No spam'}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                                <span>{language === 'bn' ? 'যেকোনো সময় আনসাবস্ক্রাইব' : 'Unsubscribe anytime'}</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
