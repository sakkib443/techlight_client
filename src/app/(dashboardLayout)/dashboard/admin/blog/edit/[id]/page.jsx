'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditBlogRedirect() {
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        router.replace(`/dashboard/admin/blog/create?id=${id}`);
    }, [id]);

    return null;
}
