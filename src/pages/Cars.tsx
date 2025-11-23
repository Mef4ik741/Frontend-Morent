import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPills from '../components/search/FilterPills';
import AllFiltersModal, { FiltersState } from '../components/search/AllFiltersModal';
import { api } from '../lib/api/axiosConfig';
import { Heart, Users, Fuel, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchedCar {
  id: string;
  imageCar: string;
  name: string;
  ownerUsername: string;
  location: string;
  fuelType: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  hostImage: string;
  hostName: string;
}

interface BackendCar {
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
	ownerUserId: string;
	images: {
		id: string;
		url: string;
		isPrimary: boolean;
		sortOrder: number;
	}[];
}

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [cars, setCars] = useState<SearchedCar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isToggling, setIsToggling] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
		brand: '',
		year: '',
		availableOnly: false,
		minPrice: '',
		maxPrice: '',
	});

  const location = searchParams.get('location') || '';

  // Load current user for favorites
  useEffect(() => {
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
        console.error('Failed to load user for favorites (search page)', e);
        setUserId(null);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!location.trim()) {
      setCars([]);
      return;
    }

    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<SearchedCar[]>('/Car/CarsSearched', {
          params: { name: location.trim() },
        });
        setCars(data || []);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить автомобили');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [location]);

  const mapBackendCarToSearched = (car: BackendCar): SearchedCar => {
		const primaryImage = car.images?.find((img) => img.isPrimary) || car.images?.[0];
		return {
			id: car.id,
			imageCar: primaryImage?.url || car.imageUrl,
			name: car.name || `${car.brand} ${car.model}`,
			ownerUsername: '',
			location: car.location,
			fuelType: 'Gas',
			transmission: 'Automatic',
			seats: 4,
			pricePerDay: car.price,
			hostImage: '',
			hostName: '',
		};
	};

	const handleApplyFilters = async (nextFilters: FiltersState) => {
		setFilters(nextFilters);

		// если фильтры пустые – просто перезагружаем поиск по location
		const hasBrand = !!nextFilters.brand.trim();
		const hasYear = !!nextFilters.year.trim();
		const hasPrice = !!nextFilters.minPrice.trim() || !!nextFilters.maxPrice.trim();
		const onlyAvailable = nextFilters.availableOnly;

		if (!hasBrand && !hasYear && !hasPrice && !onlyAvailable) {
			if (location) {
				// триггерим useEffect
				setCars([]);
			}
			return;
		}

		try {
			setLoading(true);
			setError(null);

			let data: BackendCar[] = [];
			if (hasBrand) {
				const { data: res } = await api.get<BackendCar[]>(`/Car/brand/${encodeURIComponent(nextFilters.brand.trim())}`);
				data = Array.isArray(res) ? res : [];
			} else if (hasYear) {
				const yearNum = parseInt(nextFilters.year.trim(), 10);
				if (!Number.isNaN(yearNum)) {
					const { data: res } = await api.get<BackendCar[]>(`/Car/year/${yearNum}`);
					data = Array.isArray(res) ? res : [];
				}
			} else if (onlyAvailable) {
				const { data: res } = await api.get<BackendCar[]>('/Car/available');
				data = Array.isArray(res) ? res : [];
			} else if (hasPrice) {
				const params: any = {};
				if (nextFilters.minPrice.trim()) params.minPrice = Number(nextFilters.minPrice);
				if (nextFilters.maxPrice.trim()) params.maxPrice = Number(nextFilters.maxPrice);
				const { data: res } = await api.get<BackendCar[]>('/Car/price', { params });
				data = Array.isArray(res) ? res : [];
			}

			// дополнительные фильтры по цене и доступности на фронте
			if (hasPrice && !data.length && (hasBrand || hasYear || onlyAvailable)) {
				// если основной эндпоинт не вызывался с ценой, берём доступные и фильтруем
				if (!data.length) {
					const { data: res } = await api.get<BackendCar[]>('/Car/available');
					data = Array.isArray(res) ? res : [];
				}
			}

			if (hasPrice) {
				const min = nextFilters.minPrice.trim() ? Number(nextFilters.minPrice) : 0;
				const max = nextFilters.maxPrice.trim() ? Number(nextFilters.maxPrice) : Number.MAX_SAFE_INTEGER;
				data = data.filter((c) => c.price >= min && c.price <= max);
			}

			if (onlyAvailable) {
				data = data.filter((c) => c.isAvailable);
			}

			setCars(data.map(mapBackendCarToSearched));
		} catch (err) {
			console.error('Failed to apply filters', err);
			setError('Не удалось применить фильтры');
			setCars([]);
		} finally {
			setLoading(false);
		}
	};

  const toggleFavorite = async (carId: string) => {
    if (!userId || isToggling) return;

    const isFav = favoriteIds.includes(carId);

    try {
      setIsToggling(true);
      if (!isFav) {
        await api.post('/Favorites/add', {
          userId,
          carId,
        });
        setFavoriteIds((prev) => [...prev, carId]);
      } else {
        await api.delete('/Favorites/remove', {
          params: { userId, carId },
        });
        setFavoriteIds((prev) => prev.filter((id) => id !== carId));
      }
    } catch (err) {
      console.error('Failed to toggle favorite (search page)', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Search results{location ? ` for "${location}"` : ''}
        </h1>
        <FilterPills onOpenAllFilters={() => setIsFiltersOpen(true)} />
      </div>

      <AllFiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />

      {loading && <p className="text-gray-500">Loading cars...</p>}
      {error && !loading && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {!loading && !error && cars.length === 0 && location.trim() && (
        <p className="text-gray-500 text-sm">No cars found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[4/3]">
              <img
                src={car.imageCar}
                alt={car.name}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(car.id);
                }}
                aria-label="Add to favorites"
              >
                <Heart
                  className={favoriteIds.includes(car.id) ? 'w-5 h-5 fill-red-500 text-red-500' : 'w-5 h-5 text-gray-600'}
                />
              </button>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{car.name}</h3>
                  <p className="text-gray-500 text-sm">{car.location}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">${car.pricePerDay}</span>
                  <span className="text-gray-500 text-sm">/day</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-500 text-sm my-4">
                <div className="flex items-center gap-1">
                  <Fuel className="w-4 h-4" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{car.seats} People</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src={car.hostImage}
                    alt={car.hostName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{car.hostName}</span>
                </div>
                <Link
                  to={`/car/${car.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Rent Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
