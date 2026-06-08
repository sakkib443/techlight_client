import { getSeoContent } from '@/lib/getSeoContent';

export async function generateMetadata() {
    const seo = await getSeoContent();
    return {
        title: seo.certification?.title || 'Certificate Verification',
        description: seo.certification?.description || 'Verify and download your certificates from Techlight IT Solution.',
    };
}

export default function CertificationLayout({ children }) {
    return children;
}
