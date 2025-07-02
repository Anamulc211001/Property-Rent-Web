import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, Users, Car, Wifi, Shield } from 'lucide-react';
import { Listing } from '../../types';

interface PropertyCardProps {
  listing: Listing;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ listing }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD').format(price);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'room':
        return <Home className="h-4 w-4" />;
      case 'flat':
        return <Home className="h-4 w-4" />;
      case 'family_house':
        return <Users className="h-4 w-4" />;
      case 'office':
        return <Home className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
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

  return (
    <Link to={`/listing/${listing.id}`} className="block group">
      <div className="card overflow-hidden group-hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0].image_url}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Home className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-primary-700 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            {getCategoryIcon(listing.category)}
            <span>{getCategoryLabel(listing.category)}</span>
          </div>

          {/* Status Badge */}
          {listing.status === 'rented' && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              ভাড়া হয়ে গেছে
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center space-x-1 text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{listing.area?.name}, চট্টগ্রাম</span>
          </div>

          {/* Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              <span>{listing.rooms} রুম</span>
              <span>{listing.bathrooms} বাথরুম</span>
              <span>{listing.size} বর্গফুট</span>
            </div>
          </div>

          {/* Furnishing */}
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {getFurnishingLabel(listing.furnishing)}
            </span>
          </div>

          {/* Facilities */}
          <div className="flex items-center space-x-2 mb-4">
            {listing.facilities.includes('পার্কিং') && <Car className="h-4 w-4 text-gray-500" />}
            {listing.facilities.includes('ইন্টারনেট') && <Wifi className="h-4 w-4 text-gray-500" />}
            {listing.facilities.includes('নিরাপত্তা') && <Shield className="h-4 w-4 text-gray-500" />}
            {listing.facilities.length > 3 && (
              <span className="text-xs text-gray-500">+{listing.facilities.length - 3} আরও</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary-700">
                ৳{formatPrice(listing.rent)}
              </div>
              <div className="text-sm text-gray-500">মাসিক ভাড়া</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">অগ্রিম</div>
              <div className="font-semibold text-gray-800">
                ৳{formatPrice(listing.advance)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};