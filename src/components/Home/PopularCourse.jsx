"use client";
import { API_URL, API_BASE_URL } from '@/config/api';

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LuChevronLeft, LuChevronRight, LuChevronDown, LuArrowUpDown } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import SharedCourseCard from "@/components/sheard/CourseCard";

// Loading Skeleton
const CourseCardSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100">
      <div className="h-56 bg-gray-200 dark:bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const PopularCourse = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('popularity');
  const [startIndex, setStartIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { language, t } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const { items: categories = [] } = useSelector((state) => state.categories);
  const { courses = [], loading } = useSelector((state) => state.courses);

  const visibleItems = 6;

  const categoryOptions = [
    { id: 'all', label: language === 'bn' ? 'ক্যাটাগরি' : 'Category' },
    ...categories.map(cat => ({
      id: cat._id,
      label: language === 'bn' ? cat.nameBn || cat.name : cat.name
    }))
  ];

  const sortOptions = [
    { id: 'popularity', label: language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular' },
    { id: 'trending',   label: language === 'bn' ? 'ট্রেন্ডিং' : 'Trending' },
    { id: 'featured',  label: language === 'bn' ? 'ফিচার্ড' : 'Featured' },
    { id: 'rating',    label: language === 'bn' ? 'সেরা রেটিং' : 'Top Rated' },
  ];

  const getProcessedCourses = () => {
    let result = [...courses];
    if (activeCategory !== 'all') {
      result = result.filter(c => {
        const catId = c.category?._id || c.category;
        return catId === activeCategory;
      });
    }
    switch (activeSort) {
      case 'trending':
        result = result.filter(c => (c.totalEnrollments || 0) > 5).sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0));
        break;
      case 'featured':
        result = result.filter(c => c.isFeatured);
        break;
      case 'rating':
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'popularity':
      default:
        result.sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0));
        break;
    }
    return result;
  };

  const filteredCourses = getProcessedCourses();
  const visibleCourses = filteredCourses.slice(startIndex, startIndex + visibleItems);

  const handlePrev = () => setStartIndex(prev => prev > 0 ? prev - 1 : Math.max(filteredCourses.length - visibleItems, 0));
  const handleNext = () => setStartIndex(prev => prev + visibleItems < filteredCourses.length ? prev + 1 : 0);
  const toggleDropdown = (name) => setOpenDropdown(openDropdown === name ? null : name);

  const getActiveLabel = (type) => {
    if (type === 'sort') {
      const active = sortOptions.find(s => s.id === activeSort);
      return active ? active.label : 'Most Popular';
    }
    return '';
  };

  return (
    <section className="py-16 bg-white dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-4 lg:px-32">

        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-[#7A85F0] bg-[#EEF0FD] border border-[#7A85F0]/20 mb-4">
            {language === 'bn' ? 'জনপ্রিয় কোর্স' : 'Popular Courses'}
          </span>
          <h2 className={`text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-3 ${bengaliClass}`}>
            {language === 'bn'
              ? <>শিক্ষার্থীরা যা <span className="text-[#7A85F0]">দেখছে</span></>
              : <>Most <span className="text-[#7A85F0]">Popular Courses</span></>
            }
          </h2>
          <p className={`text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto ${bengaliClass}`}>
            {language === 'bn'
              ? 'আমাদের সেরা কোর্সগুলো এক্সপ্লোর করুন এবং আপনার ক্যারিয়ার গড়ুন।'
              : 'Explore our top-rated courses handpicked by thousands of students to grow their careers.'}
          </p>
        </motion.div>

        {/* ── Filter Bar ── */}
        <div className="flex items-center justify-end gap-3 mb-8 relative z-20">

          {/* Category Dropdown */}
          <span className={`text-sm font-medium ${bengaliClass}`}>{language === 'bn' ? 'ফিল্টার বাই' : 'Filter by'}</span>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('category')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-[#7A85F0]/50 transition-all min-w-[140px] justify-between"
            >
              <span className={`truncate ${bengaliClass}`}>
                {categoryOptions.find(c => c.id === activeCategory)?.label || 'All Categories'}
              </span>
              <LuChevronDown size={13} className={`text-gray-400 shrink-0 transition-transform duration-200 ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openDropdown === 'category' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-30 max-h-64 overflow-y-auto"
                >
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setActiveCategory(opt.id); setOpenDropdown(null); setStartIndex(0); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700/50 last:border-0 ${
                        activeCategory === opt.id ? 'text-[#7A85F0] bg-[#EEF0FD]' : 'text-gray-600 dark:text-gray-400'
                      } ${bengaliClass}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => toggleDropdown('sort')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-[#7A85F0]/50 transition-all min-w-[130px] justify-between"
            >
              <div className="flex items-center gap-1.5">
                <LuArrowUpDown size={13} className="text-gray-400 shrink-0" />
                <span className={bengaliClass}>{getActiveLabel('sort')}</span>
              </div>
              <LuChevronDown size={13} className={`text-gray-400 shrink-0 transition-transform duration-200 ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openDropdown === 'sort' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-30"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setActiveSort(opt.id); setOpenDropdown(null); setStartIndex(0); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700/50 last:border-0 ${
                        activeSort === opt.id ? 'text-[#7A85F0] bg-[#EEF0FD]' : 'text-gray-600 dark:text-gray-400'
                      } ${bengaliClass}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Courses Carousel ── */}
        <div className="relative">
          {filteredCourses.length > visibleItems && (
            <>
              <button
                onClick={handlePrev}
                className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-[#7A85F0] hover:text-white hover:border-[#7A85F0] transition-all"
              >
                <LuChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-[#7A85F0] hover:text-white hover:border-[#7A85F0] transition-all"
              >
                <LuChevronRight size={20} />
              </button>
            </>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <CourseCardSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleCourses.length > 0 ? (
                visibleCourses.map((course) => (
                  <SharedCourseCard key={course._id} course={course} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className={`text-gray-500 ${bengaliClass}`}>
                    {language === 'bn' ? 'কোনো কোর্স পাওয়া যায়নি' : 'No courses found'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularCourse;
