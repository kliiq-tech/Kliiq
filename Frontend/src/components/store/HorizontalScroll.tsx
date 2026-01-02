import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HorizontalScrollProps {
    title: string;
    children: React.ReactNode;
    showViewAll?: boolean;
}

export function HorizontalScroll({ title, children, showViewAll = true }: HorizontalScrollProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
            return () => {
                scrollElement.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="space-y-4">
            {/* Header - Microsoft Store Style */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 group cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {title}
                    {showViewAll && (
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    )}
                </h2>
                {/* Small arrows on the right - Microsoft Store style */}
                <div className="flex gap-1">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={cn(
                            "w-6 h-6 rounded hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors",
                            !canScrollLeft && "opacity-30 cursor-not-allowed"
                        )}
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={cn(
                            "w-6 h-6 rounded hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors",
                            !canScrollRight && "opacity-30 cursor-not-allowed"
                        )}
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {children}
            </div>
        </div>
    );
}
