'use client';

import { useEffect, useState } from 'react';
import { FiTrash2, FiDownload } from 'react-icons/fi';

interface Subscriber {
    _id: string;
    email: string;
    createdAt: string;
}

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/subscribers')
            .then((r) => r.json())
            .then((data) => setSubscribers(data.subscribers))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this subscriber?')) return;
        try {
            await fetch('/api/admin/subscribers', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            setSubscribers((prev) => prev.filter((s) => s._id !== id));
        } catch (err) { console.error(err); }
    };

    const exportCSV = () => {
        const csv = ['Email,Subscribed Date', ...subscribers.map((s) => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Subscribers</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{subscribers.length} total subscribers</p>
                </div>
                <button
                    onClick={exportCSV}
                    disabled={subscribers.length === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50"
                >
                    <FiDownload className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading...</div>
                ) : subscribers.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No subscribers yet</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Email</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Subscribed</th>
                                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.map((sub) => (
                                    <tr key={sub._id} className="border-b last:border-0 border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors">
                                        <td className="py-4 px-6 text-sm text-slate-800 dark:text-white">{sub.email}</td>
                                        <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4 px-6">
                                            <button onClick={() => handleDelete(sub._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
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
