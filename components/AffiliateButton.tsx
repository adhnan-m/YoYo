'use client';

import { FiExternalLink } from 'react-icons/fi';

export default function AffiliateButton({ slug, affiliateUrl }: { slug: string; affiliateUrl: string }) {
    const handleClick = () => {
        fetch(`/api/products/${slug}/click`, { method: 'POST' }).catch(() => { });
    };

    return (
        <a
            href={affiliateUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-xl shadow-orange-500/25 mb-8"
        >
            <FiExternalLink className="w-5 h-5" />
            View on Amazon
        </a>
    );
}
