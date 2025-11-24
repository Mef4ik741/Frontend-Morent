import React, { useEffect, useState } from 'react';
import { Car } from '../../types';
import { api } from '../../lib/api/axiosConfig';
import { CarRow } from './CarRow';

interface LocationCarResponse {
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

type LocationKey = 'baki' | 'yasamal' | 'narimanov' | 'sahil' | 'icheri-seher';

const LOCATION_CONFIG: { key: LocationKey; title: string; searchLocation: string }[] = [
  { key: 'baki', title: 'Popular cars in Baku', searchLocation: 'Baki' },
  { key: 'yasamal', title: 'Cars in Yasamal', searchLocation: 'Yasamal' },
  { key: 'narimanov', title: 'Cars in Narimanov', searchLocation: 'Narimanov' },
  { key: 'sahil', title: 'Cars near Sahil', searchLocation: 'Sahil' },
  { key: 'icheri-seher', title: 'Cars in Icheri Sheher', searchLocation: 'Icheri seher' },
];

export const ThematicSections: React.FC = () => {
  const [carsByLocation, setCarsByLocation] = useState<Record<LocationKey, Car[]>>({
    baki: [],
    yasamal: [],
    narimanov: [],
    sahil: [],
    'icheri-seher': [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const requests = LOCATION_CONFIG.map((loc) =>
          api.get<LocationCarResponse[]>(`/Car/location/${loc.key}`, {
            params: {
              page: 1,
              pageSize: 15,
            },
          })
        );
        const responses = await Promise.all(requests);

        const next: Record<LocationKey, Car[]> = {
          baki: [],
          yasamal: [],
          narimanov: [],
          sahil: [],
          'icheri-seher': [],
        };

        responses.forEach((res, index) => {
          const cfg = LOCATION_CONFIG[index];
          if (!cfg) return;

          const backendCars = Array.isArray(res.data) ? res.data : [];
          next[cfg.key] = backendCars.map<LocationCarResponse>((c) => c).map<Car>((c) => {
            const primaryImage = c.images?.find((img) => img.isPrimary) || c.images?.[0];
            return {
              id: c.id,
              make: c.brand,
              model: c.model,
              year: c.year,
              type: 'SUV',
              pricePerDay: c.price,
              rating: 5,
              trips: 0,
              hostName: '',
              hostImage: '',
              image: primaryImage?.url || c.imageUrl,
              location: c.location,
              city: c.location,
              district: '',
              transmission: 'Automatic',
              fuelType: 'Gas',
              seats: 4,
              features: [],
              description: c.description,
            };
          });
        });

        setCarsByLocation(next);
      } catch (e) {
        console.error('Failed to load location cars', e);
        setError('Не удалось загрузить подборки по локациям');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-16 mb-12 px-0 sm:px-4">
      {error && (
        <p className="text-red-500 text-sm mb-4 px-4 sm:px-6 lg:px-8">{error}</p>
      )}
      {LOCATION_CONFIG.map(({ key, title, searchLocation }) => {
        const cars = carsByLocation[key];
        if (!cars || cars.length === 0) {
          return null;
        }

        return (
          <CarRow
            key={key}
            title={title}
            cars={cars}
            link={`/search?location=${encodeURIComponent(searchLocation)}`}
          />
        );
      })}
      {loading && (
        <p className="text-gray-500 text-sm px-4 sm:px-6 lg:px-8 mt-4">
          Loading locations...
        </p>
      )}
    </div>
  );
};
