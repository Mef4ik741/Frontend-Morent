import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { ThematicSections } from '../components/home/ThematicSections';
import { ChevronRight } from 'lucide-react';
import { api } from '../lib/api/axiosConfig';

interface TopRentedCar {
  carId: string;
  imageUrl: string;
  name: string;
  brand: string;
  model: string;
  location: string;
  rentCount: number;
}

export const HomePage: React.FC = () => {
  const [topCars, setTopCars] = useState<TopRentedCar[]>([]);
  const [topLoading, setTopLoading] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const topScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTopCars = async () => {
      try {
        setTopLoading(true);
        setTopError(null);
        const { data } = await api.get<TopRentedCar[]>('/Booking/top-10');
        setTopCars(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load top-10 cars', e);
        setTopError('Failed to load popular cars');
      } finally {
        setTopLoading(false);
      }
    };

    fetchTopCars();
  }, []);

  const scrollTopCars = (direction: 'left' | 'right') => {
    const container = topScrollRef.current;
    if (!container) return;
    const delta = direction === 'left' ? -320 : 320;
    container.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Hero Section - Turo Style */}
      <div className="relative h-[600px] w-full bg-gray-900">
        {/* Background Layer */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2500&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover object-center opacity-90"
          />
          {/* Darker overlay for 'Rich Black' feel and text readability */}
          <div className="absolute inset-0 bg-gray-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center md:items-start">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 max-w-3xl tracking-tight leading-tight text-center md:text-left drop-shadow-sm">
            Find your drive in <span className="text-brand-300">Azerbaijan</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-xl text-center md:text-left font-medium">
            Explore the world's largest car sharing marketplace. From daily drivers to luxury SUVs.
          </p>

          {/* Search Widget - Premium Look */}
          <div className="w-full max-w-6xl">
            <SearchBar className="w-full shadow-2xl shadow-gray-900/20" />
          </div>
        </div>
      </div>

      {/* Top rented cars slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Top-10 rented cars</h2>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTopCars('left')}
              className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollTopCars('right')}
              className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              ›
            </button>
          </div>
        </div>

        {topLoading && (
          <p className="text-sm text-gray-500">Loading popular cars...</p>
        )}
        {topError && !topLoading && (
          <p className="text-sm text-red-500">{topError}</p>
        )}

        {!topLoading && !topError && topCars.length > 0 && (
          <div
            ref={topScrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1"
          >
            {topCars.map((car) => (
              <Link
                key={car.carId}
                to={`/car/${car.carId}`}
                className="min-w-[220px] max-w-[220px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={car.imageUrl}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-xs text-gray-500 truncate mb-1">{car.location || '—'}</p>
                  <p className="text-[11px] text-gray-600">
                    Rented <span className="font-semibold">{car.rentCount}</span> time{car.rentCount === 1 ? '' : 's'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Thematic Car Rows by locations */}
      <ThematicSections />

      {/* Featured Section (Clean & Minimal) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 mb-16">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="max-w-xl relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Feel the best experience <br /> with our rental deals
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Join the thousands of satisfied customers in Azerbaijan who have found their perfect ride with Morent.
            </p>
            <Link to="/search" className="inline-block bg-brand-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-500 transition-all shadow-lg shadow-brand-900/50">
              Find a car
            </Link>
          </div>
          <div className="relative w-full md:w-[45%] aspect-video z-10">
            <img
              src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80"
              alt="Featured Car"
              className="w-full h-full object-cover rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 ring-4 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};