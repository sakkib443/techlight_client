'use client';

// ===================================================================
// Admin FAQ Management Page
// Admin can create, edit, delete and show/hide FAQs from here.
// ===================================================================

import { useEffect, useState, useMemo } from 'react';
import {
    LuTrash2,
    LuRefreshCw,
    LuPlus,
    LuEye,
    LuEyeOff,
    LuX,
    LuCheck,
    LuPencil,
    LuCircleHelp,
    LuSearch,
} from 'react-icons/lu';
import { API_BASE_URL } from '@/config/api';
import toast from 'react-hot-toast';

// FAQ categories (match the public FAQ page)
const CATEGORIES = [
    { id: 'enrollment', label: 'Enrollment' },
    { id: 'payment', label: 'Payment' },
    { id: 'certificate', label: 'Certificate' },
    { id: 'course', label: 'Course' },
    { id: 'technical', label: 'Technical' },
];

const CATEGORY_COLORS = {
    enrollment: 'bg-blue-50 text-blue-600',
    payment: 'bg-emerald-50 text-emerald-600',
    certificate: 'bg-amber-50 text-amber-600',
    course: 'bg-violet-50 text-violet-600',
    technical: 'bg-rose-50 text-rose-600',
};

const EMPTY_FORM = {
    category: 'enrollment',
    question: '',
    answer: '',
    order: 0,
};

export default function AdminFaqPage() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null); // null = create, id = edit
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // ==================== Fetch all FAQs (admin) ====================
    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/faqs/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setFaqs(data.data || []);
            else toast.error(data.message || 'Failed to load');
        } catch {
            toast.error('Failed to load FAQs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ==================== Open create / edit modal ====================
    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    };

    const openEdit = (faq) => {
        setEditingId(faq._id);
        setForm({
            category: faq.category,
            question: faq.question,
            answer: faq.answer,
            order: faq.order ?? 0,
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    // ==================== Create / Update submit ====================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.question.trim() || !form.answer.trim()) {
            toast.error('Question and answer are required');
            return;
        }

        setSubmitting(true);
        try {
            const isEdit = Boolean(editingId);
            const url = isEdit
                ? `${API_BASE_URL}/faqs/${editingId}`
                : `${API_BASE_URL}/faqs`;
            const method = isEdit ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...form, order: Number(form.order) || 0 }),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(isEdit ? 'FAQ updated!' : 'New FAQ added!');
                closeForm();
                fetchAll();
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch {
            toast.error('Server error');
        } finally {
            setSubmitting(false);
        }
    };

    // ==================== Toggle active ====================
    const handleToggle = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/faqs/${id}/toggle`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Status updated');
                fetchAll();
            } else toast.error(data.message || 'Something went wrong');
        } catch {
            toast.error('Something went wrong');
        }
    };

    // ==================== Delete ====================
    const handleDelete = async (id) => {
        if (!confirm('Delete this FAQ?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/faqs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Deleted');
                fetchAll();
            } else toast.error(data.message || 'Failed to delete');
        } catch {
            toast.error('Failed to delete');
        }
    };

    // ==================== Filtered list ====================
    const filteredFaqs = useMemo(() => {
        const q = search.trim().toLowerCase();
        return faqs.filter((f) => {
            const matchCat = filterCat === 'all' || f.category === filterCat;
            const matchSearch =
                q === '' ||
                f.question?.toLowerCase().includes(q) ||
                f.answer?.toLowerCase().includes(q);
            return matchCat && matchSearch;
        });
    }, [faqs, search, filterCat]);

    const activeCount = faqs.filter((f) => f.isActive).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4 lg:p-6">
            {/* ===== Header ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <LuCircleHelp className="text-[#E31E27]" size={22} />
                        FAQ Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {faqs.length} total — {activeCount} visible
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchAll}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm text-gray-600 hover:border-[#E31E27]/40 transition-all"
                        title="Refresh"
                    >
                        <LuRefreshCw size={14} />
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E31E27] hover:bg-[#C01920] text-white text-sm font-semibold transition-all shadow-lg shadow-[#E31E27]/20"
                    >
                        <LuPlus size={15} /> Add New FAQ
                    </button>
                </div>
            </div>

            {/* ===== Filters ===== */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <LuSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search questions..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white"
                    />
                </div>
                <select
                    value={filterCat}
                    onChange={(e) => setFilterCat(e.target.value)}
                    className="px-4 py-2.5 text-sm bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white"
                >
                    <option value="all">All categories</option>
                    {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ===== Create / Edit Modal ===== */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeForm} />
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 z-10">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingId ? 'Edit FAQ' : 'Add New FAQ'}
                            </h3>
                            <button
                                onClick={closeForm}
                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center"
                            >
                                <LuX size={15} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Category + Order */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                                        Category *
                                    </label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        value={form.order}
                                        onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                                        placeholder="0"
                                        className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                                    Question *
                                </label>
                                <input
                                    value={form.question}
                                    onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                                    placeholder="How do I enroll?"
                                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white"
                                />
                            </div>

                            {/* Answer */}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                                    Answer *
                                </label>
                                <textarea
                                    rows={5}
                                    value={form.answer}
                                    onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                                    placeholder="The enrollment process is simple..."
                                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#E31E27] text-gray-800 dark:text-white resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#E31E27] hover:bg-[#C01920] text-white font-bold text-sm transition-all disabled:opacity-60"
                            >
                                {submitting ? (
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <LuCheck size={15} />
                                )}
                                {submitting
                                    ? 'Saving...'
                                    : editingId
                                    ? 'Save Changes'
                                    : 'Add FAQ'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== FAQ List ===== */}
            {loading ? (
                <div className="space-y-3 animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                    ))}
                </div>
            ) : filteredFaqs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <LuCircleHelp size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">
                        {faqs.length === 0 ? 'No FAQs yet' : 'No FAQs found'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredFaqs.map((faq) => {
                        const cat = CATEGORIES.find((c) => c.id === faq.category);
                        return (
                            <div
                                key={faq._id}
                                className={`bg-white dark:bg-[#111] rounded-2xl p-5 border transition-all ${
                                    faq.isActive
                                        ? 'border-gray-100 dark:border-gray-800'
                                        : 'border-dashed border-gray-200 dark:border-gray-700 opacity-60'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        {/* Category + order badge */}
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    CATEGORY_COLORS[faq.category] || 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {cat ? cat.label : faq.category}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                Order: {faq.order ?? 0}
                                            </span>
                                            <span
                                                className={`text-[10px] font-semibold ${
                                                    faq.isActive ? 'text-green-500' : 'text-gray-400'
                                                }`}
                                            >
                                                {faq.isActive ? '● Visible' : '○ Hidden'}
                                            </span>
                                        </div>

                                        {/* Question */}
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                                            {faq.question}
                                        </p>

                                        {/* Answer */}
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                                            {faq.answer}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            onClick={() => handleToggle(faq._id)}
                                            title={faq.isActive ? 'Hide' : 'Show'}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                faq.isActive
                                                    ? 'bg-green-50 text-green-500 hover:bg-green-100'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                            }`}
                                        >
                                            {faq.isActive ? <LuEye size={14} /> : <LuEyeOff size={14} />}
                                        </button>
                                        <button
                                            onClick={() => openEdit(faq)}
                                            title="Edit"
                                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-all"
                                        >
                                            <LuPencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(faq._id)}
                                            title="Delete"
                                            className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-all"
                                        >
                                            <LuTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
