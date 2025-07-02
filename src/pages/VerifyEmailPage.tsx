import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export const VerifyEmailPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already verified, redirect to dashboard
    if (user && user.email) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email || ''
      });
      
      if (error) {
        setError('ইমেইল পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      } else {
        setResent(true);
      }
    } catch (err) {
      setError('ইমেইল পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

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
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary-700" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ইমেইল যাচাই করুন
          </h2>
          
          <p className="text-gray-600 mb-6">
            আমরা আপনার ইমেইল ঠিকানায় একটি যাচাইকরণ লিঙ্ক পাঠিয়েছি। 
            আপনার অ্যাকাউন্ট সক্রিয় করতে লিঙ্কে ক্লিক করুন।
          </p>

          {user?.email && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                ইমেইল পাঠানো হয়েছে:
              </p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {resent && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-700 text-sm">
                যাচাইকরণ ইমেইল আবার পাঠানো হয়েছে!
              </p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              disabled={loading || resent}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>আবার ইমেইল পাঠান</span>
                </>
              )}
            </button>

            <Link
              to="/login"
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>লগ ইন পেজে ফিরে যান</span>
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>ইমেইল পাননি? স্প্যাম ফোল্ডার চেক করুন।</p>
          </div>
        </div>
      </div>
    </div>
  );
};