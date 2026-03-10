import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">Y</span>
                            </div>
                            <span className="text-xl font-bold text-white">YoYo Deals</span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">
                            Find the best deals on top products. We curate the finest offers from Amazon so you never miss a great deal.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-2.5">
                            <li><Link href="/" className="text-sm hover:text-purple-400 transition-colors">Home</Link></li>
                            <li><Link href="/#categories" className="text-sm hover:text-purple-400 transition-colors">Categories</Link></li>
                            <li><Link href="/#deals" className="text-sm hover:text-purple-400 transition-colors">Deals</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
                        <ul className="space-y-2.5">
                            <li><span className="text-sm">Privacy Policy</span></li>
                            <li><span className="text-sm">Terms of Service</span></li>
                            <li><span className="text-sm">Affiliate Disclosure</span></li>
                        </ul>
                    </div>
                </div>

                {/* Divider + Bottom */}
                <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} YoYo Deals. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-500">
                        As an Amazon Associate, we earn from qualifying purchases.
                    </p>
                </div>
            </div>
        </footer>
    );
}
