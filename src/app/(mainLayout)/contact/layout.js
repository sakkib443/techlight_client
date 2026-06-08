import { getSeoContent } from '@/lib/getSeoContent';

export async function generateMetadata() {
    const seo = await getSeoContent();
    return {
        title: seo.contact?.title || 'Contact',
        description: seo.contact?.description || 'Contact Techlight IT Solution — get in touch with us for any queries, support or business inquiries.',
    };
}

export default function ContactLayout({ children }) {
    return children;
}
