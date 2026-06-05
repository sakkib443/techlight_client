'use client';

import React, { Suspense } from 'react';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import CourseCreateTab from '@/components/Admin/course/CourseCreateTab';

function CourseFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const isEdit = !!courseId;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard/admin/course"
            className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm transition-all"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{isEdit ? 'Edit Course' : 'Create Course'}</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {isEdit ? 'Update this course — existing details are pre-filled below' : 'Add a new course to your platform'}
            </p>
          </div>
        </div>

        {/* Course form (create + edit share the same form) */}
        <CourseCreateTab courseId={courseId} onSuccess={() => router.push('/dashboard/admin/course')} />
      </div>
    </div>
  );
}

export default function CreateCoursePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <FiLoader className="animate-spin text-indigo-500" size={32} />
        </div>
      }
    >
      <CourseFormPage />
    </Suspense>
  );
}
