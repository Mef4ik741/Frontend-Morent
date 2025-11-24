import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Car } from '../../types';
import { CarCard } from '../car/CarCard';

interface CarRowProps {
    title: string;
    cars: Car[];
    link?: string;
}

export const CarRow: React.FC<CarRowProps> = ({ title, cars, link }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const updateScrollButtons = () => {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            const maxScrollLeft = scrollWidth - clientWidth;
            setCanScrollLeft(scrollLeft > 8);
            setCanScrollRight(scrollLeft < maxScrollLeft - 8);
        };

        updateScrollButtons();

        container.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);

        return () => {
            container.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [cars.length]);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 280;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        let newScrollLeft = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        if (newScrollLeft < 0) newScrollLeft = 0;
        if (newScrollLeft > maxScrollLeft) newScrollLeft = maxScrollLeft;

        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    return (
        <div className="py-6">
            <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
                {link ? (
                    <Link to={link} className="group inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
                            {title}
                        </h2>
                        <ChevronRight size={24} className="text-gray-900" />
                    </Link>
                ) : (
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                )}

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded-full border transition-colors ${
                            canScrollLeft
                                ? 'border-gray-300 bg-white hover:bg-gray-100'
                                : 'border-gray-200 bg-gray-100/60 opacity-50 cursor-not-allowed'
                        }`}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`p-2 rounded-full border transition-colors ${
                            canScrollRight
                                ? 'border-gray-300 bg-white hover:bg-gray-100'
                                : 'border-gray-200 bg-gray-100/60 opacity-50 cursor-not-allowed'
                        }`}
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 px-4 sm:px-6 lg:px-8 pb-2 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {cars.map((car) => (
                    <div key={car.id} className="flex-none w-[260px] snap-start">
                        <CarCard car={car} />
                    </div>
                ))}
            </div>
        </div>
    );
};
