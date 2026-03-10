'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiStar } from 'react-icons/fi';

interface Product {
    _id: string;
    name: string;
    price: number;
    featured: boolean;
    clicks: number;
    categoryId: { _id: string; name: string } | null;
    createdAt: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchProducts = async (searchQuery = '') => {
        try {
            const res = await fetch(`/api/admin/products?search=${searchQuery}`);
            const data = await res.json();
            setProducts(data.products);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(search);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        setDeleting(id);
        try {
            await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    Search
                </button>
            </form>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading...</div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No products found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Product</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Category</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Price</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Clicks</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="border-b last:border-0 border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {product.featured && <FiStar className="w-4 h-4 text-yellow-500" />}
                                                <span className="text-sm font-medium text-slate-800 dark:text-white">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                                {product.categoryId?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${product.price.toFixed(2)}</td>
                                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">{product.clicks}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/products/${product._id}/edit`}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    disabled={deleting === product._id}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
