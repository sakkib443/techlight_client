'use client';

import React, { useEffect, useState } from 'react';
import { API_URL } from '@/config/api';

/**
 * Course picker for certificate / batch forms.
 * Lists the site's real courses (from /api/courses) in a dropdown, with an
 * "Other (type manually)" escape hatch for courses not in the system.
 * The stored value is the course title (string).
 */
export default function CourseSelect({ value, onChange, isDark, placeholder = '— Select course —' }) {
  const [courses, setCourses] = useState([]);
  const [custom, setCustom] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/courses?limit=200`)
      .then((r) => r.json())
      .then((d) => { if (active) setCourses(d.data || []); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // If a pre-filled value isn't one of the known course titles, treat it as custom.
  useEffect(() => {
    if (value && courses.length && !courses.some((c) => c.title === value)) setCustom(true);
  }, [value, courses]);

  const inputCls = isDark
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
    : 'bg-white border-gray-200 text-gray-900';
  const base = `w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`;

  if (custom) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          placeholder="Type course name"
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
        <button
          type="button"
          onClick={() => { setCustom(false); onChange(''); }}
          className={`px-3 text-xs rounded-md border whitespace-nowrap ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          List
        </button>
      </div>
    );
  }

  return (
    <select
      value={courses.some((c) => c.title === value) ? value : ''}
      onChange={(e) => {
        if (e.target.value === '__other__') { setCustom(true); onChange(''); }
        else onChange(e.target.value);
      }}
      className={base}
    >
      <option value="">{placeholder}</option>
      {courses.map((c) => (
        <option key={c._id} value={c.title}>{c.title}</option>
      ))}
      <option value="__other__">Other (type manually)…</option>
    </select>
  );
}
