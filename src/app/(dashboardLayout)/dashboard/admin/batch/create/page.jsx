'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLayers, FiArrowLeft, FiSave, FiPlus, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';

const DAYS = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export default function CreateBatchPage() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    course: '', batchName: '', batchCode: '', description: '',
    startDate: '', endDate: '', enrollmentDeadline: '', maxStudents: 50, isActive: true,
  });
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/courses?limit=200`);
        const d = await res.json();
        setCourses((d.data || []).filter((c) => c.courseType !== 'recorded'));
      } catch (e) {
        console.error('Failed to load courses', e);
      }
    })();
  }, []);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const addRow = () => setSchedule((s) => [...s, { day: 'saturday', startTime: '', endTime: '' }]);
  const updRow = (i, k, v) => setSchedule((s) => s.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));
  const delRow = (i) => setSchedule((s) => s.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.course || !form.batchName || !form.batchCode || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        maxStudents: Number(form.maxStudents) || 50,
        description: form.description || undefined,
        enrollmentDeadline: form.enrollmentDeadline || undefined,
        schedule: schedule.filter((s) => s.day && s.startTime && s.endTime),
      };
      const res = await fetch(`${API_URL}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Batch created successfully');
        router.push('/dashboard/admin/batch');
      } else {
        toast.error(data.message || 'Failed to create batch');
      }
    } catch (err) {
      console.error('Error creating batch:', err);
      toast.error('Internal server error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900';
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`;
  const field = `w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`;

  return (
    <div className="p-5 max-w-3xl">
      <Link
        href="/dashboard/admin/batch"
        className={`inline-flex items-center gap-1.5 text-sm mb-4 ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
      >
        <FiArrowLeft size={15} /> Back to Batches
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-md ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
          <FiLayers className="text-cyan-500" size={20} />
        </div>
        <div>
          <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Batch</h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>For online or offline courses</p>
        </div>
      </div>

      <form onSubmit={submit} className={`rounded-md border p-5 space-y-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div>
          <label className={labelCls}>Course *</label>
          <select value={form.course} onChange={(e) => upd('course', e.target.value)} className={field}>
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Batch Name *</label>
            <input value={form.batchName} onChange={(e) => upd('batchName', e.target.value)} placeholder="Morning Batch" className={field} />
          </div>
          <div>
            <label className={labelCls}>Batch Code *</label>
            <input value={form.batchCode} onChange={(e) => upd('batchCode', e.target.value)} placeholder="WEB-B01" className={field} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea value={form.description} onChange={(e) => upd('description', e.target.value)} rows={2} className={field} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Start Date *</label>
            <input type="date" value={form.startDate} onChange={(e) => upd('startDate', e.target.value)} className={field} />
          </div>
          <div>
            <label className={labelCls}>End Date *</label>
            <input type="date" value={form.endDate} onChange={(e) => upd('endDate', e.target.value)} className={field} />
          </div>
          <div>
            <label className={labelCls}>Enroll Deadline</label>
            <input type="date" value={form.enrollmentDeadline} onChange={(e) => upd('enrollmentDeadline', e.target.value)} className={field} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Max Students</label>
            <input type="number" min={1} value={form.maxStudents} onChange={(e) => upd('maxStudents', e.target.value)} className={field} />
          </div>
          <div className="flex items-end">
            <label className={`flex items-center gap-2 text-sm cursor-pointer ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => upd('isActive', e.target.checked)} className="w-4 h-4" />
              Active
            </label>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Weekly Schedule (optional)</span>
            <button
              type="button"
              onClick={addRow}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <FiPlus size={12} /> Add
            </button>
          </div>
          {schedule.length === 0 ? (
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>No schedule added</p>
          ) : (
            <div className="space-y-2">
              {schedule.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                  <select value={row.day} onChange={(e) => updRow(i, 'day', e.target.value)} className={field}>
                    {DAYS.map((d) => <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>)}
                  </select>
                  <input value={row.startTime} onChange={(e) => updRow(i, 'startTime', e.target.value)} placeholder="10:00 AM" className={field} />
                  <input value={row.endTime} onChange={(e) => updRow(i, 'endTime', e.target.value)} placeholder="12:00 PM" className={field} />
                  <button type="button" onClick={() => delRow(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link
            href="/dashboard/admin/batch"
            className={`px-4 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
          >
            {submitting ? <FiRefreshCw className="animate-spin" size={15} /> : <FiSave size={15} />}
            Create Batch
          </button>
        </div>
      </form>
    </div>
  );
}
