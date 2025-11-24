import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { ThematicSections } from '../components/home/ThematicSections';
import { ChevronRight } from 'lucide-react';

export const HomePage: React.FC = () => {
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
            <div className="flex flex-wrap gap-4">
              <Link
                to="/cars"
                className="inline-block bg-brand-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-500 transition-all shadow-lg shadow-brand-900/50"
              >
                Browse all cars
              </Link>
            </div>
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