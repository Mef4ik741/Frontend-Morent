import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, User, Heart, LogOut, MapPin, Car, Menu } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';
import { api } from '../../lib/api/axiosConfig';

interface NavbarUserProfile {
  name: string;
  surname: string;
  username: string;
  email: string;
  isVerified?: boolean;
}

interface OwnerBookingRequest {
  id: string; // bookingId
  carId: string;
  carName: string;
  carBrand: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  agreement: boolean;
  statusActive: boolean;
  locations: string[];
}

export const Navbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<'user' | 'notifications' | 'settings' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Temporary state to simulate authentication (localStorage for persistence across refreshes)
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userProfile, setUserProfile] = useState<NavbarUserProfile | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [ownerRequests, setOwnerRequests] = useState<OwnerBookingRequest[]>([]);
  const [ownerRequestsLoading, setOwnerRequestsLoading] = useState(false);
  const [ownerRequestsError, setOwnerRequestsError] = useState<string | null>(null);
  const [processingBookingIds, setProcessingBookingIds] = useState<string[]>([]);

  useEffect(() => {
    // Listen for storage changes to update UI if login state changes
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load user profile when logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setUserProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/Account/profile');
        const profile: any = data || {};
        setUserProfile({
          name: profile.name,
          surname: profile.surname,
          username: profile.username,
          email: profile.email,
          isVerified: (profile.userVerified ?? profile.isVerified) as boolean | undefined,
        });
      } catch (error) {
        console.error('Failed to load navbar profile', error);
      }
    };

    fetchProfile();
  }, [isLoggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll detection for search bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowSearch(true);
      } else {
        setShowSearch(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name: 'user' | 'notifications' | 'settings') => {
    const next = activeDropdown === name ? null : name;
    setActiveDropdown(next);

    if (next === 'notifications' && isLoggedIn) {
      const fetchOwnerRequests = async () => {
        try {
          setOwnerRequestsLoading(true);
          setOwnerRequestsError(null);
          const { data } = await api.get<OwnerBookingRequest[]>('/Booking/owner/requests');
          setOwnerRequests(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error('Failed to load owner booking requests', e);
          setOwnerRequestsError('Failed to load booking requests');
        } finally {
          setOwnerRequestsLoading(false);
        }
      };

      fetchOwnerRequests();
    }
  };

  const handleOwnerDecision = async (bookingId: string, isApproved: boolean) => {
    try {
      setProcessingBookingIds((prev) => [...prev, bookingId]);

      const message = window.prompt('Message to renter (optional)', '') || undefined;

      const payload = {
        isApproved,
        message,
      };

      await api.post(`/Booking/${bookingId}/owner-decision`, payload);

      setOwnerRequests((prev) => prev.filter((r) => r.id !== bookingId));
    } catch (e) {
      console.error('Failed to submit owner decision', e);
      window.alert('Failed to submit decision, please try again.');
    } finally {
      setProcessingBookingIds((prev) => prev.filter((id) => id !== bookingId));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setActiveDropdown(null);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200" ref={dropdownRef}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-extrabold text-brand-600 tracking-tighter">
              morent
            </Link>
          </div>

          {/* Scroll-Triggered Search Bar */}
          <div className={`flex-1 flex justify-center transition-all duration-300 ${showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <SearchBar compact className="shadow-sm border-gray-200 w-full max-w-4xl" />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* Notifications */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => toggleDropdown('notifications')}
                className="p-2 rounded-full hover:bg-gray-100 border border-gray-200 text-gray-600 relative"
              >
                <Bell size={18} />
              </button>

              {activeDropdown === 'notifications' && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-3 px-4 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900">Booking requests</p>
                  </div>

                  {!isLoggedIn ? (
                    <p className="text-xs text-gray-500">Log in to see booking requests.</p>
                  ) : (
                    <div className="space-y-2">
                      {ownerRequestsLoading && (
                        <p className="text-xs text-gray-500">Loading booking requests...</p>
                      )}
                      {ownerRequestsError && !ownerRequestsLoading && (
                        <p className="text-xs text-red-500">{ownerRequestsError}</p>
                      )}
                      {!ownerRequestsLoading && !ownerRequestsError && ownerRequests.length === 0 && (
                        <p className="text-xs text-gray-500">You have no pending booking requests.</p>
                      )}

                      <div className="mt-1 max-h-80 overflow-y-auto space-y-2 pr-1">
                        {ownerRequests.map((req) => {
                          const dates = `${new Date(req.startDate).toLocaleDateString()} - ${new Date(
                            req.endDate,
                          ).toLocaleDateString()}`;
                          const isProcessing = processingBookingIds.includes(req.id);

                          return (
                            <div
                              key={req.id}
                              className="border border-gray-100 rounded-lg p-2.5 bg-gray-50/60 flex flex-col gap-1"
                            >
                              <p className="text-xs font-semibold text-gray-900 truncate">
                                {req.carBrand} {req.carName}
                              </p>
                              <p className="text-[11px] text-gray-500 truncate">{dates}</p>
                              <p className="text-[11px] text-gray-500 truncate">Total: ${req.totalPrice}</p>
                              <div className="flex gap-1.5 pt-1.5">
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleOwnerDecision(req.id, true)}
                                  className="flex-1 text-center text-[11px] font-semibold bg-emerald-600 text-white rounded-md py-1 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  {isProcessing ? '...' : 'Approve'}
                                </button>
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleOwnerDecision(req.id, false)}
                                  className="flex-1 text-center text-[11px] font-semibold border border-red-200 text-red-600 rounded-md py-1 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  {isProcessing ? '...' : 'Decline'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Turo-style User Menu */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('user')}
                className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-1.5 hover:shadow-md transition-all bg-white"
              >
                <Menu size={18} className="text-gray-600 ml-1" />
                {isLoggedIn ? (
                  <img
                    src="https://picsum.photos/100/100?random=999"
                    alt="User"
                    className="h-8 w-8 rounded-full object-cover border border-gray-100"
                  />
                ) : (
                  <div className="bg-gray-500/10 p-1 rounded-full text-gray-500">
                    <User size={24} className="fill-gray-500 text-gray-500" />
                  </div>
                )}
              </button>

              {activeDropdown === 'user' && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-50 mb-2">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {userProfile
                            ? `${userProfile.name} ${userProfile.surname}`.trim() || userProfile.username
                            : 'Account'}
                        </p>
                        {userProfile && (
                          <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                        )}
                      </div>

                      <Link to="/favorites" onClick={() => setActiveDropdown(null)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                        Favorites
                      </Link>
                      <Link to="/my-listed" onClick={() => setActiveDropdown(null)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                        My listed
                      </Link>

                      <div className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium cursor-pointer">
                        Trips
                      </div>
                      <div className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium cursor-pointer">
                        Inbox
                      </div>
                      <div className="h-px bg-gray-100 my-2" />
                      <Link to="/profile" onClick={() => setActiveDropdown(null)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                        Profile
                      </Link>
                      <div className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium cursor-pointer">
                        Account
                      </div>
                      {userProfile?.isVerified && (
                        <Link
                          to="/host/add-car"
                          onClick={() => setActiveDropdown(null)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          Add car
                        </Link>
                      )}
                      <div className="h-px bg-gray-100 my-2" />
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium">
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setActiveDropdown(null)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                        Log in
                      </Link>
                      <Link to="/register" onClick={() => setActiveDropdown(null)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                        Sign up
                      </Link>
                      <Link to="/become-host" onClick={() => setActiveDropdown(null)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                        Become a host
                      </Link>
                      <div className="h-px bg-gray-100 my-2" />
                      <div className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium cursor-pointer">
                        How Morent works
                      </div>
                      <div className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium cursor-pointer">
                        Contact support
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};