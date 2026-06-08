const API = process.env.NEXT_PUBLIC_API_URL || 'https://TECHLIGHT-server.vercel.app/api';

export async function getSeoContent() {
    try {
        const res = await fetch(`${API}/design/seo`, { next: { revalidate: 60 } });
        const data = await res.json();
        return data?.data?.seoContent || {};
    } catch {
        return {};
    }
}
