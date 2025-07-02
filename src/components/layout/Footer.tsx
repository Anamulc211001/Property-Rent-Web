import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">বাসা লাগবে</span>
            </div>
            <p className="text-gray-300 mb-4">
              চট্টগ্রামের সবচেয়ে বিশ্বস্ত রেন্টাল প্ল্যাটফর্ম। সহজে খুঁজুন, নিরাপদে বুক করুন।
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>চট্টগ্রাম, বাংলাদেশ</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">দ্রুত লিঙ্ক</h3>
            <div className="space-y-2">
              <Link to="/browse" className="block text-gray-300 hover:text-white transition-colors">
                সার্চ করুন
              </Link>
              <Link to="/post-listing" className="block text-gray-300 hover:text-white transition-colors">
                বিজ্ঞাপন দিন
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">
                আমাদের সম্পর্কে
              </Link>
              <Link to="/terms" className="block text-gray-300 hover:text-white transition-colors">
                শর্তাবলী
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">যোগাযোগ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+৮৮০ ১২৩৪ ৫৬৭৮৯০</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>info@basalagbe.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © ২০২৫ বাসা লাগবে। সকল অধিকার সংরক্ষিত।
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                গোপনীয়তা নীতি
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                ব্যবহারের শর্ত
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};