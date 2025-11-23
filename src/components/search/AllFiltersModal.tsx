import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export interface FiltersState {
  brand: string;
  year: string;
  availableOnly: boolean;
  minPrice: string;
  maxPrice: string;
}

interface AllFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FiltersState) => void;
  initialFilters?: FiltersState;
}

const DEFAULT_FILTERS: FiltersState = {
  brand: '',
  year: '',
  availableOnly: false,
  minPrice: '',
  maxPrice: '',
};

export default function AllFiltersModal({ isOpen, onClose, onApply, initialFilters }: AllFiltersModalProps) {
  const [filters, setFilters] = useState<FiltersState>(initialFilters || DEFAULT_FILTERS);

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    } else {
      setFilters(DEFAULT_FILTERS);
    }
  }, [initialFilters, isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    onApply(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">All filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Price Range */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Price range</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Min price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Max price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="1000"
                />
              </div>
            </div>
          </section>

          {/* Brand, Year, Availability */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Car details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Brand</label>
                <input
                  type="text"
                  value={filters.brand}
                  onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="BMW"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Year</label>
                <input
                  type="number"
                  value={filters.year}
                  onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="2020"
                />
              </div>
              <div className="flex items-center mt-5 sm:mt-0">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.availableOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, availableOnly: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span>Only available</span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <button
            onClick={handleClear}
            className="text-sm font-semibold underline"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View results
          </button>
        </div>
      </div>
    </div>
  );
}
