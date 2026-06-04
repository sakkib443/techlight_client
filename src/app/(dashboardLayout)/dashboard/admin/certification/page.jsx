'use client';

import React, { useState, useEffect } from 'react';
import {
  FiSearch, FiPlus, FiTrash2, FiEye, FiAward, FiDownload,
  FiX, FiRefreshCw, FiSlash, FiCheckCircle, FiUsers, FiCalendar,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';
import { generateCertificatePDF } from '@/utils/generateCertificatePDF';

export default function CertificationsPage() {
  const { isDark } = useTheme();

  const [certificates, setCertificates] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showIssue, setShowIssue] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Issue form state
  const [enrollSearch, setEnrollSearch] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('');

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/certificates?limit=200`, {
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

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`${API_URL}/enrollments?limit=500`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setEnrollments(data.data || []);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  const openIssue = () => {
    setSelectedEnrollment(null);
    setTitle('');
    setGrade('');
    setEnrollSearch('');
    setShowIssue(true);
    if (enrollments.length === 0) fetchEnrollments();
  };

  const handleIssue = async () => {
    if (!selectedEnrollment) {
      toast.error('Please select a student enrollment');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          enrollmentId: selectedEnrollment._id,
          title: title.trim() || undefined,
          grade: grade.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Certificate issued successfully');
        setShowIssue(false);
        fetchCertificates();
      } else {
        toast.error(data.message || 'Failed to issue certificate');
      }
    } catch (err) {
      console.error('Error issuing certificate:', err);
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

  const download = (cert) => {
    try {
      generateCertificatePDF(cert);
    } catch (err) {
      console.error('PDF error:', err);
      toast.error('Could not generate the PDF');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Filters
  const filtered = certificates.filter((c) => {
    const s = searchTerm.toLowerCase();
    return (
      c.certificateNumber?.toLowerCase().includes(s) ||
      c.studentName?.toLowerCase().includes(s) ||
      c.courseName?.toLowerCase().includes(s) ||
      c.title?.toLowerCase().includes(s)
    );
  });

  const issuableEnrollments = enrollments
    .filter((e) => !e.certificateId)
    .filter((e) => {
      const s = `${e.student?.firstName || ''} ${e.student?.lastName || ''} ${e.student?.email || ''} ${e.course?.title || ''}`.toLowerCase();
      return s.includes(enrollSearch.toLowerCase());
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
              Issue and manage student certificates
            </p>
          </div>
        </div>
        <div className="flex gap-2">
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
            Issue Certificate
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
          placeholder="Search by number, student, or course..."
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
                {['Certificate No', 'Student', 'Course', 'Batch', 'Issued', 'Status', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-xs font-medium ${i === 6 ? 'text-center' : 'text-left'} ${isDark ? 'text-slate-300' : 'text-gray-600'}`}
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
                    <td colSpan={7} className="px-4 py-4">
                      <div className={`h-10 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`} />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <FiAward className={`mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} size={34} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No certificates issued yet</p>
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
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{cert.student?.email}</p>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{cert.courseName}</td>
                    <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      {cert.batch?.batchName || <span className={isDark ? 'text-slate-600' : 'text-gray-400'}>—</span>}
                    </td>
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

      {/* Issue Modal */}
      {showIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`sticky top-0 flex items-center justify-between p-4 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Issue Certificate</h3>
              <button onClick={() => setShowIssue(false)} className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <FiX size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Select enrollment */}
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Select Student Enrollment
                </label>
                {selectedEnrollment ? (
                  <div className={`flex items-center justify-between p-3 rounded-md border ${isDark ? 'border-indigo-500/40 bg-indigo-500/10' : 'border-indigo-200 bg-indigo-50'}`}>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedEnrollment.student?.firstName} {selectedEnrollment.student?.lastName}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {selectedEnrollment.course?.title}
                        {selectedEnrollment.batch?.batchName ? ` • ${selectedEnrollment.batch.batchName}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEnrollment(null)}
                      className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-white text-gray-500'}`}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={15} />
                      <input
                        type="text"
                        placeholder="Search student or course..."
                        value={enrollSearch}
                        onChange={(e) => setEnrollSearch(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`}
                      />
                    </div>
                    <div className={`mt-2 max-h-52 overflow-y-auto rounded-md border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                      {issuableEnrollments.length === 0 ? (
                        <p className={`px-3 py-4 text-center text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                          No eligible enrollments found
                        </p>
                      ) : (
                        issuableEnrollments.slice(0, 50).map((e) => (
                          <button
                            key={e._id}
                            onClick={() => { setSelectedEnrollment(e); setTitle(e.course?.title || ''); }}
                            className={`w-full text-left px-3 py-2 border-b last:border-b-0 ${isDark ? 'border-slate-700/60 hover:bg-slate-700/50' : 'border-gray-100 hover:bg-gray-50'}`}
                          >
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                              {e.student?.firstName} {e.student?.lastName}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                              {e.course?.title}{e.batch?.batchName ? ` • ${e.batch.batchName}` : ''}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Title */}
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Certificate Title <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Defaults to the course title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`}
                />
              </div>

              {/* Grade */}
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Grade / Result <span className={isDark ? 'text-slate-500' : 'text-gray-400'}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. A+, Distinction"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputCls}`}
                />
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
                disabled={submitting || !selectedEnrollment}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              >
                {submitting ? <FiRefreshCw className="animate-spin" size={15} /> : <FiAward size={15} />}
                Issue Certificate
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
                <p className="text-lg font-bold"><span className="text-[#7A85F0]">Tech</span><span className={isDark ? 'text-white' : 'text-gray-800'}>light</span></p>
                <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>IT Institute</p>
                <p className={`mt-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Certificate of Completion</p>
                <p className={`mt-3 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>This is to certify that</p>
                <p className="text-xl font-bold text-[#7A85F0] mt-1">{selected.studentName}</p>
                <p className={`mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>has successfully completed</p>
                <p className={`text-base font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selected.title || selected.courseName}</p>
                {selected.batch?.batchName && (
                  <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Batch: {selected.batch.batchName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  <FiCalendar size={14} /> {formatDate(selected.issueDate)}
                </div>
                <div className={`flex items-center gap-2 justify-end ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  <code className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>{selected.certificateNumber}</code>
                </div>
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
