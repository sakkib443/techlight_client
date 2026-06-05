'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiLayers, FiPlus, FiTrash2, FiRefreshCw, FiX, FiArrowLeft, FiCalendar, FiUser,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';
import CourseSelect from '@/components/Admin/CourseSelect';

const EMPTY_FORM = {
  batchNumber: '',
  batchName: '',
  courseName: '',
  mentorName: '',
  startDate: '',
  endDate: '',
};

export default function CertificateBatchesPage() {
  const { isDark } = useTheme();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/certificate-batches`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setBatches(data.data || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openForm = () => {
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const handleCreate = async () => {
    if (!form.batchNumber.trim() || !form.batchName.trim() || !form.mentorName.trim() || !form.startDate || !form.endDate) {
      toast.error('Batch number, name, mentor, start & end dates are required');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('End date cannot be before start date');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/certificate-batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          batchNumber: form.batchNumber.trim(),
          batchName: form.batchName.trim(),
          courseName: form.courseName.trim() || undefined,
          mentorName: form.mentorName.trim(),
          startDate: form.startDate,
          endDate: form.endDate,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Batch created successfully');
        setShowForm(false);
        fetchBatches();
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

  const handleDelete = async (b) => {
    if (!window.confirm(`Delete batch "${b.batchName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/certificate-batches/${b._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Batch deleted');
        fetchBatches();
      } else {
        toast.error(data.message || 'Failed to delete batch');
      }
    } catch (err) {
      console.error('Error deleting batch:', err);
      toast.error('Internal server error');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const inputCls = isDark
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
    : 'bg-white border-gray-200 text-gray-900';
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`;

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin/certification"
            className={`p-2 rounded-md border ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
          >
            <FiArrowLeft size={16} />
          </Link>
          <div className={`p-2 rounded-md ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
            <FiLayers className="text-cyan-500" size={20} />
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Certificate Batches</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Reusable batch info (mentor, dates) for certificates
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchBatches}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <FiRefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={openForm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            <FiPlus size={16} />
            Create Batch
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-36 rounded-md border animate-pulse ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`} />
          ))}
        </div>
      ) : batches.length === 0 ? (
        <div className={`rounded-md border p-14 text-center ${card}`}>
          <FiLayers className={`mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} size={34} />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No batches yet. Create your first batch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((b) => (
            <div key={b._id} className={`rounded-md border p-4 ${card}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>
                    {b.batchNumber}
                  </span>
                  <h3 className={`mt-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{b.batchName}</h3>
                  {b.courseName && (
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{b.courseName}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(b)}
                  title="Delete"
                  className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'}`}
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
              <div className={`mt-3 space-y-1.5 text-xs ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                <p className="flex items-center gap-2"><FiUser size={13} /> {b.mentorName}</p>
                <p className="flex items-center gap-2"><FiCalendar size={13} /> {formatDate(b.startDate)} – {formatDate(b.endDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`sticky top-0 flex items-center justify-between p-4 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Batch</h3>
              <button onClick={() => setShowForm(false)} className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <FiX size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Batch Number <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. B-08" value={form.batchNumber} onChange={(e) => upd('batchNumber', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
                <div>
                  <label className={labelCls}>Batch Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. MERN Batch 08" value={form.batchName} onChange={(e) => upd('batchName', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Course / Program <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>(optional)</span></label>
                <CourseSelect value={form.courseName} onChange={(v) => upd('courseName', v)} isDark={isDark} />
              </div>

              <div>
                <label className={labelCls}>Mentor Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Mentor / Instructor name" value={form.mentorName} onChange={(e) => upd('mentorName', e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Start Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.startDate} onChange={(e) => upd('startDate', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
                <div>
                  <label className={labelCls}>End Date <span className="text-red-500">*</span></label>
                  <input type="date" value={form.endDate} onChange={(e) => upd('endDate', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
              </div>
            </div>

            <div className={`sticky bottom-0 flex justify-end gap-2 p-4 border-t ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <button
                onClick={() => setShowForm(false)}
                className={`px-4 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              >
                {submitting ? <FiRefreshCw className="animate-spin" size={15} /> : <FiPlus size={15} />}
                Create Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
