export const revalidate = 60; // Revalidate every 60 seconds (ISR)

import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import type { Metadata } from 'next';
import AffiliateButton from '@/components/AffiliateButton';
import { FiStar, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
    await dbConnect();
    return Product.findOne({ slug }).populate('categoryId', 'name slug').lean();
}

async function getRelatedProducts(categoryId: string, currentId: string) {
    await dbConnect();
    return Product.find({ categoryId, _id: { $ne: currentId } }).limit(4).lean();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.name} — YoYo Deals`,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.slice(0, 160),
            images: [product.imageUrl],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const rawProduct = await getProduct(slug);
    if (!rawProduct) notFound();

    const product = JSON.parse(JSON.stringify(rawProduct));
    const rawRelated = await getRelatedProducts(
        typeof product.categoryId === 'object' ? product.categoryId._id : product.categoryId,
        product._id
    );
    const related = JSON.parse(JSON.stringify(rawRelated));

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.imageUrl,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
        },
        ...(product.rating && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                bestRating: 5,
            },
        }),
    };

    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
                        <a href="/" className="hover:text-purple-600 transition-colors">Home</a>
                        <span>/</span>
                        {product.categoryId && typeof product.categoryId === 'object' && (
                            <>
                                <a href={`/category/${product.categoryId.slug}`} className="hover:text-purple-600 transition-colors">
                                    {product.categoryId.name}
                                </a>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-slate-800 dark:text-white">{product.name}</span>
                    </nav>

                    {/* Product */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        {/* Image */}
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg">
                                    Save {discount}%
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col">
                            {product.categoryId && typeof product.categoryId === 'object' && (
                                <span className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                                    {product.categoryId.name}
                                </span>
                            )}

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            {product.rating && (
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-slate-300 dark:text-slate-600'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{product.rating} / 5</span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    ${product.price.toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xl text-slate-400 line-through">
                                        ${product.originalPrice.toFixed(2)}
                                    </span>
                                )}
                                {discount > 0 && (
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-semibold rounded-lg">
                                        You save ${(product.originalPrice - product.price).toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                                {product.description}
                            </p>

                            {/* CTA Button */}
                            <AffiliateButton slug={product.slug} affiliateUrl={product.affiliateUrl} />

                            {/* Trust features */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                    <FiShield className="w-5 h-5 text-green-500" />
                                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center">Buyer Protection</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                    <FiTruck className="w-5 h-5 text-blue-500" />
                                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center">Fast Shipping</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                    <FiRefreshCw className="w-5 h-5 text-purple-500" />
                                    <span className="text-xs text-slate-500 dark:text-slate-400 text-center">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {related.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">You May Also Like</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {related.map((p: { _id: string; name: string; slug: string; price: number; originalPrice?: number; imageUrl: string; rating?: number; featured?: boolean }) => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
