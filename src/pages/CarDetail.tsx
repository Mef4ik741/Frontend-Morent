import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { MOCK_CARS } from '../mocks/cars';
import { CarCard } from '../components/car/CarCard';
import { DatePicker } from '../components/search/DateRangePicker';
import { Star, Heart, Share2, ShieldCheck, MapPin } from 'lucide-react';
import { api } from '../lib/api/axiosConfig';

interface CarImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface CarDetailsResponse {
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
  images: CarImage[];
}

interface ReviewSummary {
  userId: string;
  averageRating: number;
  reviewsCount: number;
}

interface ReviewComment {
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const CarDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [car, setCar] = useState<CarDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 4)));
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [reviews, setReviews] = useState<ReviewComment[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<CarDetailsResponse>(`/Car/${id}`);
        setCar(data);
      } catch (e) {
        console.error('Failed to load car details', e);
        setError('Не удалось загрузить информацию об автомобиле');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
    window.scrollTo(0, 0);
  }, [id]);

  // Load current user id for reviewerId
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!token) {
      setCurrentUserId(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/Account/profile');
        const profile: any = data || {};
        setCurrentUserId(profile.id as string);
      } catch (e) {
        console.error('Failed to load current user for reviews', e);
        setCurrentUserId(null);
      }
    };

    fetchProfile();
  }, []);

  // Load reviews for car owner
  useEffect(() => {
    if (!car?.ownerUserId) return;

    const fetchReviews = async () => {
      try {
        const [avgRes, commentsRes] = await Promise.all([
          api.get<ReviewSummary>(`/Review/average/${car.ownerUserId}`),
          api.get<ReviewComment[]>('/Review/comments', {
            params: { userId: car.ownerUserId },
          }),
        ]);
        setReviewSummary(avgRes.data);
        setReviews(commentsRes.data || []);
      } catch (e) {
        console.error('Failed to load reviews', e);
      }
    };

    fetchReviews();
  }, [car?.ownerUserId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car?.ownerUserId || !currentUserId || !newComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      await api.post('/Review/rate', {
        userId: car.ownerUserId,
        reviewerId: currentUserId,
        rating: newRating,
        comment: newComment.trim(),
      });

      setNewComment('');

      // reload reviews
      const [avgRes, commentsRes] = await Promise.all([
        api.get<ReviewSummary>(`/Review/average/${car.ownerUserId}`),
        api.get<ReviewComment[]>('/Review/comments', {
          params: { userId: car.ownerUserId },
        }),
      ]);
      setReviewSummary(avgRes.data);
      setReviews(commentsRes.data || []);
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!car || !currentUserId) return;

    try {
      setIsBooking(true);
      setBookingError(null);

      const payload = {
        renterUserId: currentUserId,
        carId: car.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        agreement: true,
        locations: [car.location],
      };

      const { data } = await api.post<{ id?: string }>('/Booking/add', payload);
      const createdId = (data as any)?.id as string | undefined;
      if (createdId) {
        setBookingId(createdId);
      }
    } catch (e) {
      console.error('Failed to create booking', e);
      setBookingError('Не удалось оформить бронирование, попробуйте ещё раз.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingId) return;

    try {
      setIsBooking(true);
      setBookingError(null);
      await api.post(`/Booking/${bookingId}/cancel`, {});
      setBookingId(null);
    } catch (e) {
      console.error('Failed to cancel booking', e);
      setBookingError('Не удалось отменить бронирование, попробуйте ещё раз.');
    } finally {
      setIsBooking(false);
    }
  };

  const primaryImage = car?.images?.find((img) => img.isPrimary) || car?.images?.[0];

  if (loading && !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Загрузка автомобиля...</p>
      </div>
    );
  }

  if (error && !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
          {/* Left: images and info */}
          <div className="space-y-6">
            <div className="relative aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={primaryImage?.url || car.imageUrl}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            </div>

            {car.images && car.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {car.images.map((img) => (
                  <div
                    key={img.id}
                    className={`min-w-[100px] md:w-28 aspect-[4/3] rounded-xl overflow-hidden border-2 ${
                      img.id === primaryImage?.id
                        ? 'border-brand-600'
                        : 'border-transparent opacity-80'
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-sm mb-1">{car.location}</p>
              <div className="mb-3 text-xs text-gray-600">
                Owner:{' '}
                <Link
                  to={`/user/${car.ownerUserId}`}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  View profile
                </Link>
              </div>
              <p className="text-gray-700 whitespace-pre-line mb-4">{car.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">Year</span>
                  <span className="font-semibold">{car.year}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs uppercase mb-1">Status</span>
                  <span className="font-semibold">{car.isAvailable ? 'Available' : 'Unavailable'}</span>
                </div>
              </div>
            </div>

            {/* Reviews section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
                {reviewSummary && reviewSummary.reviewsCount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Star size={16} className="fill-brand-500 text-brand-500" />
                    <span className="font-semibold">{reviewSummary.averageRating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({reviewSummary.reviewsCount})</span>
                  </div>
                )}
              </div>

              {reviews.length === 0 && (
                <p className="text-gray-500 text-sm mb-4">No reviews yet.</p>
              )}

              {reviews.length > 0 && (
                <div className="space-y-4 mb-6">
                  {reviews.map((r) => (
                    <div key={`${r.reviewerId}-${r.createdAt}`} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-gray-900 text-sm">{r.reviewerName}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Star size={12} className="fill-brand-500 text-brand-500" />
                          <span>{r.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add review */}
              {currentUserId && car.ownerUserId !== currentUserId && (
                <form onSubmit={handleSubmitReview} className="space-y-3 border-t border-gray-100 pt-4 mt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your rating</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      {[5, 4, 3, 2, 1].map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your comment</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                      placeholder="Share your experience"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !newComment.trim()}
                    className="w-full bg-brand-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? 'Sending...' : 'Submit review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: price and booking dates (без реального бронирования) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">${car.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/day</span>
                </div>
              </div>
              <div className="space-y-4">
                <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate}
                />
              </div>
              {bookingError && (
                <p className="mt-4 text-sm text-red-500">{bookingError}</p>
              )}
              {!bookingId && (
                <button
                  className="mt-6 w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleCreateBooking}
                  disabled={isBooking || !currentUserId}
                >
                  {isBooking ? 'Processing...' : 'Request to book'}
                </button>
              )}
              {bookingId && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm text-green-600 font-medium">
                    Booking created successfully.
                  </p>
                  <button
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleCancelBooking}
                    disabled={isBooking}
                  >
                    {isBooking ? 'Cancelling...' : 'Cancel booking'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};