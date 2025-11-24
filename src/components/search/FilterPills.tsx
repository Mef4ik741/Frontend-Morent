import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface FilterPillsProps {
    onOpenAllFilters: () => void;
}

export default function FilterPills({ onOpenAllFilters }: FilterPillsProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={onOpenAllFilters}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
                <SlidersHorizontal className="w-4 h-4" />
                All filters
            </button>
        </div>
    );
}
