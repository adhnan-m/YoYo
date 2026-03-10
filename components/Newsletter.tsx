'use client';

import { useState } from 'react';
import { FiMail, FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMessage('You\'re in! Welcome to our deals community.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 py-20 px-4">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDE2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

            <div className="relative max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                    <FiMail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Never Miss a Deal
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                    Get the best product deals and discounts delivered to your inbox. No spam, just savings.
                </p>

                {status === 'success' ? (
                    <div className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl py-4 px-6 max-w-md mx-auto">
                        <FiCheck className="w-6 h-6 text-green-300" />
                        <span className="text-white font-medium">{message}</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="px-7 py-3.5 bg-white text-purple-700 rounded-xl font-semibold hover:bg-white/90 disabled:opacity-50 transition-all shadow-lg shadow-black/10"
                        >
                            {status === 'loading' ? 'Joining...' : 'Subscribe'}
                        </button>
                    </form>
                )}

                {status === 'error' && (
                    <div className="flex items-center justify-center gap-2 mt-4 text-red-200">
                        <FiAlertCircle className="w-4 h-4" />
                        <span className="text-sm">{message}</span>
                    </div>
                )}
            </div>
        </section>
    );
}
