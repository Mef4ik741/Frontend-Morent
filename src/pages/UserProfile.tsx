import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { api } from '../lib/api/axiosConfig';

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
  balance: number;
  lastAvatarUploadAt: string | null;
  roles: string[];
}

interface ReviewSummary {
  userId: string;
  averageRating: number;
  reviewsCount: number;
}

export const UserProfilePage: React.FC = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<PublicProfile>(`/Account/profile/${userId}`);
        setProfile(data);
      } catch (err) {
        console.error('Failed to load public profile', err);
        setError('Не удалось загрузить профиль пользователя');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // load average rating for this user
  useEffect(() => {
    if (!userId) return;

    const fetchReviewSummary = async () => {
      try {
        const { data } = await api.get<ReviewSummary>(`/Review/average/${userId}`);
        setReviewSummary(data);
      } catch (e) {
        // если отзывов нет или 404, просто не показываем рейтинг
        console.error('Failed to load user review summary', e);
        setReviewSummary(null);
      }
    };

    fetchReviewSummary();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-gray-500">Загрузка профиля...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-red-500 text-sm">{error || 'Профиль не найден'}</p>
      </div>
    );
  }

  const fullName = `${profile.name} ${profile.surname}`.trim();
  const joinedDate = new Date(profile.createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Left: user info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="relative inline-block">
                <img
                  src={profile.imageProfileURL || 'https://picsum.photos/100/100?random=999'}
                  alt={fullName || profile.username}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gray-50"
                />
                {profile.isVerified && (
                  <div className="absolute bottom-2 right-0 bg-brand-600 text-white p-1 rounded-full border-2 border-white">
                    <ShieldCheck size={14} />
                  </div>
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900">{fullName || profile.username}</h1>
              <p className="text-sm text-gray-500 mb-1">{profile.email}</p>
              {/* скрываем служебные поля: balance, roles, lastAvatarUploadAt, isConfirmed */}
              <p className="text-sm text-gray-500 mb-1">Joined {joinedDate}</p>

              <div className="flex justify-center gap-4 text-sm text-gray-600 mb-2">
                <div className="text-center">
                  <span className="block font-bold text-gray-900">{profile.reviewCount}</span>
                  <span>Reviews</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-gray-900">{profile.negativeReviewCount}</span>
                  <span>Negative</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Verified Info</h3>
              <div className="space-y-3 text-sm">
                {profile.isVerified && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <ShieldCheck size={18} className="text-green-500" />
                    <span>Identity Verified</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-green-500" />
                  <span>Email Address</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-green-500" />
                  <span>Phone Number</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: public rating and info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center min-h-[200px]">
              {reviewSummary && reviewSummary.reviewsCount > 0 ? (
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-5xl font-extrabold text-gray-900 leading-none">
                      {reviewSummary.averageRating.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">из 5</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i <= Math.round(reviewSummary.averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        }
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <Star size={48} className="text-gray-200 mb-4" />
                  <h3 className="font-bold text-gray-900 text-lg">No public reviews yet</h3>
                  <p className="text-gray-500 max-w-xs">
                    Reviews and activity of this user will appear here in future.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-4">About this user</h3>
              <p className="text-sm text-gray-600">This host is using Morent platform. More detailed public info can be added here later.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
