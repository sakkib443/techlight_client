'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/config/api';
import {
    FiPlus, FiTrash2, FiSave, FiImage, FiVideo, FiBookOpen, FiLayers,
    FiCheck, FiTarget, FiList, FiTag, FiSearch, FiLayout, FiArrowRight,
    FiBriefcase, FiTool, FiHelpCircle, FiDollarSign, FiUser, FiInfo, FiLoader,
    FiUpload, FiX,
} from 'react-icons/fi';

/* ============================ Styles ============================ */
const inputBase =
    'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all';
const selectBase =
    'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all appearance-none cursor-pointer';

/* ====================== Reusable building blocks ====================== */
const FormField = ({ label, icon: Icon, error, children, required, hint }) => (
    <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            {Icon && <Icon size={14} className="text-slate-400" />}
            {label}
            {required ? (
                <span className="text-red-500">*</span>
            ) : (
                <span className="text-[11px] font-normal text-slate-400">(optional)</span>
            )}
        </label>
        {children}
        {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
        {error && <p className="text-red-500 text-xs font-medium">{error.message}</p>}
    </div>
);

const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({ title, subtitle, icon: Icon }) => (
    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        {Icon && (
            <span className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Icon size={17} />
            </span>
        )}
        <div>
            <h2 className="font-semibold text-slate-800 text-sm">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
    </div>
);

// Repeatable single-line list (rendered from a react-hook-form field array)
const DynamicList = ({ title, icon: Icon, accentText, accentBtn, fieldArray, name, register, placeholder }) => (
    <Card>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                {Icon && <Icon size={15} className={accentText} />}
                {title}
                <span className="text-[10px] font-normal text-slate-400">(optional)</span>
            </h3>
            <button
                type="button"
                onClick={() => fieldArray.append('')}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-white transition-colors ${accentBtn}`}
            >
                <FiPlus size={14} />
            </button>
        </div>
        <div className="p-4 space-y-2.5">
            {fieldArray.fields.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">Nothing added yet — click + to add.</p>
            )}
            {fieldArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                    <input {...register(`${name}.${index}`)} className={inputBase} placeholder={placeholder} />
                    <button
                        type="button"
                        onClick={() => fieldArray.remove(index)}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <FiTrash2 size={15} />
                    </button>
                </div>
            ))}
        </div>
    </Card>
);

/* ============================ Validation ============================ */
// Only title, thumbnail and category are truly required. Everything else is
// optional. Price defaults to 0. Description is optional but, if provided,
// must be at least 50 characters.
const courseValidationSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
    slug: z.string().min(1),
    thumbnail: z.string().url('Enter a valid image URL'),
    category: z.string().min(1, 'Please select a category'),
    description: z.string().min(50, 'If provided, description must be at least 50 characters').optional().or(z.literal('')),
    shortDescription: z.string().max(500, 'Keep it under 500 characters').optional().or(z.literal('')),
    bannerImage: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    previewVideo: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    sampleVideoUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
    instructor: z.string().optional(),
    price: z.coerce.number({ invalid_type_error: 'Price must be a number' }).min(0, 'Price cannot be negative'),
    discountPrice: z.coerce.number().min(0, 'Cannot be negative').optional(),
    priceLabel: z.string().max(100).optional().or(z.literal('')),
    courseType: z.enum(['online', 'offline', 'recorded']),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    language: z.enum(['english']),
    tags: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    whatYouWillLearn: z.array(z.string()).optional(),
    targetAudience: z.array(z.string()).optional(),
    jobOpportunities: z.array(z.string()).optional(),
    softwareWeLearn: z.array(z.string()).optional(),
    faq: z.array(z.object({
        question: z.string().optional().or(z.literal('')),
        answer: z.string().optional().or(z.literal('')),
    })).optional(),
    totalLessons: z.coerce.number().min(0, 'Cannot be negative').optional(),
    totalEnrollments: z.coerce.number().min(0, 'Cannot be negative').optional(),
    metaTitle: z.string().max(100, 'Keep it under 100 characters').optional().or(z.literal('')),
    metaDescription: z.string().max(300, 'Keep it under 300 characters').optional().or(z.literal('')),
    status: z.enum(['draft', 'published', 'archived']),
    isFeatured: z.boolean().optional(),
    isPopular: z.boolean().optional(),
});

/* ============================ Component ============================ */
const CourseCreateTab = ({ onSuccess, courseId }) => {
    const isEdit = !!courseId;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!courseId);
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);
    const [bannerUploading, setBannerUploading] = useState(false);
    const thumbnailInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const handleImageUpload = async (file, field, setUploading) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/upload/single`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (data.success && data.data?.url) {
                setValue(field, data.data.url);
                toast.success('Image uploaded!');
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch {
            toast.error('Upload failed — please try again');
        } finally {
            setUploading(false);
        }
    };

    const {
        register, control, handleSubmit, setValue, watch, reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(courseValidationSchema),
        mode: 'onTouched',
        defaultValues: {
            courseType: 'recorded',
            level: 'beginner',
            language: 'english',
            status: 'draft',
            price: 0,
            priceLabel: '',
            features: [],
            requirements: [],
            whatYouWillLearn: [],
            targetAudience: [],
            jobOpportunities: [],
            softwareWeLearn: [],
            tags: [],
            faq: [],
            isFeatured: false,
            isPopular: false,
            totalLessons: 0,
            totalEnrollments: 0,
        },
    });

    const featuresFields = useFieldArray({ control, name: 'features' });
    const requirementsFields = useFieldArray({ control, name: 'requirements' });
    const learningFields = useFieldArray({ control, name: 'whatYouWillLearn' });
    const audienceFields = useFieldArray({ control, name: 'targetAudience' });
    const jobFields = useFieldArray({ control, name: 'jobOpportunities' });
    const softwareFields = useFieldArray({ control, name: 'softwareWeLearn' });
    const tagsFields = useFieldArray({ control, name: 'tags' });
    const faqFields = useFieldArray({ control, name: 'faq' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const requests = [
                    fetch(`${API_BASE_URL}/categories`),
                    fetch(`${API_BASE_URL}/instructors`),
                ];
                if (courseId) {
                    requests.push(
                        fetch(`${API_BASE_URL}/courses/${courseId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                    );
                }
                const [catsRes, instRes, courseRes] = await Promise.all(requests);
                const catsData = await catsRes.json();
                const instData = await instRes.json();
                if (catsData.success) setCategories(catsData.data || []);
                if (instData.success) setInstructors(instData.data || []);

                // Edit mode — pre-fill the form with the existing course data.
                if (courseId && courseRes) {
                    const courseResult = await courseRes.json();
                    const course = courseResult.data;
                    if (course) {
                        reset({
                            title: course.title || '',
                            slug: course.slug || '',
                            thumbnail: course.thumbnail || '',
                            bannerImage: course.bannerImage || '',
                            previewVideo: course.previewVideo || '',
                            sampleVideoUrl: course.sampleVideoUrl || '',
                            description: course.description || '',
                            shortDescription: course.shortDescription || '',
                            category: course.category?._id || course.category || '',
                            instructor: course.instructor?._id || course.instructor || '',
                            price: course.price ?? 0,
                            discountPrice: course.discountPrice ?? undefined,
                            priceLabel: course.priceLabel || '',
                            courseType: course.courseType || 'recorded',
                            level: course.level || 'beginner',
                            language: course.language || 'english',
                            status: course.status || 'draft',
                            isFeatured: !!course.isFeatured,
                            isPopular: !!course.isPopular,
                            totalLessons: course.totalLessons ?? 0,
                            totalEnrollments: course.totalEnrollments ?? 0,
                            metaTitle: course.metaTitle || '',
                            metaDescription: course.metaDescription || '',
                            features: course.features?.length ? course.features : [],
                            requirements: course.requirements?.length ? course.requirements : [],
                            whatYouWillLearn: course.whatYouWillLearn?.length ? course.whatYouWillLearn : [],
                            targetAudience: course.targetAudience?.length ? course.targetAudience : [],
                            jobOpportunities: course.jobOpportunities?.length ? course.jobOpportunities : [],
                            softwareWeLearn: course.softwareWeLearn?.length ? course.softwareWeLearn : [],
                            tags: course.tags?.length ? course.tags : [],
                            faq: course.faq?.length
                                ? course.faq.map((f) => ({ question: f.question || '', answer: f.answer || '' }))
                                : [],
                        });
                    } else {
                        toast.error('Course not found');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (courseId) toast.error('Failed to load course data');
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [courseId, reset]);

    // Auto-generate slug from title
    const title = watch('title');
    useEffect(() => {
        const slugified = (title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setValue('slug', slugified);
    }, [title, setValue]);

    const slug = watch('slug');

    const onSubmit = async (data) => {
        setLoading(true);
        const token = localStorage.getItem('token');

        const cleanArray = (arr) =>
            Array.isArray(arr) ? arr.map((s) => (s || '').trim()).filter(Boolean) : [];

        const payload = {
            ...data,
            features: cleanArray(data.features),
            requirements: cleanArray(data.requirements),
            whatYouWillLearn: cleanArray(data.whatYouWillLearn),
            targetAudience: cleanArray(data.targetAudience),
            jobOpportunities: cleanArray(data.jobOpportunities),
            softwareWeLearn: cleanArray(data.softwareWeLearn),
            tags: cleanArray(data.tags),
            faq: Array.isArray(data.faq)
                ? data.faq.filter((f) => f?.question?.trim() && f?.answer?.trim())
                : [],
        };
        if (!payload.discountPrice) delete payload.discountPrice;
        if (!payload.instructor) delete payload.instructor;

        try {
            const response = await fetch(
                isEdit ? `${API_BASE_URL}/courses/${courseId}` : `${API_BASE_URL}/courses`,
                {
                    method: isEdit ? 'PATCH' : 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload),
                }
            );
            const result = await response.json();

            if (response.ok) {
                toast.success(isEdit ? 'Course updated successfully!' : 'Course created successfully!');
                if (onSuccess) onSuccess();
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map((err) => `${err.path.split('.').pop()}: ${err.message}`).join(', ')
                    : result.message || (isEdit ? 'Failed to update course' : 'Failed to create course');
                toast.error(errorMsg);
            }
        } catch (error) {
            toast.error('Network error — please try again');
        } finally {
            setLoading(false);
        }
    };

    // On validation failure: notify and scroll to the first invalid field
    const onInvalid = (formErrors) => {
        toast.error('Please fix the highlighted fields');
        const firstKey = Object.keys(formErrors)[0];
        if (firstKey) {
            const el = document.querySelector(`[name="${firstKey}"]`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.focus?.();
            }
        }
    };

    const submit = handleSubmit(onSubmit, onInvalid);

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
                <FiLoader className="animate-spin text-indigo-500" size={34} />
                <p className="text-sm text-slate-500">Loading course data…</p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            {/* Action bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">
                <div className="flex items-start gap-2 text-sm text-slate-500">
                    <FiInfo size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                    <span>
                        Only <span className="font-semibold text-slate-700">Title</span>,{' '}
                        <span className="font-semibold text-slate-700">Thumbnail</span> and{' '}
                        <span className="font-semibold text-slate-700">Category</span> are required. Everything else is optional.
                    </span>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-500/25 transition-all disabled:opacity-60 shrink-0"
                >
                    {loading ? (
                        <><FiLoader className="animate-spin" size={16} /> {isEdit ? 'Updating...' : 'Creating...'}</>
                    ) : (
                        <><FiSave size={16} /> {isEdit ? 'Update Course' : 'Create Course'} <FiArrowRight size={15} /></>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ===================== Left column ===================== */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Basic info */}
                    <Card>
                        <SectionHeader title="Basic Information" subtitle="Title and descriptions" icon={FiBookOpen} />
                        <div className="p-5 space-y-5">
                            <FormField label="Course Title" error={errors.title} required>
                                <input {...register('title')} autoComplete="off" className={inputBase} placeholder="e.g. Complete Video Editing Masterclass" />
                            </FormField>
                            {slug && (
                                <p className="-mt-3 text-[11px] text-slate-400">
                                    URL slug: <span className="font-mono text-slate-500">/{slug}</span>
                                </p>
                            )}
                            <FormField label="Short Description" error={errors.shortDescription} hint="A brief one-line summary shown on course cards.">
                                <textarea {...register('shortDescription')} rows={2} className={inputBase} placeholder="A brief one-liner summary..." />
                            </FormField>
                            <FormField label="Full Description" error={errors.description} hint="If provided, must be at least 50 characters.">
                                <textarea {...register('description')} rows={6} className={inputBase} placeholder="Write a detailed course description..." />
                            </FormField>
                        </div>
                    </Card>

                    {/* Media */}
                    <Card>
                        <SectionHeader title="Media & Video" subtitle="Images and intro videos" icon={FiImage} />
                        <div className="p-5 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Thumbnail */}
                                <FormField label="Thumbnail Image" icon={FiImage} error={errors.thumbnail} required>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input {...register('thumbnail')} className={`${inputBase} flex-1`} placeholder="https://... or upload below" />
                                            <button
                                                type="button"
                                                onClick={() => thumbnailInputRef.current?.click()}
                                                disabled={thumbnailUploading}
                                                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium rounded-lg border border-indigo-200 transition-all disabled:opacity-50"
                                            >
                                                {thumbnailUploading ? <FiLoader size={14} className="animate-spin" /> : <FiUpload size={14} />}
                                                Upload
                                            </button>
                                            <input
                                                ref={thumbnailInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e.target.files?.[0], 'thumbnail', setThumbnailUploading)}
                                            />
                                        </div>
                                        {watch('thumbnail') && (
                                            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                                                <img src={watch('thumbnail')} alt="Thumbnail preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                                <button
                                                    type="button"
                                                    onClick={() => setValue('thumbnail', '')}
                                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <FiX size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </FormField>
                                {/* Banner Image */}
                                <FormField label="Banner Image" icon={FiLayout} error={errors.bannerImage}>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input {...register('bannerImage')} className={`${inputBase} flex-1`} placeholder="https://... or upload below" />
                                            <button
                                                type="button"
                                                onClick={() => bannerInputRef.current?.click()}
                                                disabled={bannerUploading}
                                                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium rounded-lg border border-indigo-200 transition-all disabled:opacity-50"
                                            >
                                                {bannerUploading ? <FiLoader size={14} className="animate-spin" /> : <FiUpload size={14} />}
                                                Upload
                                            </button>
                                            <input
                                                ref={bannerInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e.target.files?.[0], 'bannerImage', setBannerUploading)}
                                            />
                                        </div>
                                        {watch('bannerImage') && (
                                            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                                                <img src={watch('bannerImage')} alt="Banner preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                                <button
                                                    type="button"
                                                    onClick={() => setValue('bannerImage', '')}
                                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <FiX size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </FormField>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Preview Video URL" icon={FiVideo} error={errors.previewVideo} hint="YouTube or Vimeo link">
                                    <input {...register('previewVideo')} className={inputBase} placeholder="https://..." />
                                </FormField>
                                <FormField label="Sample Lesson Video URL" icon={FiVideo} error={errors.sampleVideoUrl}>
                                    <input {...register('sampleVideoUrl')} className={inputBase} placeholder="https://..." />
                                </FormField>
                            </div>
                        </div>
                    </Card>

                    {/* Learning lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DynamicList title="What You'll Learn" icon={FiTarget} accentText="text-indigo-500" accentBtn="bg-indigo-600 hover:bg-indigo-700" fieldArray={learningFields} name="whatYouWillLearn" register={register} placeholder="Learning outcome..." />
                        <DynamicList title="Features" icon={FiCheck} accentText="text-emerald-500" accentBtn="bg-emerald-600 hover:bg-emerald-700" fieldArray={featuresFields} name="features" register={register} placeholder="Course feature..." />
                        <DynamicList title="Requirements" icon={FiList} accentText="text-rose-500" accentBtn="bg-rose-600 hover:bg-rose-700" fieldArray={requirementsFields} name="requirements" register={register} placeholder="Prerequisite..." />
                        <DynamicList title="Target Audience" icon={FiTarget} accentText="text-purple-500" accentBtn="bg-purple-600 hover:bg-purple-700" fieldArray={audienceFields} name="targetAudience" register={register} placeholder="Who is this for..." />
                        <DynamicList title="Job Opportunities" icon={FiBriefcase} accentText="text-orange-500" accentBtn="bg-orange-600 hover:bg-orange-700" fieldArray={jobFields} name="jobOpportunities" register={register} placeholder="e.g. Video Editor" />
                        <DynamicList title="Software We Learn" icon={FiTool} accentText="text-cyan-500" accentBtn="bg-cyan-600 hover:bg-cyan-700" fieldArray={softwareFields} name="softwareWeLearn" register={register} placeholder="e.g. Premiere Pro" />
                    </div>

                    {/* Tags */}
                    <DynamicList title="Search Tags" icon={FiTag} accentText="text-blue-500" accentBtn="bg-blue-600 hover:bg-blue-700" fieldArray={tagsFields} name="tags" register={register} placeholder="Tag..." />

                    {/* FAQ */}
                    <Card>
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
                            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FiHelpCircle size={15} className="text-violet-500" /> FAQ
                                <span className="text-[10px] font-normal text-slate-400">(optional)</span>
                            </h3>
                            <button type="button" onClick={() => faqFields.append({ question: '', answer: '' })} className="w-7 h-7 flex items-center justify-center rounded-lg text-white bg-violet-600 hover:bg-violet-700 transition-colors">
                                <FiPlus size={14} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            {faqFields.fields.length === 0 && (
                                <p className="text-center text-slate-400 text-sm py-2">No FAQ added yet. Click + to add one.</p>
                            )}
                            {faqFields.fields.map((field, index) => (
                                <div key={field.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3 relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-violet-500 uppercase tracking-wider">FAQ #{index + 1}</span>
                                        <button type="button" onClick={() => faqFields.remove(index)} className="text-slate-400 hover:text-red-600 transition-colors"><FiTrash2 size={14} /></button>
                                    </div>
                                    <input {...register(`faq.${index}.question`)} className={inputBase} placeholder="Question — e.g. Is there a certificate?" />
                                    <textarea {...register(`faq.${index}.answer`)} rows={2} className={inputBase} placeholder="Answer — e.g. Yes, you get a certificate after completion." />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ===================== Right column ===================== */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Pricing */}
                    <Card>
                        <SectionHeader title="Pricing" subtitle="Leave price at 0 for a free course" icon={FiDollarSign} />
                        <div className="p-5 space-y-4">
                            <FormField label="Regular Price (BDT)" error={errors.price}>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">BDT</span>
                                    <input type="number" step="any" {...register('price')} className={`${inputBase} pl-12`} placeholder="0" />
                                </div>
                            </FormField>
                            <FormField label="Discount Price (BDT)" error={errors.discountPrice}>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">BDT</span>
                                    <input type="number" step="any" {...register('discountPrice')} className={`${inputBase} pl-12`} placeholder="0" />
                                </div>
                            </FormField>
                            <FormField label="Price Label" error={errors.priceLabel} hint="Custom text shown instead of the amount.">
                                <input {...register('priceLabel')} className={inputBase} placeholder="e.g. Free, Contact Us" />
                            </FormField>
                            <FormField label="Total Lessons" error={errors.totalLessons} hint="Number of lessons shown on the course card.">
                                <input type="number" min="0" {...register('totalLessons')} className={inputBase} placeholder="e.g. 60" />
                            </FormField>
                            <FormField label="Enrolled Count" error={errors.totalEnrollments} hint="Number of enrolled students shown on the course card.">
                                <input type="number" min="0" {...register('totalEnrollments')} className={inputBase} placeholder="e.g. 210" />
                            </FormField>
                        </div>
                    </Card>

                    {/* Classification */}
                    <Card>
                        <SectionHeader title="Classification" icon={FiLayers} />
                        <div className="p-5 space-y-4">
                            <FormField label="Category" icon={FiLayers} error={errors.category} required>
                                <select {...register('category')} className={selectBase}>
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField label="Instructor" icon={FiUser} error={errors.instructor}>
                                <select {...register('instructor')} className={selectBase}>
                                    <option value="">Select an instructor</option>
                                    {instructors.map((inst) => (
                                        <option key={inst._id} value={inst._id}>{inst.name}{inst.designation ? ` (${inst.designation})` : ''}</option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField label="Course Type">
                                <select {...register('courseType')} className={selectBase}>
                                    <option value="recorded">Pre-recorded</option>
                                    <option value="online">Online Live</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </FormField>
                            <FormField label="Difficulty Level">
                                <select {...register('level')} className={selectBase}>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </FormField>
                            <FormField label="Language">
                                <select {...register('language')} className={selectBase}>
                                    <option value="english">English</option>
                                </select>
                            </FormField>
                        </div>
                    </Card>

                    {/* Visibility & SEO */}
                    <Card>
                        <SectionHeader title="Visibility & SEO" icon={FiSearch} />
                        <div className="p-5 space-y-4">
                            <FormField label="Status">
                                <select {...register('status')} className={selectBase}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published (Live)</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </FormField>
                            <div className="flex flex-wrap gap-5 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-medium text-slate-600">Featured</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" {...register('isPopular')} className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
                                    <span className="text-sm font-medium text-slate-600">Popular</span>
                                </label>
                            </div>
                            <hr className="border-slate-100" />
                            <FormField label="Meta Title" error={errors.metaTitle}>
                                <input {...register('metaTitle')} className={inputBase} maxLength={100} placeholder="SEO title" />
                            </FormField>
                            <FormField label="Meta Description" error={errors.metaDescription}>
                                <textarea {...register('metaDescription')} rows={3} className={inputBase} maxLength={300} placeholder="SEO description" />
                            </FormField>
                        </div>
                    </Card>

                    {/* Sticky submit (mobile-friendly duplicate) */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-500/25 transition-all disabled:opacity-60"
                    >
                        {loading ? (
                            <><FiLoader className="animate-spin" size={16} /> {isEdit ? 'Updating...' : 'Creating...'}</>
                        ) : (
                            <><FiSave size={16} /> {isEdit ? 'Update Course' : 'Create Course'}</>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CourseCreateTab;
