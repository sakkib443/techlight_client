'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuArrowLeft,
    LuArrowRight,
    LuClock,
    LuShare2,
    LuBookOpen,
    LuTag,
    LuEye,
    LuTwitter,
    LuFacebook,
    LuLinkedin,
    LuCopy,
    LuCheck,
    LuPlay,
    LuSparkles,
    LuCalendar,
    LuQuote,
} from 'react-icons/lu';
import { API_BASE_URL } from '@/config/api';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function SingleBlogPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;
    const { language } = useLanguage();
    const bengaliClass = language === 'bn' ? 'hind-siliguri' : '';

    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [readProgress, setReadProgress] = useState(0);

    // i18n
    const text = {
        min: language === 'bn' ? 'মিনিট পড়া' : 'min read',
        views: language === 'bn' ? 'ভিউ' : 'views',
        summary: language === 'bn' ? 'সারসংক্ষেপ' : 'Key Takeaway',
        videoTutorial: language === 'bn' ? 'ভিডিও টিউটোরিয়াল' : 'Video Tutorial',
        relatedPosts: language === 'bn' ? 'সম্পর্কিত পোস্ট' : 'Related reads',
        learnMore: language === 'bn' ? 'আরও পড়তে চান?' : 'Want more like this?',
        allBlogsHere: language === 'bn' ? 'আমাদের সব ব্লগ পোস্ট এক জায়গায়' : 'Discover more articles in our library',
        viewAllBlogs: language === 'bn' ? 'সব ব্লগ দেখুন' : 'Browse all',
        blogNotFound: language === 'bn' ? 'ব্লগ পাওয়া যায়নি' : 'Article not found',
        backToBlog: language === 'bn' ? 'ব্লগে ফিরে যান' : 'Back to blog',
        readingTime: language === 'bn' ? 'পড়ার সময়' : 'Reading time',
        share: language === 'bn' ? 'শেয়ার' : 'Share',
    };

    // Reading progress (article-body based)
    useEffect(() => {
        const handleScroll = () => {
            const article = document.getElementById('blog-content');
            if (!article) return;
            const rect = article.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            const scrolled = -rect.top;
            const progress = total > 0 ? (scrolled / total) * 100 : 0;
            setReadProgress(Math.min(100, Math.max(0, progress)));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [blog]);

    // Fetch blog
    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setBlog(data.data);
                    setRelatedBlogs(data.data.relatedBlogs || []);
                } else {
                    router.push('/blog');
                }
            } catch (error) {
                console.error('Failed to fetch blog:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug, router]);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = blog?.title || '';

    const handleShare = (platform) => {
        const urls = {
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        };
        if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success(language === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link copied!');
        setTimeout(() => setCopied(false), 2000);
        setShowShareMenu(false);
    };

    // === Loading ===
    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-3 border-[#7A85F0]/20 border-t-[#7A85F0] rounded-full"
                />
            </div>
        );
    }

    // === Not Found ===
    if (!blog) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#EEF0FD] dark:bg-[#7A85F0]/10 flex items-center justify-center">
                        <LuBookOpen className="text-[#7A85F0]" size={32} />
                    </div>
                    <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-3 ${bengaliClass}`}>
                        {text.blogNotFound}
                    </h2>
                    <Link
                        href="/blog"
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7A85F0] hover:bg-[#5A65D0] text-white font-semibold text-sm shadow-lg shadow-[#7A85F0]/25 transition-all ${bengaliClass}`}
                    >
                        <LuArrowLeft size={14} /> {text.backToBlog}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-gray-100 dark:bg-gray-900">
                <motion.div
                    style={{ width: `${readProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#7A85F0] to-[#5A65D0]"
                    transition={{ duration: 0.1 }}
                />
            </div>

            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-poppins antialiased">

                {/* ===== Article Header — Split Layout (Text Left + Image Right) ===== */}
                <header className="relative pt-10 pb-12 lg:pt-14 lg:pb-16 bg-slate-50 dark:bg-[#050505] overflow-hidden">
                    <div className="absolute top-10 right-10 w-72 h-72 bg-[#7A85F0]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-200/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="container mx-auto px-4 lg:px-32 relative z-10">
                        {/* Back link */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8"
                        >
                            <Link
                                href="/blog"
                                className={`group inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#7A85F0] dark:hover:text-[#7A85F0] transition-colors ${bengaliClass}`}
                            >
                                <LuArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="uppercase tracking-widest">{text.backToBlog}</span>
                            </Link>
                        </motion.div>

                        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

                            {/* Left — Heading & Meta */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="lg:col-span-7"
                            >
                                {blog.category && (
                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF0FD] dark:bg-[#7A85F0]/10 border border-[#7A85F0]/20 text-[#7A85F0] text-[11px] font-semibold uppercase tracking-widest mb-5 ${bengaliClass}`}>
                                        <LuSparkles size={11} />
                                        {blog.category.name}
                                    </span>
                                )}

                                <h1 className={`text-3xl md:text-4xl lg:text-[44px] font-bold text-gray-900 dark:text-white leading-[1.15] tracking-tight mb-5 ${bengaliClass}`}>
                                    {blog.title}
                                </h1>

                                <p className={`text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-7 max-w-xl ${bengaliClass}`}>
                                    {blog.excerpt}
                                </p>

                                {/* Meta strip */}
                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 pt-5 border-t border-gray-200 dark:border-white/10">
                                    <div className="inline-flex items-center gap-1.5">
                                        <LuCalendar size={12} className="text-[#7A85F0]" />
                                        <span className={bengaliClass}>
                                            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <div className="inline-flex items-center gap-1.5">
                                        <LuClock size={12} className="text-[#7A85F0]" />
                                        <span className={bengaliClass}>{blog.readingTime} {text.min}</span>
                                    </div>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <div className="inline-flex items-center gap-1.5">
                                        <LuEye size={12} className="text-[#7A85F0]" />
                                        <span>{(blog.totalViews || 0).toLocaleString()} {text.views}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right — Featured Image */}
                            {blog.thumbnail && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.15 }}
                                    className="lg:col-span-5 relative"
                                >
                                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/40 dark:shadow-black/40 border border-white/60 dark:border-white/10 group">
                                        <Image
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                    </div>

                                    {/* Floating reading time badge */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="absolute -bottom-4 -left-4 bg-white dark:bg-[#111] rounded-2xl px-4 py-2.5 shadow-xl border border-gray-100 dark:border-gray-800 z-10"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7A85F0] to-[#5A65D0] flex items-center justify-center">
                                                <LuClock size={14} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-0.5">
                                                    {text.readingTime}
                                                </p>
                                                <p className={`text-sm font-bold text-gray-900 dark:text-white leading-none ${bengaliClass}`}>
                                                    {blog.readingTime} {text.min}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Floating views badge */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="absolute -top-4 -right-4 bg-white dark:bg-[#111] rounded-2xl px-3 py-2 shadow-xl border border-gray-100 dark:border-gray-800 z-10"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                <LuEye size={12} className="text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                                                    {text.views}
                                                </p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5">
                                                    {(blog.totalViews || 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </header>

                {/* ===== Article Body ===== */}
                <div className="container mx-auto px-4 lg:px-32 pt-12 lg:pt-16 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* Main Article */}
                        <motion.article
                            id="blog-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-8 max-w-none"
                        >
                            {/* Key Takeaway */}
                            <div className="relative mb-10 p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-[#EEF0FD] to-white dark:from-[#7A85F0]/10 dark:to-[#111] border border-[#7A85F0]/20">
                                <LuQuote className="absolute top-5 right-5 text-[#7A85F0]/15" size={48} />
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-1 h-4 rounded-full bg-[#7A85F0]" />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest text-[#7A85F0] ${bengaliClass}`}>
                                        {text.summary}
                                    </span>
                                </div>
                                <p className={`text-base lg:text-lg text-gray-700 dark:text-gray-200 leading-relaxed ${bengaliClass}`}>
                                    {blog.excerpt}
                                </p>
                            </div>

                            {/* Article content */}
                            <div
                                className={`prose prose-lg max-w-none dark:prose-invert
                                    prose-headings:font-poppins prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tight prose-headings:font-bold
                                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-100 dark:prose-h2:border-gray-800
                                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                    prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-[1.8] prose-p:text-[15px]
                                    prose-a:text-[#7A85F0] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4
                                    prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                                    prose-ul:my-4 prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-li:my-1.5 prose-li:text-[15px] prose-li:leading-relaxed
                                    prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                                    prose-code:text-[#7A85F0] prose-code:font-semibold prose-code:bg-[#EEF0FD] dark:prose-code:bg-[#7A85F0]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:text-sm
                                    prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:border prose-pre:border-gray-800 prose-pre:shadow-xl prose-pre:p-5 prose-pre:text-sm
                                    prose-blockquote:border-l-4 prose-blockquote:border-[#7A85F0] prose-blockquote:bg-[#EEF0FD]/50 dark:prose-blockquote:bg-[#7A85F0]/5 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:font-medium ${bengaliClass}`}
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            {/* Video */}
                            {blog.videoUrl && (
                                <div className="mt-12 p-5 bg-gray-900 dark:bg-black rounded-3xl border border-gray-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7A85F0] to-[#5A65D0] flex items-center justify-center text-white">
                                            <LuPlay size={14} fill="currentColor" />
                                        </div>
                                        <h3 className={`text-white font-bold text-sm ${bengaliClass}`}>{text.videoTutorial}</h3>
                                    </div>
                                    <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                                        <iframe src={blog.videoUrl} className="w-full h-full" allowFullScreen />
                                    </div>
                                </div>
                            )}

                            {/* Tags + Share */}
                            <div className="mt-14 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                                    {/* Tags */}
                                    {blog.tags?.length > 0 && (
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                <LuTag size={11} className="text-[#7A85F0]" />
                                                <span className={bengaliClass}>{language === 'bn' ? 'ট্যাগ' : 'Tags'}</span>
                                            </div>
                                            {blog.tags.slice(0, 5).map((tag, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={`/blog?tag=${tag}`}
                                                    className={`px-2.5 py-1 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-[11px] font-medium hover:bg-[#EEF0FD] hover:text-[#7A85F0] hover:border-[#7A85F0]/30 transition-all ${bengaliClass}`}
                                                >
                                                    #{tag}
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Share */}
                                    <div className="relative shrink-0">
                                        <button
                                            onClick={() => setShowShareMenu(!showShareMenu)}
                                            className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#7A85F0]/30 hover:text-[#7A85F0] text-xs font-semibold transition-all ${bengaliClass}`}
                                        >
                                            <LuShare2 size={13} />
                                            {text.share}
                                        </button>
                                        <AnimatePresence>
                                            {showShareMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-2 py-2 bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 min-w-[170px] z-30"
                                                >
                                                    {[
                                                        { onClick: () => handleShare('twitter'), icon: LuTwitter, label: 'Twitter', color: 'text-sky-500' },
                                                        { onClick: () => handleShare('facebook'), icon: LuFacebook, label: 'Facebook', color: 'text-blue-600' },
                                                        { onClick: () => handleShare('linkedin'), icon: LuLinkedin, label: 'LinkedIn', color: 'text-blue-700' },
                                                    ].map((item, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={item.onClick}
                                                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-medium text-gray-700 dark:text-gray-300"
                                                        >
                                                            <item.icon className={item.color} size={14} /> {item.label}
                                                        </button>
                                                    ))}
                                                    <div className="my-1 mx-3 h-px bg-gray-100 dark:bg-gray-800" />
                                                    <button
                                                        onClick={copyLink}
                                                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-medium text-gray-700 dark:text-gray-300"
                                                    >
                                                        {copied ? <LuCheck className="text-green-500" size={14} /> : <LuCopy size={14} />}
                                                        {copied ? 'Copied!' : 'Copy link'}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-6">

                                {/* Related Posts */}
                                {relatedBlogs.length > 0 && (
                                    <div className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2.5 mb-5">
                                            <div className="w-8 h-8 rounded-lg bg-[#EEF0FD] dark:bg-[#7A85F0]/10 flex items-center justify-center">
                                                <LuBookOpen className="text-[#7A85F0]" size={14} />
                                            </div>
                                            <h3 className={`text-sm font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                                                {text.relatedPosts}
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            {relatedBlogs.slice(0, 4).map((related, i) => (
                                                <Link
                                                    key={related._id}
                                                    href={`/blog/${related.slug}`}
                                                    className="group flex gap-3 items-start"
                                                >
                                                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                                                        {related.thumbnail ? (
                                                            <Image
                                                                src={related.thumbnail}
                                                                alt={related.title}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-[#EEF0FD] flex items-center justify-center">
                                                                <LuBookOpen className="text-[#7A85F0]/40" size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A85F0]">
                                                            0{i + 1}
                                                        </span>
                                                        <h4 className={`text-[13px] font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#7A85F0] transition-colors leading-snug mt-0.5 ${bengaliClass}`}>
                                                            {related.title}
                                                        </h4>
                                                        <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-1.5">
                                                            <LuClock size={10} /> {related.readingTime} {text.min}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="relative overflow-hidden rounded-3xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#7A85F0] via-[#6B74E8] to-[#5A63D0]" />
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                                        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full" />
                                        <div className="absolute top-6 right-8 grid grid-cols-3 gap-2 opacity-15">
                                            {[...Array(9)].map((_, i) => (
                                                <div key={i} className="w-1 h-1 bg-white rounded-full" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative z-10 p-7 text-white">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-4">
                                            <LuSparkles size={11} />
                                            <span className={`text-[10px] font-semibold uppercase tracking-widest ${bengaliClass}`}>
                                                {text.learnMore}
                                            </span>
                                        </div>
                                        <h3 className={`text-xl font-bold mb-2 leading-tight ${bengaliClass}`}>
                                            {language === 'bn' ? 'আরো অসাধারণ আর্টিকেল' : 'More great reads await'}
                                        </h3>
                                        <p className={`text-white/80 text-xs mb-5 leading-relaxed ${bengaliClass}`}>
                                            {text.allBlogsHere}
                                        </p>
                                        <Link
                                            href="/blog"
                                            className={`group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#7A85F0] font-bold text-xs rounded-full shadow-lg hover:-translate-y-0.5 transition-all ${bengaliClass}`}
                                        >
                                            {text.viewAllBlogs}
                                            <LuArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
