'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FiHome, FiSave, FiRefreshCw, FiEye, FiImage, FiGrid, FiUpload, FiX, FiVideo, FiYoutube } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';

const HERO_DEFAULTS = {
  mediaType: 'image', // 'image' | 'video' | 'youtube'
  bannerImage: '/images/bg hero.png',
  videoUrl: '',
  youtubeUrl: '',
};

// Extract the 11-char video id from any common YouTube URL shape
const getYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
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
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleVideoUpload = async (file) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video must be under 50MB');
      return;
    }
    const token = localStorage.getItem('token');
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('video', file);
      const res = await fetch(`${API_URL}/upload/video`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        hSet('videoUrl', data.data.url);
        toast.success('Video uploaded!');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (e) {
      toast.error('Upload failed');
    } finally {
      setUploadingVideo(false);
    }
  };

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
        <div className={`rounded-md border p-5 space-y-5 ${card}`}>
          {/* Media type selector */}
          <div>
            <label className={label}>Hero-তে কী দেখাবে?</label>
            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Homepage-এর Hero banner জায়গায় ছবি, আপলোড করা ভিডিও, অথবা YouTube ভিডিও — যেকোনো একটি দেখাতে পারবেন।
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'image', icon: FiImage, label: 'Image' },
                { id: 'video', icon: FiVideo, label: 'Upload Video' },
                { id: 'youtube', icon: FiYoutube, label: 'YouTube' },
              ].map((m) => {
                const active = (hero.mediaType || 'image') === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => hSet('mediaType', m.id)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm rounded-md border transition-colors ${
                      active
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : isDark
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <m.icon size={15} /> {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ---- IMAGE / Poster ---- */}
          <div>
            <label className={label}>
              {(hero.mediaType || 'image') === 'image' ? 'Hero Banner Image' : 'Banner Image (ভিডিও লোড হওয়ার আগে / poster হিসেবে দেখাবে)'}
            </label>
            <div className={`flex items-start gap-2 text-xs mb-3 px-3 py-2 rounded-md ${isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
              <FiImage size={14} className="mt-0.5 shrink-0" />
              <div className="leading-relaxed">
                <span className="font-semibold">Recommended:</span> 1920 × 640 px (Ratio 3:1), landscape। সর্বোচ্চ 2MB, format: JPG / PNG / WebP।
                সঠিক ratio না হলে ছবির উপর/নিচ কিছুটা crop হতে পারে।
              </div>
            </div>
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

          {/* ---- VIDEO UPLOAD ---- */}
          {(hero.mediaType || 'image') === 'video' && (
            <div>
              <label className={label}>Banner Video (Cloudinary তে আপলোড হবে)</label>
              <div className={`flex items-start gap-2 text-xs mb-3 px-3 py-2 rounded-md ${isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                <FiVideo size={14} className="mt-0.5 shrink-0" />
                <div className="leading-relaxed">
                  সর্বোচ্চ 50MB, format: MP4 / WebM / MOV। ভিডিও autoplay হবে, muted ও loop অবস্থায় চলবে (banner-এর মতো)।
                </div>
              </div>
              <div className={`rounded-md border p-4 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                {hero.videoUrl && (
                  <div className="relative mb-3">
                    <video src={hero.videoUrl} controls muted className="w-full max-h-64 rounded-md bg-black" />
                    <button
                      onClick={() => hSet('videoUrl', '')}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow"
                    >
                      <FiX size={13} />
                    </button>
                  </div>
                )}
                <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-md border border-dashed cursor-pointer transition-colors text-sm font-medium
                  ${uploadingVideo ? 'opacity-60 cursor-not-allowed' : ''}
                  ${isDark ? 'border-slate-600 text-slate-400 hover:border-indigo-500 hover:text-indigo-400' : 'border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-500'}`}>
                  {uploadingVideo ? (
                    <><FiRefreshCw className="animate-spin" size={14} /> Uploading...</>
                  ) : (
                    <><FiUpload size={14} /> {hero.videoUrl ? 'Replace Video' : 'Upload Banner Video'}</>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    disabled={uploadingVideo}
                    onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          )}

          {/* ---- YOUTUBE LINK ---- */}
          {(hero.mediaType || 'image') === 'youtube' && (
            <div>
              <label className={label}>YouTube Video Link</label>
              <div className={`flex items-start gap-2 text-xs mb-3 px-3 py-2 rounded-md ${isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                <FiYoutube size={14} className="mt-0.5 shrink-0" />
                <div className="leading-relaxed">
                  পুরো YouTube লিঙ্ক পেস্ট করুন (যেমন: https://youtu.be/xxxx অথবা https://www.youtube.com/watch?v=xxxx)। ভিডিও autoplay, muted ও loop অবস্থায় চলবে।
                </div>
              </div>
              <input
                value={hero.youtubeUrl || ''}
                onChange={(e) => hSet('youtubeUrl', e.target.value)}
                className={field}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {hero.youtubeUrl && !getYouTubeId(hero.youtubeUrl) && (
                <p className="text-xs mt-1.5 text-red-500">এই লিঙ্ক থেকে YouTube video id পাওয়া যায়নি — লিঙ্কটি ঠিক আছে কিনা দেখুন।</p>
              )}
            </div>
          )}

          {/* ---- LIVE PREVIEW (Hero section যেভাবে দেখাবে) ---- */}
          <div>
            <label className={label}>Live Preview — Homepage Hero যেভাবে দেখাবে</label>
            <div className={`rounded-md border overflow-hidden ${isDark ? 'border-slate-700 bg-black' : 'border-gray-200 bg-gray-50'}`}>
              {(() => {
                const mt = hero.mediaType || 'image';
                const ytId = getYouTubeId(hero.youtubeUrl);
                if (mt === 'video' && hero.videoUrl) {
                  return (
                    <video src={hero.videoUrl} poster={hero.bannerImage || undefined} autoPlay muted loop playsInline className="block w-full h-auto" />
                  );
                }
                if (mt === 'youtube' && ytId) {
                  return (
                    <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                        title="Hero Preview"
                        frameBorder="0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }
                if (hero.bannerImage) {
                  return <img src={hero.bannerImage} alt="Hero Preview" className="block w-full h-auto" />;
                }
                return (
                  <div className={`flex items-center justify-center py-16 text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                    কোনো media সেট করা হয়নি — উপরে ছবি/ভিডিও যোগ করুন।
                  </div>
                );
              })()}
            </div>
            <p className={`text-[11px] mt-1.5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
              পরিবর্তন save করার পর Homepage-এ live দেখাবে। <span className="font-medium">Save Changes</span> চাপতে ভুলবেন না।
            </p>
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
