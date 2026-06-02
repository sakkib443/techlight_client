'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiLayers, FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiUsers, FiX, FiSave, FiSearch, FiCalendar,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';

export default function BatchListPage() {
  const { isDark } = useTheme();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [edit, setEdit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/batches?limit=200`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const d = await res.json();
      setBatches(d.data || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete batch "${b.batchName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/batches/${b._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.success('Batch deleted');
        fetchBatches();
      } else {
        toast.error(d.message || 'Failed to delete batch');
      }
    } catch (err) {
      console.error('Error deleting batch:', err);
      toast.error('Internal server error');
    }
  };

  const saveEdit = async () => {
    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/batches/${edit._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          batchName: edit.batchName,
          status: edit.status,
          maxStudents: Number(edit.maxStudents) || 1,
          isActive: edit.isActive,
        }),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.success('Batch updated');
        setEdit(null);
        fetchBatches();
      } else {
        toast.error(d.message || 'Failed to update batch');
      }
    } catch (err) {
      console.error('Error updating batch:', err);
      toast.error('Internal server error');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A');

  const filtered = batches.filter((b) =>
    `${b.batchName} ${b.batchCode} ${b.course?.title || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (s) =>
    ({
      upcoming: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
      ongoing: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
      completed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      cancelled: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    }[s] || 'bg-gray-50 text-gray-500');

  const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const inputCls = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900';

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
            <FiLayers className="text-cyan-500" size={20} />
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Batches</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Manage course batches</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/admin/batch/students"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <FiUsers size={15} /> Batch Students
          </Link>
          <Link
            href="/dashboard/admin/batch/create"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            <FiPlus size={16} /> Create Batch
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={16} />
        <input
          type="text"
          placeholder="Search batch, code, or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`}
        />
      </div>

      {/* Table */}
      <div className={`rounded-md border overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? 'bg-slate-700/50' : 'bg-gray-50'}>
                {['Batch', 'Course', 'Duration', 'Seats', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-xs font-medium ${i === 5 ? 'text-center' : 'text-left'} ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-4"><div className={`h-10 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`} /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <FiLayers className={`mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} size={34} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No batches yet</p>
                    <Link href="/dashboard/admin/batch/create" className="inline-block mt-3 text-sm text-indigo-500 hover:underline">Create your first batch</Link>
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b._id} className={isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{b.batchName}</p>
                      <code className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{b.batchCode}</code>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{b.course?.title || '—'}</td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      <span className="flex items-center gap-1.5"><FiCalendar size={13} /> {fmt(b.startDate)} → {fmt(b.endDate)}</span>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{b.enrolledCount ?? 0} / {b.maxStudents}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${statusStyle(b.status)}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEdit({ ...b })} title="Edit" className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}>
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => remove(b)} title="Delete" className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'}`}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-700 bg-slate-700/30' : 'border-gray-100 bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Showing {filtered.length} of {batches.length} batches</p>
        </div>
      </div>

      {/* Edit Modal */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-md rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Batch</h3>
              <button onClick={() => setEdit(null)} className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <FiX size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Batch Name</label>
                <input value={edit.batchName} onChange={(e) => setEdit({ ...edit, batchName: e.target.value })} className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Status</label>
                  <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })} className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`}>
                    {['upcoming', 'ongoing', 'completed', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Max Students</label>
                  <input type="number" min={1} value={edit.maxStudents} onChange={(e) => setEdit({ ...edit, maxStudents: e.target.value })} className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
              </div>
              <label className={`flex items-center gap-2 text-sm cursor-pointer ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                <input type="checkbox" checked={edit.isActive} onChange={(e) => setEdit({ ...edit, isActive: e.target.checked })} className="w-4 h-4" />
                Active
              </label>
            </div>
            <div className={`flex justify-end gap-2 p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <button onClick={() => setEdit(null)} className={`px-4 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Cancel</button>
              <button onClick={saveEdit} disabled={submitting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50">
                {submitting ? <FiRefreshCw className="animate-spin" size={15} /> : <FiSave size={15} />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
