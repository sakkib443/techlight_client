"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineSparkles } from "react-icons/hi2";
import {
    LuArrowLeft,
    LuMail,
    LuPhone,
    LuBadgeCheck,
    LuUsers,
    LuBookOpen,
    LuUser,
} from "react-icons/lu";
import { FaWhatsapp, FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { API_BASE_URL } from "@/config/api";

export default function MentorDetailsPage() {
    const { id } = useParams();
    const [mentor, setMentor] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchMentor = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/instructors/${id}`);
                const result = await res.json();
                if (result.success && result.data) {
                    setMentor(result.data);
                    window.scrollTo(0, 0);
                } else {
                    setError("Mentor not found");
                }
            } catch (err) {
                console.error("Error fetching mentor:", err);
                setError("Failed to load mentor profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchMentor();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#7A85F0] mb-4" />
                    <h3 className="text-lg font-medium text-gray-800">Loading mentor...</h3>
                    <p className="text-gray-500 text-sm">Please wait a moment</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LuUsers className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Mentor Not Found</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Link
                        href="/mentors"
                        className="inline-flex items-center gap-2 bg-[#7A85F0] hover:bg-[#6571e8] text-white font-medium py-2.5 px-6 rounded-xl transition-colors"
                    >
                        <LuArrowLeft />
                        Back to Mentors
                    </Link>
                </div>
            </div>
        );
    }

    const socials = [
        { key: "facebook", icon: FaFacebookF },
        { key: "linkedin", icon: FaLinkedinIn },
        { key: "twitter", icon: FaTwitter },
        { key: "github", icon: FaGithub },
    ].filter((s) => mentor.socialLinks?.[s.key]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Back bar */}
            <div className="bg-gradient-to-r from-[#7A85F0]/10 via-white to-[#c41e18]/5 border-b border-slate-200 py-4 pt-24">
                <div className="max-w-6xl mx-auto px-4">
                    <Link
                        href="/mentors"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#7A85F0] transition-colors text-sm"
                    >
                        <LuArrowLeft />
                        Back to Mentors
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left - Image & contact */}
                    <div className="w-full lg:w-[360px] shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="relative h-[460px] w-full overflow-hidden bg-gradient-to-br from-[#7A85F0] to-[#c41e18]">
                                    {mentor.image ? (
                                        <img
                                            src={mentor.image}
                                            alt={mentor.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white">
                                            <LuUser size={80} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    {mentor.trainingExperience?.years && (
                                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#7A85F0] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5">
                                            <LuBadgeCheck />
                                            {mentor.trainingExperience.years}+ Years
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h2 className="text-2xl font-bold text-white">{mentor.name}</h2>
                                        <p className="text-white/80 text-sm">{mentor.designation}</p>
                                    </div>
                                </div>

                                <div className="p-4 space-y-3">
                                    {mentor.subject && (
                                        <span className="inline-block px-3 py-1 bg-[#c41e18]/10 text-[#c41e18] text-sm font-medium rounded-full">
                                            {mentor.subject}
                                        </span>
                                    )}

                                    {mentor.email && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-8 h-8 bg-[#7A85F0]/10 rounded-full flex items-center justify-center">
                                                <LuMail className="text-[#7A85F0] text-sm" />
                                            </div>
                                            <span className="truncate">{mentor.email}</span>
                                        </div>
                                    )}

                                    {mentor.phone && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-8 h-8 bg-[#c41e18]/10 rounded-full flex items-center justify-center">
                                                <LuPhone className="text-[#c41e18] text-sm" />
                                            </div>
                                            {mentor.phone}
                                        </div>
                                    )}

                                    {mentor.phone && (
                                        <a
                                            href={`https://wa.me/88${mentor.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                                `Hello ${mentor.name}, I want to learn from you.`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium rounded-xl transition-colors mt-2"
                                        >
                                            <FaWhatsapp className="text-lg" />
                                            Contact on WhatsApp
                                        </a>
                                    )}

                                    {socials.length > 0 && (
                                        <div className="flex items-center justify-center gap-2 pt-2">
                                            {socials.map(({ key, icon: Icon }) => (
                                                <a
                                                    key={key}
                                                    href={mentor.socialLinks[key]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#7A85F0] hover:text-white text-slate-500 flex items-center justify-center transition-colors"
                                                >
                                                    <Icon size={14} />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{mentor.name}</h1>
                            <p className="text-xl text-[#c41e18] font-medium">{mentor.designation}</p>

                            {Array.isArray(mentor.specialization) && mentor.specialization.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {mentor.specialization.map((area, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-slate-100 text-gray-700 text-sm rounded-full">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {(mentor.details || mentor.bio) && (
                                <p className="text-gray-600 leading-relaxed mt-4 whitespace-pre-line">
                                    {mentor.details || mentor.bio}
                                </p>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-[#7A85F0]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <LuBadgeCheck className="text-[#7A85F0] text-xl" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{mentor.trainingExperience?.years || 0}+</p>
                                <p className="text-sm text-gray-500">Years Experience</p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-[#c41e18]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <LuUsers className="text-[#c41e18] text-xl" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{mentor.trainingExperience?.students || 0}+</p>
                                <p className="text-sm text-gray-500">Students Trained</p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <LuBookOpen className="text-purple-600 text-xl" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{mentor.specialization?.length || 0}</p>
                                <p className="text-sm text-gray-500">Specializations</p>
                            </div>
                        </div>

                        {/* Education & Work */}
                        {((mentor.education && mentor.education.length > 0) ||
                            (mentor.workExperience && mentor.workExperience.length > 0)) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mentor.education && mentor.education.length > 0 && (
                                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#7A85F0]/10 rounded-full flex items-center justify-center">
                                                <HiOutlineAcademicCap className="text-[#7A85F0] text-xl" />
                                            </div>
                                            Education
                                        </h3>
                                        <ul className="space-y-3">
                                            {mentor.education.map((edu, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm">
                                                    <span className="w-2 h-2 bg-[#7A85F0] rounded-full mt-2 shrink-0" />
                                                    <span className="text-gray-600">{edu}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {mentor.workExperience && mentor.workExperience.length > 0 && (
                                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#c41e18]/10 rounded-full flex items-center justify-center">
                                                <HiOutlineBriefcase className="text-[#c41e18] text-xl" />
                                            </div>
                                            Work Experience
                                        </h3>
                                        <ul className="space-y-3">
                                            {mentor.workExperience.map((work, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm">
                                                    <span className="w-2 h-2 bg-[#c41e18] rounded-full mt-2 shrink-0" />
                                                    <span className="text-gray-600">{work}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Life Journey */}
                        {mentor.lifeJourney && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                        <HiOutlineSparkles className="text-amber-500 text-xl" />
                                    </div>
                                    Life Journey
                                </h3>
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-5 rounded-r-xl">
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {mentor.lifeJourney}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
