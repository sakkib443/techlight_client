"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuUser, LuArrowRight, LuBriefcase } from "react-icons/lu";
import { API_BASE_URL } from "@/config/api";

const MentorSkeleton = () => (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="h-56 bg-slate-200 animate-pulse" />
        <div className="p-5 space-y-3">
            <div className="h-6 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="flex gap-1.5 pt-2">
                <div className="h-5 bg-slate-200 rounded-full w-14" />
                <div className="h-5 bg-slate-200 rounded-full w-16" />
                <div className="h-5 bg-slate-200 rounded-full w-12" />
            </div>
        </div>
    </div>
);

export default function MentorsPage() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/instructors`);
                const data = await res.json();
                if (data.success) {
                    setMentors((data.data || []).filter((m) => m.isActive !== false));
                }
            } catch (err) {
                console.error("Error fetching mentors:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="relative py-12 lg:py-16 bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E31E27]/5 via-transparent to-[#E31E27]/5"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(227,30,39,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(227,30,39,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#E31E27]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#E31E27]/[0.06] rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-4 lg:px-32 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E31E27]/20 rounded-full shadow-sm mb-4">
                            <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31E27] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E31E27]"></span>
                            </span>
                            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                                Our Team
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 leading-tight">
                            Meet Our{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E31E27] to-[#CC1B24]">
                                Mentors
                            </span>
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed">
                            Learn directly from industry experts who are passionate about helping
                            you become job-ready.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MentorSkeleton />
                        <MentorSkeleton />
                        <MentorSkeleton />
                    </div>
                ) : mentors.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LuUser className="text-slate-400" size={30} />
                        </div>
                        <p className="text-gray-500">No mentors available right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentors.map((m, idx) => (
                            <motion.div
                                key={m._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                                <Link href={`/mentors/${m._id}`}>
                                    <div className="group h-full flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#E31E27]/10 hover:border-[#E31E27]/30 transition-all duration-300">
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#E31E27] to-[#c41e18]">
                                            {m.image ? (
                                                <img
                                                    src={m.image}
                                                    alt={m.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white">
                                                    <LuUser size={56} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-5">
                                                <span className="px-5 py-2.5 bg-white text-[#E31E27] font-semibold rounded-xl shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 text-sm">
                                                    View Details
                                                    <LuArrowRight size={16} />
                                                </span>
                                            </div>
                                            {m.trainingExperience?.years && (
                                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#E31E27] text-white text-[11px] font-semibold rounded-lg">
                                                    {m.trainingExperience.years}+ yrs
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-1 p-5">
                                            <h2 className="text-lg font-bold text-gray-900 truncate">{m.name}</h2>
                                            <p className="text-xs text-[#E31E27] font-semibold mt-1 line-clamp-1">
                                                {m.designation}
                                            </p>
                                            {m.subject && (
                                                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                                                    <LuBriefcase className="text-[#c41e18] flex-shrink-0" size={13} />
                                                    <span className="line-clamp-1">{m.subject}</span>
                                                </p>
                                            )}

                                            {m.bio && (
                                                <p className="text-sm text-gray-500 mt-3 line-clamp-2">{m.bio}</p>
                                            )}

                                            {Array.isArray(m.specialization) && m.specialization.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                                                    {m.specialization.slice(0, 3).map((s, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
