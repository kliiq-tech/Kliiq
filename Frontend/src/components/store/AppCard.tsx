import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { StoreApp } from '../../data/storeData';

interface AppCardProps {
    app: StoreApp;
    size?: 'small' | 'medium' | 'large';
}

export function AppCard({ app, size = 'medium' }: AppCardProps) {
    const cardSizes = {
        small: 'w-[140px]',
        medium: 'w-[180px]',
        large: 'w-[220px]'
    };

    const formatPrice = (price: number | 'free') => {
        if (price === 'free') return 'Free';
        return `$${price.toFixed(2)}`;
    };

    const isSmall = size === 'small';

    return (
        <div className={cn(
            "flex-shrink-0 group cursor-pointer",
            cardSizes[size]
        )}>
            <div className="bg-white dark:bg-white/5 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* App Icon/Image */}
                <div className={cn(
                    "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white overflow-hidden",
                    isSmall ? "aspect-square" : "aspect-[3/4]"
                )}>
                    {app.icon && app.icon.startsWith('http') ? (
                        <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className={cn(
                            "font-bold drop-shadow-lg",
                            isSmall ? "text-3xl" : "text-5xl"
                        )}>
                            {app.name.substring(0, 2).toUpperCase()}
                        </span>
                    )}
                </div>

                {/* App Info */}
                <div className={cn("p-3", !isSmall && "space-y-2")}>
                    <div>
                        <h3 className={cn(
                            "font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight",
                            isSmall ? "text-xs mb-1" : "text-sm mb-1"
                        )}>
                            {app.name}
                        </h3>
                        <p className={cn(
                            "text-gray-500 dark:text-gray-400",
                            isSmall ? "text-[10px]" : "text-xs"
                        )}>
                            {app.category}
                        </p>
                    </div>

                    {/* Rating - only for medium/large */}
                    {!isSmall && app.rating && (
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {app.rating}
                            </span>
                        </div>
                    )}

                    {/* Price & Action */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            {app.originalPrice && app.price !== 'free' && !isSmall && (
                                <span className="text-[10px] text-gray-400 line-through">
                                    ${app.originalPrice.toFixed(2)}
                                </span>
                            )}
                            <span className={cn(
                                "font-semibold",
                                isSmall ? "text-xs" : "text-sm",
                                app.price === 'free' ? "text-gray-700 dark:text-gray-300" : "text-green-600 dark:text-green-400"
                            )}>
                                {formatPrice(app.price)}
                            </span>
                        </div>
                        {!isSmall && (
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors">
                                Get
                            </button>
                        )}
                    </div>

                    {/* Tags - only for medium/large */}
                    {!isSmall && app.tags && app.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {app.tags.slice(0, 1).map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
