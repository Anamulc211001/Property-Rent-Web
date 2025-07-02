import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, MapPin, SlidersHorizontal } from 'lucide-react';
import { SearchBar } from '../components/common/SearchBar';
import { PropertyCard } from '../components/listings/PropertyCard';
import { Listing, SearchFilters } from '../types';
import { supabase } from '../lib/supabase';

export const BrowsePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    minRent: searchParams.get('minRent') ? parseInt(searchParams.get('minRent')!) : undefined,
    maxRent: searchParams.get('maxRent') ? parseInt(searchParams.get('maxRent')!) : undefined,
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          area:areas(id, name, city),
          images:listing_images(id, image_url),
          owner:users(id, name, email)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.location) {
        const { data: areas } = await supabase
          .from('areas')
          .select('id')
          .eq('name', filters.location);
        
        if (areas && areas.length > 0) {
          query = query.eq('area_id', areas[0].id);
        }
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.minRent) {
        query = query.gte('rent', filters.minRent);
      }

      if (filters.maxRent) {
        query = query.lte('rent', filters.maxRent);
      }

      if (filters.rooms) {
        query = query.eq('rooms', filters.rooms);
      }

      if (filters.furnishing) {
        query = query.eq('furnishing', filters.furnishing);
      }

      const { data, error } = await query;

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string, location: string, category: string) => {
    setFilters(prev => ({
      ...prev,
      location,
      category
    }));
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar onSearch={handleSearch} showFilters={true} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">ফিল্টার</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    মাসিক ভাড়া (টাকা)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="সর্বনিম্ন"
                      value={filters.minRent || ''}
                      onChange={(e) => handleFilterChange({ minRent: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="input-field text-sm"
                    />
                    <input
                      type="number"
                      placeholder="সর্বোচ্চ"
                      value={filters.maxRent || ''}
                      onChange={(e) => handleFilterChange({ maxRent: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    রুম সংখ্যা
                  </label>
                  <select
                    value={filters.rooms || ''}
                    onChange={(e) => handleFilterChange({ rooms: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="input-field"
                  >
                    <option value="">যে কোনো</option>
                    <option value="1">১ রুম</option>
                    <option value="2">২ রুম</option>
                    <option value="3">৩ রুম</option>
                    <option value="4">৪+ রুম</option>
                  </select>
                </div>

                {/* Furnishing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ফার্নিশিং
                  </label>
                  <select
                    value={filters.furnishing || ''}
                    onChange={(e) => handleFilterChange({ furnishing: e.target.value || undefined })}
                    className="input-field"
                  >
                    <option value="">যে কোনো</option>
                    <option value="furnished">ফার্নিশড</option>
                    <option value="semi_furnished">সেমি-ফার্নিশড</option>
                    <option value="unfurnished">আনফার্নিশড</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => setFilters({})}
                  className="w-full btn-secondary"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {loading ? 'খুঁজছি...' : `${listings.length}টি প্রপার্টি পাওয়া গেছে`}
                </h2>
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden btn-secondary flex items-center space-x-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>ফিল্টার</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {listings.map((listing) => (
                  <PropertyCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  কোনো প্রপার্টি পাওয়া যায়নি
                </h3>
                <p className="text-gray-600 mb-4">
                  আপনার খোঁজের মাপদণ্ড অনুযায়ী কোনো প্রপার্টি খুঁজে পাওয়া যায়নি।
                </p>
                <button
                  onClick={() => setFilters({})}
                  className="btn-primary"
                >
                  সব ফিল্টার রিসেট করুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};