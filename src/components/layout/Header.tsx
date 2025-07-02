import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, PlusCircle, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary-700" />
            <span className="text-xl font-bold text-primary-700">বাসা লাগবে</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/browse" className="text-gray-700 hover:text-primary-700 transition-colors">
              সার্চ করুন
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-700 transition-colors">
              আমাদের সম্পর্কে
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-700 transition-colors">
              যোগাযোগ
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/post-listing"
                  className="btn-primary flex items-center space-x-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">বিজ্ঞাপন দিন</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-700">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ড্যাশবোর্ড
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        প্রোফাইল
                      </Link>
                      <button
                        onClick={signOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>লগ আউট</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>লগ ইন</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/browse"
            className="block px-3 py-2 text-gray-700 hover:text-primary-700"
          >
            সার্চ করুন
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 text-gray-700 hover:text-primary-700"
          >
            আমাদের সম্পর্কে
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 text-gray-700 hover:text-primary-700"
          >
            যোগাযোগ
          </Link>
        </div>
      </div>
    </header>
  );
};