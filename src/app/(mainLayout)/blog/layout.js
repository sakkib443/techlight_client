import { getSeoContent } from '@/lib/getSeoContent';

export async function generateMetadata() {
    const seo = await getSeoContent();
    return {
        title: seo.blog?.title || 'Blog',
        description: seo.blog?.description || 'Read the latest articles, tips and tutorials from Techlight IT Solution.',
    };
}

export default function BlogLayout({ children }) {
    return children;
}
