'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    LuClock,
    LuTrendingUp,
    LuBookOpen,
    LuArrowRight,
    LuChevronLeft,
    LuChevronRight,
    LuSearch,
    LuEye,
} from 'react-icons/lu';
import { API_BASE_URL } from '@/config/api';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogPage() {
    const { language } = useLanguage();
    const bengaliClass = language === 'bn' ? 'hind-siliguri' : '';
    const [blogs, setBlogs] = useState([]);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('popular');

    const text = {
        popular: language === 'bn' ? 'জনপ্রিয়' : 'Popular',
        recent: language === 'bn' ? 'সাম্প্রতিক' : 'Recent',
        noBlogsFound: language === 'bn' ? 'কোনো ব্লগ পাওয়া যায়নি' : 'No blogs found',
        comingSoon: language === 'bn' ? 'নতুন কন্টেন্ট শীঘ্রই আসছে!' : 'New content coming soon!',
        min: language === 'bn' ? 'মিনিট' : 'min',
        heroSubtitle: language === 'bn'
            ? 'প্রযুক্তি, ডিজাইন ও ক্যারিয়ার নিয়ে আমাদের সেরা আর্টিকেল পড়ুন'
            : 'Read our best articles about technology, design and career',
        readMore: language === 'bn' ? 'আরো পড়ুন' : 'Read More',
        allArticles: language === 'bn' ? 'সকল আর্টিকেল' : 'All Articles',
        searchPlaceholder: language === 'bn' ? 'ব্লগ খুঁজুন...' : 'Search articles...',
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/blogs?status=published&page=${currentPage}&limit=9`);
                const data = await res.json();
                if (data.success) {
                    setBlogs(data.data || []);
                    setTotalPages(data.meta?.totalPages || 1);
                }

                const featuredRes = await fetch(`${API_BASE_URL}/blogs/featured?limit=5`);
                const featuredData = await featuredRes.json();
                if (featuredData.success) setFeaturedBlogs(featuredData.data || []);

                const popularRes = await fetch(`${API_BASE_URL}/blogs/popular?limit=5`);
                const popularData = await popularRes.json();
                if (popularData.success) setPopularBlogs(popularData.data || []);
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [currentPage]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-3 border-[#7A85F0]/30 border-t-[#7A85F0] rounded-full"
                />
            </div>
        );
    }

    const featured = featuredBlogs[0] || blogs[0];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] font-poppins antialiased">

            {/* ── Hero ── */}
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
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#EEF0FD] border border-[#7A85F0]/20">
                            <LuBookOpen className="text-[#7A85F0]" size={14} />
                            <span className={`text-xs font-semibold text-[#7A85F0] uppercase tracking-wider ${bengaliClass}`}>
                                {language === 'bn' ? 'ব্লগ' : 'Blog'}
                            </span>
                        </div>

                        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight ${bengaliClass}`}>
                            {language === 'bn' ? 'জ্ঞান ও ' : 'Knowledge & '}
                            <span className="text-[#7A85F0]">{language === 'bn' ? 'অনুপ্রেরণা' : 'Inspiration'}</span>
                        </h1>

                        <p className={`text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto ${bengaliClass}`}>
                            {text.heroSubtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Main Content ── */}
            <div className="container mx-auto px-4 lg:px-32 py-8">

                {/* Featured + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                    {/* Featured Post */}
                    <div className="lg:col-span-2 h-full">
                        {featured ? (
                            <Link href={`/blog/${featured.slug}`} className="group block h-full">
                                <div className="bg-white dark:bg-[#111] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col hover:shadow-xl hover:shadow-[#7A85F0]/5 transition-all duration-300">
                                    <div className="relative h-[320px] lg:h-[350px] overflow-hidden">
                                        {featured.thumbnail ? (
                                            <Image
                                                src={featured.thumbnail}
                                                alt={featured.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#7A85F0]/20 via-[#7A85F0]/10 to-amber-500/10 flex items-center justify-center">
                                                <LuBookOpen className="text-[#7A85F0]/40" size={60} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[#7A85F0] text-white text-[10px] font-bold uppercase tracking-wide">
                                            {featured.category?.name || 'Featured'}
                                        </span>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h2 className={`text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2.5 leading-snug group-hover:text-[#7A85F0] transition-colors line-clamp-2 ${bengaliClass}`}>
                                            {featured.title}
                                        </h2>
                                        <p className={`text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1 ${bengaliClass}`}>
                                            {featured.excerpt || 'Read our latest featured article...'}
                                        </p>
                                        <div className="flex items-center gap-3 text-sm pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="w-8 h-8 rounded-full bg-[#7A85F0] flex items-center justify-center text-white text-xs font-bold">
                                                {featured.author?.firstName?.[0] || 'A'}
                                            </div>
                                            <span className={`font-medium text-gray-700 dark:text-gray-300 text-xs ${bengaliClass}`}>
                                                {featured.author?.firstName || 'Author'}
                                            </span>
                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                            <span className={`text-gray-400 text-xs ${bengaliClass}`}>
                                                {formatDate(featured.publishedAt || featured.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="h-full min-h-[400px] rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-3">
                                <div className="w-16 h-16 bg-[#EEF0FD] rounded-2xl flex items-center justify-center">
                                    <LuBookOpen className="text-[#7A85F0]" size={28} />
                                </div>
                                <p className={`text-sm text-gray-400 ${bengaliClass}`}>
                                    {language === 'bn' ? 'শীঘ্রই ফিচার্ড আর্টিকেল আসছে' : 'Featured article coming soon'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar — Popular / Recent */}
                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col">
                        {/* Tabs */}
                        <div className="flex gap-1.5 mb-5 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
                            {['popular', 'recent'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab
                                        ? 'bg-[#7A85F0] text-white shadow-md shadow-[#7A85F0]/20'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    {tab === 'popular' ? text.popular : text.recent}
                                </button>
                            ))}
                        </div>

                        {/* Posts list */}
                        <div className="flex-1 flex flex-col gap-1">
                            {(activeTab === 'popular' ? popularBlogs : blogs).length > 0 ? (
                                (activeTab === 'popular' ? popularBlogs : blogs).slice(0, 4).map((blog, index) => (
                                    <Link
                                        key={blog._id}
                                        href={`/blog/${blog.slug}`}
                                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-800">
                                            {blog.thumbnail ? (
                                                <Image
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#EEF0FD] dark:bg-[#7A85F0]/10 flex items-center justify-center">
                                                    <LuBookOpen className="text-[#7A85F0]/50" size={16} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 py-0.5">
                                            <h4 className={`font-semibold text-gray-800 dark:text-white text-xs leading-snug line-clamp-2 group-hover:text-[#7A85F0] transition-colors ${bengaliClass}`}>
                                                {blog.title}
                                            </h4>
                                            <p className={`text-[10px] text-gray-400 mt-1.5 ${bengaliClass}`}>
                                                {formatDate(blog.publishedAt || blog.createdAt)}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className={`text-xs text-gray-400 ${bengaliClass}`}>{text.comingSoon}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── All Articles Header ── */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-lg lg:text-xl font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                        {text.allArticles}
                    </h2>
                    <div className="h-px flex-1 mx-6 bg-gray-200 dark:bg-gray-800" />
                </div>

                {/* ── Blog Grid ── */}
                {blogs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800"
                    >
                        <div className="w-16 h-16 mx-auto mb-5 bg-[#EEF0FD] rounded-2xl flex items-center justify-center">
                            <LuBookOpen className="text-[#7A85F0]" size={28} />
                        </div>
                        <h3 className={`text-base font-bold text-gray-800 dark:text-white mb-2 ${bengaliClass}`}>{text.noBlogsFound}</h3>
                        <p className={`text-sm text-gray-400 ${bengaliClass}`}>{text.comingSoon}</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="group"
                            >
                                <Link href={`/blog/${blog.slug}`} className="block">
                                    <div className="bg-white dark:bg-[#111] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-[#7A85F0]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#7A85F0]/5 hover:-translate-y-1">
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            {blog.thumbnail ? (
                                                <Image
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#7A85F0]/10 via-[#7A85F0]/5 to-amber-500/5 flex items-center justify-center">
                                                    <LuBookOpen className="text-[#7A85F0]/30" size={36} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 dark:bg-black/60 backdrop-blur-sm text-[10px] font-bold text-gray-700 dark:text-white border border-white/20">
                                                {blog.category?.name || (language === 'bn' ? 'ব্লগ' : 'Blog')}
                                            </span>

                                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#7A85F0]/90 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                                                <LuClock size={10} />
                                                5 {text.min}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="flex items-center gap-2.5 mb-3">
                                                <div className="w-7 h-7 rounded-full bg-[#7A85F0] flex items-center justify-center text-white text-[10px] font-bold">
                                                    {blog.author?.firstName?.[0] || 'A'}
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-semibold text-gray-800 dark:text-white ${bengaliClass}`}>
                                                        {blog.author?.firstName || 'Author'}
                                                    </p>
                                                    <p className={`text-[10px] text-gray-400 ${bengaliClass}`}>
                                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            <h3 className={`text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#7A85F0] transition-colors line-clamp-2 mb-2 leading-snug ${bengaliClass}`}>
                                                {blog.title}
                                            </h3>

                                            <p className={`text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4 ${bengaliClass}`}>
                                                {blog.excerpt || 'Click to read more about this interesting topic...'}
                                            </p>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                                <span className={`text-xs font-semibold text-[#7A85F0] flex items-center gap-1.5 ${bengaliClass}`}>
                                                    {text.readMore}
                                                    <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={13} />
                                                </span>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <LuEye size={12} />
                                                    <span className="text-[10px] font-medium">{blog.views || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:bg-[#7A85F0] hover:border-[#7A85F0] hover:text-white transition-all"
                        >
                            <LuChevronLeft size={18} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${currentPage === page
                                    ? 'bg-[#7A85F0] text-white shadow-lg shadow-[#7A85F0]/25'
                                    : 'bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-[#7A85F0] hover:border-[#7A85F0] hover:text-white'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:bg-[#7A85F0] hover:border-[#7A85F0] hover:text-white transition-all"
                        >
                            <LuChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
