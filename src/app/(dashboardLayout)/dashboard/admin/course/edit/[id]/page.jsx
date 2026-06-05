'use client';

// Course editing now reuses the Create Course page (pre-filled) at
// /dashboard/admin/course/create?id=<id>. This route just forwards there so
// old links/bookmarks keep working.

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';

export default function EditCourseRedirect() {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) router.replace(`/dashboard/admin/course/create?id=${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FiLoader className="animate-spin text-indigo-500" size={32} />
    </div>
  );
}
