import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api/axiosConfig';

interface ProfileResponse {
  id: string;
}

export const AddCarPage: React.FC = () => {
  const navigate = useNavigate();
  const [ownerUserId, setOwnerUserId] = useState<string | null>(null);

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
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!token) {
      setOwnerUserId(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/Account/profile');
        const profile: any = data || {};
        setOwnerUserId(profile.id as string);
      } catch (e) {
        console.error('Failed to load owner user id', e);
        setOwnerUserId(null);
      }
    };

    fetchProfile();
  }, []);

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
      // backend ожидает поле files (array)
      formData.append('files', file);
    });

    const { data } = await api.post('/Car/upload-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // ожидаемый формат: { imageUrls: string[] }
    if (data && typeof data === 'object' && Array.isArray((data as any).imageUrls)) {
      return (data as any).imageUrls as string[];
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerUserId) {
      setError('You must be logged in to add a car.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const primaryImageUrl = await uploadPrimaryImage();
      const galleryImageUrls = await uploadGalleryImages();

      const payload = {
        name,
        brand,
        model,
        year: Number(year),
        price: Number(price),
        description,
        location,
        ownerUserId,
        imageUrl: primaryImageUrl || '',
        primaryImageUrl: primaryImageUrl || '',
        galleryImageUrls,
      };

      const { data } = await api.post('/Car/add', payload);
      setSuccess('Car has been added successfully.');

      // optionally redirect if backend returns car id
      const createdId = (data as any)?.id as string | undefined;
      if (createdId) {
        navigate(`/car/${createdId}`);
      }
    } catch (err) {
      console.error('Failed to add car', err);
      setError('Failed to add car. Please check the form and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Add a new car</h1>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Primary image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPrimaryFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gallery images</label>
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
              {galleryFiles.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Selected images: {galleryFiles.length}
                </p>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          {success && <p className="text-sm text-green-600 mt-2">{success}</p>}

          <button
            type="submit"
            disabled={loading || !ownerUserId}
            className="mt-4 w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit car'}
          </button>
        </form>
      </div>
    </div>
  );
};
