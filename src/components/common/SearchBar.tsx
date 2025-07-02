import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { chittagongAreas, propertyCategories } from '../../data/areas';

interface SearchBarProps {
  onSearch: (query: string, location: string, category: string) => void;
  showFilters?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, showFilters = false }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location, category);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Query */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="রুম, ফ্ল্যাট, অফিস খুঁজুন..."
              className="input-field pl-10"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="">সব এলাকা</option>
              {chittagongAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field appearance-none"
            >
              <option value="">সব ধরনের প্রপার্টি</option>
              {propertyCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>খুঁজুন</span>
          </button>

          {showFilters && (
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>আরো ফিল্টার</span>
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                মাসিক ভাড়া (টাকা)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="সর্বনিম্ন"
                  className="input-field text-sm"
                />
                <input
                  type="number"
                  placeholder="সর্বোচ্চ"
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                রুম সংখ্যা
              </label>
              <select className="input-field">
                <option value="">যে কোনো</option>
                <option value="1">১ রুম</option>
                <option value="2">২ রুম</option>
                <option value="3">৩ রুম</option>
                <option value="4">৪+ রুম</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ফার্নিশিং
              </label>
              <select className="input-field">
                <option value="">যে কোনো</option>
                <option value="furnished">ফার্নিশড</option>
                <option value="semi_furnished">সেমি-ফার্নিশড</option>
                <option value="unfurnished">আনফার্নিশড</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};