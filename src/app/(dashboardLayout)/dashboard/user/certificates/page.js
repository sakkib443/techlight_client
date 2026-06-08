'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiAward, FiDownload, FiEye, FiArrowRight, FiBook,
    FiRefreshCw, FiX, FiCalendar, FiCheckCircle,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config/api';
import { generateCertificatePDF } from '@/utils/generateCertificatePDF';

export default function UserCertificatesPage() {
    const { isDark } = useTheme();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/certificates/my`, {
                headers: { Authorization: `Bearer ${token}` },
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
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const card = isDark
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-gray-200 shadow-sm';

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-lg border ${card}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                        <FiAward className="text-amber-500" size={22} />
                    </div>
                    <div>
                        <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Certificates</h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            View and download your earned certificates
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchCertificates}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    <FiRefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`h-44 rounded-lg border animate-pulse ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`} />
                    ))}
                </div>
            ) : certificates.length === 0 ? (
                /* Empty state */
                <div className={`py-16 text-center rounded-lg border border-dashed ${isDark ? 'border-slate-700 bg-slate-900/30' : 'border-gray-200 bg-gray-50'}`}>
                    <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <FiAward size={30} className={isDark ? 'text-slate-600' : 'text-gray-300'} />
                    </div>
                    <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>No certificates yet</h2>
                    <p className={`text-sm mt-2 max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                        Your certificates will appear here once your institute issues them. Keep learning!
                    </p>
                    <Link
                        href="/dashboard/user/courses"
                        className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
                    >
                        Go to My Courses <FiArrowRight size={15} />
                    </Link>
                </div>
            ) : (
                /* Certificate cards */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((cert) => (
                        <div key={cert._id} className={`rounded-lg border overflow-hidden ${card}`}>
                            {/* Ribbon */}
                            <div className="bg-gradient-to-r from-[#E31E27] to-indigo-500 px-4 py-3 flex items-center justify-between">
                                <span className="text-white text-xs font-medium flex items-center gap-1.5">
                                    <FiCheckCircle size={13} /> Certified
                                </span>
                                <code className="text-[10px] text-white/90 bg-white/15 px-2 py-0.5 rounded">{cert.certificateNumber}</code>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                                        <FiAward className="text-amber-500" size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {cert.courseName || cert.title || cert.batchName}
                                        </h3>
                                        {(cert.batchName || cert.batch?.batchName) && (
                                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Batch: {cert.batchName || cert.batch?.batchName}</p>
                                        )}
                                        <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <FiCalendar size={12} /> {formatDate(cert.issueDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => setSelected(cert)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <FiEye size={14} /> View
                                    </button>
                                    <button
                                        onClick={() => download(cert)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                    >
                                        <FiDownload size={14} /> PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className={`w-full max-w-xl rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Certificate Preview</h3>
                            <button onClick={() => setSelected(null)} className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="p-5">
                            <div className={`rounded-lg border-2 p-6 text-center ${isDark ? 'border-slate-700 bg-slate-900/40' : 'border-indigo-100 bg-slate-50'}`}>
                                <p className="text-lg font-bold"><span className="text-[#E31E27]">Tech</span><span className={isDark ? 'text-white' : 'text-gray-800'}>light</span></p>
                                <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>IT Solution</p>
                                <p className={`mt-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Certificate of Completion</p>
                                <p className={`mt-3 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>This is to certify that</p>
                                <p className="text-xl font-bold text-[#E31E27] mt-1">{selected.studentName}</p>
                                <p className={`mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>has successfully completed</p>
                                <p className={`text-base font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selected.courseName || selected.title || selected.batchName}</p>
                                {(selected.batchName || selected.batch?.batchName) && (
                                    <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Batch: {selected.batchName || selected.batch?.batchName}</p>
                                )}
                                <div className="flex items-center justify-center gap-4 mt-5 text-[11px]">
                                    <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>{formatDate(selected.issueDate)}</span>
                                    <code className={`px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>{selected.certificateNumber}</code>
                                </div>
                            </div>
                        </div>

                        <div className={`flex justify-end gap-2 p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                            <button
                                onClick={() => setSelected(null)}
                                className={`px-4 py-2 text-sm rounded-md border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                Close
                            </button>
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
