import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Home, Users, Car, Wifi, Shield, Phone, Mail, 
  Calendar, Ruler, Heart, Share2, ChevronLeft, ChevronRight,
  CheckCircle, Clock, BedDouble, Bath
} from 'lucide-react';
import { Listing } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export const ListingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListing();
      if (user) {
        checkFavoriteStatus();
      }
    }
  }, [id, user]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          area:areas(id, name, city),
          images:listing_images(id, image_url),
          owner:users(id, name, email, phone)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', id)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
    }
  };

  const toggleFavorite = async () => {
    if (!user || !listing) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listing.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert([{ user_id: user.id, listing_id: listing.id }]);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD').format(price);
  };

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      room: 'রুম',
      flat: 'ফ্ল্যাট',
      family_house: 'পারিবারিক বাসা',
      office: 'অফিস',
      hostel: 'হোস্টেল'
    };
    return categories[category] || category;
  };

  const getFurnishingLabel = (furnishing: string) => {
    const types: { [key: string]: string } = {
      furnished: 'ফার্নিশড',
      semi_furnished: 'সেমি-ফার্নিশড',
      unfurnished: 'আনফার্নিশড'
    };
    return types[furnishing] || furnishing;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">প্রপার্টি পাওয়া যায়নি</h2>
          <Link to="/browse" className="btn-primary">
            ব্রাউজ পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/browse"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>ব্রাউজ পেজে ফিরে যান</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-96">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <img
                      src={listing.images[currentImageIndex]?.image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    {listing.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === 0 ? listing.images.length - 1 : prev - 1
                          )}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === listing.images.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {listing.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Home className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.area?.name}, চট্টগ্রাম</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full ${
                      isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    } hover:bg-opacity-80`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Property Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <BedDouble className="h-6 w-6 text-primary-700 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">রুম</div>
                  <div className="font-semibold">{listing.rooms}টি</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 text-primary-700 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">বাথরুম</div>
                  <div className="font-semibold">{listing.bathrooms}টি</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Ruler className="h-6 w-6 text-primary-700 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">আয়তন</div>
                  <div className="font-semibold">{listing.size} বর্গফুট</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Home className="h-6 w-6 text-primary-700 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">ধরন</div>
                  <div className="font-semibold">{getCategoryLabel(listing.category)}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">বিবরণ</h3>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">সুবিধাসমূহ</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">উপলব্ধ থেকে</span>
                  </div>
                  <div className="font-medium">
                    {new Date(listing.available_from).toLocaleDateString('bn-BD')}
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">ফার্নিশিং</span>
                  </div>
                  <div className="font-medium">{getFurnishingLabel(listing.furnishing)}</div>
                </div>
              </div>

              {listing.notes && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">গুরুত্বপূর্ণ তথ্য</h4>
                  <p className="text-yellow-700">{listing.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Booking */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-700 mb-1">
                  ৳{formatPrice(listing.rent)}
                </div>
                <div className="text-gray-600">মাসিক ভাড়া</div>
                <div className="text-lg font-semibold text-gray-800 mt-2">
                  অগ্রিম: ৳{formatPrice(listing.advance)}
                </div>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full btn-primary py-3 text-lg mb-4"
              >
                এখনই বুক করুন
              </button>

              <div className="text-center text-sm text-gray-500">
                <Clock className="h-4 w-4 inline mr-1" />
                সাধারণত ২৪ ঘন্টার মধ্যে উত্তর পাবেন
              </div>
            </div>

            {/* Owner Contact */}
            {listing.owner && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">যোগাযোগ</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">{listing.owner.name}</span>
                  </div>
                  {listing.owner.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <a
                        href={`tel:${listing.owner.phone}`}
                        className="text-primary-600 hover:text-primary-500"
                      >
                        {listing.owner.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <a
                      href={`mailto:${listing.owner.email}`}
                      className="text-primary-600 hover:text-primary-500"
                    >
                      {listing.owner.email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">অবস্থান</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{listing.area?.name}</div>
                    <div className="text-gray-600">{listing.address}</div>
                    <div className="text-gray-600">চট্টগ্রাম, বাংলাদেশ</div>
                  </div>
                </div>
              </div>
              
              {/* Map placeholder */}
              <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <div>ম্যাপ শীঘ্রই আসছে</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          listing={listing}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

// Booking Modal Component
const BookingModal: React.FC<{ listing: Listing; onClose: () => void }> = ({ listing, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          listing_id: listing.id,
          renter_id: user.id,
          advance_paid: listing.advance,
          contact_phone: formData.phone,
          notes: formData.notes
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // For demo purposes, we'll simulate payment success
      // In production, integrate with actual payment gateway
      await supabase
        .from('payments')
        .insert([{
          booking_id: booking.id,
          amount: listing.advance,
          method: 'demo',
          payment_status: 'completed',
          transaction_id: `demo_${Date.now()}`
        }]);

      alert('বুকিং সফল হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      alert('বুকিং করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">বুকিং নিশ্চিত করুন</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">{listing.title}</h4>
          <div className="text-sm text-gray-600 mb-2">{listing.area?.name}, চট্টগ্রাম</div>
          <div className="text-lg font-bold text-primary-700">
            অগ্রিম পেমেন্ট: ৳{new Intl.NumberFormat('bn-BD').format(listing.advance)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              নাম
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ফোন নম্বর
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ইমেইল
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              অতিরিক্ত তথ্য (ঐচ্ছিক)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="input-field"
              placeholder="কোনো বিশেষ প্রয়োজন বা প্রশ্ন থাকলে লিখুন..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'প্রক্রিয়াকরণ...' : 'বুক করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};