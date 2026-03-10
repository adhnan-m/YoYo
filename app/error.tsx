'use client';

import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default function Error({ reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-500/10 mb-6">
                    <FiAlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Something went wrong</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    An unexpected error occurred. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                >
                    <FiRefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
