export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
}
