'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiUsers, FiArrowLeft, FiRefreshCw, FiX, FiMail, FiPhone, FiSearch,
  FiFolder, FiBook, FiCalendar, FiUserX,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';

export default function BatchStudentsPage() {
  const { isDark } = useTheme();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [openBatch, setOpenBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

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

  const openFolder = async (batch) => {
    setOpenBatch(batch);
    setStudents([]);
    try {
      setStudentsLoading(true);
      const res = await fetch(`${API_URL}/batches/${batch._id}/students`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const d = await res.json();
      setStudents(d.data || []);
    } catch (err) {
      console.error('Error fetching batch students:', err);
      toast.error('Failed to load students');
    } finally {
      setStudentsLoading(false);
    }
  };

  const removeStudent = async (studentId) => {
    if (!openBatch) return;
    if (!window.confirm('Remove this student from the batch?')) return;
    try {
      const res = await fetch(`${API_URL}/batches/${openBatch._id}/students/${studentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const d = await res.json();
      if (res.ok && d.success) {
        toast.success('Student removed from batch');
        setStudents((prev) => prev.filter((e) => (e.student?._id || e.student) !== studentId));
        fetchBatches();
      } else {
        toast.error(d.message || 'Failed to remove student');
      }
    } catch (err) {
      console.error('Error removing student:', err);
      toast.error('Internal server error');
    }
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A');

  const filtered = batches.filter((b) =>
    `${b.batchName} ${b.batchCode} ${b.course?.title || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const card = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const inputCls = isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900';

  return (
    <div className="p-5">
      <Link
        href="/dashboard/admin/batch"
        className={`inline-flex items-center gap-1.5 text-sm mb-4 ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
      >
        <FiArrowLeft size={15} /> Back to Batches
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
            <FiUsers className="text-cyan-500" size={20} />
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Batch Students</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Open a batch folder to see its students</p>
          </div>
        </div>
        <button
          onClick={fetchBatches}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <FiRefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={16} />
        <input
          type="text"
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`}
        />
      </div>

      {/* Folder grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className={`h-32 rounded-md border animate-pulse ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className={`py-16 text-center rounded-md border border-dashed ${isDark ? 'border-slate-700 bg-slate-900/30' : 'border-gray-200 bg-gray-50'}`}>
          <FiFolder className={`mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} size={34} />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No batches found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <button
              key={b._id}
              onClick={() => openFolder(b)}
              className={`text-left p-4 rounded-md border transition-all hover:shadow-md ${card} ${isDark ? 'hover:border-cyan-500/40' : 'hover:border-cyan-300'}`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                  <FiFolder className="text-cyan-500" size={20} />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                  {b.enrolledCount ?? 0} / {b.maxStudents}
                </span>
              </div>
              <h3 className={`mt-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{b.batchName}</h3>
              <code className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{b.batchCode}</code>
              <p className={`mt-2 text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                <FiBook size={12} /> {b.course?.title || '—'}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Students Modal */}
      {openBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-md flex items-center justify-center ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                  <FiFolder className="text-cyan-500" size={18} />
                </div>
                <div>
                  <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{openBatch.batchName}</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{openBatch.course?.title}</p>
                </div>
              </div>
              <button onClick={() => setOpenBatch(null)} className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <FiX size={18} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {studentsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => <div key={i} className={`h-14 rounded-md animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`} />)}
                </div>
              ) : students.length === 0 ? (
                <div className="py-10 text-center">
                  <FiUsers className={`mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} size={30} />
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No students assigned to this batch yet</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Assign students from the Enrollments page</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {students.map((e) => {
                    const s = e.student || {};
                    const name = `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unknown';
                    return (
                      <div key={e._id} className={`flex items-center justify-between p-3 rounded-md border ${isDark ? 'border-slate-700 bg-slate-900/30' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          {s.avatar ? (
                            <img src={s.avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                              {name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</p>
                            <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                              {s.email && <span className="flex items-center gap-1 truncate"><FiMail size={11} /> {s.email}</span>}
                              {s.phone && <span className="flex items-center gap-1"><FiPhone size={11} /> {s.phone}</span>}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeStudent(s._id)}
                          title="Remove from batch"
                          className={`p-1.5 rounded-md shrink-0 ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'}`}
                        >
                          <FiUserX size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={`flex items-center justify-between p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{students.length} student(s)</span>
              <button onClick={() => setOpenBatch(null)} className={`px-4 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
