'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { LuMail, LuMailOpen, LuTrash2, LuRefreshCw, LuSearch, LuCheck, LuClock, LuUser, LuAtSign, LuMessageCircle, LuTriangleAlert } from 'react-icons/lu';
import { API_BASE_URL } from '@/config/api';

const STATUS_LABELS = { unread: 'Unread', read: 'Read', replied: 'Replied' };
const STATUS_COLORS = {
    unread: 'bg-red-100 text-red-600',
    read: 'bg-gray-100 text-gray-500',
    replied: 'bg-green-100 text-green-600',
};

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);

    const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    const fetchMessages = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({ page: String(page), limit: '20' });
            if (filter !== 'all') params.append('status', filter);
            const res = await fetch(`${API_BASE_URL}/contact?${params}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setMessages(Array.isArray(data.data) ? data.data : []);
                setMeta(data.meta || {});
            } else {
                setMessages([]);
                setError(data.message || 'Failed to load messages');
            }
        } catch (err) {
            console.error(err);
            setMessages([]);
            setError('Network error — could not load messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMessages(); }, [filter, page]);

    const handleStatusChange = async (id, status) => {
        try {
            const res = await fetch(`${API_BASE_URL}/contact/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error();
            setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, status } : m)));
            if (selected?._id === id) setSelected((prev) => ({ ...prev, status }));
        } catch {
            toast.error('Could not update status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            toast.success('Message deleted');
            setSelected(null);
            fetchMessages();
        } catch {
            toast.error('Could not delete message');
        }
    };

    const handleOpen = async (msg) => {
        setSelected(msg);
        if (msg.status === 'unread') handleStatusChange(msg._id, 'read');
    };

    const filtered = messages.filter((m) =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase()) ||
        m.subject?.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (d) => {
        if (!d) return '';
        const date = new Date(d);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4 lg:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <LuMail className="text-[#E31E27]" size={22} /> Contact Messages
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">All messages from the contact page</p>
                </div>
                <button onClick={fetchMessages} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-sm text-gray-600 hover:border-[#E31E27]/40 transition-all">
                    <LuRefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Filters + Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="flex gap-2">
                    {['all', 'unread', 'read', 'replied'].map((s) => (
                        <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === s ? 'bg-[#E31E27] text-white' : 'bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'}`}>
                            {s === 'all' ? 'All' : STATUS_LABELS[s]}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 sm:max-w-xs">
                    <LuSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or subject..."
                        className="w-full pl-8 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-[#E31E27]/50 text-gray-800 dark:text-white" />
                </div>
            </div>

            {/* Error banner */}
            {error && !loading && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    <LuTriangleAlert size={16} className="shrink-0" /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Message List */}
                <div className="lg:col-span-2 space-y-2">
                    {loading ? (
                        <div className="animate-pulse space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800">
                            <LuMail size={32} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-400">No messages</p>
                        </div>
                    ) : filtered.map((msg) => (
                        <div key={msg._id} onClick={() => handleOpen(msg)}
                            className={`cursor-pointer p-4 rounded-xl border transition-all ${selected?._id === msg._id
                                ? 'border-[#E31E27]/50 bg-[#FEE2E2]/30 dark:bg-[#E31E27]/10'
                                : 'bg-white dark:bg-[#111] border-gray-100 dark:border-gray-800 hover:border-[#E31E27]/30'
                                } ${msg.status === 'unread' ? 'border-l-4 border-l-[#E31E27]' : ''}`}>
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[msg.status] || 'bg-gray-100 text-gray-500'}`}>
                                            {STATUS_LABELS[msg.status] || msg.status}
                                        </span>
                                    </div>
                                    <p className={`text-sm font-semibold text-gray-900 dark:text-white truncate ${msg.status === 'unread' ? 'font-bold' : ''}`}>{msg.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                                </div>
                                <p className="text-[10px] text-gray-400 whitespace-nowrap">{formatDate(msg.createdAt)}</p>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {meta.totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 disabled:opacity-40">Prev</button>
                            <span className="px-3 py-1.5 text-xs text-gray-500">{page} / {meta.totalPages}</span>
                            <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
                                className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 disabled:opacity-40">Next</button>
                        </div>
                    )}
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-3">
                    {!selected ? (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800">
                            <LuMailOpen size={40} className="text-gray-200 dark:text-gray-700 mb-3" />
                            <p className="text-sm text-gray-400">Select a message to read</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                            {/* Detail Header */}
                            <div className="flex items-start justify-between gap-4 mb-6 pb-5 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{selected.subject}</h2>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><LuUser size={11} />{selected.name}</span>
                                        <span className="flex items-center gap-1"><LuAtSign size={11} />{selected.email}</span>
                                        <span className="flex items-center gap-1"><LuClock size={11} />{formatDate(selected.createdAt)}</span>
                                    </div>
                                </div>
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 ${STATUS_COLORS[selected.status] || 'bg-gray-100 text-gray-500'}`}>
                                    {STATUS_LABELS[selected.status] || selected.status}
                                </span>
                            </div>

                            {/* Message Body */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <LuMessageCircle size={14} className="text-[#E31E27]" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                    {selected.message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                                    onClick={() => handleStatusChange(selected._id, 'replied')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E31E27] hover:bg-[#C01920] text-white text-xs font-semibold transition-all">
                                    <LuMail size={13} /> Reply by Email
                                </a>
                                {selected.status !== 'replied' && (
                                    <button onClick={() => handleStatusChange(selected._id, 'replied')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800 text-xs font-semibold hover:bg-green-100 transition-all">
                                        <LuCheck size={13} /> Mark as Replied
                                    </button>
                                )}
                                {selected.status !== 'unread' && (
                                    <button onClick={() => handleStatusChange(selected._id, 'unread')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 text-xs font-semibold hover:bg-gray-100 transition-all">
                                        <LuMail size={13} /> Mark as Unread
                                    </button>
                                )}
                                <button onClick={() => handleDelete(selected._id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-800 text-xs font-semibold hover:bg-red-100 transition-all">
                                    <LuTrash2 size={13} /> Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
