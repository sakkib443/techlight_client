'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FiHome, FiSave, FiRefreshCw, FiEye, FiImage, FiGrid, FiUpload, FiX } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';

const HERO_DEFAULTS = {
  bannerImage: '/images/bg hero.png',
};

const PROVIDE_DEFAULTS = {
  badge: 'About Our Platform',
  title: 'Breaking Barriers Through',
  titleHighlight: 'Language & Technology',
  description:
    'The core mission of Techlight IT Solution is to empower individuals with both technical and practical skills to enhance their career opportunities. Learn hands-on from our industry expert instructors.',
  buttonText: 'Explore All Courses',
  buttonLink: '/courses',
  features: [
    { title: 'Flexible Schedule', desc: 'Learn at your own pace and time' },
    { title: '24/7 Online Support', desc: 'Get help whenever you need it' },
    { title: 'Smart Learning Process', desc: 'Modern methods for easy learning' },
  ],
  provideImage: '/images/57462951_2085649778223584_3709857119512559616_n.jpg',
};

export default function HomeDesignPage() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState('hero');
  const [hero, setHero] = useState(HERO_DEFAULTS);
  const [provide, setProvide] = useState(PROVIDE_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState({ bannerImage: false, provideImage: false });

  const handleImageUpload = async (key, file, section = 'hero') => {
    if (!file) return;
    const token = localStorage.getItem('token');
    setUploadingImg(prev => ({ ...prev, [key]: true }));
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_URL}/upload/single`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (section === 'provide') {
          pSet(key, data.data.url);
        } else {
          hSet(key, data.data.url);
        }
        toast.success('Image uploaded!');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (e) {
      toast.error('Upload failed');
    } finally {
      setUploadingImg(prev => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [h, p] = await Promise.all([
        fetch(`${API_URL}/design/hero`).then((r) => r.json()).catch(() => null),
        fetch(`${API_URL}/design/provide`).then((r) => r.json()).catch(() => null),
      ]);
      const hc = h?.data?.heroContent;
      if (hc && Object.keys(hc).length) {
        setHero({ ...HERO_DEFAULTS, ...hc });
      }
      const pc = p?.data?.provideContent;
      if (pc && Object.keys(pc).length) {
        setProvide({ ...PROVIDE_DEFAULTS, ...pc, features: pc.features?.length ? pc.features : PROVIDE_DEFAULTS.features });
      }
    } catch (e) {
      console.error('Error fetching home content:', e);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const isHero = tab === 'hero';
      const res = await fetch(`${API_URL}/design/${isHero ? 'hero' : 'provide'}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(isHero ? { heroContent: hero } : { provideContent: provide }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`${isHero ? 'Hero' : 'What We Provide'} section saved`);
      } else {
        toast.error(data.message || 'Failed to save');
      }
    } catch (e) {
      console.error('Error saving:', e);
      toast.error('Internal server error');
    } finally {
      setSaving(false);
    }
  };

  const hSet = (k, v) => setHero((p) => ({ ...p, [k]: v }));
  const hStat = (i, k, v) => setHero((p) => ({ ...p, stats: p.stats.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }));
  const pSet = (k, v) => setProvide((p) => ({ ...p, [k]: v }));
  const pFeat = (i, k, v) => setProvide((p) => ({ ...p, features: p.features.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)) }));

  const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const inputCls = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900';
  const field = `w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`;
  const label = `block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`;

  const TabButton = ({ id, icon: Icon, children }) => (
    <button
      onClick={() => setTab(id)}
      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border transition-colors ${
        tab === id
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : isDark
          ? 'border-slate-700 text-slate-300 hover:bg-slate-700'
          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={15} />
      {children}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <FiRefreshCw className="animate-spin text-indigo-500" size={28} />
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
            <FiHome className="text-indigo-500" size={20} />
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Home Page Content</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Edit the Hero and What We Provide sections</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <FiRefreshCw size={15} /> Refresh
          </button>
          <a href="/" target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <FiEye size={15} /> Preview
          </a>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50">
            {saving ? <FiRefreshCw className="animate-spin" size={15} /> : <FiSave size={15} />} Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <TabButton id="hero" icon={FiImage}>Hero Section</TabButton>
        <TabButton id="provide" icon={FiGrid}>What We Provide</TabButton>
      </div>

      {/* HERO TAB */}
      {tab === 'hero' && (
        <div className={`rounded-md border p-5 space-y-4 ${card}`}>
          <div>
            <label className={label}>Hero Banner Image</label>
            <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              এই ছবিটি Homepage-এর Hero section-এ full-width banner হিসেবে দেখাবে।
            </p>
            <div className={`rounded-md border p-4 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              {hero.bannerImage && (
                <div className="relative mb-3">
                  <img src={hero.bannerImage} alt="Hero Banner" className="w-full max-h-64 object-cover rounded-md" />
                  <button
                    onClick={() => hSet('bannerImage', '')}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow"
                  >
                    <FiX size={13} />
                  </button>
                </div>
              )}
              <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-md border border-dashed cursor-pointer transition-colors text-sm font-medium
                ${uploadingImg.bannerImage ? 'opacity-60 cursor-not-allowed' : ''}
                ${isDark ? 'border-slate-600 text-slate-400 hover:border-indigo-500 hover:text-indigo-400' : 'border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-500'}`}>
                {uploadingImg.bannerImage ? (
                  <><FiRefreshCw className="animate-spin" size={14} /> Uploading...</>
                ) : (
                  <><FiUpload size={14} /> Upload Banner Image</>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImg.bannerImage}
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('bannerImage', e.target.files[0])}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* PROVIDE TAB */}
      {tab === 'provide' && (
        <div className={`rounded-md border p-5 space-y-4 ${card}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Badge text</label>
              <input value={provide.badge || ''} onChange={(e) => pSet('badge', e.target.value)} className={field} placeholder="About Our Platform" />
            </div>
            <div>
              <label className={label}>Highlighted text (colored part)</label>
              <input value={provide.titleHighlight || ''} onChange={(e) => pSet('titleHighlight', e.target.value)} className={field} placeholder="Language & Technology" />
            </div>
          </div>
          <div>
            <label className={label}>Title</label>
            <input value={provide.title || ''} onChange={(e) => pSet('title', e.target.value)} className={field} placeholder="Breaking Barriers Through" />
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Shown as: <span className="font-medium">{provide.title}</span> <span className="text-[#E31E27] font-medium">{provide.titleHighlight}</span></p>
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea value={provide.description || ''} onChange={(e) => pSet('description', e.target.value)} rows={3} className={field} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Button text</label>
              <input value={provide.buttonText || ''} onChange={(e) => pSet('buttonText', e.target.value)} className={field} placeholder="Explore All Courses" />
            </div>
            <div>
              <label className={label}>Button link</label>
              <input value={provide.buttonLink || ''} onChange={(e) => pSet('buttonLink', e.target.value)} className={field} placeholder="/courses" />
            </div>
          </div>
          <div>
            <label className={label}>Feature highlights (3 items)</label>
            <div className="space-y-3">
              {provide.features.map((f, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={f.title || ''} onChange={(e) => pFeat(i, 'title', e.target.value)} className={field} placeholder="Flexible Schedule" />
                  <input value={f.desc || ''} onChange={(e) => pFeat(i, 'desc', e.target.value)} className={field} placeholder="Short description" />
                </div>
              ))}
            </div>
          </div>

          {/* Provide Section Image */}
          <div>
            <label className={label}>Section Image (বাম পাশের ছবি)</label>
            <div className={`rounded-md border p-3 max-w-xs ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              {provide.provideImage && (
                <div className="relative mb-2">
                  <img src={provide.provideImage} alt="Provide" className="w-full h-40 object-cover rounded-md" />
                  <button
                    onClick={() => pSet('provideImage', '')}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              )}
              <label className={`flex items-center justify-center gap-2 w-full py-2 rounded-md border border-dashed cursor-pointer transition-colors text-xs font-medium
                ${uploadingImg.provideImage ? 'opacity-60 cursor-not-allowed' : ''}
                ${isDark ? 'border-slate-600 text-slate-400 hover:border-indigo-500 hover:text-indigo-400' : 'border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-500'}`}>
                {uploadingImg.provideImage ? (
                  <><FiRefreshCw className="animate-spin" size={13} /> Uploading...</>
                ) : (
                  <><FiUpload size={13} /> Upload Image</>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImg.provideImage}
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload('provideImage', e.target.files[0], 'provide');
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
