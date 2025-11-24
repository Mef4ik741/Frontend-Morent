import React, { useEffect, useRef, useState } from 'react';

import { Star, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { api } from '../lib/api/axiosConfig';

interface Profile {
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

interface ReviewSummaryProfile {
  userId: string;
  averageRating: number;
  reviewsCount: number;
}

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummaryProfile | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [usernameUpdating, setUsernameUpdating] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);
  const [emailConfirming, setEmailConfirming] = useState(false);
  const [emailConfirmError, setEmailConfirmError] = useState<string | null>(null);
  const [emailConfirmSuccess, setEmailConfirmSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get<Profile>('/Account/profile');
        setProfile(data);
        setNewUsername(data.username || '');

      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить профиль');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const trimmed = newUsername.trim();
    if (!trimmed) {
      setUsernameError('Username cannot be empty');
      return;
    }

    try {
      setUsernameUpdating(true);
      setUsernameError(null);
      setUsernameSuccess(null);

      await api.put('/Account/username', {
        userId: profile.id,
        username: trimmed,
      });

      const { data } = await api.get<Profile>('/Account/profile');
      setProfile(data);
      setNewUsername(data.username || trimmed);
      setUsernameSuccess('Username has been updated.');
    } catch (err) {
      console.error('Failed to update username', err);
      setUsernameError('Failed to update username. Please try another name.');
    } finally {
      setUsernameUpdating(false);
    }
  };

  const handleConfirmEmail = async () => {
    try {
      setEmailConfirming(true);
      setEmailConfirmError(null);
      setEmailConfirmSuccess(null);

      await api.post('/Account/Email/Confirm', {});

      const { data } = await api.get<Profile>('/Account/profile');
      setProfile(data);
      setEmailConfirmSuccess('Email has been confirmed.');
    } catch (err) {
      console.error('Failed to confirm email', err);
      setEmailConfirmError('Failed to confirm email. Please try again later.');
    } finally {
      setEmailConfirming(false);
    }
  };

  useEffect(() => {
    if (!profile?.id) return;

    const fetchReviewSummary = async () => {
      try {
        const { data } = await api.get<ReviewSummaryProfile>(`/Review/average/${profile.id}`);
        setReviewSummary(data);
      } catch (e) {
        // если отзывов нет или 404, просто не показываем рейтинг
        console.error('Failed to load profile review summary', e);
        setReviewSummary(null);
      }
    };

    fetchReviewSummary();
  }, [profile?.id]);

  const uploadAvatar = async (file: File) => {
    if (!profile) return;

    try {
      setAvatarUploading(true);
      setAvatarError(null);
      setAvatarSuccess(null);

      const formData = new FormData();
      formData.append('UserId', profile.id);
      formData.append('File', file);

      await api.post('/Account/UploadAvatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { data } = await api.get<Profile>('/Account/profile');
      setProfile(data);
      setAvatarSuccess('Avatar has been updated.');
      window.dispatchEvent(new Event('profile-updated'));
      setAvatarFile(null);
    } catch (err) {
      console.error('Failed to upload avatar', err);
      setAvatarError('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

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
        <p className="text-red-500">{error || 'Профиль не найден'}</p>
      </div>
    );
  }

  const fullName = `${profile.name} ${profile.surname}`.trim();
  const joinedDate = new Date(profile.createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar / User Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="relative inline-block">
                <img
                  src={profile.imageProfileURL || 'https://picsum.photos/100/100?random=999'}
                  alt={fullName || profile.username}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gray-50"
                />
                <div className="absolute bottom-2 right-0 bg-brand-600 text-white p-1 rounded-full border-2 border-white">
                  <ShieldCheck size={14} />
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{fullName || profile.username}</h1>
              <p className="text-sm text-gray-500 mb-1">{profile.email}</p>
              <form onSubmit={handleUpdateUsername} className="mt-2 space-y-1">
                <label className="block text-xs font-semibold text-gray-600 text-left">Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                    setUsernameError(null);
                    setUsernameSuccess(null);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                {usernameError && <p className="text-xs text-red-500">{usernameError}</p>}
                {usernameSuccess && <p className="text-xs text-green-600">{usernameSuccess}</p>}
                <button
                  type="submit"
                  disabled={usernameUpdating}
                  className="mt-1 w-full border border-gray-300 text-gray-700 font-semibold py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {usernameUpdating ? 'Saving...' : 'Save username'}
                </button>
              </form>
              <p className="text-sm text-gray-500 mb-4">Joined {joinedDate}</p>

              <div className="flex justify-center gap-4 text-sm text-gray-600 mb-6">
                <div className="text-center">
                  <span className="block font-bold text-gray-900">{profile.reviewCount}</span>
                  <span>Reviews</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-gray-900">{profile.negativeReviewCount}</span>
                  <span>Negative</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0] || null;
                    if (!file) return;
                    setAvatarFile(file);
                    setAvatarError(null);
                    setAvatarSuccess(null);
                    await uploadAvatar(file);
                    // сбрасываем значение input, чтобы повторный выбор того же файла тоже срабатывал
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="hidden"
                />
                {avatarError && <p className="text-xs text-red-500">{avatarError}</p>}
                {avatarSuccess && <p className="text-xs text-green-600">{avatarSuccess}</p>}
                <button
                  type="button"
                  disabled={avatarUploading}
                  className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => {
                    setAvatarError(null);
                    setAvatarSuccess(null);
                    fileInputRef.current?.click();
                  }}
                >
                  {avatarUploading ? 'Uploading...' : 'Upload avatar'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Verified Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span>Identity Verified</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className={profile.isConfirmed ? 'text-green-500' : 'text-yellow-500'} />
                  <span>
                    Email Address
                    {!profile.isConfirmed && ' (not confirmed)'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-green-500" />
                  <span>Phone Number</span>
                </div>
                {!profile.isConfirmed && (
                  <div className="pt-2 space-y-1">
                    {emailConfirmError && (
                      <p className="text-xs text-red-500">{emailConfirmError}</p>
                    )}
                    {emailConfirmSuccess && (
                      <p className="text-xs text-green-600">{emailConfirmSuccess}</p>
                    )}
                    <button
                      type="button"
                      disabled={emailConfirming}
                      onClick={handleConfirmEmail}
                      className="w-full border border-brand-500 text-brand-600 font-semibold py-1.5 rounded-lg hover:bg-brand-50 transition-colors text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {emailConfirming ? 'Confirming...' : 'Confirm email'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[240px]">
              {reviewSummary && reviewSummary.reviewsCount > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={32} className="fill-brand-500 text-brand-500" />
                    <span className="text-3xl font-extrabold text-gray-900">
                      {reviewSummary.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => {
                      const filled = i <= Math.round(reviewSummary.averageRating);
                      return (
                        <Star
                          key={i}
                          size={20}
                          className={filled ? 'fill-brand-500 text-brand-500' : 'text-gray-200'}
                        />
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on <span className="font-semibold">{reviewSummary.reviewsCount}</span> review{reviewSummary.reviewsCount !== 1 ? 's' : ''}.
                  </p>
                </>
              ) : (
                <>
                  <Star size={48} className="text-gray-200 mb-4" />
                  <h3 className="font-bold text-gray-900 text-lg">No reviews yet</h3>
                  <p className="text-gray-500 max-w-xs">Reviews from hosts will appear here after you complete your trips.</p>
                </>
              )}
            </div>

            {/* Recent Activity (Placeholder) */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-6">Recent Activity</h3>
              <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                <div className="bg-brand-100 p-3 rounded-full text-brand-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Account created</p>
                  <p className="text-sm text-gray-500">You joined Morent on December 15, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};