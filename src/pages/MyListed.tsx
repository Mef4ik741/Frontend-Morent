import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import { api } from '../lib/api/axiosConfig';

interface MyListedCar {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  location: string;
  isAvailable: boolean;
  imageUrl: string;
  images: { id: string; url: string; isPrimary: boolean; sortOrder: number }[];
}

export const MyListedPage: React.FC = () => {
  const [items, setItems] = useState<MyListedCar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchListed = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<MyListedCar[]>('/Car/my-listed');
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load my listed cars', e);
        setError('Не удалось загрузить ваши автомобили');
      } finally {
        setLoading(false);
      }
    };

    fetchListed();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      setDeletingIds((prev) => [...prev, id]);
      await api.delete(`/Car/${id}`);
      setItems((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error('Failed to delete car', e);
      alert('Failed to delete car. Please try again.');
    } finally {
      setDeletingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Car className="text-brand-600" />
        <h1 className="text-2xl font-bold">My listed cars</h1>
      </div>

      {loading && <p className="text-gray-500">Loading cars...</p>}
      {error && !loading && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500 text-sm">You have not listed any cars yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {items.map((item) => {
          const primaryImage = item.images?.find((img) => img.isPrimary) || item.images?.[0];
          const image = primaryImage?.url || item.imageUrl;
          const title = item.name || `${item.brand} ${item.model}`;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <Link to={`/car/${item.id}`} className="block">
                <div className="relative aspect-[4/3] bg-gray-100">
                  {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{title}</h3>
                <p className="text-sm text-gray-500 truncate">{item.location || 'No location'}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 mb-3">${item.price}</p>
                <div className="mt-auto flex gap-2">
                  <Link
                    to={`/host/edit-car/${item.id}`}
                    className="flex-1 text-center text-xs font-semibold border border-gray-200 rounded-lg py-2 hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/car/${item.id}`}
                    className="flex-1 text-center text-xs font-semibold bg-brand-600 text-white rounded-lg py-2 hover:bg-brand-700"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingIds.includes(item.id)}
                    className="flex-1 text-center text-xs font-semibold border border-red-200 text-red-600 rounded-lg py-2 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingIds.includes(item.id) ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
