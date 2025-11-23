import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api/axiosConfig';

interface CarDetails {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  location: string;
  imageUrl: string;
  images: { id: string; url: string; isPrimary: boolean; sortOrder: number }[];
}

export const EditCarPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState<CarDetails | null>(null);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<CarDetails>(`/Car/${id}`);
        setCar(data);
        setName(data.name);
        setBrand(data.brand);
        setModel(data.model);
        setYear(String(data.year));
        setPrice(String(data.price));
        setDescription(data.description);
        setLocation(data.location);
      } catch (e) {
        console.error('Failed to load car for edit', e);
        setError('Не удалось загрузить автомобиль');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const uploadPrimaryImage = async (): Promise<string | null> => {
    if (!primaryFile) return null;
    const formData = new FormData();
    formData.append('file', primaryFile);
    const { data } = await api.post('/Car/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object' && 'url' in data) return (data as any).url as string;
    return null;
  };

  const uploadGalleryImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    if (!galleryFiles || galleryFiles.length === 0) return urls;

    const formData = new FormData();
    galleryFiles.forEach((file) => {
      formData.append('files', file);
    });

    const { data } = await api.post('/Car/upload-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (data && typeof data === 'object' && Array.isArray((data as any).imageUrls)) {
      return (data as any).imageUrls as string[];
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !car) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      let primaryImageUrl = car.imageUrl;
      if (primaryFile) {
        const uploaded = await uploadPrimaryImage();
        if (uploaded) primaryImageUrl = uploaded;
      }

      let galleryImageUrls: string[] = [];
      if (galleryFiles.length > 0) {
        galleryImageUrls = await uploadGalleryImages();
      }

      const payload = {
        name,
        brand,
        model,
        year: Number(year),
        price: Number(price),
        description,
        location,
        imageUrl: primaryImageUrl,
        primaryImageUrl,
        galleryImageUrls,
      };

      await api.put(`/Car/${id}`, payload);
      setSuccess('Car has been updated successfully.');
      navigate(`/my-listed`);
    } catch (err) {
      console.error('Failed to update car', err);
      setError('Failed to update car. Please check the form and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!car && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading car...</p>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Edit car</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Model</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (per day)</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Primary image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPrimaryFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gallery images (optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  setGalleryFiles((prev) => [...prev, ...files]);
                }}
                className="w-full text-sm"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          {success && <p className="text-sm text-green-600 mt-2">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
