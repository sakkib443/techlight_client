'use client';

// ===================================================================
// Admin · Category Homepage + Order Manager
//  • Left  : Homepage categories (max 8) — drag to set homepage order
//  • Right : All categories — drag to set the general order (used everywhere),
//            star toggle to add/remove a category from the homepage section
// ===================================================================

import React, { useEffect, useState, useMemo } from 'react';
import { Reorder, useDragControls, motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiStar, FiX, FiMenu, FiSave, FiSearch, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_URL } from '@/config/api';

// Homepage categories section shows at most 8
const MAX_HOME = 8;

function Thumb({ cat }) {
  return (
    <div className="w-11 h-11 rounded-lg bg-blue-500 flex items-center justify-center text-white overflow-hidden shrink-0">
      {cat.image ? <img src={cat.image} className="w-full h-full object-cover" alt="" /> : <FiFolder size={18} />}
    </div>
  );
}

// ── Row in the homepage list (left) ──
function HomeItem({ cat, index, isDark, onRemove }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={cat} dragListener={false} dragControls={controls} className="list-none"
      whileDrag={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border mb-2 select-none ${isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-slate-200'}`}>
        <button onPointerDown={(e) => controls.start(e)}
          className={`cursor-grab active:cursor-grabbing touch-none p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'}`}
          title="Drag to reorder">
          <FiMenu size={18} />
        </button>
        <span className="w-7 h-7 shrink-0 rounded-lg bg-[#E31E27] text-white text-xs font-bold flex items-center justify-center">{index + 1}</span>
        <Thumb cat={cat} />
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{cat.name}</p>
          <p className="text-xs text-slate-400 truncate">/{cat.slug}</p>
        </div>
        <button onClick={() => onRemove(cat)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 shrink-0" title="Remove from homepage">
          <FiX size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
}

// ── Row in the full order list (right) ──
function OrderItem({ cat, index, isDark, onHome, canStar, onToggleStar, draggable }) {
  const controls = useDragControls();
  const body = (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border mb-2 select-none ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'}`}>
      {draggable ? (
        <button onPointerDown={(e) => controls.start(e)}
          className={`cursor-grab active:cursor-grabbing touch-none p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'}`}
          title="Drag to reorder">
          <FiMenu size={18} />
        </button>
      ) : (
        <span className="p-1.5 text-slate-300"><FiMenu size={18} /></span>
      )}
      <span className={`w-7 h-7 shrink-0 rounded-lg text-xs font-bold flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'}`}>{index + 1}</span>
      <Thumb cat={cat} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{cat.name}</p>
        <p className="text-xs text-slate-400 truncate">/{cat.slug}</p>
      </div>
      <button onClick={() => onToggleStar(cat)} disabled={!onHome && !canStar}
        className={`p-2 rounded-lg shrink-0 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${onHome ? 'text-[#E31E27]' : 'text-slate-400 hover:text-[#E31E27]'}`}
        title={onHome ? 'Remove from homepage' : 'Add to homepage'}>
        <FiStar size={18} className={onHome ? 'fill-[#E31E27]' : ''} />
      </button>
    </div>
  );

  if (!draggable) return <div className="list-none">{body}</div>;
  return (
    <Reorder.Item value={cat} dragListener={false} dragControls={controls} className="list-none"
      whileDrag={{ scale: 1.01, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
      {body}
    </Reorder.Item>
  );
}

export default function CategoryHomeOrderManager() {
  const { isDark } = useTheme();

  const [allCats, setAllCats] = useState([]);
  const [home, setHome] = useState([]);   // ordered subset → homeOrder
  const [order, setOrder] = useState([]); // ordered ALL → general order
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [savedFlag, setSavedFlag] = useState(false);

  const loadCats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/categories/admin/all?type=course`, {
        headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
      });
      const json = await res.json();
      const cats = json?.data || [];
      setAllCats(cats);
      setOrder([...cats].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      setHome(cats.filter((c) => c.showOnHome).sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0)));
      setSavedFlag(false);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCats(); }, []);

  const homeIds = useMemo(() => new Set(home.map((c) => c._id)), [home]);
  const isFull = home.length >= MAX_HOME;

  const toggleStar = (cat) => {
    setSavedFlag(false);
    if (homeIds.has(cat._id)) {
      setHome((prev) => prev.filter((c) => c._id !== cat._id));
    } else {
      if (home.length >= MAX_HOME) return;
      setHome((prev) => [...prev, cat]);
    }
  };

  const removeFromHome = (cat) => {
    setSavedFlag(false);
    setHome((prev) => prev.filter((c) => c._id !== cat._id));
  };

  const searching = search.trim() !== '';
  const visibleOrder = useMemo(() => {
    if (!searching) return order;
    const q = search.toLowerCase();
    return order.filter((c) => c.name?.toLowerCase().includes(q));
  }, [order, search, searching]);

  const handleSave = async () => {
    setSaving(true);
    setSavedFlag(false);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

      // 1) General order
      if (order.length > 0) {
        await fetch(`${API_URL}/categories/admin/reorder`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ items: order.map((c, i) => ({ id: c._id, order: i })) }),
        });
      }

      // 2) Removed from homepage → unset showOnHome
      const removed = allCats.filter((c) => c.showOnHome && !homeIds.has(c._id));
      await Promise.all(removed.map((c) =>
        fetch(`${API_URL}/categories/admin/${c._id}`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ showOnHome: false, homeOrder: 0 }),
        })
      ));

      // 3) Homepage selection + order
      if (home.length > 0) {
        await fetch(`${API_URL}/categories/admin/home-reorder`, {
          method: 'PATCH', headers,
          body: JSON.stringify({ items: home.map((c, i) => ({ id: c._id, homeOrder: i })) }),
        });
      }

      setSavedFlag(true);
      await loadCats();
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
            <FiFolder className="text-blue-500" /> Category Homepage &amp; Order
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            বাম পাশে হোম পেজের category (সর্বোচ্চ {MAX_HOME}টা), ডান পাশে সব category-র general order।
            Drag করে সাজান, ⭐ দিয়ে হোমে যোগ/বাদ দিন, তারপর Save করুন।
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadCats} className={`p-2.5 rounded-xl border ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`} title="Reload">
            <FiRefreshCw size={16} />
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all disabled:opacity-60">
            {saving ? <FiRefreshCw size={16} className="animate-spin" /> : <FiSave size={16} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {savedFlag && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-green-500/10 text-green-500 text-sm font-medium">
            <FiCheckCircle size={16} /> Saved! হোম পেজ এখন এই category গুলো এই order এ দেখাবে।
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Homepage */}
          <div className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2"><FiStar className="text-[#E31E27]" size={16} /> Homepage Categories</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isFull ? 'bg-green-500/10 text-green-500' : 'bg-[#E31E27]/10 text-[#E31E27]'}`}>
                {home.length}/{MAX_HOME} selected
              </span>
            </div>
            {home.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400">এখনো কোনো category নেই।<br />ডান পাশ থেকে ⭐ দিয়ে যোগ করুন।</div>
            ) : (
              <Reorder.Group axis="y" values={home} onReorder={setHome}>
                {home.map((cat, index) => (
                  <HomeItem key={cat._id} cat={cat} index={index} isDark={isDark} onRemove={removeFromHome} />
                ))}
              </Reorder.Group>
            )}
          </div>

          {/* RIGHT: General order */}
          <div className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">All Categories (general order)</h2>
              <span className="text-xs text-slate-400">{order.length} categories</span>
            </div>
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search to find & star a category..."
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800'}`} />
            </div>
            {searching && <p className="text-xs text-amber-500 mb-3">সার্চ চলাকালীন drag বন্ধ। Order সাজাতে সার্চ খালি করুন।</p>}
            <div className="max-h-[65vh] overflow-y-auto pr-1">
              {visibleOrder.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-400">কোনো category পাওয়া যায়নি।</div>
              ) : searching ? (
                visibleOrder.map((cat) => (
                  <OrderItem key={cat._id} cat={cat} index={order.indexOf(cat)} isDark={isDark}
                    onHome={homeIds.has(cat._id)} canStar={!isFull} onToggleStar={toggleStar} draggable={false} />
                ))
              ) : (
                <Reorder.Group axis="y" values={order} onReorder={setOrder}>
                  {order.map((cat, index) => (
                    <OrderItem key={cat._id} cat={cat} index={index} isDark={isDark}
                      onHome={homeIds.has(cat._id)} canStar={!isFull} onToggleStar={toggleStar} draggable={true} />
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
