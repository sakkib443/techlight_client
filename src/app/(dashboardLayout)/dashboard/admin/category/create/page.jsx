'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSave, FiLoader, FiImage, FiGlobe, FiFolder, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';
import { useTheme } from '@/providers/ThemeProvider';

const CreateCategory = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '', status: 'active' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from name
  useEffect(() => {
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm((prev) => ({ ...prev, slug }));
  }, [form.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Category name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/categories/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug,
          description: form.description,
          image: form.image.trim(),
          status: form.status,
          type: 'course',
          isParent: true,
          parentCategory: null,
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success('Category created successfully!');
        router.push('/dashboard/admin/category');
      } else {
        const msg = result.errorMessages?.length
          ? result.errorMessages.map((x) => x.message).join(', ')
          : result.message || 'Failed to create category';
        setError(msg);
        toast.error('Could not create category');
      }
    } catch (err) {
      setError('Network error — check backend connectivity');
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-3 py-2.5 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-900 text-white placeholder:text-slate-600' : 'border-gray-200 bg-white text-gray-800 placeholder:text-gray-400'} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none text-sm transition-all`;
  const labelClass = `block text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1.5`;
  const cardClass = `${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-5 rounded-xl border shadow-sm`;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardClass}`}>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin/category" className={`p-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition-colors`}>
              <FiArrowLeft size={18} />
            </Link>
            <div>
              <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
                <FiFolder className="text-blue-500" size={18} /> Create Category
              </h1>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Add a new category for your courses</p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <FiAlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Web Development"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>URL Slug (auto)</label>
                  <div className="relative">
                    <FiGlobe className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={14} />
                    <input type="text" readOnly value={form.slug} className={`${inputClass} pl-9 font-mono ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`} placeholder="auto-generated" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Description <span className="font-normal text-slate-400">(optional)</span></label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this category..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
              <FiImage size={16} className="text-rose-500" /> Image <span className="font-normal text-slate-400 text-xs">(optional)</span>
            </h2>
            <input
              type="text"
              placeholder="https://..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className={inputClass}
            />
            {form.image && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-slate-700" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Status</h2>
            <div className={`p-1 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-gray-100'} flex gap-1 max-w-xs`}>
              <button
                type="button"
                onClick={() => setForm({ ...form, status: 'active' })}
                className={`flex-1 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${form.status === 'active' ? 'bg-emerald-500 text-white' : isDark ? 'text-slate-400' : 'text-gray-500'}`}
              >
                {form.status === 'active' && <FiCheck size={12} />} Active
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, status: 'inactive' })}
                className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${form.status === 'inactive' ? (isDark ? 'bg-slate-700 text-white' : 'bg-gray-600 text-white') : isDark ? 'text-slate-400' : 'text-gray-500'}`}
              >
                Inactive
              </button>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mt-2`}>Active categories are visible when creating courses.</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => router.push('/dashboard/admin/category')} className={`px-4 py-2.5 rounded-lg text-sm font-medium ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.name.trim()}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />}
              {loading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
