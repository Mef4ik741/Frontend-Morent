import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Car } from '../../types';
import { api } from '../../lib/api/axiosConfig';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isToggling, setIsToggling] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!token) {
      setUserId(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/Account/profile');
        const profile: any = data || {};
        setUserId(profile.id as string);
      } catch (e) {
        console.error('Failed to load user for favorites', e);
        setUserId(null);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Link
      to={`/car/${car.id}`}
      className="block bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      {/* Car Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />

        {/* Favorite Button */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            if (!userId || isToggling) return;

            try {
              setIsToggling(true);
              if (!isFavorite) {
                await api.post('/Favorites/add', {
                  userId,
                  carId: car.id,
                });
                setIsFavorite(true);
              } else {
                await api.delete('/Favorites/remove', {
                  params: { userId, carId: car.id },
                });
                setIsFavorite(false);
              }
            } catch (err) {
              console.error('Failed to toggle favorite', err);
            } finally {
              setIsToggling(false);
            }
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          aria-label="Add to favorites"
        >
          <Heart
            size={18}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      {/* Car Details */}
      <div className="p-4">
        {/* Make & Model */}
        <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
          {car.make} {car.model} {car.year}
        </h3>

        {/* Rating & Trips */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={14} className="fill-gray-900 text-gray-900" />
          <span className="font-bold text-sm text-gray-900">{car.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-600">({car.trips} trips)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-gray-900">${car.pricePerDay}</span>
          <span className="text-sm text-gray-600">/day</span>
        </div>
      </div>
    </Link>
  );
};