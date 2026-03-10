'use client';

import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiHome, FiBox, FiGrid, FiUsers, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: FiHome },
    { href: '/admin/products', label: 'Products', icon: FiBox },
    { href: '/admin/categories', label: 'Categories', icon: FiGrid },
    { href: '/admin/subscribers', label: 'Subscribers', icon: FiUsers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 dark:bg-slate-950 border-r border-slate-700 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Y</span>
                        </div>
                        <span className="text-white font-bold text-xl">YoYo Admin</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 w-full transition-all duration-200"
                    >
                        <FiLogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <FiMenu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                                View Site →
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
