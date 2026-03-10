'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                            <span className="text-white font-bold text-lg">Y</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                            YoYo Deals
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            Home
                        </Link>
                        <Link href="/#categories" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            Categories
                        </Link>
                        <Link href="/#deals" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            Deals
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {menuOpen && (
                    <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 space-y-2">
                        <Link href="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                            Home
                        </Link>
                        <Link href="/#categories" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                            Categories
                        </Link>
                        <Link href="/#deals" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                            Deals
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
