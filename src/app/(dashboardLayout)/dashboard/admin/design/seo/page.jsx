"use client";
import { API_URL } from '@/config/api';
import React, { useState, useEffect } from 'react';
import { LuSave, LuRefreshCw, LuSearch } from 'react-icons/lu';
import { useTheme } from '@/providers/ThemeProvider';

const PAGES = [
    { key: 'home', label: 'Home Page' },
    { key: 'about', label: 'About Page' },
    { key: 'courses', label: 'Courses Page' },
    { key: 'contact', label: 'Contact Page' },
    { key: 'certification', label: 'Certification Page' },
    { key: 'software', label: 'Software Page' },
    { key: 'website', label: 'Website Templates Page' },
    { key: 'blog', label: 'Blog Page' },
];

const defaultSeo = {
    siteName: 'TECHLIGHT IT',
    home: { title: '', description: '' },
    about: { title: '', description: '' },
    courses: { title: '', description: '' },
    contact: { title: '', description: '' },
    certification: { title: '', description: '' },
    software: { title: '', description: '' },
    website: { title: '', description: '' },
    blog: { title: '', description: '' },
};

export default function SeoSettingsPage() {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seoContent, setSeoContent] = useState(defaultSeo);
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        fetchSeo();
    }, []);

    const fetchSeo = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/seo`);
            const data = await res.json();
            if (data.success && data.data?.seoContent) {
                setSeoContent({ ...defaultSeo, ...data.data.seoContent });
            }
        } catch (error) {
            console.error('Failed to fetch SEO content', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (pageKey, field, value) => {
        setSeoContent(prev => ({
            ...prev,
            [pageKey]: {
                ...prev[pageKey],
                [field]: value,
            },
        }));
    };

    const handleSiteNameChange = (value) => {
        setSeoContent(prev => ({ ...prev, siteName: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/design/seo`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ seoContent }),
            });
            const data = await res.json();
            if (data.success) {
                alert('SEO settings saved successfully!');
            }
        } catch (error) {
            console.error('Failed to save SEO content', error);
            alert('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400';
    const labelColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const tabActive = isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white';
    const tabInactive = isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100">
                        <LuSearch className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>SEO Settings</h1>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Manage meta title & description for each page</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchSeo}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LuRefreshCw className="text-sm" /> Refresh
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
                    >
                        <LuSave className="text-sm" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Site Name */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>Site Name (used in title template)</label>
                <input
                    type="text"
                    value={seoContent.siteName || ''}
                    onChange={e => handleSiteNameChange(e.target.value)}
                    placeholder="e.g. TECHLIGHT IT"
                    className={`w-full max-w-sm px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                />
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Page titles will appear as: <span className="font-medium">{seoContent.siteName || 'TECHLIGHT IT'} | Page Name</span></p>
            </div>

            {/* Page Tabs */}
            <div className={`rounded-xl border ${cardBg} overflow-hidden`}>
                <div className={`flex flex-wrap gap-1 p-3 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                    {PAGES.map(page => (
                        <button
                            key={page.key}
                            onClick={() => setActiveTab(page.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === page.key ? tabActive : tabInactive}`}
                        >
                            {page.label}
                        </button>
                    ))}
                </div>

                <div className="p-5 space-y-4">
                    {PAGES.filter(p => p.key === activeTab).map(page => (
                        <div key={page.key}>
                            <h3 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>{page.label}</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${labelColor}`}>
                                        Meta Title
                                        <span className={`ml-2 text-xs font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            ({(seoContent[page.key]?.title || '').length}/60 chars)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={seoContent[page.key]?.title || ''}
                                        onChange={e => handleChange(page.key, 'title', e.target.value)}
                                        placeholder={`e.g. ${seoContent.siteName || 'TECHLIGHT IT'} | ${page.label}`}
                                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${labelColor}`}>
                                        Meta Description
                                        <span className={`ml-2 text-xs font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            ({(seoContent[page.key]?.description || '').length}/160 chars)
                                        </span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={seoContent[page.key]?.description || ''}
                                        onChange={e => handleChange(page.key, 'description', e.target.value)}
                                        placeholder="Write a short description for this page (max 160 characters recommended)"
                                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${inputBg}`}
                                    />
                                </div>

                                {/* Preview */}
                                <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                                    <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Google Preview</p>
                                    <p className="text-blue-500 text-sm font-medium truncate">
                                        {seoContent[page.key]?.title || `${seoContent.siteName || 'TECHLIGHT IT'} | ${page.label}`}
                                    </p>
                                    <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {seoContent[page.key]?.description || 'No description set.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
