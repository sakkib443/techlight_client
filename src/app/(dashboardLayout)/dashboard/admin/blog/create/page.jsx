'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import {
    FiArrowLeft, FiSave, FiVideo, FiTag, FiEye, FiEdit3,
    FiBold, FiItalic, FiList, FiLink, FiCode,
    FiAlignLeft, FiAlignCenter, FiAlignRight,
    FiUpload, FiX, FiCheck, FiLoader, FiImage,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';
import toast from 'react-hot-toast';

/* ─────────────────── helpers ─────────────────── */
const inputCls = (isDark, error) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${error
        ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
        : isDark
            ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-400 focus:ring-indigo-500/20'
            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20'
    }`;

const card = (isDark) =>
    `p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`;

const FieldError = ({ msg }) =>
    msg ? <p className="mt-1 text-xs text-red-500 font-medium">{msg}</p> : null;

const Label = ({ children, required, isDark }) => (
    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        {children}
        {required
            ? <span className="text-red-500 ml-1">*</span>
            : <span className="text-slate-400 text-xs ml-1 font-normal">(optional)</span>}
    </label>
);

/* ─────────────────── main component ─────────────────── */
function BlogFormInner() {
    const { isDark } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const blogId = searchParams.get('id');
    const isEdit = !!blogId;

    const contentRef = useRef(null);
    const [fetching, setFetching] = useState(isEdit);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [previewMode, setPreviewMode] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        thumbnail: '',
        thumbnailMode: 'url', // 'url' | 'upload'
        videoUrl: '',
        category: '',
        tags: [],
        status: 'draft',
        isFeatured: false,
        isPopular: false,
        allowComments: true,
        metaTitle: '',
        metaDescription: '',
    });
    const [tagInput, setTagInput] = useState('');

    /* fetch categories + (edit) blog data */
    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem('token');
                const reqs = [fetch(`${API_BASE_URL}/categories`)];
                if (isEdit) reqs.push(fetch(`${API_BASE_URL}/blogs/${blogId}`, { headers: { Authorization: `Bearer ${token}` } }));

                const [catRes, blogRes] = await Promise.all(reqs);
                const catData = await catRes.json();
                if (catData.success) setCategories(catData.data || []);

                if (isEdit && blogRes) {
                    const blogData = await blogRes.json();
                    if (blogData.success && blogData.data) {
                        const b = blogData.data;
                        setForm({
                            title: b.title || '',
                            excerpt: b.excerpt || '',
                            content: b.content || '',
                            thumbnail: b.thumbnail || '',
                            thumbnailMode: 'url',
                            videoUrl: b.videoUrl || '',
                            category: b.category?._id || b.category || '',
                            tags: b.tags || [],
                            status: b.status || 'draft',
                            isFeatured: b.isFeatured || false,
                            isPopular: b.isPopular || false,
                            allowComments: b.allowComments !== false,
                            metaTitle: b.metaTitle || '',
                            metaDescription: b.metaDescription || '',
                        });
                        setTimeout(() => {
                            if (contentRef.current) contentRef.current.innerHTML = b.content || '';
                        }, 80);
                    } else {
                        toast.error('Blog not found');
                        router.push('/dashboard/admin/blog');
                    }
                }
            } catch {
                toast.error('Failed to load data');
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [blogId]);

    /* field change */
    const set = (name, value) => {
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        set(name, type === 'checkbox' ? checked : value);
    };

    /* tags */
    const addTag = () => {
        const t = tagInput.trim().toLowerCase();
        if (t && !form.tags.includes(t) && form.tags.length < 10) {
            set('tags', [...form.tags, t]);
            setTagInput('');
        }
    };
    const removeTag = (t) => set('tags', form.tags.filter(x => x !== t));

    /* image upload */
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/upload/image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (data.success && data.data?.url) {
                set('thumbnail', data.data.url);
                toast.success('Image uploaded!');
            } else {
                toast.error('Upload failed');
            }
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    /* rich text */
    const fmt = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
        if (contentRef.current) set('content', contentRef.current.innerHTML);
    };
    const heading = (n) => {
        document.execCommand('formatBlock', false, `h${n}`);
        if (contentRef.current) set('content', contentRef.current.innerHTML);
    };

    /* validation */
    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Blog title is required';
        else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters';

        const plainContent = contentRef.current?.innerText?.trim() || '';
        if (!plainContent) e.content = 'Blog content is required';
        else if (plainContent.length < 100) e.content = `Content must be at least 100 characters (currently ${plainContent.length})`;

        if (form.excerpt && form.excerpt.trim().length < 20)
            e.excerpt = 'Excerpt must be at least 20 characters if provided';

        if (form.thumbnail && !/^https?:\/\/.+/.test(form.thumbnail))
            e.thumbnail = 'Thumbnail must be a valid URL';

        if (form.videoUrl && !/^https?:\/\/.+/.test(form.videoUrl))
            e.videoUrl = 'Video URL must be a valid URL';

        setErrors(e);
        if (Object.keys(e).length > 0) {
            toast.error(`Fix ${Object.keys(e).length} error(s) before saving`);
            return false;
        }
        return true;
    };

    /* submit */
    const handleSubmit = async (status) => {
        if (!validate()) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                title: form.title.trim(),
                excerpt: form.excerpt.trim() || undefined,
                content: form.content,
                thumbnail: form.thumbnail.trim() || undefined,
                videoUrl: form.videoUrl.trim() || undefined,
                category: form.category || undefined,
                tags: form.tags.length ? form.tags : undefined,
                status,
                isFeatured: form.isFeatured,
                isPopular: form.isPopular,
                allowComments: form.allowComments,
                metaTitle: form.metaTitle.trim() || undefined,
                metaDescription: form.metaDescription.trim() || undefined,
            };

            const url = isEdit ? `${API_BASE_URL}/blogs/${blogId}` : `${API_BASE_URL}/blogs`;
            const method = isEdit ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(isEdit ? 'Blog updated!' : status === 'published' ? 'Blog published!' : 'Saved as draft!');
                router.push('/dashboard/admin/blog');
            } else {
                // show backend errors clearly
                if (data.errorMessages?.length) {
                    const be = {};
                    data.errorMessages.forEach(err => {
                        const field = err.path?.split('.')?.pop() || 'general';
                        be[field] = err.message;
                    });
                    setErrors(be);
                    toast.error('Please fix the highlighted fields');
                } else {
                    toast.error(data.message || 'Failed to save blog');
                }
            }
        } catch {
            toast.error('Network error — please try again');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiLoader className="w-10 h-10 mx-auto animate-spin text-indigo-500" />
                    <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading blog...</p>
                </div>
            </div>
        );
    }

    const toolBtn = `p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`;
    const divider = `w-px h-6 mx-1 self-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`;

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/blog"
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {isEdit ? 'Edit Blog' : 'Write New Blog'}
                        </h1>
                        <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Only <strong>Title</strong> and <strong>Content</strong> are required. Everything else is optional.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setPreviewMode(p => !p)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${previewMode
                            ? 'bg-indigo-500 text-white'
                            : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {previewMode ? <FiEdit3 size={15} /> : <FiEye size={15} />}
                        {previewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button onClick={() => handleSubmit('draft')} disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        <FiSave size={15} /> Save Draft
                    </button>
                    <button onClick={() => handleSubmit('published')} disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-500/30 transition-all disabled:opacity-50">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck size={15} />}
                        {isEdit ? 'Update & Publish' : 'Publish'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Left ── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Title */}
                    <div className={card(isDark)}>
                        <Label required isDark={isDark}>Blog Title</Label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter your blog title..."
                            className={`w-full px-4 py-3 rounded-xl border text-lg font-medium transition-all focus:outline-none focus:ring-2 ${errors.title
                                ? 'border-red-400 focus:ring-red-500/20'
                                : isDark ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-400 focus:ring-indigo-500/20'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20'}`}
                        />
                        <FieldError msg={errors.title} />
                    </div>

                    {/* Excerpt */}
                    <div className={card(isDark)}>
                        <Label isDark={isDark}>Excerpt / Short Summary</Label>
                        <textarea
                            name="excerpt"
                            value={form.excerpt}
                            onChange={handleChange}
                            placeholder="Write a brief summary of this blog post..."
                            rows={3}
                            maxLength={500}
                            className={`${inputCls(isDark, errors.excerpt)} resize-none`}
                        />
                        <div className="flex items-center justify-between mt-1">
                            <FieldError msg={errors.excerpt} />
                            <p className={`text-xs ml-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{form.excerpt.length}/500</p>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'} ${errors.content ? 'border-red-400' : ''}`}>
                        <div className={`flex items-center px-3 py-2 border-b flex-wrap gap-0.5 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                            <span className={`text-xs font-semibold mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Content {<span className="text-red-500">*</span>}</span>
                            <button onClick={() => fmt('bold')} className={toolBtn} title="Bold"><FiBold size={15} /></button>
                            <button onClick={() => fmt('italic')} className={toolBtn} title="Italic"><FiItalic size={15} /></button>
                            <div className={divider} />
                            {[2, 3, 4].map(n => (
                                <button key={n} onClick={() => heading(n)} className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>H{n}</button>
                            ))}
                            <div className={divider} />
                            <button onClick={() => fmt('insertUnorderedList')} className={toolBtn} title="Bullet list"><FiList size={15} /></button>
                            <div className={divider} />
                            <button onClick={() => fmt('justifyLeft')} className={toolBtn}><FiAlignLeft size={15} /></button>
                            <button onClick={() => fmt('justifyCenter')} className={toolBtn}><FiAlignCenter size={15} /></button>
                            <button onClick={() => fmt('justifyRight')} className={toolBtn}><FiAlignRight size={15} /></button>
                            <div className={divider} />
                            <button onClick={() => { const u = prompt('Link URL:'); if (u) fmt('createLink', u); }} className={toolBtn} title="Insert link"><FiLink size={15} /></button>
                            <button onClick={() => fmt('formatBlock', 'pre')} className={toolBtn} title="Code block"><FiCode size={15} /></button>
                        </div>

                        {previewMode ? (
                            <div className={`p-6 min-h-[420px] prose prose-lg max-w-none ${isDark ? 'prose-invert' : ''}`}
                                dangerouslySetInnerHTML={{ __html: form.content }} />
                        ) : (
                            <div
                                ref={contentRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => set('content', e.currentTarget.innerHTML)}
                                className={`p-6 min-h-[420px] focus:outline-none ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                                style={{ lineHeight: 1.8 }}
                                data-placeholder="Start writing your blog content here... (min 100 characters)"
                            />
                        )}
                        <FieldError msg={errors.content} />
                        {errors.content && <div className="h-2" />}
                    </div>
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-5">

                    {/* Thumbnail */}
                    <div className={card(isDark)}>
                        <Label isDark={isDark}>Featured Image</Label>
                        <div className={`flex rounded-lg overflow-hidden border mb-3 text-xs font-medium ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                            {['url', 'upload'].map(m => (
                                <button key={m} type="button"
                                    onClick={() => set('thumbnailMode', m)}
                                    className={`flex-1 py-1.5 transition-colors capitalize ${form.thumbnailMode === m
                                        ? 'bg-indigo-600 text-white'
                                        : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                    {m === 'url' ? 'Image URL' : 'Upload File'}
                                </button>
                            ))}
                        </div>

                        {form.thumbnailMode === 'url' ? (
                            <div className="relative">
                                <FiImage className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={15} />
                                <input
                                    type="url"
                                    name="thumbnail"
                                    value={form.thumbnail}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className={`${inputCls(isDark, errors.thumbnail)} pl-9`}
                                />
                            </div>
                        ) : (
                            <label className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDark ? 'border-slate-600 hover:border-indigo-500 hover:bg-slate-700/50' : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'}`}>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                {uploading
                                    ? <div className="w-7 h-7 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                    : <><FiUpload className={`mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20} /><span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Click to upload</span></>
                                }
                            </label>
                        )}

                        {form.thumbnail && (
                            <div className="relative mt-3 rounded-xl overflow-hidden">
                                <img src={form.thumbnail} alt="preview" className="w-full h-36 object-cover" onError={(e) => e.target.style.display = 'none'} />
                                <button onClick={() => set('thumbnail', '')}
                                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                                    <FiX size={13} />
                                </button>
                            </div>
                        )}
                        <FieldError msg={errors.thumbnail} />
                    </div>

                    {/* Category */}
                    <div className={card(isDark)}>
                        <Label isDark={isDark}>Category</Label>
                        <select name="category" value={form.category} onChange={handleChange} className={inputCls(isDark, errors.category)}>
                            <option value="">Select category</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <FieldError msg={errors.category} />
                    </div>

                    {/* Tags */}
                    <div className={card(isDark)}>
                        <Label isDark={isDark}>Tags</Label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Add tag, press Enter"
                                className={inputCls(isDark, false)}
                            />
                            <button type="button" onClick={addTag}
                                className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                                <FiTag size={15} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {form.tags.map((t, i) => (
                                <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                                    #{t}
                                    <button type="button" onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors"><FiX size={11} /></button>
                                </span>
                            ))}
                        </div>
                        <FieldError msg={errors.tags} />
                    </div>

                    {/* Video URL */}
                    <div className={card(isDark)}>
                        <Label isDark={isDark}>Video URL</Label>
                        <div className="relative">
                            <FiVideo className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={15} />
                            <input
                                type="url"
                                name="videoUrl"
                                value={form.videoUrl}
                                onChange={handleChange}
                                placeholder="https://youtube.com/..."
                                className={`${inputCls(isDark, errors.videoUrl)} pl-9`}
                            />
                        </div>
                        <FieldError msg={errors.videoUrl} />
                    </div>

                    {/* Status + Options */}
                    <div className={card(isDark)}>
                        <Label isDark={isDark}>Status</Label>
                        <select name="status" value={form.status} onChange={handleChange} className={inputCls(isDark, false)}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                        <div className="mt-4 space-y-3">
                            {[
                                { name: 'isFeatured', label: 'Featured Blog' },
                                { name: 'isPopular', label: 'Mark as Popular' },
                                { name: 'allowComments', label: 'Allow Comments' },
                            ].map(opt => (
                                <label key={opt.name} className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" name={opt.name} checked={form[opt.name]} onChange={handleChange}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className={card(isDark)}>
                        <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>SEO <span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>(optional)</span></h3>
                        <div className="space-y-3">
                            <input
                                name="metaTitle"
                                value={form.metaTitle}
                                onChange={handleChange}
                                placeholder="Meta Title (max 70 chars)"
                                maxLength={70}
                                className={inputCls(isDark, false)}
                            />
                            <textarea
                                name="metaDescription"
                                value={form.metaDescription}
                                onChange={handleChange}
                                placeholder="Meta Description (max 160 chars)"
                                maxLength={160}
                                rows={2}
                                className={`${inputCls(isDark, false)} resize-none`}
                            />
                        </div>
                    </div>

                    {/* bottom submit */}
                    <button onClick={() => handleSubmit('published')} disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck size={15} />}
                        {isEdit ? 'Update & Publish' : 'Publish Blog'}
                    </button>
                </div>
            </div>

            <style jsx>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: ${isDark ? '#64748b' : '#94a3b8'};
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}

export default function BlogFormPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <FiLoader className="animate-spin text-indigo-500" size={32} />
            </div>
        }>
            <BlogFormInner />
        </Suspense>
    );
}
