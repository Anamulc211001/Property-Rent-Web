import React, { useEffect, useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { Listing } from '../../types';
import { supabase } from '../../lib/supabase';

export const FeaturedListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      setError(null);
      
      // First, let's check if we can connect to Supabase
      const { data: testConnection, error: connectionError } = await supabase
        .from('areas')
        .select('count')
        .limit(1);

      if (connectionError) {
        console.error('Supabase connection error:', connectionError);
        setError('ডাটাবেস সংযোগে সমস্যা হয়েছে');
        setLoading(false);
        return;
      }

      // Now fetch listings with all related data
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          area:areas(id, name, city),
          images:listing_images(id, image_url),
          owner:users(id, name, email)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching listings:', error);
        setError('প্রপার্টি লোড করতে সমস্যা হয়েছে');
        setListings([]);
      } else {
        console.log('Fetched listings:', data);
        setListings(data || []);
        
        if (!data || data.length === 0) {
          setError('কোনো প্রপার্টি পাওয়া যায়নি। নতুন বিজ্ঞাপন দিন।');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('অপ্রত্যাশিত সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            {error}
          </h3>
          <p className="text-yellow-700 text-sm mb-4">
            {error.includes('ডাটাবেস') 
              ? 'অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করুন এবং পেজ রিফ্রেশ করুন।'
              : 'আপনি প্রথম প্রপার্টি বিজ্ঞাপন দিতে পারেন।'
            }
          </p>
          <button
            onClick={fetchFeaturedListings}
            className="btn-primary text-sm"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            এখনো কোনো প্রপার্টি নেই
          </h3>
          <p className="text-blue-700 text-sm mb-4">
            প্রথম প্রপার্টি বিজ্ঞাপন দিন এবং আমাদের প্ল্যাটফর্মে যোগ দিন।
          </p>
          <a href="/post-listing" className="btn-primary text-sm">
            বিজ্ঞাপন দিন
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <PropertyCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};