'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
    FiSave, FiX, FiUser, FiLink, FiAlertCircle, FiMail, FiPhone, FiBriefcase,
    FiImage, FiAward, FiInfo, FiLoader, FiSettings, FiUsers, FiUpload,
} from 'react-icons/fi';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaGithub } from 'react-icons/fa';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

/* ===================== Validation ===================== */
// Only "name" is required. Email and all URL fields are optional, but if the
// admin types something, it must be a valid email / URL — otherwise that exact
// field is flagged.
const optionalUrl = z.string().trim().url('Enter a valid URL (https://...)').optional().or(z.literal(''));

const instructorSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    designation: z.string().optional().or(z.literal('')),
    subject: z.string().optional().or(z.literal('')),
    bio: z.string().optional().or(z.literal('')),
    details: z.string().optional().or(z.literal('')),
    lifeJourney: z.string().optional().or(z.literal('')),
    image: optionalUrl,
    email: z.string().trim().email('Enter a valid email address').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    socialLinks: z.object({
        facebook: optionalUrl,
        twitter: optionalUrl,
        linkedin: optionalUrl,
        github: optionalUrl,
    }).optional(),
    specialization: z.string().optional().or(z.literal('')),
    education: z.string().optional().or(z.literal('')),
    workExperience: z.string().optional().or(z.literal('')),
    trainingYears: z.string().optional().or(z.literal('')),
    trainingStudents: z.string().optional().or(z.literal('')),
    isActive: z.boolean().default(true),
    user: z.string().optional().nullable(),
});

/* ===================== Presentational helpers (defined outside to keep focus) ===================== */
const Field = ({ isDark, label, required, error, hint, children }) => (
    <div className="space-y-1.5">
        <label className={`flex items-center gap-1.5 text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {label}
            {required ? (
                <span className="text-red-500">*</span>
            ) : (
                <span className={`text-[11px] font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>(optional)</span>
            )}
        </label>
        {children}
        {hint && !error && <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{hint}</p>}
        {error && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                <FiAlertCircle size={12} className="shrink-0" /> {error.message}
            </p>
        )}
    </div>
);

const Card = ({ isDark, children }) => (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {children}
    </div>
);

const SectionHeader = ({ isDark, title, subtitle, icon: Icon }) => (
    <div className={`px-5 py-4 border-b flex items-center gap-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <span className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <Icon size={17} />
        </span>
        <div>
            <h2 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{title}</h2>
            {subtitle && <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</p>}
        </div>
    </div>
);

export default function CreateInstructorPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [submitError, setSubmitError] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    const imageInputRef = useRef(null);

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

    const {
        register, handleSubmit, watch, setValue, formState: { errors },
    } = useForm({
        resolver: zodResolver(instructorSchema),
        mode: 'onTouched',
        defaultValues: {
            isActive: true,
            socialLinks: { facebook: '', twitter: '', linkedin: '', github: '' },
        },
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (data.success) {
                    setUsers((data.data || []).filter((u) => u.role === 'mentor' || u.role === 'admin'));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const imageUrl = watch('image');

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setSubmitError('');
            const token = localStorage.getItem('token');

            const payload = {
                name: data.name.trim(),
                ...(data.designation && { designation: data.designation }),
                ...(data.subject && { subject: data.subject }),
                ...(data.bio && { bio: data.bio }),
                ...(data.details && { details: data.details }),
                ...(data.lifeJourney && { lifeJourney: data.lifeJourney }),
                ...(data.image && { image: data.image.trim() }),
                ...(data.email && { email: data.email.trim() }),
                ...(data.phone && { phone: data.phone }),
                user: data.user && data.user !== '' ? data.user : null,
                isActive: data.isActive,
                specialization: data.specialization
                    ? data.specialization.split(',').map((s) => s.trim()).filter(Boolean)
                    : [],
                education: data.education
                    ? data.education.split('\n').map((s) => s.trim()).filter(Boolean)
                    : [],
                workExperience: data.workExperience
                    ? data.workExperience.split('\n').map((s) => s.trim()).filter(Boolean)
                    : [],
                trainingExperience: {
                    years: data.trainingYears || '',
                    students: data.trainingStudents || '',
                },
                socialLinks: {
                    ...(data.socialLinks?.facebook && { facebook: data.socialLinks.facebook.trim() }),
                    ...(data.socialLinks?.twitter && { twitter: data.socialLinks.twitter.trim() }),
                    ...(data.socialLinks?.linkedin && { linkedin: data.socialLinks.linkedin.trim() }),
                    ...(data.socialLinks?.github && { github: data.socialLinks.github.trim() }),
                },
            };

            const res = await fetch(`${API_BASE_URL}/instructors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (result.success) {
                toast.success('Mentor created successfully!');
                router.push('/dashboard/admin/instructor');
            } else {
                const errorMsg = result.errorMessages?.length
                    ? result.errorMessages.map((err) => `${err.path ? err.path.split('.').pop() + ': ' : ''}${err.message}`).join(' | ')
                    : result.message || 'Failed to create mentor';
                setSubmitError(errorMsg);
                toast.error('Could not create mentor');
            }
        } catch (error) {
            console.error('Error creating instructor:', error);
            setSubmitError('Network error. Please check your connection and try again.');
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    const onInvalid = (formErrors) => {
        toast.error('Please fix the highlighted fields');
        let name = Object.keys(formErrors)[0];
        if (name === 'socialLinks' && formErrors.socialLinks) {
            name = `socialLinks.${Object.keys(formErrors.socialLinks)[0]}`;
        }
        const el = document.querySelector(`[name="${name}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus?.();
        }
    };

    /* ===================== Field styles ===================== */
    const inputBase = `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 ${isDark ? 'bg-slate-950 text-white placeholder:text-slate-600' : 'bg-white text-slate-800 placeholder:text-slate-400'}`;
    const borderNormal = isDark
        ? 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20';
    const borderError = 'border-red-400 focus:border-red-500 focus:ring-red-500/25';
    const fieldCls = (err, extra = '') => `${inputBase} ${err ? borderError : borderNormal} ${extra}`;

    const social = [
        { key: 'facebook', label: 'Facebook URL', icon: FaFacebookF, placeholder: 'https://facebook.com/...' },
        { key: 'linkedin', label: 'LinkedIn URL', icon: FaLinkedinIn, placeholder: 'https://linkedin.com/in/...' },
        { key: 'twitter', label: 'Twitter (X) URL', icon: FaTwitter, placeholder: 'https://twitter.com/...' },
        { key: 'github', label: 'GitHub URL', icon: FaGithub, placeholder: 'https://github.com/...' },
    ];

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="max-w-5xl mx-auto p-6 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Add Mentor</h1>
                        <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Create a new mentor profile</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-white'}`}
                    >
                        <FiX size={16} /> Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                    {/* Info + submit error */}
                    <div className={`flex items-start gap-2 text-sm rounded-xl border px-4 py-3 ${isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-indigo-100 bg-indigo-50/60 text-slate-600'}`}>
                        <FiInfo size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                        <span>Only <span className="font-semibold">Name</span> is required — everything else is optional.</span>
                    </div>

                    {submitError && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                            <FiAlertCircle size={20} className="shrink-0" />
                            <span className="text-sm font-medium">{submitError}</span>
                        </div>
                    )}

                    {/* Basic Information */}
                    <Card isDark={isDark}>
                        <SectionHeader isDark={isDark} title="Basic Information" subtitle="Name, role and photo" icon={FiUser} />
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field isDark={isDark} label="Full Name" required error={errors.name}>
                                <div className="relative">
                                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input {...register('name')} className={fieldCls(errors.name, 'pl-10')} placeholder="e.g. John Doe" />
                                </div>
                            </Field>
                            <Field isDark={isDark} label="Designation" error={errors.designation}>
                                <div className="relative">
                                    <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input {...register('designation')} className={fieldCls(errors.designation, 'pl-10')} placeholder="e.g. Senior Web Developer" />
                                </div>
                            </Field>
                            <Field isDark={isDark} label="Subject / Expertise" error={errors.subject}>
                                <input {...register('subject')} className={fieldCls(errors.subject)} placeholder="e.g. Full-Stack Web Development" />
                            </Field>
                            <Field isDark={isDark} label="Profile Image" error={errors.image}>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input {...register('image')} className={`${fieldCls(errors.image)} flex-1`} placeholder="https://... or upload" />
                                        <button type="button" onClick={() => imageInputRef.current?.click()} disabled={imageUploading}
                                            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium rounded-lg border border-indigo-200 transition-all disabled:opacity-50">
                                            {imageUploading ? <FiLoader size={14} className="animate-spin" /> : <FiUpload size={14} />} Upload
                                        </button>
                                        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                                    </div>
                                    {imageUrl && <img src={imageUrl} alt="preview" className="w-20 h-20 rounded-lg object-cover border border-slate-200" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                                </div>
                            </Field>
                            <div className="md:col-span-2">
                                <Field isDark={isDark} label="Short Bio" error={errors.bio} hint="A brief one or two line introduction.">
                                    <textarea {...register('bio')} rows={3} className={fieldCls(errors.bio)} placeholder="A brief biography of the mentor..." />
                                </Field>
                            </div>
                        </div>
                    </Card>

                    {/* Contact */}
                    <Card isDark={isDark}>
                        <SectionHeader isDark={isDark} title="Contact" subtitle="How students can reach out" icon={FiMail} />
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field isDark={isDark} label="Email Address" error={errors.email}>
                                <div className="relative">
                                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input {...register('email')} className={fieldCls(errors.email, 'pl-10')} placeholder="e.g. john@example.com" />
                                </div>
                            </Field>
                            <Field isDark={isDark} label="Phone Number" error={errors.phone}>
                                <div className="relative">
                                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input {...register('phone')} className={fieldCls(errors.phone, 'pl-10')} placeholder="e.g. +8801700000000" />
                                </div>
                            </Field>
                        </div>
                    </Card>

                    {/* Experience & Background */}
                    <Card isDark={isDark}>
                        <SectionHeader isDark={isDark} title="Experience & Background" subtitle="Shown on the public mentor profile" icon={FiAward} />
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <Field isDark={isDark} label="Specializations" error={errors.specialization} hint="Comma separated, e.g. React, Node.js, UI/UX">
                                    <input {...register('specialization')} className={fieldCls(errors.specialization)} placeholder="React, Node.js, UI/UX, Python" />
                                </Field>
                            </div>
                            <Field isDark={isDark} label="Years of Experience" error={errors.trainingYears}>
                                <input {...register('trainingYears')} className={fieldCls(errors.trainingYears)} placeholder="e.g. 8" />
                            </Field>
                            <Field isDark={isDark} label="Students Trained" error={errors.trainingStudents}>
                                <input {...register('trainingStudents')} className={fieldCls(errors.trainingStudents)} placeholder="e.g. 2000" />
                            </Field>
                            <div className="md:col-span-2">
                                <Field isDark={isDark} label="Education" error={errors.education} hint="One per line.">
                                    <textarea {...register('education')} rows={3} className={fieldCls(errors.education)} placeholder={'B.Sc in CSE, BUET\nM.Sc in Software Engineering'} />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field isDark={isDark} label="Work Experience" error={errors.workExperience} hint="One per line.">
                                    <textarea {...register('workExperience')} rows={3} className={fieldCls(errors.workExperience)} placeholder={'Senior Engineer at Google (2020-Present)\nFull-Stack Developer at Pathao (2017-2020)'} />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field isDark={isDark} label="Details / About" error={errors.details} hint="Detailed description shown on the profile page.">
                                    <textarea {...register('details')} rows={4} className={fieldCls(errors.details)} placeholder="Detailed description shown on the mentor profile page..." />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field isDark={isDark} label="Life Journey" error={errors.lifeJourney}>
                                    <textarea {...register('lifeJourney')} rows={4} className={fieldCls(errors.lifeJourney)} placeholder="The mentor's inspirational journey..." />
                                </Field>
                            </div>
                        </div>
                    </Card>

                    {/* Social Links */}
                    <Card isDark={isDark}>
                        <SectionHeader isDark={isDark} title="Social Links" subtitle="Optional — must be valid URLs" icon={FiLink} />
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            {social.map(({ key, label, icon: Icon, placeholder }) => (
                                <Field key={key} isDark={isDark} label={label} error={errors.socialLinks?.[key]}>
                                    <div className="relative">
                                        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input {...register(`socialLinks.${key}`)} className={fieldCls(errors.socialLinks?.[key], 'pl-10')} placeholder={placeholder} />
                                    </div>
                                </Field>
                            ))}
                        </div>
                    </Card>

                    {/* Settings */}
                    <Card isDark={isDark}>
                        <SectionHeader isDark={isDark} title="Settings" icon={FiSettings} />
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                            <Field isDark={isDark} label="Link to User Account" error={errors.user} hint="Connect this mentor to an existing user.">
                                <div className="relative">
                                    <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <select {...register('user')} className={fieldCls(errors.user, 'pl-10 appearance-none cursor-pointer')}>
                                        <option value="">None</option>
                                        {users.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.firstName} {user.lastName} ({user.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Field>
                            <label className={`flex items-center gap-2.5 cursor-pointer rounded-lg border px-4 py-2.5 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Active (visible on the site)</span>
                            </label>
                        </div>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm shadow-indigo-600/25 transition-all disabled:opacity-60"
                        >
                            {loading ? (
                                <><FiLoader className="animate-spin" size={18} /> Creating...</>
                            ) : (
                                <><FiSave size={18} /> Save Mentor</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
