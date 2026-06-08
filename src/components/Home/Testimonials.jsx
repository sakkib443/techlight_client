"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronLeft, LuChevronRight, LuStar, LuQuote, LuPenLine, LuX, LuCheck, LuUpload, LuUser } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

import { API_BASE_URL } from "@/config/api";
import toast from "react-hot-toast";

const COLORS = ['#E31E27', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

/* ── Avatar: image হলে দেখাও, fail/না থাকলে initial ── */
const Avatar = ({ src, name, initial, color }) => {
    const [imgError, setImgError] = useState(false);
    if (src && !imgError) {
        return (
            <img
                src={src}
                alt={name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                onError={() => setImgError(true)}
            />
        );
    }
    return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
            style={{ backgroundColor: color }}>
            {initial}
        </div>
    );
};

/* ── Single Testimonial Card ── */
const TestimonialCard = ({ card, bengaliClass }) => (
    <div className="bg-white dark:bg-[#141414] rounded-2xl p-7 shadow-lg shadow-gray-100/80 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 relative overflow-hidden flex flex-col h-full">
        <div className="absolute top-4 right-5 opacity-[0.05]">
            <LuQuote size={50} className="text-[#E31E27]" />
        </div>
        <div className="absolute top-0 left-0 w-full h-[3px]"
            style={{ background: `linear-gradient(90deg, ${card.color}40, ${card.color}10)` }} />
        <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                    <LuStar key={i} size={14}
                        className={i < card.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'} />
                ))}
            </div>
            <p className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1 ${bengaliClass}`}>
                &ldquo;{card.review}&rdquo;
            </p>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={card.userImage}
                            name={card.name}
                            initial={card.initial}
                            color={card.color}
                        />
                        <div>
                            <h4 className={`font-semibold text-gray-900 dark:text-white text-[13px] ${bengaliClass}`}>{card.name}</h4>
                            <p className={`text-gray-400 text-[11px] ${bengaliClass}`}>{card.designation}</p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#FEE2E2] text-[#E31E27] border border-[#E31E27]/10 whitespace-nowrap ${bengaliClass}`}>
                        {card.course}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

/* ── Add Testimonial Modal ── */
const AddTestimonialModal = ({ onClose, onSuccess, bengaliClass, language }) => {
    const [form, setForm] = useState({ name: '', designation: '', course: '', review: '', rating: 5 });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [hover, setHover] = useState(0);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error(language === 'bn' ? 'ছবির সাইজ সর্বোচ্চ ২MB হতে হবে' : 'Image size must be under 2MB');
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.review.trim().length < 20) {
            toast.error(language === 'bn' ? 'রিভিউ কমপক্ষে ২০ অক্ষর হতে হবে' : 'Review must be at least 20 characters');
            return;
        }
        setSubmitting(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('designation', form.designation);
            formData.append('course', form.course);
            formData.append('review', form.review);
            formData.append('rating', String(form.rating));
            if (imageFile) formData.append('userImage', imageFile);

            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_BASE_URL}/testimonials`, {
                method: 'POST',
                headers,
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                toast.success(language === 'bn' ? 'টেস্টিমোনিয়াল যোগ হয়েছে!' : 'Testimonial added successfully!');
                onSuccess();
                onClose();
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch {
            toast.error(language === 'bn' ? 'সার্ভার সমস্যা হয়েছে' : 'Server error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-[#111] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 z-10">

                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className={`text-lg font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                            {language === 'bn' ? 'আপনার অভিজ্ঞতা শেয়ার করুন' : 'Share Your Experience'}
                        </h3>
                        <p className={`text-xs text-gray-400 mt-0.5 ${bengaliClass}`}>
                            {language === 'bn' ? 'আপনার রিভিউ সবার দেখার জন্য প্রকাশিত হবে' : 'Your review will be visible to everyone'}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all">
                        <LuX size={15} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Photo Upload */}
                    <div>
                        <label className={`text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block ${bengaliClass}`}>
                            {language === 'bn' ? 'প্রোফাইল ছবি (ঐচ্ছিক)' : 'Profile Photo (Optional)'}
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <LuUser size={22} className="text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-[#E31E27] hover:bg-[#FEE2E2]/30 dark:hover:bg-[#E31E27]/10 transition-all text-xs text-gray-500 dark:text-gray-400">
                                    <LuUpload size={13} />
                                    <span className="truncate">{imageFile ? imageFile.name : (language === 'bn' ? 'ছবি বেছে নিন' : 'Choose photo')}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, WEBP — max 2MB</p>
                            </div>
                            {imagePreview && (
                                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all shrink-0">
                                    <LuX size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Rating Stars */}
                    <div>
                        <label className={`text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block ${bengaliClass}`}>
                            {language === 'bn' ? 'রেটিং দিন' : 'Your Rating'}
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} type="button"
                                    onClick={() => setForm(f => ({ ...f, rating: star }))}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}>
                                    <LuStar size={24}
                                        className={`transition-colors ${star <= (hover || form.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={`text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block ${bengaliClass}`}>
                                {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                            </label>
                            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder={language === 'bn' ? 'রাকিব হাসান' : 'John Doe'}
                                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white" />
                        </div>
                        <div>
                            <label className={`text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block ${bengaliClass}`}>
                                {language === 'bn' ? 'পদবী / পেশা *' : 'Designation *'}
                            </label>
                            <input required value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                                placeholder={language === 'bn' ? 'ওয়েব ডেভেলপার' : 'Web Developer'}
                                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white" />
                        </div>
                    </div>

                    <div>
                        <label className={`text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block ${bengaliClass}`}>
                            {language === 'bn' ? 'কোর্সের নাম *' : 'Course Name *'}
                        </label>
                        <input required value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
                            placeholder={language === 'bn' ? 'ওয়েব ডেভেলপমেন্ট' : 'Web Development'}
                            className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white" />
                    </div>

                    <div>
                        <label className={`text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block ${bengaliClass}`}>
                            {language === 'bn' ? 'আপনার অভিজ্ঞতা লিখুন *' : 'Your Review *'}
                        </label>
                        <textarea required rows={4} value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                            placeholder={language === 'bn' ? 'টেকলাইট আইটি-তে পড়ার অভিজ্ঞতা শেয়ার করুন...' : 'Share your learning experience at Techlight IT...'}
                            className={`w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white resize-none ${bengaliClass}`} />
                        <p className="text-[10px] text-gray-400 mt-1">{form.review.length}/1000</p>
                    </div>

                    <button type="submit" disabled={submitting}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#E31E27] hover:bg-[#C01920] text-white font-bold text-sm transition-all shadow-lg shadow-[#E31E27]/25 disabled:opacity-60 ${bengaliClass}`}>
                        {submitting ? (
                            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                {language === 'bn' ? 'যোগ হচ্ছে...' : 'Submitting...'}</>
                        ) : (
                            <><LuCheck size={15} /> {language === 'bn' ? 'টেস্টিমোনিয়াল জমা দিন' : 'Submit Testimonial'}</>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

/* ── Main Component ── */
const Testimonials = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startIndex, setStartIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const fetchTestimonials = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/testimonials`);
            const data = await res.json();
            if (data.success && data.data?.length > 0) {
                setTestimonials(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch testimonials');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

    const total = testimonials.length;
    const visibleCount = Math.min(3, total);

    const getVisibleCards = () => {
        if (total === 0) return [];
        return Array.from({ length: visibleCount }, (_, i) => testimonials[(startIndex + i) % total]);
    };

    const handleNext = useCallback(() => {
        if (total <= visibleCount) return;
        setDirection(1);
        setStartIndex(prev => (prev + 1) % total);
    }, [total, visibleCount]);

    const handlePrev = () => {
        if (total <= visibleCount) return;
        setDirection(-1);
        setStartIndex(prev => (prev - 1 + total) % total);
    };

    useEffect(() => {
        if (total <= visibleCount) return;
        const timer = setInterval(handleNext, 4000);
        return () => clearInterval(timer);
    }, [handleNext, total, visibleCount]);

    const isVisible = (i) => {
        for (let j = 0; j < visibleCount; j++) {
            if ((startIndex + j) % total === i) return true;
        }
        return false;
    };

    const handleAddClick = () => {
        setShowModal(true);
    };

    const visibleCards = getVisibleCards();

    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-[#0a0a0a] dark:to-[#111] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-32">

                {/* Header */}
                <motion.div className="text-center mb-14"
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#E31E27] bg-[#FEE2E2] border border-[#E31E27]/20 mb-4">
                        {language === 'bn' ? 'ছাত্রদের মতামত' : 'Student Reviews'}
                    </span>
                    <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-3 ${bengaliClass}`}>
                        {language === 'bn'
                            ? <>আমাদের শিক্ষার্থীরা কী <span className="text-[#E31E27]">বলছে</span></>
                            : <>What Our Students <span className="text-[#E31E27]">Say</span></>}
                    </h2>
                    <p className={`text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto mb-6 ${bengaliClass}`}>
                        {language === 'bn'
                            ? 'আমাদের সফল শিক্ষার্থীদের অভিজ্ঞতা থেকে জানুন কেন টেকলাইট সেরা।'
                            : 'Hear from our successful students about their learning experience at Techlight.'}
                    </p>

                    {/* Add Testimonial Button */}
                    <motion.button onClick={handleAddClick}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E31E27] hover:bg-[#C01920] text-white text-sm font-semibold shadow-lg shadow-[#E31E27]/25 transition-all ${bengaliClass}`}>
                        <LuPenLine size={15} />
                        {language === 'bn' ? 'আপনার অভিজ্ঞতা যোগ করুন' : 'Add Your Review'}
                    </motion.button>
                </motion.div>

                {/* Loading */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-56 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                        ))}
                    </div>
                ) : total === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">
                        {language === 'bn' ? 'এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!' : 'No reviews yet. Be the first to add one!'}
                    </div>
                ) : (
                    <>
                        {/* Cards */}
                        <div className="relative overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {visibleCards.map((card) => (
                                        <motion.div key={card._id || card.id} layout
                                            initial={{ x: direction > 0 ? 350 : -350, opacity: 0, scale: 0.85 }}
                                            animate={{ x: 0, opacity: 1, scale: 1 }}
                                            exit={{ x: direction > 0 ? -350 : 350, opacity: 0, scale: 0.85 }}
                                            transition={{
                                                x: { type: "spring", stiffness: 80, damping: 22, mass: 1.2 },
                                                opacity: { duration: 0.6 }, scale: { duration: 0.6 },
                                                layout: { type: "spring", stiffness: 80, damping: 22, mass: 1.2 },
                                            }}>
                                            <TestimonialCard card={card} bengaliClass={bengaliClass} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Controls */}
                        {total > visibleCount && (
                            <>
                                <div className="flex items-center justify-center gap-5 mt-10">
                                    <button onClick={handlePrev}
                                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-[#E31E27] hover:text-white hover:border-[#E31E27] transition-all shadow-sm">
                                        <LuChevronLeft size={18} />
                                    </button>
                                    <div className="flex items-center gap-1.5">
                                        {testimonials.map((_, i) => (
                                            <button key={i}
                                                onClick={() => { setDirection(i > startIndex ? 1 : -1); setStartIndex(i); }}
                                                className={`rounded-full transition-all duration-300 ${startIndex === i ? 'w-7 h-2 bg-[#E31E27]' : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'}`} />
                                        ))}
                                    </div>
                                    <button onClick={handleNext}
                                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-[#E31E27] hover:text-white hover:border-[#E31E27] transition-all shadow-sm">
                                        <LuChevronRight size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-center -space-x-1 mt-5">
                                    {testimonials.map((item, i) => (
                                        <div key={item._id || item.id}
                                            onClick={() => { setDirection(i > startIndex ? 1 : -1); setStartIndex(i); }}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-all duration-500 border-2 border-white dark:border-[#111] ${isVisible(i) ? 'scale-125 opacity-100 ring-2 ring-[#E31E27]/30 z-10' : 'opacity-30 hover:opacity-60 hover:scale-110'}`}
                                            style={{ backgroundColor: item.color || '#E31E27' }}>
                                            {item.initial}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <AddTestimonialModal
                        onClose={() => setShowModal(false)}
                        onSuccess={fetchTestimonials}
                        bengaliClass={bengaliClass}
                        language={language}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Testimonials;
