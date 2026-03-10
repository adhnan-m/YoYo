import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
            <div className="text-center max-w-md">
                <p className="text-8xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
                    404
                </p>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Page Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
                >
                    <FiHome className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
