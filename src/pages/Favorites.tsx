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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/Account/profile');
        const profile: any = data || {};
        setUserId(profile.id);
      } catch (e) {
        console.error('Failed to load user profile', e);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<FavoriteItem[]>('/Favorites/list');
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load favorites', e);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (e: React.MouseEvent, carId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) return;

    try {
      // Optimistic update
      setItems(prev => prev.filter(item => item.carId !== carId));

      await api.delete('/Favorites/remove', {
        params: {
          carId,
          userId
        }
      });
    } catch (e) {
      console.error('Failed to remove favorite', e);
      // Revert if failed (optional, but good practice)
      // For now, we just log error as we want UI to feel snappy
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="text-red-500 fill-current" />
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
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                {image ? (
                  <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => handleRemoveFavorite(e, item.carId)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform z-10"
                  title="Remove from favorites"
                >
                  <Heart size={18} className="text-red-500 fill-red-500" />
                </button>
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
