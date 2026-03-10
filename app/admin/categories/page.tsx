'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    createdAt: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [error, setError] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data.categories);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories';
            const method = editId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            setForm({ name: '', description: '' });
            setShowForm(false);
            setEditId(null);
            fetchCategories();
        } catch { setError('An error occurred'); }
    };

    const startEdit = (cat: Category) => {
        setEditId(cat._id);
        setForm({ name: cat.name, description: cat.description || '' });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this category?')) return;
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) { alert(data.error); return; }
            setCategories((prev) => prev.filter((c) => c._id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Categories</h1>
                <button
                    onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', description: '' }); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
                >
                    {showForm ? <FiX className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                    {showForm ? 'Cancel' : 'Add Category'}
                </button>
            </div>

            {/* Inline form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Category name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                        <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Optional description" />
                    </div>
                    <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                        <FiCheck className="w-4 h-4" />
                        {editId ? 'Update' : 'Create'}
                    </button>
                </form>
            )}

            {/* List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading...</div>
                ) : categories.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No categories yet</div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {categories.map((cat) => (
                            <div key={cat._id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors">
                                <div>
                                    <h3 className="font-medium text-slate-800 dark:text-white">{cat.name}</h3>
                                    {cat.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{cat.description}</p>}
                                    <p className="text-xs text-slate-400 mt-1">Slug: {cat.slug}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => startEdit(cat)} className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                                        <FiEdit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(cat._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
