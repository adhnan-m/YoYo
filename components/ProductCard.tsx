import Link from 'next/link';
import { FiStar, FiArrowRight } from 'react-icons/fi';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        slug: string;
        price: number;
        originalPrice?: number;
        imageUrl: string;
        rating?: number;
        featured?: boolean;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Link href={`/product/${product.slug}`} className="group">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-700/50 overflow-hidden">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                            -{discount}%
                        </div>
                    )}
                    {product.featured && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1">
                            <FiStar className="w-3 h-3" />
                            Featured
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm leading-snug mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating!)
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-slate-300 dark:text-slate-600'
                                        }`}
                                />
                            ))}
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{product.rating}</span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-600 transition-all duration-200">
                            <FiArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
