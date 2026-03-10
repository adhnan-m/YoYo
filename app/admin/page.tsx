'use client';

import { useEffect, useState } from 'react';
import { FiBox, FiGrid, FiUsers, FiMousePointer } from 'react-icons/fi';

interface Stats {
    totalProducts: number;
    totalCategories: number;
    totalSubscribers: number;
    totalClicks: number;
}

interface RecentProduct {
    _id: string;
    name: string;
    price: number;
    clicks: number;
    createdAt: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                setStats(data.stats);
                setRecentProducts(data.recentProducts);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: FiBox, color: 'from-blue-500 to-cyan-500' },
        { label: 'Categories', value: stats?.totalCategories ?? 0, icon: FiGrid, color: 'from-purple-500 to-pink-500' },
        { label: 'Subscribers', value: stats?.totalSubscribers ?? 0, icon: FiUsers, color: 'from-orange-500 to-red-500' },
        { label: 'Total Clicks', value: stats?.totalClicks ?? 0, icon: FiMousePointer, color: 'from-green-500 to-emerald-500' },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full`} />
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} mb-4`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white">{card.value.toLocaleString()}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Products */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Recent Products</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left py-3 px-6 text-sm font-medium text-slate-500 dark:text-slate-400">Product</th>
                                <th className="text-left py-3 px-6 text-sm font-medium text-slate-500 dark:text-slate-400">Price</th>
                                <th className="text-left py-3 px-6 text-sm font-medium text-slate-500 dark:text-slate-400">Clicks</th>
                                <th className="text-left py-3 px-6 text-sm font-medium text-slate-500 dark:text-slate-400">Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b last:border-0 border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors"
                                >
                                    <td className="py-4 px-6 text-sm font-medium text-slate-800 dark:text-white">{product.name}</td>
                                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">${product.price.toFixed(2)}</td>
                                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">{product.clicks}</td>
                                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {recentProducts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-500 dark:text-slate-400">
                                        No products yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
