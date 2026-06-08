'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSave, FiX, FiUser, FiLink, FiCheckCircle, FiInfo, FiMail, FiPhone, FiBriefcase, FiAlertCircle, FiUpload, FiLoader } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

const instructorSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    designation: z.string().optional().or(z.literal('')),
    subject: z.string().optional().or(z.literal('')),
    bio: z.string().optional().or(z.literal('')),
    details: z.string().optional().or(z.literal('')),
    lifeJourney: z.string().optional().or(z.literal('')),
    image: z.string().optional().or(z.literal('')),
    email: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    socialLinks: z.object({
        facebook: z.string().optional().or(z.literal('')),
        twitter: z.string().optional().or(z.literal('')),
        linkedin: z.string().optional().or(z.literal('')),
        github: z.string().optional().or(z.literal('')),
    }).optional(),
    specialization: z.string().optional().or(z.literal('')),
    education: z.string().optional().or(z.literal('')),
    workExperience: z.string().optional().or(z.literal('')),
    trainingYears: z.string().optional().or(z.literal('')),
    trainingStudents: z.string().optional().or(z.literal('')),
    isActive: z.boolean().default(true),
    user: z.string().optional().nullable(),
});

export default function EditInstructorPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [users, setUsers] = useState([]);
    const [submitError, setSubmitError] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    const imageInputRef = useRef(null);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(instructorSchema),
    });

    const imageUrl = watch('image');

    const handleImageUpload = async (file) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file);
        setImageUploading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/upload/single`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (data.success && data.data?.url) {
                setValue('image', data.data.url);
                toast.success('Image uploaded!');
            } else { toast.error(data.message || 'Upload failed'); }
        } catch { toast.error('Upload failed'); }
        finally { setImageUploading(false); }
    };

    useEffect(() => {
        fetchUsers();
        fetchInstructor();
    }, [id]);

    const fetchInstructor = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/instructors/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const instructor = data.data;
                reset({
                    ...instructor,
                    specialization: instructor.specialization ? instructor.specialization.join(', ') : '',
                    education: instructor.education ? instructor.education.join('\n') : '',
                    workExperience: instructor.workExperience ? instructor.workExperience.join('\n') : '',
                    trainingYears: instructor.trainingExperience?.years || '',
                    trainingStudents: instructor.trainingExperience?.students || '',
                    user: instructor.user?._id || instructor.user || ''
                });
            }
        } catch (error) {
            console.error('Error fetching instructor:', error);
        } finally {
            setFetching(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data.filter(u => u.role === 'mentor' || u.role === 'admin') || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setSubmitError('');
            const token = localStorage.getItem('token');

            const { trainingYears, trainingStudents, ...rest } = data;
            const payload = {
                ...rest,
                user: data.user && data.user !== '' ? data.user : null,
                specialization: data.specialization ? data.specialization.split(',').map(s => s.trim()).filter(s => s !== '') : [],
                education: data.education ? data.education.split('\n').map(s => s.trim()).filter(s => s !== '') : [],
                workExperience: data.workExperience ? data.workExperience.split('\n').map(s => s.trim()).filter(s => s !== '') : [],
                trainingExperience: {
                    years: trainingYears || '',
                    students: trainingStudents || '',
                },
            };

            const res = await fetch(`${API_BASE_URL}/instructors/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (result.success) {
                alert('Mentor updated successfully');
                router.push('/dashboard/admin/instructor');
            } else {
                // Show all field-level validation errors from backend
                const errorMsg = result.errorMessages?.length
                    ? result.errorMessages
                        .map(err => `${err.path ? err.path.split('.').pop() + ': ' : ''}${err.message}`)
                        .join(' | ')
                    : (result.message || 'Failed to update mentor');
                setSubmitError(errorMsg);
            }
        } catch (error) {
            console.error('Error updating instructor:', error);
            setSubmitError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const inputBase = `w-full px-4 py-3 rounded-xl border transition-all text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 ${isDark
        ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600'
        : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
        }`;

    const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Mentor</h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update mentor profile details</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-semibold ${isDark
                        ? 'border-slate-800 text-slate-400 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                >
                    <FiX size={18} />
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {submitError && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                        <FiAlertCircle size={20} />
                        <span className="text-sm font-medium">{submitError}</span>
                    </div>
                )}
                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-indigo-500/5' : 'bg-white border-slate-200 shadow-xl shadow-indigo-500/5'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    {...register('name')}
                                    className={`${inputBase} pl-11`}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Designation <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    {...register('designation')}
                                    className={`${inputBase} pl-11`}
                                    placeholder="e.g. Senior Web Developer"
                                />
                            </div>
                            {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Subject / Expertise</label>
                            <div className="relative">
                                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    {...register('subject')}
                                    className={`${inputBase} pl-11`}
                                    placeholder="e.g. Full-Stack Web Development"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    {...register('email')}
                                    className={`${inputBase} pl-11`}
                                    placeholder="e.g. john@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Phone Number</label>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    {...register('phone')}
                                    className={`${inputBase} pl-11`}
                                    placeholder="e.g. +8801700000000"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Profile Image</label>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input {...register('image')} className={`${inputBase} flex-1`} placeholder="https://... or upload" />
                                    <button type="button" onClick={() => imageInputRef.current?.click()} disabled={imageUploading}
                                        className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium rounded-lg border border-indigo-200 transition-all disabled:opacity-50">
                                        {imageUploading ? <FiLoader size={14} className="animate-spin" /> : <FiUpload size={14} />} Upload
                                    </button>
                                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                                </div>
                                {imageUrl && <img src={imageUrl} alt="preview" className="w-20 h-20 rounded-lg object-cover border border-slate-200" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                            </div>
                            {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Bio / Description</label>
                            <textarea
                                {...register('bio')}
                                className={`${inputBase} min-h-[120px] py-4`}
                                placeholder="A brief biography of the mentor..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Specializations (comma separated)</label>
                            <input
                                {...register('specialization')}
                                className={inputBase}
                                placeholder="React, Node.js, UI/UX, Python"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Years of Experience</label>
                            <input
                                {...register('trainingYears')}
                                className={inputBase}
                                placeholder="e.g. 8"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Students Trained</label>
                            <input
                                {...register('trainingStudents')}
                                className={inputBase}
                                placeholder="e.g. 2000"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Education (one per line)</label>
                            <textarea
                                {...register('education')}
                                className={`${inputBase} min-h-[100px] py-4`}
                                placeholder={"B.Sc in CSE, BUET\nM.Sc in Software Engineering"}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Work Experience (one per line)</label>
                            <textarea
                                {...register('workExperience')}
                                className={`${inputBase} min-h-[100px] py-4`}
                                placeholder={"Senior Engineer at Google (2020-Present)\nFull-Stack Developer at Pathao (2017-2020)"}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Details / About</label>
                            <textarea
                                {...register('details')}
                                className={`${inputBase} min-h-[120px] py-4`}
                                placeholder="Detailed description shown on the mentor profile page..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Life Journey</label>
                            <textarea
                                {...register('lifeJourney')}
                                className={`${inputBase} min-h-[120px] py-4`}
                                placeholder="The mentor's inspirational journey..."
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Link to User Account (Optional)</label>
                            <select {...register('user')} className={inputBase}>
                                <option value="">None</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 pt-8">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                id="isActive"
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="isActive" className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Active Status</label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <FiLink size={16} />
                            Social Media Links
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Facebook URL</label>
                                <input {...register('socialLinks.facebook')} className={inputBase} placeholder="https://facebook.com/..." />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">LinkedIn URL</label>
                                <input {...register('socialLinks.linkedin')} className={inputBase} placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Twitter (X) URL</label>
                                <input {...register('socialLinks.twitter')} className={inputBase} placeholder="https://twitter.com/..." />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">GitHub URL</label>
                                <input {...register('socialLinks.github')} className={inputBase} placeholder="https://github.com/..." />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:bg-indigo-400 transition-all font-bold shadow-lg shadow-indigo-600/20"
                    >
                        {loading ? 'Updating...' : (
                            <>
                                <FiSave size={20} />
                                Update Mentor
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
