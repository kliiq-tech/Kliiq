import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { HeroSlide } from '../../data/storeData';

interface HeroCarouselProps {
    slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden group bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            {/* Content Grid */}
            <div className="relative h-full flex items-center">
                {/* Left Side - Text Content */}
                <div className="w-1/2 px-12 z-10">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={cn(
                                "transition-opacity duration-500",
                                index === currentSlide ? "opacity-100" : "opacity-0 absolute"
                            )}
                        >
                            <h2 className="text-5xl font-bold text-white mb-3">{slide.title}</h2>
                            <p className="text-xl text-white/90 mb-6">{slide.subtitle}</p>
                            <button className="px-8 py-3 bg-white text-gray-900 rounded-md font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                                {slide.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Right Side - Game Grid */}
                <div className="w-1/2 h-full flex items-center justify-center pr-12">
                    <div className="grid grid-cols-3 gap-3 max-w-md">
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[3/4] rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform"
                                style={{
                                    background: `linear-gradient(135deg, 
                                        ${['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'][i % 9]} 0%, 
                                        ${['#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#fee140', '#fa709a', '#338aff'][i % 9]} 100%)`
                                }}
                            >
                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                                    {['COD', 'FC2', 'RDR', 'ARC', 'HOB', 'MC', 'GR', 'CV', 'FT'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-12 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "h-1 rounded-full transition-all",
                            index === currentSlide
                                ? "bg-white w-12"
                                : "bg-white/50 hover:bg-white/75 w-8"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
