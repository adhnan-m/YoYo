export const revalidate = 60; // Revalidate every 60 seconds (ISR)

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Link from 'next/link';
import { FiArrowRight, FiTrendingUp, FiZap, FiShield } from 'react-icons/fi';

async function getFeaturedProducts() {
  await dbConnect();
  return Product.find({ featured: true }).limit(8).lean();
}

async function getCategories() {
  await dbConnect();
  return Category.find().lean();
}

async function getTrendingProducts() {
  await dbConnect();
  return Product.find().sort({ clicks: -1 }).limit(4).lean();
}

export default async function HomePage() {
  const [featuredProducts, categories, trendingProducts] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getTrendingProducts(),
  ]);

  // Serialize Mongoose docs
  const featured = JSON.parse(JSON.stringify(featuredProducts));
  const cats = JSON.parse(JSON.stringify(categories));
  const trending = JSON.parse(JSON.stringify(trendingProducts));

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 md:py-32 px-4">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <FiZap className="w-4 h-4" />
              Curated deals updated daily
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover the
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"> Best Deals </span>
              on Top Products
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              We handpick the finest products and find you the biggest savings. From tech to home essentials — your next great deal is here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#deals" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl shadow-purple-500/25 flex items-center gap-2">
                Browse Deals
                <FiArrowRight className="w-5 h-5" />
              </a>
              <a href="#categories" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/20 transition-all border border-white/20">
                View Categories
              </a>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 px-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                <FiZap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Daily Updates</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Fresh deals every day</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                <FiShield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Verified Products</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Trusted Amazon sellers</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Best Prices</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Up to 60% savings</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="deals" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Featured Deals</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Hand-picked products with the best savings</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product: Record<string, unknown>) => (
                <ProductCard key={String(product._id)} product={product as { _id: string; name: string; slug: string; price: number; originalPrice?: number; imageUrl: string; rating?: number; featured?: boolean }} />
              ))}
            </div>
            {featured.length === 0 && (
              <p className="text-center text-slate-400 py-12">No featured products yet. Check back soon!</p>
            )}
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Browse by Category</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Explore deals in every category</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {cats.map((cat: { _id: string; name: string; slug: string; imageUrl?: string }) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square bg-slate-200 dark:bg-slate-800"
                >
                  {cat.imageUrl && (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <FiTrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map((product: Record<string, unknown>) => (
                <ProductCard key={String(product._id)} product={product as { _id: string; name: string; slug: string; price: number; originalPrice?: number; imageUrl: string; rating?: number; featured?: boolean }} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
