import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, MapPin, Home, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { chittagongAreas, propertyCategories, furnishingTypes, commonFacilities } from '../data/areas';

interface ListingFormData {
  title: string;
  description: string;
  rent: number;
  advance: number;
  category: string;
  rooms: number;
  bathrooms: number;
  furnishing: string;
  facilities: string[];
  area_id: string;
  address: string;
  size: number;
  available_from: string;
  notes: string;
}

export const PostListingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<Array<{ id: string; name: string }>>([]);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    rent: 0,
    advance: 0,
    category: '',
    rooms: 1,
    bathrooms: 1,
    furnishing: '',
    facilities: [],
    area_id: '',
    address: '',
    size: 0,
    available_from: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAreas();
  }, [user, navigate]);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 10)); // Max 10 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (listingId: string) => {
    const uploadPromises = images.map(async (image, index) => {
      const fileExt = image.name.split('.').pop();
      const fileName = `${listingId}/${index}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, image);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      return supabase
        .from('listing_images')
        .insert([{
          listing_id: listingId,
          image_url: publicUrl
        }]);
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create listing
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert([{
          ...formData,
          owner_id: user.id,
          facilities: formData.facilities
        }])
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload images if any
      if (images.length > 0) {
        await uploadImages(listing.id);
      }

      alert('আপনার বিজ্ঞাপন সফলভাবে পোস্ট হয়েছে!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('বিজ্ঞাপন পোস্ট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              নতুন বিজ্ঞাপন দিন
            </h1>
            <p className="text-gray-600">
              আপনার প্রপার্টির সম্পূর্ণ তথ্য দিয়ে একটি আকর্ষণীয় বিজ্ঞাপন তৈরি করুন
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>মূল তথ্য</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিজ্ঞাপনের শিরোনাম *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="যেমন: খুলশীতে সুন্দর ২ রুমের ফ্ল্যাট"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    প্রপার্টির ধরন *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {propertyCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    এলাকা *
                  </label>
                  <select
                    name="area_id"
                    value={formData.area_id}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    সম্পূর্ণ ঠিকানা *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="বিস্তারিত ঠিকানা লিখুন"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিবরণ *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="input-field"
                    placeholder="প্রপার্টির বিস্তারিত বিবরণ লিখুন..."
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>প্রপার্টির বিবরণ</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    রুম সংখ্যা *
                  </label>
                  <input
                    type="number"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বাথরুম সংখ্যা *
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    আয়তন (বর্গফুট) *
                  </label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ফার্নিশিং *
                  </label>
                  <select
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {furnishingTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    উপলব্ধ থেকে *
                  </label>
                  <input
                    type="date"
                    name="available_from"
                    value={formData.available_from}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  সুবিধাসমূহ
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonFacilities.map(facility => (
                    <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(facility)}
                        onChange={() => handleFacilityToggle(facility)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>মূল্য নির্ধারণ</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    মাসিক ভাড়া (টাকা) *
                  </label>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="input-field"
                    placeholder="যেমন: ১৫০০০"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    অগ্রিম (টাকা) *
                  </label>
                  <input
                    type="number"
                    name="advance"
                    value={formData.advance}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="input-field"
                    placeholder="যেমন: ৩০০০০"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>ছবি আপলোড করুন</span>
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    ছবি আপলোড করুন
                  </div>
                  <div className="text-gray-600 mb-4">
                    সর্বোচ্চ ১০টি ছবি আপলোড করতে পারবেন
                  </div>
                  <label className="btn-primary cursor-pointer">
                    ছবি নির্বাচন করুন
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  অতিরিক্ত তথ্য (ঐচ্ছিক)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="কোনো বিশেষ শর্ত বা তথ্য থাকলে লিখুন..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'পোস্ট করা হচ্ছে...' : 'বিজ্ঞাপন পোস্ট করুন'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};