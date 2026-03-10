export const revalidate = 60; // Revalidate every 60 seconds (ISR)

import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import type { Metadata } from 'next';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string; search?: string; sort?: string }>;
}

async function getCategory(slug: string) {
    await dbConnect();
    return Category.findOne({ slug }).lean();
}

async function getCategoryProducts(
    categoryId: string,
    page: number,
    search: string,
    sort: string
) {
    await dbConnect();

    const query: Record<string, unknown> = { categoryId };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { clicks: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const limit = 12;
    const [products, total] = await Promise.all([
        Product.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Product.countDocuments(query),
    ]);

    return { products, total, pages: Math.ceil(total / limit) };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);
    if (!category) return { title: 'Category Not Found' };

    return {
        title: `${category.name} — YoYo Deals`,
        description: category.description || `Browse the best ${category.name} deals and discounts.`,
    };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params;
    const { page: pageStr, search: searchQuery, sort: sortOption } = await searchParams;

    const rawCategory = await getCategory(slug);
    if (!rawCategory) notFound();

    const category = JSON.parse(JSON.stringify(rawCategory));
    const page = parseInt(pageStr || '1');
    const search = searchQuery || '';
    const sort = sortOption || 'newest';

    const { products: rawProducts, total, pages } = await getCategoryProducts(
        category._id,
        page,
        search,
        sort
    );
    const products = JSON.parse(JSON.stringify(rawProducts));

    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero Banner */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 py-16 px-4">
                    {category.imageUrl && (
                        <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-20"
                        />
                    )}
                    <div className="relative max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
                        {category.description && (
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto">{category.description}</p>
                        )}
                        <p className="text-slate-400 mt-4">{total} products found</p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <form method="GET" className="flex gap-3 w-full sm:w-auto">
                            <input type="hidden" name="sort" value={sort} />
                            <input
                                name="search"
                                type="text"
                                defaultValue={search}
                                placeholder="Search in this category..."
                                className="flex-1 sm:w-72 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Sort by:</span>
                            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                                {[
                                    { value: 'newest', label: 'Newest' },
                                    { value: 'popular', label: 'Popular' },
                                    { value: 'price-asc', label: 'Price ↑' },
                                    { value: 'price-desc', label: 'Price ↓' },
                                ].map((option) => (
                                    <a
                                        key={option.value}
                                        href={`/category/${slug}?sort=${option.value}&search=${search}`}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sort === option.value
                                            ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                            }`}
                                    >
                                        {option.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-slate-400 mb-4">No products found</p>
                            <p className="text-slate-500 dark:text-slate-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product: { _id: string; name: string; slug: string; price: number; originalPrice?: number; imageUrl: string; rating?: number; featured?: boolean }) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                                <a
                                    key={p}
                                    href={`/category/${slug}?page=${p}&sort=${sort}&search=${search}`}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${p === page
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {p}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
