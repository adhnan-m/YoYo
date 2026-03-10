'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';

interface Category {
    _id: string;
    name: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        originalPrice: '',
        imageUrl: '',
        affiliateUrl: '',
        featured: false,
        rating: '',
    });

    useEffect(() => {
        fetch('/api/admin/categories')
            .then((r) => r.json())
            .then((data) => setCategories(data.categories))
            .catch(console.error);
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                setForm((prev) => ({ ...prev, imageUrl: data.url }));
            } else {
                setError(data.error || 'Upload failed');
            }
        } catch {
            setError('Upload failed');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                name: form.name,
                description: form.description,
                categoryId: form.categoryId,
                price: parseFloat(form.price),
                originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
                imageUrl: form.imageUrl,
                affiliateUrl: form.affiliateUrl,
                featured: form.featured,
                rating: form.rating ? parseFloat(form.rating) : undefined,
            };

            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to create product');
                return;
            }

            router.push('/admin/products');
        } catch {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">New Product</h1>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. Sony WH-1000XM5 Headphones"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            rows={4}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            placeholder="Describe the product..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                        <select
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Original Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={form.originalPrice}
                            onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating (0-5)</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={form.rating}
                            onChange={(e) => setForm({ ...form, rating: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="4.5"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="url"
                                value={form.imageUrl}
                                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                required
                                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://... or upload below"
                            />
                            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                <FiUpload className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">Upload</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Affiliate URL</label>
                        <input
                            type="url"
                            value={form.affiliateUrl}
                            onChange={(e) => setForm({ ...form, affiliateUrl: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="https://www.amazon.com/dp/..."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.featured}
                                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                className="w-5 h-5 rounded-lg border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured Product</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/25"
                    >
                        <FiSave className="w-4 h-4" />
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
