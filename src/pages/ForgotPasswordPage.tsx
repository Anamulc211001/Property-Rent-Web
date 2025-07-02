import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setError('পাসওয়ার্ড রিসেট ইমেইল পাঠাতে সমস্যা হয়েছে।');
      } else {
        setSent(true);
      }
    } catch (err) {
      setError('পাসওয়ার্ড রিসেট ইমেইল পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">বা</span>
              </div>
              <span className="text-2xl font-bold text-primary-700">বাসা লাগবে</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ইমেইল পাঠানো হয়েছে
            </h2>
            
            <p className="text-gray-600 mb-6">
              আমরা আপনার ইমেইল ঠিকানায় পাসওয়ার্ড রিসেট লিঙ্ক পাঠিয়েছি। 
              ইমেইল চেক করুন এবং নির্দেশনা অনুসরণ করুন।
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">ইমেইল পাঠানো হয়েছে:</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            <Link
              to="/login"
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>লগ ইন পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">বা</span>
            </div>
            <span className="text-2xl font-bold text-primary-700">বাসা লাগবে</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            পাসওয়ার্ড ভুলে গেছেন?
          </h2>
          <p className="text-gray-600">
            চিন্তা নেই! আপনার ইমেইল ঠিকানা দিন, আমরা পাসওয়ার্ড রিসেট লিঙ্ক পাঠিয়ে দেব।
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-10"
                  placeholder="আপনার ইমেইল লিখুন"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>রিসেট লিঙ্ক পাঠান</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 font-medium flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>লগ ইন পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};