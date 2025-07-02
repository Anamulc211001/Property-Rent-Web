import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Users, Shield, Star } from 'lucide-react';
import { SearchBar } from '../components/common/SearchBar';
import { FeaturedListings } from '../components/listings/FeaturedListings';

export const HomePage: React.FC = () => {
  const handleSearch = (query: string, location: string, category: string) => {
    // Navigate to browse page with search params
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    
    window.location.href = `/browse?${params.toString()}`;
  };

  const stats = [
    { label: 'সক্রিয় বিজ্ঞাপন', value: '৫০০+', icon: Home },
    { label: 'সন্তুষ্ট গ্রাহক', value: '১০০০+', icon: Users },
    { label: 'বিশ্বস্ত মালিক', value: '২০০+', icon: Shield },
    { label: 'রেটিং', value: '৪.৮', icon: Star }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-primary-700">বাসা লাগবে?</span>
              <br />
              <span className="text-2xl lg:text-4xl font-normal">
                চট্টগ্রামের সেরা রেন্টাল প্ল্যাটফর্ম
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              চট্টগ্রামের প্রতিটি এলাকায় সহজে খুঁজুন, বুক করুন এবং বাসা পান। 
              ব্যাচেলর, স্টুডেন্ট, পরিবার ও কর্পোরেটের জন্য নিরাপদ ও বিশ্বস্ত সেবা।
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} showFilters={true} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-3">
                    <IconComponent className="h-6 w-6 text-primary-700" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              জনপ্রিয় বিজ্ঞাপন
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              চট্টগ্রামের সেরা এবং জনপ্রিয় রেন্টাল প্রপার্টিগুলো দেখুন
            </p>
          </div>
          
          <FeaturedListings />
          
          <div className="text-center mt-12">
            <Link to="/browse" className="btn-primary inline-flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>আরো দেখুন</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              কেন বাসা লাগবে?
            </h2>
            <p className="text-gray-600">
              আমাদের প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Search className="h-8 w-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                সহজ খোঁজ
              </h3>
              <p className="text-gray-600">
                চট্টগ্রামের সব এলাকায় আপনার পছন্দমতো বাসা খুঁজুন অ্যাডভান্স ফিল্টার দিয়ে
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Shield className="h-8 w-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                নিরাপদ বুকিং
              </h3>
              <p className="text-gray-600">
                সম্পূর্ণ নিরাপদ পেমেন্ট সিস্টেম এবং ভেরিফাইড প্রপার্টি অনার
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Users className="h-8 w-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ২৪/৭ সাপোর্ট
              </h3>
              <p className="text-gray-600">
                যেকোনো সমস্যায় আমাদের দক্ষ টিম আপনার পাশে, সব সময়
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            আপনার প্রপার্টি ভাড়া দিতে চান?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            আমাদের প্ল্যাটফর্মে আপনার প্রপার্টির বিজ্ঞাপন দিন এবং সঠিক ভাড়াটিয়া খুঁজুন
          </p>
          <Link
            to="/post-listing"
            className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>বিজ্ঞাপন দিন</span>
          </Link>
        </div>
      </section>
    </div>
  );
};