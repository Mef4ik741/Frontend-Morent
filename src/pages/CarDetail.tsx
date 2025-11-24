import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Star,
  Heart,
  Share2,
  ShieldCheck,
  MapPin,
  Fuel,
  Armchair,
  Gauge,
  Settings2,
  Check,
  User,
  Medal,
  Images,
  X
} from 'lucide-react';
import { DatePicker } from '../components/search/DateRangePicker';
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

interface PublicProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  imageProfileURL: string | null;
  createdAt: string;
  isConfirmed: boolean;
  isVerified: boolean;
  rank: number;
  reviewCount: number;
  negativeReviewCount: number;
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

// Mock data for UI demonstration (since API doesn't provide these yet)
const MOCK_SPECS = {
  mpg: '30 MPG',
  fuelType: 'Gas (Regular)',
  seats: '5 seats',
  transmission: 'Automatic',
  doors: '4 doors'
};

const MOCK_FEATURES = [
  { category: 'Safety', items: ['Backup camera', 'Lane departure warning', 'Blind spot warning'] },
  { category: 'Comfort', items: ['Heated seats', 'Sunroof', 'Keyless entry'] },
  { category: 'Connectivity', items: ['Bluetooth', 'Apple CarPlay', 'Android Auto', 'USB input'] }
];

export const CarDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [car, setCar] = useState<CarDetailsResponse | null>(null);
  const [host, setHost] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Booking State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Review State
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [reviews, setReviews] = useState<ReviewComment[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
    window.scrollTo(0, 0);
  }, [id]);

  // Load Host Profile
  useEffect(() => {
    if (!car?.ownerUserId) return;

    const fetchHost = async () => {
      try {
        const { data } = await api.get<PublicProfile>(`/Account/profile/${car.ownerUserId}`);
        setHost(data);
      } catch (e) {
        console.error('Failed to load host profile', e);
      }
    };

    fetchHost();
  }, [car?.ownerUserId]);

  // Load current user
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
        console.error('Failed to load current user', e);
        setCurrentUserId(null);
      }
    };

    fetchProfile();
  }, []);

  // Load existing booking
  useEffect(() => {
    if (!car?.id || !currentUserId) return;

    const fetchExistingBooking = async () => {
      try {
        setBookingError(null);
        const { data } = await api.get('/Booking/by-car-and-user', {
          params: { carId: car.id },
        });
        const existingId = (data as any)?.id as string | undefined;
        setBookingId(existingId || null);
      } catch (e: any) {
        if (e?.response?.status === 404) {
          setBookingId(null);
        }
      }
    };

    fetchExistingBooking();
  }, [car?.id, currentUserId]);

  // Load reviews
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

  // Load favorite status for this car
  useEffect(() => {
    if (!car?.id || !currentUserId) return;

    const fetchFavoriteStatus = async () => {
      try {
        const { data } = await api.get<any[]>('/Favorites/list');
        const items = Array.isArray(data) ? data : [];
        setIsFavorite(items.some((item: any) => item.carId === car.id));
      } catch (e) {
        console.error('Failed to load favorite status (car detail page)', e);
      }
    };

    fetchFavoriteStatus();
  }, [car?.id, currentUserId]);

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

      // Reload reviews
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

  const toggleFavorite = async () => {
    if (!car?.id || !currentUserId || isTogglingFavorite) return;

    const isFav = isFavorite;

    try {
      setIsTogglingFavorite(true);
      if (!isFav) {
        await api.post('/Favorites/add', {
          userId: currentUserId,
          carId: car.id,
        });
        setIsFavorite(true);
      } else {
        await api.delete('/Favorites/remove', {
          params: { userId: currentUserId, carId: car.id },
        });
        setIsFavorite(false);
      }
    } catch (err) {
      console.error('Failed to toggle favorite (car detail page)', err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!car || !currentUserId || !startDate || !endDate) return;

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
      setBookingError('Failed to create booking. Please try again.');
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
      setBookingError('Failed to cancel booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading && !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error && !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!car) return null;

  const primaryImage = car.images?.find((img) => img.isPrimary) || { url: car.imageUrl };
  const allImages = car.images && car.images.length > 0 ? car.images : [{ id: 'main', url: car.imageUrl, isPrimary: true, sortOrder: 0 }];
  const otherImages = allImages.filter(img => img.url !== primaryImage.url).slice(0, 2);
  const totalImagesCount = allImages.length;

  // Calculate total price
  const days = startDate && endDate
    ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const totalPrice = days * car.price;
  const discount = days >= 3 ? Math.floor(totalPrice * 0.1) : 0;
  const finalPrice = totalPrice - discount;

  const hostName = host ? `${host.name} ${host.surname}`.trim() || host.username : 'Loading...';
  const hostJoined = host ? new Date(host.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '';

  return (
    <div className="bg-white min-h-screen pb-20 relative">

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[200] bg-black bg-opacity-95 overflow-y-auto">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="fixed top-4 right-4 text-white hover:text-gray-300 z-[210] p-2 bg-black/50 rounded-full"
          >
            <X size={32} />
          </button>
          <div className="max-w-6xl mx-auto p-4 pt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
            {allImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
                <img src={img.url} alt={`${car.name} ${idx}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Hero Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8 relative">
          <div className="h-full bg-gray-100 relative group cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
            <img
              src={primaryImage.url}
              alt={car.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
            {otherImages.length > 0 ? (
              otherImages.map((img, idx) => (
                <div key={idx} className="bg-gray-100 relative overflow-hidden group cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
                  <img src={img.url} alt={`${car.name} ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))
            ) : (
              // Placeholders if no gallery images
              <>
                <div className="bg-gray-100 flex items-center justify-center text-gray-300">
                  <span className="text-sm">No extra images</span>
                </div>
                <div className="bg-gray-100 flex items-center justify-center text-gray-300">
                  <span className="text-sm">No extra images</span>
                </div>
              </>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite();
            }}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={isFavorite ? 'w-5 h-5 fill-red-500 text-red-500' : 'w-5 h-5 text-gray-600'}
            />
          </button>

          {/* View Photos Button */}
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors z-10"
          >
            <Images size={16} />
            View {totalImagesCount} photos
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 relative">

          {/* Left Column: Car Info */}
          <div className="space-y-8">

            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                {car.brand} {car.model} {car.year}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">
                    {reviewSummary?.averageRating.toFixed(1) || '5.0'}
                  </span>
                  <Star size={14} className="fill-brand-600 text-brand-600" />
                  <span>({reviewSummary?.reviewsCount || 49} trips)</span>
                </div>
                {host?.isVerified && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Medal size={14} className="text-brand-600" />
                    <span>All-Star Host</span>
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                <div className="flex flex-col gap-1">
                  <Armchair size={20} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{MOCK_SPECS.seats}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <Fuel size={20} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{MOCK_SPECS.fuelType}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <Gauge size={20} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{MOCK_SPECS.mpg}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <Settings2 size={20} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{MOCK_SPECS.transmission}</span>
                </div>
              </div>
            </div>

            {/* Hosted By */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hosted by</h3>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={host?.imageProfileURL || 'https://i.pravatar.cc/150?u=host'}
                    alt={hostName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{hostName}</h4>
                  <p className="text-sm text-gray-500">Joined {hostJoined}</p>
                </div>
              </div>
              {host?.isVerified && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg inline-block">
                  <Medal size={16} className="text-brand-600" />
                  <span className="font-medium text-gray-900">All-Star Host</span>
                  <span className="text-gray-500">- Top-rated & experienced</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {MOCK_FEATURES.map((category) => (
                  <div key={category.category}>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">{category.category}</h4>
                    <ul className="space-y-2">
                      {category.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check size={16} className="text-brand-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
                <div className="flex items-center gap-1 bg-brand-50 px-2 py-0.5 rounded-md">
                  <Star size={14} className="fill-brand-600 text-brand-600" />
                  <span className="text-sm font-bold text-brand-700">
                    {reviewSummary?.averageRating.toFixed(1) || '5.0'}
                  </span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((r, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{r.reviewerName}</span>
                          <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex text-brand-500 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < Math.round(r.rating) ? "fill-current" : "text-gray-300"} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Review Form */}
              {currentUserId && car.ownerUserId !== currentUserId && (
                <form onSubmit={handleSubmitReview} className="mt-8 bg-gray-50 p-6 rounded-2xl">
                  <h4 className="font-bold text-gray-900 mb-4">Leave a review</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className={`p-1 hover:scale-110 transition-transform ${newRating >= star ? 'text-brand-500' : 'text-gray-300'}`}
                          >
                            <Star size={24} className={newRating >= star ? "fill-current" : ""} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Comment</label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        placeholder="How was your trip?"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview || !newComment.trim()}
                      className="bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-200"
                    >
                      {isSubmittingReview ? 'Posting...' : 'Post Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="relative hidden lg:block">
            <div className="sticky top-24 border border-gray-200 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white">

              {/* Price Header */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-gray-900">${car.price}</span>
                  <span className="text-sm font-medium text-gray-500">/ day</span>
                </div>
                {days > 0 && (
                  <div className="text-sm font-bold text-brand-600 mt-1">
                    ${finalPrice} total <span className="text-gray-400 font-normal">excl. taxes</span>
                  </div>
                )}
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 rounded-xl">
                  <div className="border-b border-gray-200">
                    <DatePicker
                      label="Trip start"
                      value={startDate}
                      onChange={setStartDate}
                      className="px-4 py-2 hover:bg-gray-50 transition-colors"
                      singleMonth
                    />
                  </div>
                  <div>
                    <DatePicker
                      label="Trip end"
                      value={endDate}
                      onChange={setEndDate}
                      minDate={startDate}
                      className="px-4 py-2 hover:bg-gray-50 transition-colors"
                      singleMonth
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1">Pickup & return location</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{car.location}</span>
                    <MapPin size={16} className="text-gray-400 group-hover:text-brand-600 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Savings */}
              {discount > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-gray-600">3+ day discount</span>
                  <span className="text-sm font-bold text-green-600">-${discount}</span>
                </div>
              )}

              {/* Action Button */}
              {bookingError && (
                <p className="text-xs text-red-500 mb-3 font-medium">{bookingError}</p>
              )}

              {!bookingId ? (
                <button
                  onClick={handleCreateBooking}
                  disabled={isBooking || !currentUserId || !startDate || !endDate}
                  className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isBooking ? 'Processing...' : 'Continue'}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Check size={18} />
                    Booking request sent!
                  </div>
                  <button
                    onClick={handleCancelBooking}
                    disabled={isBooking}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 hover:text-red-600 transition-colors"
                  >
                    Cancel booking
                  </button>
                </div>
              )}

              {!currentUserId && (
                <p className="text-xs text-center text-gray-400 mt-3">
                  Please <Link to="/login" className="text-brand-600 font-bold hover:underline">log in</Link> to book this car.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};