'use client';

// ===================================================================
// Admin · Homepage Popular Courses + /courses Listing Order Manager
//  • Left  : Popular list (max 6) — drag to set homepage popular order
//  • Right : All courses — drag to set the default /courses page order,
//            star toggle to add/remove a course from the popular list
// ===================================================================

import React, { useEffect, useState, useMemo } from 'react';
import { Reorder, useDragControls, motion, AnimatePresence } from 'framer-motion';
import {
  FiStar, FiX, FiSave, FiSearch, FiMenu, FiRefreshCw, FiCheckCircle,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

// Homepage popular section shows at most 6 courses
const MAX_POPULAR = 6;

// ── Row in the popular list (left) ──
function PopularItem({ course, index, isDark, onRemove }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={course}
      dragListener={false}
      dragControls={controls}
      className="list-none"
      whileDrag={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
    >
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border mb-2 select-none ${
          isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-slate-200'
        }`}
      >
        <button
          onPointerDown={(e) => controls.start(e)}
          className={`cursor-grab active:cursor-grabbing touch-none p-1.5 rounded-lg ${
            isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="Drag to reorder"
        >
          <FiMenu size={18} />
        </button>
        <span className="w-7 h-7 shrink-0 rounded-lg bg-[#E31E27] text-white text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <img src={course.thumbnail} alt={course.title} className="w-14 h-10 rounded-lg object-cover shrink-0 bg-slate-200" />
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{course.title}</p>
          <p className="text-xs text-slate-400 truncate">{course.category?.name || '—'}</p>
        </div>
        <button onClick={() => onRemove(course)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 shrink-0" title="Remove from popular">
          <FiX size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
}

// ── Row in the full course-order list (right) ──
function OrderItem({ course, index, isDark, isPopular, canStar, onToggleStar, draggable }) {
  const controls = useDragControls();
  const body = (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border mb-2 select-none ${
        isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      {draggable ? (
        <button
          onPointerDown={(e) => controls.start(e)}
          className={`cursor-grab active:cursor-grabbing touch-none p-1.5 rounded-lg ${
            isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="Drag to reorder"
        >
          <FiMenu size={18} />
        </button>
      ) : (
        <span className="p-1.5 text-slate-300"><FiMenu size={18} /></span>
      )}
      <span className={`w-7 h-7 shrink-0 rounded-lg text-xs font-bold flex items-center justify-center ${
        isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'
      }`}>
        {index + 1}
      </span>
      <img src={course.thumbnail} alt={course.title} className="w-14 h-10 rounded-lg object-cover shrink-0 bg-slate-200" />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{course.title}</p>
        <p className="text-xs text-slate-400 truncate">{course.category?.name || '—'}</p>
      </div>
      <button
        onClick={() => onToggleStar(course)}
        disabled={!isPopular && !canStar}
        className={`p-2 rounded-lg shrink-0 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          isPopular ? 'text-[#E31E27]' : 'text-slate-400 hover:text-[#E31E27]'
        }`}
        title={isPopular ? 'Remove from popular' : 'Add to popular'}
      >
        <FiStar size={18} className={isPopular ? 'fill-[#E31E27]' : ''} />
      </button>
    </div>
  );

  if (!draggable) return <div className="list-none">{body}</div>;

  return (
    <Reorder.Item
      value={course}
      dragListener={false}
      dragControls={controls}
      className="list-none"
      whileDrag={{ scale: 1.01, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
    >
      {body}
    </Reorder.Item>
  );
}

export default function PopularCoursesManager() {
  const { isDark } = useTheme();

  const [allCourses, setAllCourses] = useState([]);
  const [popular, setPopular] = useState([]); // ordered subset → popularOrder
  const [order, setOrder] = useState([]);     // ordered ALL courses → displayOrder
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [savedFlag, setSavedFlag] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses?limit=1000&sortBy=displayOrder&sortOrder=asc`, { cache: 'no-store' });
      const data = await res.json();
      const courses = data.data || [];
      setAllCourses(courses);
      setOrder(courses); // already in displayOrder
      setPopular(
        courses.filter((c) => c.isPopular).sort((a, b) => (a.popularOrder ?? 0) - (b.popularOrder ?? 0))
      );
      setSavedFlag(false);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourses(); }, []);

  const popularIds = useMemo(() => new Set(popular.map((c) => c._id)), [popular]);
  const isFull = popular.length >= MAX_POPULAR;

  const toggleStar = (course) => {
    setSavedFlag(false);
    if (popularIds.has(course._id)) {
      setPopular((prev) => prev.filter((c) => c._id !== course._id));
    } else {
      if (popular.length >= MAX_POPULAR) return;
      setPopular((prev) => [...prev, course]);
    }
  };

  const removeFromPopular = (course) => {
    setSavedFlag(false);
    setPopular((prev) => prev.filter((c) => c._id !== course._id));
  };

  // Right list: when searching, show a filtered (non-draggable) view
  const searching = search.trim() !== '';
  const visibleOrder = useMemo(() => {
    if (!searching) return order;
    const q = search.toLowerCase();
    return order.filter((c) => c.title?.toLowerCase().includes(q));
  }, [order, search, searching]);

  const handleSave = async () => {
    setSaving(true);
    setSavedFlag(false);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

      // 1) Save /courses listing order (displayOrder for every course)
      if (order.length > 0) {
        await fetch(`${API_BASE_URL}/courses/reorder`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ items: order.map((c, i) => ({ id: c._id, displayOrder: i })) }),
        });
      }

      // 2) Courses removed from popular → unset isPopular
      const removed = allCourses.filter((c) => c.isPopular && !popularIds.has(c._id));
      await Promise.all(
        removed.map((c) =>
          fetch(`${API_BASE_URL}/courses/${c._id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ isPopular: false, popularOrder: 0 }),
          })
        )
      );

      // 3) Save popular order (also marks them popular)
      if (popular.length > 0) {
        await fetch(`${API_BASE_URL}/courses/popular/reorder`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ items: popular.map((c, i) => ({ id: c._id, popularOrder: i })) }),
        });
      }

      setSavedFlag(true);
      await loadCourses();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 lg:p-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FiStar className="text-[#E31E27]" /> Popular &amp; Course Order
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            বাম পাশে homepage এর popular (সর্বোচ্চ {MAX_POPULAR}টা), ডান পাশে পুরো /courses পেজের default order।
            Drag করে সাজান, ⭐ দিয়ে popular এ যোগ/বাদ দিন, তারপর Save করুন।
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadCourses}
            className={`p-2.5 rounded-xl border ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
            title="Reload"
          >
            <FiRefreshCw size={16} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E31E27] text-white font-semibold shadow-lg shadow-[#E31E27]/30 hover:bg-[#c41a22] transition-all disabled:opacity-60"
          >
            {saving ? <FiRefreshCw size={16} className="animate-spin" /> : <FiSave size={16} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {savedFlag && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-green-500/10 text-green-500 text-sm font-medium"
          >
            <FiCheckCircle size={16} /> Saved! Homepage ও Courses পেজ এখন এই order এ দেখাবে।
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── LEFT: Popular ── */}
          <div className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <FiStar className="text-[#E31E27]" size={16} /> Homepage Popular
              </h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isFull ? 'bg-green-500/10 text-green-500' : 'bg-[#E31E27]/10 text-[#E31E27]'}`}>
                {popular.length}/{MAX_POPULAR} selected
              </span>
            </div>

            {popular.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400">
                এখনো কোনো কোর্স নেই।
                <br />
                ডান পাশের লিস্ট থেকে ⭐ দিয়ে যোগ করুন।
              </div>
            ) : (
              <Reorder.Group axis="y" values={popular} onReorder={setPopular}>
                {popular.map((course, index) => (
                  <PopularItem key={course._id} course={course} index={index} isDark={isDark} onRemove={removeFromPopular} />
                ))}
              </Reorder.Group>
            )}
          </div>

          {/* ── RIGHT: Full course order ── */}
          <div className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Course Order (/courses page)</h2>
              <span className="text-xs text-slate-400">{order.length} courses</span>
            </div>

            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search to find & star a course..."
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {searching && (
              <p className="text-xs text-amber-500 mb-3">
                সার্চ চলাকালীন drag বন্ধ। Order সাজাতে সার্চ খালি করুন।
              </p>
            )}

            <div className="max-h-[65vh] overflow-y-auto pr-1">
              {visibleOrder.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-400">কোনো কোর্স পাওয়া যায়নি।</div>
              ) : searching ? (
                visibleOrder.map((course) => (
                  <OrderItem
                    key={course._id}
                    course={course}
                    index={order.indexOf(course)}
                    isDark={isDark}
                    isPopular={popularIds.has(course._id)}
                    canStar={!isFull}
                    onToggleStar={toggleStar}
                    draggable={false}
                  />
                ))
              ) : (
                <Reorder.Group axis="y" values={order} onReorder={setOrder}>
                  {order.map((course, index) => (
                    <OrderItem
                      key={course._id}
                      course={course}
                      index={index}
                      isDark={isDark}
                      isPopular={popularIds.has(course._id)}
                      canStar={!isFull}
                      onToggleStar={toggleStar}
                      draggable={true}
                    />
                  ))}
                </Reorder.Group>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
