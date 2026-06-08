import { getSeoContent } from '@/lib/getSeoContent';

export async function generateMetadata() {
    const seo = await getSeoContent();
    return {
        title: seo.about?.title || 'About',
        description: seo.about?.description || 'Learn about Techlight IT Solution — a leading IT training institute and digital solutions provider in Bangladesh.',
    };
}

export default function AboutLayout({ children }) {
    return children;
}
