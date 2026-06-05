'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiSearch, FiPlus, FiTrash2, FiEye, FiAward, FiDownload,
  FiX, FiRefreshCw, FiSlash, FiCheckCircle, FiCalendar, FiLayers,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';
import { generateCertificatePDF } from '@/utils/generateCertificatePDF';
import CourseSelect from '@/components/Admin/CourseSelect';

const EMPTY_FORM = {
  studentName: '',
  phone: '',
  email: '',
  studentId: '',
  courseName: '',
  grade: '',
  certificateBatch: '',
};

export default function CertificationsPage() {
  const { isDark } = useTheme();

  const [certificates, setCertificates] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showIssue, setShowIssue] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Issue form
  const [form, setForm] = useState(EMPTY_FORM);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    fetchCertificates();
    fetchBatches();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/certificates?limit=300`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setCertificates(data.data || []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${API_URL}/certificate-batches`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setBatches(data.data || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openIssue = () => {
    setForm(EMPTY_FORM);
    setShowIssue(true);
    if (batches.length === 0) fetchBatches();
  };

  const selectedBatch = batches.find((b) => b._id === form.certificateBatch) || null;

  const handleIssue = async () => {
    if (!form.studentName.trim() || !form.phone.trim() || !form.studentId.trim()) {
      toast.error('Student name, phone and student ID are required');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          studentName: form.studentName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          studentId: form.studentId.trim(),
          courseName: form.courseName.trim() || undefined,
          grade: form.grade.trim() || undefined,
          certificateBatch: form.certificateBatch || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Certificate created successfully');
        setShowIssue(false);
        fetchCertificates();
      } else {
        toast.error(data.message || 'Failed to create certificate');
      }
    } catch (err) {
      console.error('Error creating certificate:', err);
      toast.error('Internal server error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRevoke = async (cert) => {
    const newStatus = cert.status === 'issued' ? 'revoked' : 'issued';
    try {
      const res = await fetch(`${API_URL}/certificates/${cert._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Certificate ${newStatus}`);
        fetchCertificates();
      } else {
        toast.error(data.message || 'Failed to update certificate');
      }
    } catch (err) {
      console.error('Error updating certificate:', err);
      toast.error('Internal server error');
    }
  };

  const handleDelete = async (cert) => {
    if (!window.confirm(`Delete certificate ${cert.certificateNumber}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/certificates/${cert._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Certificate deleted');
        fetchCertificates();
      } else {
        toast.error(data.message || 'Failed to delete certificate');
      }
    } catch (err) {
      console.error('Error deleting certificate:', err);
      toast.error('Internal server error');
    }
  };

  const download = async (cert) => {
    try {
      await generateCertificatePDF(cert);
    } catch (err) {
      console.error('PDF error:', err);
      toast.error('Could not generate the PDF');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filtered = certificates.filter((c) => {
    const s = searchTerm.toLowerCase();
    return (
      c.certificateNumber?.toLowerCase().includes(s) ||
      c.studentName?.toLowerCase().includes(s) ||
      c.studentId?.toLowerCase().includes(s) ||
      c.phone?.toLowerCase().includes(s) ||
      c.courseName?.toLowerCase().includes(s)
    );
  });

  const stats = {
    total: certificates.length,
    issued: certificates.filter((c) => c.status === 'issued').length,
    revoked: certificates.filter((c) => c.status === 'revoked').length,
  };

  const statusStyle = (status) =>
    status === 'issued'
      ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
      : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';

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
          <div className={`p-2 rounded-md ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
            <FiAward className="text-orange-500" size={20} />
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Certificates</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Create and manage student certificates
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/admin/certification/batches"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <FiLayers size={15} />
            Manage Batches
          </Link>
          <button
            onClick={fetchCertificates}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <FiRefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={openIssue}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            <FiPlus size={16} />
            Create Certificate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-md border ${card}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total</p>
          <p className={`text-2xl font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
        </div>
        <div className={`p-4 rounded-md border ${card}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Issued</p>
          <p className="text-2xl font-semibold mt-1 text-green-500">{stats.issued}</p>
        </div>
        <div className={`p-4 rounded-md border ${card}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Revoked</p>
          <p className="text-2xl font-semibold mt-1 text-red-500">{stats.revoked}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={16} />
        <input
          type="text"
          placeholder="Search by number, name, ID, phone or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`}
        />
      </div>

      {/* Table */}
      <div className={`rounded-md border overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? 'bg-slate-700/50' : 'bg-gray-50'}>
                {['Certificate No', 'Student', 'Course', 'Batch', 'Mentor', 'Issued', 'Status', 'Actions'].map((h, i, arr) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-xs font-medium ${i === arr.length - 1 ? 'text-center' : 'text-left'} ${isDark ? 'text-slate-300' : 'text-gray-600'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-4 py-4">
                      <div className={`h-10 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`} />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center">
                    <FiAward className={`mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} size={34} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No certificates created yet</p>
                  </td>
                </tr>
              ) : (
                filtered.map((cert) => (
                  <tr key={cert._id} className={isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3">
                      <code className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'}`}>
                        {cert.certificateNumber}
                      </code>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                      <p className="font-medium">{cert.studentName}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{cert.studentId} · {cert.phone}</p>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{cert.courseName || '—'}</td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      {cert.batchName || cert.certificateBatch?.batchName || <span className={isDark ? 'text-slate-600' : 'text-gray-400'}>—</span>}
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{cert.mentorName || '—'}</td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{formatDate(cert.issueDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${statusStyle(cert.status)}`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => download(cert)}
                          title="Download PDF"
                          className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-green-400' : 'hover:bg-gray-100 text-gray-400 hover:text-green-500'}`}
                        >
                          <FiDownload size={16} />
                        </button>
                        <button
                          onClick={() => { setSelected(cert); setShowView(true); }}
                          title="View"
                          className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => toggleRevoke(cert)}
                          title={cert.status === 'issued' ? 'Revoke' : 'Restore'}
                          className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-amber-400' : 'hover:bg-gray-100 text-gray-400 hover:text-amber-500'}`}
                        >
                          {cert.status === 'issued' ? <FiSlash size={16} /> : <FiCheckCircle size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(cert)}
                          title="Delete"
                          className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'}`}
                        >
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
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            Showing {filtered.length} of {certificates.length} certificates
          </p>
        </div>
      </div>

      {/* Create Modal */}
      {showIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`sticky top-0 flex items-center justify-between p-4 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Certificate</h3>
              <button onClick={() => setShowIssue(false)} className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <FiX size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Batch select */}
              <div>
                <label className={labelCls}>
                  Batch <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>(fills mentor, dates & batch no.)</span>
                </label>
                {batches.length === 0 ? (
                  <div className={`flex items-center justify-between gap-2 p-3 rounded-md border text-xs ${isDark ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-gray-500'}`}>
                    <span>No batches yet.</span>
                    <Link href="/dashboard/admin/certification/batches" className="text-indigo-500 hover:underline font-medium">
                      Create a batch →
                    </Link>
                  </div>
                ) : (
                  <select
                    value={form.certificateBatch}
                    onChange={(e) => upd('certificateBatch', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`}
                  >
                    <option value="">— No batch / enter manually —</option>
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.batchNumber} — {b.batchName}
                      </option>
                    ))}
                  </select>
                )}
                {selectedBatch && (
                  <div className={`mt-2 p-3 rounded-md text-xs space-y-0.5 ${isDark ? 'bg-slate-700/40 text-slate-300' : 'bg-indigo-50 text-gray-600'}`}>
                    <p>Mentor: <span className="font-medium">{selectedBatch.mentorName}</span></p>
                    <p>Duration: <span className="font-medium">{formatDate(selectedBatch.startDate)} – {formatDate(selectedBatch.endDate)}</span></p>
                    {selectedBatch.courseName && <p>Course: <span className="font-medium">{selectedBatch.courseName}</span></p>}
                  </div>
                )}
              </div>

              {/* Student name + ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Student Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Full name" value={form.studentName} onChange={(e) => upd('studentName', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
                <div>
                  <label className={labelCls}>Student ID <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. TECH-2024-001" value={form.studentId} onChange={(e) => upd('studentId', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
              </div>

              {/* Phone + email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. 01712345678" value={form.phone} onChange={(e) => upd('phone', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
                <div>
                  <label className={labelCls}>Email <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>(optional)</span></label>
                  <input type="email" placeholder="student@email.com" value={form.email} onChange={(e) => upd('email', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
              </div>

              {/* Course + grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Course / Program <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>(optional)</span></label>
                  <CourseSelect value={form.courseName} onChange={(v) => upd('courseName', v)} isDark={isDark} placeholder={selectedBatch?.courseName ? `Use batch course (${selectedBatch.courseName})` : '— Select course —'} />
                </div>
                <div>
                  <label className={labelCls}>Grade / Result <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>(optional)</span></label>
                  <input type="text" placeholder="e.g. A+, Distinction" value={form.grade} onChange={(e) => upd('grade', e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`} />
                </div>
              </div>
            </div>

            <div className={`sticky bottom-0 flex justify-end gap-2 p-4 border-t ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <button
                onClick={() => setShowIssue(false)}
                className={`px-4 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleIssue}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              >
                {submitting ? <FiRefreshCw className="animate-spin" size={15} /> : <FiAward size={15} />}
                Create Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showView && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-xl rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Certificate Details</h3>
              <button onClick={() => setShowView(false)} className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <FiX size={18} />
              </button>
            </div>

            {/* Preview */}
            <div className="p-5">
              <div className={`rounded-lg border-2 p-6 text-center ${isDark ? 'border-slate-700 bg-slate-900/40' : 'border-indigo-100 bg-slate-50'}`}>
                <p className="text-lg font-bold"><span className="text-[#E31E27]">Tech</span><span className={isDark ? 'text-white' : 'text-gray-800'}>light</span></p>
                <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>IT Institute</p>
                <p className={`mt-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Certificate of Completion</p>
                <p className={`mt-3 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>This is to certify that</p>
                <p className="text-xl font-bold text-[#E31E27] mt-1">{selected.studentName}</p>
                <p className={`mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>has successfully completed</p>
                <p className={`text-base font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selected.courseName || selected.batchName}</p>
                {selected.mentorName && (
                  <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Mentor: {selected.mentorName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <Detail isDark={isDark} label="Student ID" value={selected.studentId} />
                <Detail isDark={isDark} label="Phone" value={selected.phone} />
                <Detail isDark={isDark} label="Email" value={selected.email || '—'} />
                <Detail isDark={isDark} label="Batch" value={selected.batchName || '—'} />
                <Detail isDark={isDark} label="Duration" value={selected.startDate ? `${formatDate(selected.startDate)} – ${formatDate(selected.endDate)}` : '—'} />
                <Detail isDark={isDark} label="Grade" value={selected.grade || '—'} />
                <Detail isDark={isDark} label="Issued" value={formatDate(selected.issueDate)} />
                <Detail isDark={isDark} label="Certificate No." value={selected.certificateNumber} />
              </div>
            </div>

            <div className={`flex justify-end gap-2 p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <button
                onClick={() => download(selected)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                <FiDownload size={15} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ isDark, label, value }) {
  return (
    <div>
      <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{label}</p>
      <p className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{value}</p>
    </div>
  );
}
