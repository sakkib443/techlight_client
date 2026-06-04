'use client';

import { useEffect, useState } from 'react';
import { LuStar, LuTrash2, LuRefreshCw, LuPlus, LuEye, LuEyeOff, LuX, LuCheck, LuQuote } from 'react-icons/lu';
import { API_BASE_URL } from '@/config/api';
import toast from 'react-hot-toast';

const COLORS = ['#E31E27', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const StarRating = ({ value, onChange }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button"
                    onClick={() => onChange(s)}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}>
                    <LuStar size={22} className={`transition-colors ${s <= (hover || value) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                </button>
            ))}
        </div>
    );
};

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', designation: '', course: '', review: '', rating: 5, color: '#E31E27' });
    const [submitting, setSubmitting] = useState(false);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/testimonials/all?page=${page}&limit=20`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) { setTestimonials(data.data); setMeta(data.meta || {}); }
        } catch { toast.error('লোড করা যায়নি'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, [page]);

    const handleDelete = async (id) => {
        if (!confirm('এই testimonial মুছে ফেলবেন?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) { toast.success('মুছে ফেলা হয়েছে'); fetchAll(); }
        } catch { toast.error('মুছতে সমস্যা হয়েছে'); }
    };

    const handleToggle = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/testimonials/${id}/toggle`, {
                method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) { toast.success('Status পরিবর্তন হয়েছে'); fetchAll(); }
        } catch { toast.error('সমস্যা হয়েছে'); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (form.review.trim().length < 20) { toast.error('রিভিউ কমপক্ষে ২০ অক্ষর হওয়া দরকার'); return; }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/testimonials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Testimonial যোগ হয়েছে!');
                setForm({ name: '', designation: '', course: '', review: '', rating: 5, color: '#E31E27' });
                setShowForm(false);
                fetchAll();
            } else { toast.error(data.message || 'সমস্যা হয়েছে'); }
        } catch { toast.error('সার্ভার সমস্যা'); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4 lg:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <LuQuote className="text-[#E31E27]" size={22} />
                        Testimonials
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Homepage-এ দেখানো সব testimonial — মোট {meta.total || 0}টি
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchAll} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm text-gray-600 hover:border-[#E31E27]/40 transition-all">
                        <LuRefreshCw size={14} />
                    </button>
                    <button onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E31E27] hover:bg-[#C01920] text-white text-sm font-semibold transition-all shadow-lg shadow-[#E31E27]/20">
                        <LuPlus size={15} /> নতুন যোগ করুন
                    </button>
                </div>
            </div>

            {/* Add Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-[#111] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 z-10">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">নতুন Testimonial যোগ করুন</h3>
                            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                <LuX size={15} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">রেটিং</label>
                                <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">নাম *</label>
                                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="রাকিব হাসান"
                                        className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">পদবী *</label>
                                    <input required value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                                        placeholder="ওয়েব ডেভেলপার"
                                        className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">কোর্সের নাম *</label>
                                <input required value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
                                    placeholder="ওয়েব ডেভেলপমেন্ট"
                                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">রিভিউ *</label>
                                <textarea required rows={4} value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                                    placeholder="টেস্টিমোনিয়াল টেক্সট লিখুন..."
                                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white resize-none" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Avatar Color</label>
                                <div className="flex gap-2">
                                    {COLORS.map(c => (
                                        <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                                            className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                                            style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>
                            <button type="submit" disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#E31E27] hover:bg-[#C01920] text-white font-bold text-sm transition-all disabled:opacity-60">
                                {submitting ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <LuCheck size={15} />}
                                {submitting ? 'যোগ হচ্ছে...' : 'Testimonial যোগ করুন'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Testimonials Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-52 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
                </div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <LuQuote size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">এখনো কোনো testimonial নেই</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {testimonials.map(t => (
                        <div key={t._id} className={`bg-white dark:bg-[#111] rounded-2xl p-5 border transition-all ${t.isActive ? 'border-gray-100 dark:border-gray-800' : 'border-dashed border-gray-200 dark:border-gray-700 opacity-60'}`}>
                            {/* Top */}
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                        style={{ backgroundColor: t.color || '#E31E27' }}>
                                        {t.initial || t.name?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                                        <p className="text-[11px] text-gray-400">{t.designation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => handleToggle(t._id)} title={t.isActive ? 'Hide' : 'Show'}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${t.isActive ? 'bg-green-50 text-green-500 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                                        {t.isActive ? <LuEye size={13} /> : <LuEyeOff size={13} />}
                                    </button>
                                    <button onClick={() => handleDelete(t._id)}
                                        className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all">
                                        <LuTrash2 size={13} />
                                    </button>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-0.5 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <LuStar key={i} size={12} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                ))}
                            </div>

                            {/* Review */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3">
                                "{t.review}"
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEE2E2] text-[#E31E27]">
                                    {t.course}
                                </span>
                                <span className={`text-[10px] font-semibold ${t.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                                    {t.isActive ? '● দেখানো হচ্ছে' : '○ লুকানো আছে'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-4 py-2 text-xs rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 disabled:opacity-40">আগের</button>
                    <span className="px-4 py-2 text-xs text-gray-500">{page} / {meta.totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
                        className="px-4 py-2 text-xs rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 disabled:opacity-40">পরের</button>
                </div>
            )}
        </div>
    );
}
