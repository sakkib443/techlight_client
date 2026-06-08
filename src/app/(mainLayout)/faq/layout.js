import { getSeoContent } from '@/lib/getSeoContent';

export async function generateMetadata() {
    const seo = await getSeoContent();
    return {
        title: seo.faq?.title || 'FAQ',
        description: seo.faq?.description || 'Frequently Asked Questions about Techlight IT Solution — enrollment, payment, certificates, courses and technical support.',
    };
}

export default function FAQLayout({ children }) {
    return children;
}
