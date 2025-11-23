import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { DatePicker } from './DateRangePicker';
import { api } from '../../lib/api/axiosConfig';

interface SearchBarProps {
    className?: string;
    compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = "", compact = false }) => {
    const [location, setLocation] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 3)));

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocation(value);
    };

    const handleSearch = async () => {
        if (!location.trim() || isSearching) return;

        try {
            setIsSearching(true);
            const { data } = await api.get('/Car/CarsSearched', {
                params: { name: location.trim() },
            });
            console.log('CarsSearched results', data);
            setResults(Array.isArray(data) ? data : null);
            navigate(`/search?location=${encodeURIComponent(location.trim())}`);
        } catch (error) {
            console.error('Search request failed', error);
            setResults(null);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col lg:flex-row items-center relative ${compact ? 'p-1' : 'p-2'} ${className}`}>

            {/* Location Input */}
            <div className={`w-full lg:flex-[1.5] relative px-4 ${compact ? 'py-1' : 'py-2'}`}>
                <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Where</label>
                <input
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    className="w-full bg-transparent focus:outline-none text-gray-900 font-bold placeholder-gray-400 text-sm truncate"
                    placeholder="City, airport, address or hotel"
                />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2"></div>

            {/* From Date */}
            <div className={`w-full lg:flex-1 px-4 border-t lg:border-t-0 border-gray-100 pt-2 lg:pt-0 ${compact ? 'py-1' : 'py-2'}`}>
                <DatePicker
                    label="From"
                    placeholder="Add dates"
                    value={startDate}
                    onChange={setStartDate}
                    className="w-full"
                />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2"></div>

            {/* Until Date */}
            <div className={`w-full lg:flex-1 px-4 border-t lg:border-t-0 border-gray-100 pt-2 lg:pt-0 ${compact ? 'py-1' : 'py-2'}`}>
                <DatePicker
                    label="Until"
                    placeholder="Add dates"
                    value={endDate}
                    onChange={setEndDate}
                    minDate={startDate}
                    className="w-full"
                />
            </div>

            {/* Search Button */}
            <div className="w-full lg:w-auto mt-2 lg:mt-0 lg:ml-2">
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className={`bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-brand-500/25 ${compact ? 'h-9 w-9' : 'h-12 w-full lg:w-12'}`}
                >
                    <Search size={compact ? 18 : 24} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};
