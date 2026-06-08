import { getSeoContent } from '@/lib/getSeoContent';

export async function generateMetadata() {
    const seo = await getSeoContent();
    return {
        title: seo.courses?.title || 'Courses',
        description: seo.courses?.description || 'Explore professional IT courses at Techlight IT Solution — web development, digital marketing, graphics design and more.',
    };
}

export default function CoursesLayout({ children }) {
    return children;
}
