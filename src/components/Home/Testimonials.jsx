"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronLeft, LuChevronRight, LuStar, LuQuote } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

/* ── Single Testimonial Card ── */
const TestimonialCard = ({ card, bengaliClass }) => (
    <div className="bg-white dark:bg-[#141414] rounded-2xl p-7 shadow-lg shadow-gray-100/80 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 relative overflow-hidden flex flex-col h-full">
        {/* Quote watermark */}
        <div className="absolute top-4 right-5 opacity-[0.05]">
            <LuQuote size={50} className="text-[#7A85F0]" />
        </div>

        {/* Accent line */}
        <div
            className="absolute top-0 left-0 w-full h-[3px]"
            style={{ background: `linear-gradient(90deg, ${card.color}40, ${card.color}10)` }}
        />

        <div className="relative z-10 flex flex-col flex-1">
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                    <LuStar
                        key={i}
                        size={14}
                        className={i < card.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}
                    />
                ))}
            </div>

            {/* Review */}
            <p className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1 ${bengaliClass}`}>
                &ldquo;{card.review}&rdquo;
            </p>

            {/* Divider + User */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                            style={{ backgroundColor: card.color }}
                        >
                            {card.initial}
                        </div>
                        <div>
                            <h4 className={`font-semibold text-gray-900 dark:text-white text-[13px] ${bengaliClass}`}>
                                {card.name}
                            </h4>
                            <p className={`text-gray-400 text-[11px] ${bengaliClass}`}>
                                {card.designation}
                            </p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#EEF0FD] text-[#7A85F0] border border-[#7A85F0]/10 whitespace-nowrap ${bengaliClass}`}>
                        {card.course}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

/* ── Main Component ── */
const Testimonials = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [startIndex, setStartIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const testimonials = [
        {
            id: 1,
            review: language === 'bn'
                ? 'টেকলাইট আইটি ইনস্টিটিউট থেকে ওয়েব ডেভেলপমেন্ট কোর্স করার পর আমার ক্যারিয়ার সম্পূর্ণ বদলে গেছে। প্রতিটি ক্লাস ছিল হাতে-কলমে শেখানো।'
                : 'After completing the Web Development course from Techlight IT, my career changed completely. Every class was hands-on learning.',
            name: language === 'bn' ? 'রাকিব হাসান' : 'Rakib Hasan',
            designation: language === 'bn' ? 'জুনিয়র ডেভেলপার, ব্রেইন স্টেশন ২৩' : 'Junior Developer, Brain Station 23',
            course: language === 'bn' ? 'ওয়েব ডেভেলপমেন্ট' : 'Web Development',
            rating: 5, initial: 'R', color: '#7A85F0',
        },
        {
            id: 2,
            review: language === 'bn'
                ? 'গ্রাফিক ডিজাইন কোর্সটি আমার জন্য গেম চেঞ্জার ছিল। ইন্সট্রাক্টররা অত্যন্ত সহায়ক এবং কারিকুলাম ইন্ডাস্ট্রি স্ট্যান্ডার্ড মেনে তৈরি।'
                : 'The Graphic Design course was a game changer for me. Instructors were extremely helpful and the curriculum follows industry standards.',
            name: language === 'bn' ? 'ফাতেমা আক্তার' : 'Fatema Akter',
            designation: language === 'bn' ? 'ইউআই ডিজাইনার, ফ্রিল্যান্সার' : 'UI Designer, Freelancer',
            course: language === 'bn' ? 'গ্রাফিক ডিজাইন' : 'Graphic Design',
            rating: 5, initial: 'F', color: '#F59E0B',
        },
        {
            id: 3,
            review: language === 'bn'
                ? 'ডিজিটাল মার্কেটিং কোর্সের পর আমি নিজে ৩টি ক্লায়েন্টের কাজ পেয়েছি। রিয়েল প্রজেক্টে কাজ করার সুযোগ সবচেয়ে ভালো দিক।'
                : 'After the Digital Marketing course, I landed 3 clients on my own. Working on real projects was the best part of this course.',
            name: language === 'bn' ? 'আরিফ রহমান' : 'Arif Rahman',
            designation: language === 'bn' ? 'ডিজিটাল মার্কেটার, স্বনিয়োজিত' : 'Digital Marketer, Self-employed',
            course: language === 'bn' ? 'ডিজিটাল মার্কেটিং' : 'Digital Marketing',
            rating: 5, initial: 'A', color: '#10B981',
        },
        {
            id: 4,
            review: language === 'bn'
                ? 'টেকলাইটের সাপোর্ট অসাধারণ। কোর্স শেষ হওয়ার পরেও জব প্লেসমেন্টে সাহায্য করেছে। লাইফটাইম সাপোর্টের প্রমিজটা তারা সত্যিই রাখে!'
                : 'Techlight\'s support is amazing. They helped with job placement even after the course. They truly keep their lifetime support promise!',
            name: language === 'bn' ? 'নুসরাত জাহান' : 'Nusrat Jahan',
            designation: language === 'bn' ? 'ফ্রন্টেন্ড ডেভেলপার, টেকনোভা' : 'Frontend Developer, Technova',
            course: 'MERN Stack',
            rating: 5, initial: 'N', color: '#EF4444',
        },
        {
            id: 5,
            review: language === 'bn'
                ? 'ইউটিউব থেকে শিখতাম আগে, কিন্তু স্ট্রাকচার্ড কোর্স করার পর বুঝলাম পার্থক্যটা কত বেশি। টেকলাইটের কোর্স প্রফেশনাল লেভেলের।'
                : 'I used to learn from YouTube, but after a structured course I realized the huge difference. Techlight courses are truly professional.',
            name: language === 'bn' ? 'তানভীর আহমেদ' : 'Tanvir Ahmed',
            designation: language === 'bn' ? 'ব্যাকেন্ড ডেভেলপার' : 'Backend Developer',
            course: language === 'bn' ? 'পাইথন প্রোগ্রামিং' : 'Python Programming',
            rating: 4, initial: 'T', color: '#8B5CF6',
        },
        {
            id: 6,
            review: language === 'bn'
                ? 'সার্টিফিকেট পাওয়ার পর ফ্রিল্যান্সিং প্রোফাইলে ক্লায়েন্ট রিকোয়েস্ট দ্বিগুণ হয়ে গেছে। টেকলাইটের সার্টিফিকেট সত্যিই ভ্যালু আছে।'
                : 'After getting the certificate, my freelancing profile saw double the client requests. Techlight certificates truly have market value.',
            name: language === 'bn' ? 'শারমিন সুলতানা' : 'Sharmin Sultana',
            designation: language === 'bn' ? 'গ্রাফিক ডিজাইনার, ফাইভার' : 'Graphic Designer, Fiverr',
            course: language === 'bn' ? 'মোশন গ্রাফিক্স' : 'Motion Graphics',
            rating: 5, initial: 'S', color: '#EC4899',
        },
    ];

    const total = testimonials.length;
    const visibleCount = 3;

    const getVisibleCards = () => {
        const cards = [];
        for (let i = 0; i < visibleCount; i++) {
            cards.push(testimonials[(startIndex + i) % total]);
        }
        return cards;
    };

    const handleNext = useCallback(() => {
        setDirection(1);
        setStartIndex((prev) => (prev + 1) % total);
    }, [total]);

    const handlePrev = () => {
        setDirection(-1);
        setStartIndex((prev) => (prev - 1 + total) % total);
    };

    useEffect(() => {
        const timer = setInterval(handleNext, 3000);
        return () => clearInterval(timer);
    }, [handleNext]);

    const visibleCards = getVisibleCards();

    const isVisible = (i) => {
        for (let j = 0; j < visibleCount; j++) {
            if ((startIndex + j) % total === i) return true;
        }
        return false;
    };

    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-[#0a0a0a] dark:to-[#111] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-32">

                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4">
                        {language === 'bn' ? 'ছাত্রদের মতামত' : 'Student Reviews'}
                    </span>
                    <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-3 ${bengaliClass}`}>
                        {language === 'bn'
                            ? <>আমাদের শিক্ষার্থীরা কী <span className="text-[#7A85F0]">বলছে</span></>
                            : <>What Our Students <span className="text-[#7A85F0]">Say</span></>
                        }
                    </h2>
                    <p className={`text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto ${bengaliClass}`}>
                        {language === 'bn'
                            ? 'আমাদের সফল শিক্ষার্থীদের অভিজ্ঞতা থেকে জানুন কেন টেকলাইট সেরা।'
                            : 'Hear from our successful students about their learning experience at Techlight.'}
                    </p>
                </motion.div>

                {/* ── Conveyor Belt Cards ── */}
                <div className="relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AnimatePresence initial={false} mode="popLayout">
                            {visibleCards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    layout
                                    initial={{
                                        x: direction > 0 ? 350 : -350,
                                        opacity: 0,
                                        scale: 0.85,
                                    }}
                                    animate={{
                                        x: 0,
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    exit={{
                                        x: direction > 0 ? -350 : 350,
                                        opacity: 0,
                                        scale: 0.85,
                                    }}
                                    transition={{
                                        x: { type: "spring", stiffness: 80, damping: 22, mass: 1.2 },
                                        opacity: { duration: 0.6, ease: "easeInOut" },
                                        scale: { duration: 0.6, ease: "easeInOut" },
                                        layout: { type: "spring", stiffness: 80, damping: 22, mass: 1.2 },
                                    }}
                                >
                                    <TestimonialCard card={card} bengaliClass={bengaliClass} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-5 mt-10">
                    <button
                        onClick={handlePrev}
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-[#7A85F0] hover:text-white hover:border-[#7A85F0] transition-all shadow-sm"
                    >
                        <LuChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1.5">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setDirection(i > startIndex ? 1 : -1);
                                    setStartIndex(i);
                                }}
                                className={`rounded-full transition-all duration-300 ${startIndex === i
                                    ? 'w-7 h-2 bg-[#7A85F0]'
                                    : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-[#7A85F0] hover:text-white hover:border-[#7A85F0] transition-all shadow-sm"
                    >
                        <LuChevronRight size={18} />
                    </button>
                </div>

                {/* Avatar row */}
                <div className="flex items-center justify-center -space-x-1 mt-5">
                    {testimonials.map((item, i) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                setDirection(i > startIndex ? 1 : -1);
                                setStartIndex(i);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-all duration-500 border-2 border-white dark:border-[#111] ${isVisible(i)
                                ? 'scale-125 opacity-100 ring-2 ring-[#7A85F0]/30 z-10'
                                : 'opacity-30 hover:opacity-60 hover:scale-110'
                                }`}
                            style={{ backgroundColor: item.color }}
                        >
                            {item.initial}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
