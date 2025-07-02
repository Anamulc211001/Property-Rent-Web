import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Plus, Heart, Calendar, DollarSign, Eye, Edit, Trash2,
  CheckCircle, Clock, XCircle, Users, BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Listing, Booking } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings' | 'favorites'>('overview');
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalBookings: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user's listings if they're an owner
      if (user.role === 'owner' || user.role === 'admin') {
        const { data: listingsData } = await supabase
          .from('listings')
          .select(`
            *,
            area:areas(id, name, city),
            images:listing_images(id, image_url)
          `)
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        setListings(listingsData || []);

        // Fetch bookings for user's listings
        const listingIds = listingsData?.map(l => l.id) || [];
        if (listingIds.length > 0) {
          const { data: bookingsData } = await supabase
            .from('bookings')
            .select(`
              *,
              listing:listings(id, title, area:areas(name)),
              renter:users(id, name, email)
            `)
            .in('listing_id', listingIds)
            .order('created_at', { ascending: false });

          setBookings(bookingsData || []);
        }

        // Calculate stats
        const activeListings = listingsData?.filter(l => l.status === 'active').length || 0;
        const pendingBookings = bookingsData?.filter(b => b.booking_status === 'pending').length || 0;

        setStats({
          totalListings: listingsData?.length || 0,
          activeListings,
          totalBookings: bookingsData?.length || 0,
          pendingBookings
        });
      } else {
        // Fetch user's bookings if they're a renter
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select(`
            *,
            listing:listings(
              id, title, rent, advance,
              area:areas(name),
              images:listing_images(id, image_url)
            )
          `)
          .eq('renter_id', user.id)
          .order('created_at', { ascending: false });

        setBookings(bookingsData || []);
      }

      // Fetch favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select(`
          listing:listings(
            *,
            area:areas(id, name, city),
            images:listing_images(id, image_url)
          )
        `)
        .eq('user_id', user.id);

      setFavorites(favoritesData?.map(f => f.listing).filter(Boolean) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই বিজ্ঞাপনটি মুছে দিতে চান?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      setListings(prev => prev.filter(l => l.id !== listingId));
      alert('বিজ্ঞাপন সফলভাবে মুছে দেওয়া হয়েছে।');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('বিজ্ঞাপন মুছতে সমস্যা হয়েছে।');
    }
  };

  const handleBookingStatusUpdate = async (bookingId: string, status: 'confirmed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: status })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, booking_status: status } : b
      ));

      alert(`বুকিং ${status === 'confirmed' ? 'নিশ্চিত' : 'বাতিল'} করা হয়েছে।`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('বুকিং স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD').format(price);
  };

  const getStatusBadge = (status: string, type: 'listing' | 'booking') => {
    const styles = {
      listing: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        rented: 'bg-blue-100 text-blue-800'
      },
      booking: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800'
      }
    };

    const labels = {
      listing: {
        active: 'সক্রিয়',
        inactive: 'নিষ্ক্রিয়',
        rented: 'ভাড়া হয়েছে'
      },
      booking: {
        pending: 'অপেক্ষমান',
        confirmed: 'নিশ্চিত',
        rejected: 'বাতিল',
        cancelled: 'বাতিল'
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type][status as keyof typeof styles[typeof type]]}`}>
        {labels[type][status as keyof typeof labels[typeof type]]}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">অ্যাক্সেস নিষেধ</h2>
          <p className="text-gray-600 mb-4">ড্যাশবোর্ড দেখতে লগ ইন করুন।</p>
          <Link to="/login" className="btn-primary">লগ ইন করুন</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            স্বাগতম, {user.name}
          </h1>
          <p className="text-gray-600">
            আপনার {user.role === 'owner' ? 'প্রপার্টি ও বুকিং' : 'বুকিং ও পছন্দের তালিকা'} পরিচালনা করুন
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                ওভারভিউ
              </button>
              
              {(user.role === 'owner' || user.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'listings'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Home className="h-4 w-4 inline mr-2" />
                  আমার বিজ্ঞাপন
                </button>
              )}

              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                বুকিং
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Heart className="h-4 w-4 inline mr-2" />
                পছন্দের তালিকা
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {(user.role === 'owner' || user.role === 'admin') && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-primary-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <Home className="h-8 w-8 text-primary-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-primary-600">মোট বিজ্ঞাপন</p>
                          <p className="text-2xl font-bold text-primary-900">{stats.totalListings}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-600">সক্রিয় বিজ্ঞাপন</p>
                          <p className="text-2xl font-bold text-green-900">{stats.activeListings}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600">মোট বুকিং</p>
                          <p className="text-2xl font-bold text-blue-900">{stats.totalBookings}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-yellow-600">অপেক্ষমান বুকিং</p>
                          <p className="text-2xl font-bold text-yellow-900">{stats.pendingBookings}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">দ্রুত অ্যাকশন</h3>
                  <div className="flex flex-wrap gap-4">
                    {(user.role === 'owner' || user.role === 'admin') && (
                      <Link to="/post-listing" className="btn-primary flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>নতুন বিজ্ঞাপন দিন</span>
                      </Link>
                    )}
                    <Link to="/browse" className="btn-secondary flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>প্রপার্টি খুঁজুন</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (user.role === 'owner' || user.role === 'admin') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">আমার বিজ্ঞাপন</h3>
                  <Link to="/post-listing" className="btn-primary flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>নতুন বিজ্ঞাপন</span>
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700 mx-auto"></div>
                  </div>
                ) : listings.length > 0 ? (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing.id} className="bg-white border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{listing.title}</h4>
                              {getStatusBadge(listing.status, 'listing')}
                            </div>
                            <p className="text-gray-600 mb-2">{listing.area?.name}, চট্টগ্রাম</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>৳{formatPrice(listing.rent)}/মাস</span>
                              <span>{listing.rooms} রুম</span>
                              <span>{listing.size} বর্গফুট</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/listing/${listing.id}`}
                              className="p-2 text-gray-500 hover:text-primary-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="p-2 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো বিজ্ঞাপন নেই</h3>
                    <p className="text-gray-600 mb-4">আপনার প্রথম প্রপার্টি বিজ্ঞাপন দিন।</p>
                    <Link to="/post-listing" className="btn-primary">
                      বিজ্ঞাপন দিন
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.role === 'owner' ? 'আমার প্রপার্টির বুকিং' : 'আমার বুকিং'}
                </h3>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700 mx-auto"></div>
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {booking.listing?.title}
                              </h4>
                              {getStatusBadge(booking.booking_status, 'booking')}
                            </div>
                            <p className="text-gray-600 mb-2">
                              {booking.listing?.area?.name}, চট্টগ্রাম
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <span>অগ্রিম: ৳{formatPrice(booking.advance_paid)}</span>
                              <span>ফোন: {booking.contact_phone}</span>
                              <span>তারিখ: {new Date(booking.created_at).toLocaleDateString('bn-BD')}</span>
                            </div>
                            {user.role === 'owner' && booking.renter && (
                              <p className="text-sm text-gray-600">
                                ভাড়াটিয়া: {booking.renter.name} ({booking.renter.email})
                              </p>
                            )}
                          </div>
                          {user.role === 'owner' && booking.booking_status === 'pending' && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                                className="btn-primary text-sm"
                              >
                                নিশ্চিত করুন
                              </button>
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'rejected')}
                                className="btn-secondary text-sm"
                              >
                                বাতিল করুন
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো বুকিং নেই</h3>
                    <p className="text-gray-600">
                      {user.role === 'owner' 
                        ? 'এখনো কোনো বুকিং আসেনি।' 
                        : 'আপনি এখনো কোনো প্রপার্টি বুক করেননি।'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">পছন্দের প্রপার্টি</h3>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700 mx-auto"></div>
                  </div>
                ) : favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((listing) => (
                      <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-200">
                          {listing.images && listing.images.length > 0 ? (
                            <img
                              src={listing.images[0].image_url}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{listing.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{listing.area?.name}, চট্টগ্রাম</p>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-primary-700">
                              ৳{formatPrice(listing.rent)}
                            </div>
                            <Link
                              to={`/listing/${listing.id}`}
                              className="btn-primary text-sm"
                            >
                              দেখুন
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো পছন্দের প্রপার্টি নেই</h3>
                    <p className="text-gray-600 mb-4">আপনার পছন্দের প্রপার্টি সেভ করুন।</p>
                    <Link to="/browse" className="btn-primary">
                      প্রপার্টি খুঁজুন
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};