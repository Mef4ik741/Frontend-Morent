import React, { useRef } from 'react';
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

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 280;
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
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
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 px-4 sm:px-6 lg:px-8 pb-2 snap-x snap-mandatory scrollbar-hide"
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
