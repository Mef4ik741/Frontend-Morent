import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { api } from '../lib/api/axiosConfig';

interface FavoriteItem {
  carId: string;
  name: string;
  price: number;
  location: string;
  primaryImageUrl: string;
}

export const FavoritesPage: React.FC = () => {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<FavoriteItem[]>('/Favorites/list');
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load favorites', e);
        setError('Не удалось загрузить избранные автомобили');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="text-red-500" />
        <h1 className="text-2xl font-bold">My favorites</h1>
      </div>

      {loading && <p className="text-gray-500">Loading favorites...</p>}
      {error && !loading && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500 text-sm">You have no favorite cars yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {items.map((item, index) => {
          const image = item.primaryImageUrl;
          const title = item.name || 'Car';

          return (
            <Link
              key={`${item.carId}-${index}`}
              to={`/car/${item.carId}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                {image ? (
                  <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{title}</h3>
                <p className="text-sm text-gray-500 truncate">{item.location}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">${item.price}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
