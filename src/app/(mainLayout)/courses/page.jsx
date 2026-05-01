"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoursesData } from "@/redux/CourseSlice";
import { fetchCategories, setSelectedCategories } from "@/redux/categorySlice";
import CourseCard from "@/components/sheard/CourseCard";
import { HiOutlineSparkles } from "react-icons/hi2";
import {
  LuBookOpen, LuUsers, LuSearch, LuX, LuArrowUpDown,
  LuGrid3X3, LuLayoutGrid, LuStar, LuArrowRight, LuSparkles, LuChevronDown
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-3 border-[#7A85F0]/30 border-t-[#7A85F0] rounded-full animate-spin" />
  </div>
);

const CourseCardSkeleton = () => (
  <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-pulse">
    <div className="aspect-[16/10] bg-slate-100 dark:bg-white/5" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-slate-100 dark:bg-white/5 rounded w-3/4" />
      <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/2" />
      <div className="h-8 bg-slate-100 dark:bg-white/5 rounded w-1/3" />
    </div>
  </div>
);

const CourseContent = () => {
  const dispatch = useDispatch();
  const { courses = [], loading } = useSelector((state) => state.courses || {});
  const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    setIsVisible(true);
    dispatch(fetchCoursesData());
    dispatch(fetchCategories());
  }, [dispatch]);

  const courseTypes = [
    { name: 'All', label: language === 'bn' ? 'সব' : 'All' },
    { name: 'Online', label: language === 'bn' ? 'অনলাইন' : 'Online' },
    { name: 'Offline', label: language === 'bn' ? 'অফলাইন' : 'Offline' },
    { name: 'Recorded', label: language === 'bn' ? 'রেকর্ডেড' : 'Recorded' }
  ];

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "";
    if (typeof categoryId === "object" && categoryId.name) return categoryId.name;
    if (typeof categoryId === "string" && categoryId.length < 20) return categoryId;
    const category = categories.find(cat => cat._id === categoryId || cat.id === categoryId);
    return category?.name || "";
  };

  const filteredCourses = courses.filter((course) => {
    if (!course) return false;
    const rawType = course?.courseType || course?.type || course?.mode || "";
    const cType = rawType.toString().toLowerCase();
    const sType = (selectedType || "All").toLowerCase();
    const typeMatch = sType === "all" || cType === sType;

    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      const courseCategoryName = getCategoryName(course.category);
      categoryMatch = selectedCategories.includes(courseCategoryName);
    }

    const q = (searchQuery || "").trim().toLowerCase();
    const searchMatch =
      q === "" ||
      (course.title && course.title.toLowerCase().includes(q)) ||
      (course.technology && course.technology.toLowerCase().includes(q)) ||
      getCategoryName(course.category).toLowerCase().includes(q);

    return typeMatch && categoryMatch && searchMatch;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aPrice = a.price || (parseInt(a.fee?.replace(/[^\d]/g, '') || 0));
    const bPrice = b.price || (parseInt(b.fee?.replace(/[^\d]/g, '') || 0));
    const aRating = a.averageRating || a.rating || 5;
    const bRating = b.averageRating || b.rating || 5;
    const aStudents = a.totalEnrollments || a.totalStudentsEnroll || 0;
    const bStudents = b.totalEnrollments || b.totalStudentsEnroll || 0;

    switch (sortBy) {
      case "rating": return bRating - aRating;
      case "price-low": return aPrice - bPrice;
      case "price-high": return bPrice - aPrice;
      case "students": return bStudents - aStudents;
      default: return 0;
    }
  });

  const handleCategoryChange = (categoryName) => {
    const newSelection = categoryName === "" ? [] : [categoryName];
    dispatch(setSelectedCategories(newSelection));
  };

  const clearAllFilters = () => {
    dispatch(setSelectedCategories([]));
    setSearchQuery("");
    setSelectedType("All");
    setSortBy("default");
  };

  const hasActiveFilters = selectedCategories.length > 0 || searchQuery || selectedType !== "All";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Hero Section with Floating Elements */}
      <section className="relative py-12 lg:py-16 bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7A85F0]/5 via-transparent to-[#7A85F0]/5"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(230,45,38,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(230,45,38,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#7A85F0]/15 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 3, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#7A85F0]/15 to-transparent rounded-full blur-3xl"
        />

        {/* Professional Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top-left: Glass card with icon */}
          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-[8%] hidden lg:block"
          >
            <div className="w-12 h-12 bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-lg shadow-black/5 flex items-center justify-center border border-white/60 dark:border-white/20">
              <LuBookOpen className="text-[#7A85F0]" size={20} />
            </div>
          </motion.div>

          {/* Top-right: Users icon */}
          <motion.div
            animate={{ y: [-6, 10, -6], x: [-3, 3, -3] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
            className="absolute top-24 right-[10%] hidden lg:block"
          >
            <div className="w-13 h-13 bg-gradient-to-br from-[#7A85F0] to-[#6470E0] backdrop-blur-md rounded-2xl shadow-lg shadow-[#7A85F0]/25 flex items-center justify-center rotate-6">
              <LuUsers className="text-white" size={20} />
            </div>
          </motion.div>

          {/* Bottom-left: Code icon */}
          <motion.div
            animate={{ y: [-5, 12, -5], rotate: [1, -1, 1] }}
            transition={{ duration: 8, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
            className="absolute bottom-20 left-[12%] hidden lg:block"
          >
            <div className="w-11 h-11 bg-slate-900/85 backdrop-blur-md rounded-xl shadow-lg shadow-black/10 border border-slate-700/50 flex items-center justify-center">
              <LuSparkles className="text-emerald-400" size={18} />
            </div>
          </motion.div>

          {/* Bottom-right: Star icon */}
          <motion.div
            animate={{ y: [-10, 6, -10], x: [2, -2, 2] }}
            transition={{ duration: 7, repeat: Infinity, delay: 2, ease: "easeInOut" }}
            className="absolute bottom-28 right-[7%] hidden lg:block"
          >
            <div className="w-11 h-11 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-lg shadow-black/5 border border-white/60 dark:border-white/20 flex items-center justify-center">
              <LuStar className="text-amber-500 fill-amber-500" size={18} />
            </div>
          </motion.div>

          {/* Subtle floating dots */}
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/2 left-8 w-1.5 h-1.5 bg-[#7A85F0]/50 rounded-full hidden lg:block" />
          <motion.div animate={{ opacity: [0.6, 0.3, 0.6] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute top-1/3 left-14 w-1 h-1 bg-[#7A85F0]/40 rounded-full hidden lg:block" />
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4.5, repeat: Infinity, delay: 2 }} className="absolute bottom-1/3 right-10 w-1.5 h-1.5 bg-[#7A85F0]/50 rounded-full hidden lg:block" />
          <motion.div animate={{ opacity: [0.5, 0.2, 0.5] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }} className="absolute bottom-1/2 right-20 w-1 h-1 bg-[#7A85F0]/40 rounded-full hidden lg:block" />
        </div>

        <div className="container mx-auto px-4 lg:px-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-[#7A85F0]/20 rounded-full shadow-sm mb-4">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A85F0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7A85F0]"></span>
              </span>
              <span className={`text-[10px] font-medium text-slate-600 dark:text-slate-300 ${bengaliClass}`}>
                {language === "bn" ? "প্রিমিয়াম কোর্স" : "Premium Courses"}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 outfit leading-tight ${bengaliClass}`}>
              {language === "bn" ? "আমাদের " : "Discover Our "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A85F0] to-[#7A85F0]">
                  {language === "bn" ? "প্রিমিয়াম কোর্স" : "Premium Courses"}
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C47.6667 2.16667 141 -1.8 199 5.5" stroke="#7A85F0" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className={`text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed mb-6 ${bengaliClass}`}>
              {language === "bn"
                ? "ইন্ডাস্ট্রি এক্সপার্টদের কাছ থেকে শিখুন এবং আপনার ক্যারিয়ার ট্রান্সফর্ম করুন।"
                : "Learn from industry experts and transform your career with our comprehensive course catalog."}
            </p>

            {/* Stats Cards */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#7A85F0]/30 transition-all duration-300">
                <div className="w-9 h-9 bg-gradient-to-br from-[#7A85F0]/10 to-[#7A85F0]/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LuBookOpen className="text-[#7A85F0] text-base" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-800 dark:text-white outfit">{courses.length || '20'}+</p>
                  <p className={`text-[10px] text-slate-500 dark:text-slate-400 ${bengaliClass}`}>{language === 'bn' ? 'কোর্স' : 'Courses'}</p>
                </div>
              </div>

              <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#7A85F0]/30 transition-all duration-300">
                <div className="w-9 h-9 bg-gradient-to-br from-[#7A85F0]/10 to-[#7A85F0]/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiOutlineSparkles className="text-[#7A85F0] text-base" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-800 dark:text-white outfit">10+</p>
                  <p className={`text-[10px] text-slate-500 dark:text-slate-400 ${bengaliClass}`}>{language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</p>
                </div>
              </div>

              <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LuUsers className="text-emerald-500 text-base" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-800 dark:text-white outfit">5K+</p>
                  <p className={`text-[10px] text-slate-500 dark:text-slate-400 ${bengaliClass}`}>{language === 'bn' ? 'শিক্ষার্থী' : 'Students'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Filters Row ── */}
      <section className="py-4 bg-white dark:bg-[#0a0a0a] border-b border-slate-100 dark:border-white/5">
        <div className="container mx-auto px-4 lg:px-32">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left — Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Type Dropdown */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`appearance-none pl-3.5 pr-8 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[12px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#7A85F0] cursor-pointer transition-colors ${bengaliClass}`}
                >
                  {courseTypes.map((type) => (
                    <option key={type.name} value={type.name}>{language === 'bn' ? 'টাইপ: ' : 'Type: '}{type.label}</option>
                  ))}
                </select>
                <LuChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategories[0] || ""}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={`appearance-none pl-3.5 pr-8 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[12px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#7A85F0] cursor-pointer transition-colors ${bengaliClass}`}
                >
                  <option value="">{language === 'bn' ? 'ক্যাটাগরি: সব' : 'Category: All'}</option>
                  {categories
                    .filter(cat => cat.name.toLowerCase() !== 'all')
                    .map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
                <LuChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <LuArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`appearance-none pl-9 pr-8 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[12px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#7A85F0] cursor-pointer transition-colors ${bengaliClass}`}
                >
                  <option value="default">{language === 'bn' ? 'সর্ট করুন' : 'Sort By'}</option>
                  <option value="rating">{language === 'bn' ? 'টপ রেটেড' : 'Top Rated'}</option>
                  <option value="students">{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</option>
                  <option value="price-low">{language === 'bn' ? 'কম দাম' : 'Price: Low'}</option>
                  <option value="price-high">{language === 'bn' ? 'বেশি দাম' : 'Price: High'}</option>
                </select>
                <LuChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 transition-all ${bengaliClass}`}
                >
                  <LuX size={13} />
                  {language === "bn" ? "ক্লিয়ার" : "Clear"}
                </button>
              )}
            </div>

            {/* Right — Search + Count + View */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#7A85F0]/10 rounded-lg flex items-center justify-center pointer-events-none">
                  <LuSearch className="text-[#7A85F0]" size={13} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === "bn" ? "কোর্স খুঁজুন..." : "Search courses..."}
                  className={`w-48 lg:w-56 pl-12 pr-8 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#7A85F0]/30 focus:border-[#7A85F0] focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-slate-800 dark:text-white text-[12px] placeholder-slate-400 ${bengaliClass}`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <LuX size={13} />
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-slate-200 dark:bg-white/10" />

              {/* Count */}
              <span className={`text-[12px] text-slate-500 whitespace-nowrap ${bengaliClass}`}>
                <span className="font-bold text-[#7A85F0]">{sortedCourses.length}</span>
                {language === "bn" ? " টি কোর্স" : " courses"}
              </span>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-white/10 text-[#7A85F0] shadow-sm" : "text-slate-400"}`}
                >
                  <LuGrid3X3 size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-white/10 text-[#7A85F0] shadow-sm" : "text-slate-400"}`}
                >
                  <LuLayoutGrid size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses Grid ── */}
      <section className="py-10 lg:py-14 bg-slate-50 dark:bg-[#0d0d0d]">
        <div className="container mx-auto px-4 lg:px-32">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {[1, 2, 3, 4, 5, 6].map((i) => <CourseCardSkeleton key={i} />)}
              </motion.div>
            ) : sortedCourses.length > 0 ? (
              <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {sortedCourses.map((course, index) => (
                  <motion.div key={course?._id || course?.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}>
                    <CourseCard course={course} view={viewMode === 'grid' ? 'grid' : 'list'} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20">
                <div className="w-16 h-16 bg-[#EEF0FD] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LuSearch className="text-[#7A85F0]" size={28} />
                </div>
                <h3 className={`text-base font-bold text-slate-800 dark:text-white mb-2 ${bengaliClass}`}>
                  {language === "bn" ? "কোন কোর্স পাওয়া যায়নি" : "No courses found"}
                </h3>
                <p className={`text-xs text-slate-500 ${bengaliClass}`}>
                  {language === "bn" ? "অন্য কিওয়ার্ড দিয়ে খুঁজুন" : "Try a different search keyword"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 lg:py-14 bg-gradient-to-br from-[#7A85F0] to-[#5A63D0]">
        <div className="container mx-auto px-4 lg:px-32">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-full mb-3">
              <LuSparkles className="text-white" size={10} />
              <span className={`text-[10px] font-medium text-white ${bengaliClass}`}>
                {language === "bn" ? "প্রাইভেট টিউশন" : "Private Tutoring"}
              </span>
            </div>
            <h2 className={`text-lg lg:text-xl font-bold text-white mb-2 ${bengaliClass}`}>
              {language === "bn" ? "১-অন-১ মেন্টরশিপ দরকার?" : "Need 1-on-1 Mentorship?"}
            </h2>
            <p className={`text-white/80 text-xs mb-5 ${bengaliClass}`}>
              {language === "bn" ? "আমাদের এক্সপার্ট মেন্টরদের সাথে প্রাইভেট সেশন বুক করুন।" : "Book private sessions with our expert mentors for personalized learning."}
            </p>
            <Link href="/contact" className={`inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#7A85F0] text-xs font-bold rounded-lg hover:bg-white/90 transition-all shadow-md ${bengaliClass}`}>
              {language === "bn" ? "যোগাযোগ করুন" : "Contact Us"}
              <LuArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const Course = () => (
  <Suspense fallback={<LoadingFallback />}>
    <CourseContent />
  </Suspense>
);

export default Course;
