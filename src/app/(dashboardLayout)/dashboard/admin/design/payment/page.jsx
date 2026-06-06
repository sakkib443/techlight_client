'use client';

import React, { useEffect, useState } from 'react';
import { FiSave, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/config/api';

const DEFAULTS = {
    bkash: '',
    rocket: '',
    nagad: '',
    note: '',
};

export default function PaymentDesignPage() {
    const { isDark } = useTheme();
    const [content, setContent] = useState(DEFAULTS);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/design/payment`)
            .then(r => r.json())
            .then(d => {
                if (d.success && d.data?.paymentContent) {
                    setContent({ ...DEFAULTS, ...d.data.paymentContent });
                }
            })
            .catch(() => toast.error('Failed to load payment settings'))
            .finally(() => setLoading(false));
    }, []);

    const set = (field, value) => setContent(p => ({ ...p, [field]: value }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/design/payment`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ paymentContent: content }),
            });
            const data = await res.json();
            if (data.success) toast.success('Payment settings saved!');
            else toast.error(data.message || 'Failed to save');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const field = `w-full px-4 py-2.5 rounded-lg border text-sm transition-all outline-none focus:ring-2 ${isDark
        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-400 focus:ring-indigo-500/20'
        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20'}`;

    const card = `p-5 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`;
    const label = `block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`;

    if (loading) return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <FiRefreshCw className="animate-spin text-indigo-500" size={28} />
        </div>
    );

    return (
        <div className="space-y-6 pb-12 max-w-2xl">
            {/* Header */}
            <div className={`flex items-center justify-between p-5 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <FiCreditCard className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Payment Settings</h1>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Set your bKash, Rocket & Nagad numbers for checkout
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                    {saving ? <FiRefreshCw className="animate-spin" size={15} /> : <FiSave size={15} />}
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            {/* Payment Numbers */}
            <div className={card}>
                <h2 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Payment Numbers</h2>
                <div className="space-y-4">
                    {[
                        { key: 'bkash', label: 'bKash Number', placeholder: '01XXXXXXXXX', color: 'bg-[#d12053]' },
                        { key: 'rocket', label: 'Rocket Number', placeholder: '01XXXXXXXXX', color: 'bg-[#8c3494]' },
                        { key: 'nagad', label: 'Nagad Number', placeholder: '01XXXXXXXXX', color: 'bg-[#f7941d]' },
                    ].map(({ key, label: lbl, placeholder, color }) => (
                        <div key={key}>
                            <label className={label}>{lbl}</label>
                            <div className="flex gap-3 items-center">
                                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                    {lbl[0]}
                                </div>
                                <input
                                    type="text"
                                    value={content[key]}
                                    onChange={e => set(key, e.target.value)}
                                    placeholder={placeholder}
                                    className={field}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Note */}
            <div className={card}>
                <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Payment Note <span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>(optional)</span></h2>
                <label className={label}>Note shown to customer during checkout</label>
                <textarea
                    value={content.note}
                    onChange={e => set('note', e.target.value)}
                    rows={3}
                    placeholder="e.g. Send money as Personal. Keep the transaction ID."
                    className={`${field} resize-none`}
                />
            </div>
        </div>
    );
}
