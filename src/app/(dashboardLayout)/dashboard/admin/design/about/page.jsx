'use client';

import React, { useEffect, useState } from 'react';
import { FiUsers, FiSave, FiRefreshCw, FiEye, FiImage, FiGrid, FiTarget, FiBarChart2 } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';
import { mergeAboutContent } from '@/config/aboutDefaults';

export default function AboutDesignPage() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState('hero');
  const [content, setContent] = useState(() => mergeAboutContent({}));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/design/about`).then((r) => r.json()).catch(() => null);
      setContent(mergeAboutContent(res?.data?.aboutContent || {}));
    } catch (e) {
      console.error('Error fetching about content:', e);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/design/about`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ aboutContent: content }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('About page saved');
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

  // ---- Setters ----
  const setHero = (k, v) => setContent((p) => ({ ...p, hero: { ...p.hero, [k]: v } }));
  const setHeroMini = (i, k, v) =>
    setContent((p) => ({
      ...p,
      hero: { ...p.hero, miniStats: p.hero.miniStats.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) },
    }));
  const setStat = (i, k, v) =>
    setContent((p) => ({ ...p, stats: p.stats.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }));
  const setMV = (k, v) => setContent((p) => ({ ...p, missionVision: { ...p.missionVision, [k]: v } }));
  const setMVCard = (card, k, v) =>
    setContent((p) => ({
      ...p,
      missionVision: { ...p.missionVision, [card]: { ...p.missionVision[card], [k]: v } },
    }));
  const setMVPoint = (card, i, v) =>
    setContent((p) => ({
      ...p,
      missionVision: {
        ...p.missionVision,
        [card]: { ...p.missionVision[card], points: p.missionVision[card].points.map((pt, idx) => (idx === i ? v : pt)) },
      },
    }));
  const setWhy = (k, v) => setContent((p) => ({ ...p, whyChooseUs: { ...p.whyChooseUs, [k]: v } }));
  const setWhyFeat = (i, k, v) =>
    setContent((p) => ({
      ...p,
      whyChooseUs: { ...p.whyChooseUs, features: p.whyChooseUs.features.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)) },
    }));

  // ---- Styles ----
  const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const inputCls = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900';
  const field = `w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`;
  const label = `block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`;
  const subhead = `text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-gray-700'}`;

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
            <FiUsers className="text-indigo-500" size={20} />
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>About Page Content</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Edit the Hero, Stats, Mission &amp; Vision, and Why Choose Us sections</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAbout} className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <FiRefreshCw size={15} /> Refresh
          </button>
          <a href="/about" target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <FiEye size={15} /> Preview
          </a>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50">
            {saving ? <FiRefreshCw className="animate-spin" size={15} /> : <FiSave size={15} />} Save Changes
          </button>
        </div>
      </div>

      {/* Note */}
      <div className={`mb-4 text-xs rounded-md px-3 py-2 border ${isDark ? 'border-slate-700 text-slate-400 bg-slate-800/50' : 'border-amber-200 text-amber-700 bg-amber-50'}`}>
        Content is shown in English on the About page (single language). The Team section is managed under Mentor.
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <TabButton id="hero" icon={FiImage}>Hero</TabButton>
        <TabButton id="stats" icon={FiBarChart2}>Stats</TabButton>
        <TabButton id="missionVision" icon={FiTarget}>Mission &amp; Vision</TabButton>
        <TabButton id="whyChooseUs" icon={FiGrid}>Why Choose Us</TabButton>
      </div>

      {/* HERO TAB */}
      {tab === 'hero' && (
        <div className={`rounded-md border p-5 space-y-4 ${card}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Badge text</label>
              <input value={content.hero.badge || ''} onChange={(e) => setHero('badge', e.target.value)} className={field} placeholder="About Us" />
            </div>
            <div>
              <label className={label}>Highlighted text (colored part)</label>
              <input value={content.hero.titleHighlight || ''} onChange={(e) => setHero('titleHighlight', e.target.value)} className={field} placeholder="Shaping Futures" />
            </div>
          </div>
          <div>
            <label className={label}>Title (first part)</label>
            <input value={content.hero.titlePart1 || ''} onChange={(e) => setHero('titlePart1', e.target.value)} className={field} placeholder="Building Skills," />
            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Shown as: <span className="font-medium">{content.hero.titlePart1}</span> <span className="text-[#E31E27] font-medium">{content.hero.titleHighlight}</span></p>
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea value={content.hero.description || ''} onChange={(e) => setHero('description', e.target.value)} rows={3} className={field} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={label}>Primary button text</label>
              <input value={content.hero.primaryButtonText || ''} onChange={(e) => setHero('primaryButtonText', e.target.value)} className={field} placeholder="Explore Courses" />
            </div>
            <div>
              <label className={label}>Primary button link</label>
              <input value={content.hero.primaryButtonLink || ''} onChange={(e) => setHero('primaryButtonLink', e.target.value)} className={field} placeholder="/courses" />
            </div>
            <div>
              <label className={label}>Secondary button text</label>
              <input value={content.hero.secondaryButtonText || ''} onChange={(e) => setHero('secondaryButtonText', e.target.value)} className={field} placeholder="Watch Video" />
            </div>
          </div>
          <div>
            <label className={label}>Mini stats (3 items, shown under the buttons)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {content.hero.miniStats.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s.value || ''} onChange={(e) => setHeroMini(i, 'value', e.target.value)} className={`${field} w-1/3`} placeholder="5+" />
                  <input value={s.label || ''} onChange={(e) => setHeroMini(i, 'label', e.target.value)} className={field} placeholder="Years Experience" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATS TAB */}
      {tab === 'stats' && (
        <div className={`rounded-md border p-5 space-y-4 ${card}`}>
          <p className={`text-xs mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>The 4 animated counter cards. Value is the number, suffix is appended (e.g. <span className="font-medium">50</span> + <span className="font-medium">K+</span>).</p>
          <div className="space-y-3">
            {content.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input value={s.value || ''} onChange={(e) => setStat(i, 'value', e.target.value)} className={field} placeholder="50" />
                <input value={s.suffix || ''} onChange={(e) => setStat(i, 'suffix', e.target.value)} className={field} placeholder="K+" />
                <input value={s.label || ''} onChange={(e) => setStat(i, 'label', e.target.value)} className={field} placeholder="Active Students" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MISSION & VISION TAB */}
      {tab === 'missionVision' && (
        <div className={`rounded-md border p-5 space-y-5 ${card}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Section badge</label>
              <input value={content.missionVision.badge || ''} onChange={(e) => setMV('badge', e.target.value)} className={field} placeholder="Our Purpose" />
            </div>
            <div>
              <label className={label}>Heading highlight (colored)</label>
              <input value={content.missionVision.headingHighlight || ''} onChange={(e) => setMV('headingHighlight', e.target.value)} className={field} placeholder="Fueled by Passion" />
            </div>
          </div>
          <div>
            <label className={label}>Heading (first part)</label>
            <input value={content.missionVision.headingPart1 || ''} onChange={(e) => setMV('headingPart1', e.target.value)} className={field} placeholder="Driven by Purpose," />
          </div>
          <div>
            <label className={label}>Subtitle</label>
            <textarea value={content.missionVision.subtitle || ''} onChange={(e) => setMV('subtitle', e.target.value)} rows={2} className={field} />
          </div>

          {/* Mission & Vision cards */}
          {['mission', 'vision'].map((cardKey) => (
            <div key={cardKey} className={`rounded-md border p-4 space-y-3 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <p className={subhead}>{cardKey === 'mission' ? 'Mission Card' : 'Vision Card'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={label}>Title</label>
                  <input value={content.missionVision[cardKey].title || ''} onChange={(e) => setMVCard(cardKey, 'title', e.target.value)} className={field} placeholder={cardKey === 'mission' ? 'Our Mission' : 'Our Vision'} />
                </div>
              </div>
              <div>
                <label className={label}>Description</label>
                <textarea value={content.missionVision[cardKey].description || ''} onChange={(e) => setMVCard(cardKey, 'description', e.target.value)} rows={2} className={field} />
              </div>
              <div>
                <label className={label}>Bullet points (3 items)</label>
                <div className="space-y-2">
                  {content.missionVision[cardKey].points.map((pt, i) => (
                    <input key={i} value={pt || ''} onChange={(e) => setMVPoint(cardKey, i, e.target.value)} className={field} placeholder={`Point ${i + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WHY CHOOSE US TAB */}
      {tab === 'whyChooseUs' && (
        <div className={`rounded-md border p-5 space-y-4 ${card}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Section badge</label>
              <input value={content.whyChooseUs.badge || ''} onChange={(e) => setWhy('badge', e.target.value)} className={field} placeholder="Why Choose Us" />
            </div>
            <div>
              <label className={label}>Heading highlight (colored)</label>
              <input value={content.whyChooseUs.headingHighlight || ''} onChange={(e) => setWhy('headingHighlight', e.target.value)} className={field} placeholder="Different" />
            </div>
          </div>
          <div>
            <label className={label}>Heading (first part)</label>
            <input value={content.whyChooseUs.headingPart1 || ''} onChange={(e) => setWhy('headingPart1', e.target.value)} className={field} placeholder="What Makes Us" />
          </div>
          <div>
            <label className={label}>Subtitle</label>
            <textarea value={content.whyChooseUs.subtitle || ''} onChange={(e) => setWhy('subtitle', e.target.value)} rows={2} className={field} />
          </div>
          <div>
            <label className={label}>Feature cards (6 items)</label>
            <div className="space-y-3">
              {content.whyChooseUs.features.map((f, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={f.title || ''} onChange={(e) => setWhyFeat(i, 'title', e.target.value)} className={field} placeholder="Industry Experts" />
                  <input value={f.desc || ''} onChange={(e) => setWhyFeat(i, 'desc', e.target.value)} className={field} placeholder="Short description" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
