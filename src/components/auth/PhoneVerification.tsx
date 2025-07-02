import React, { useState, useEffect } from 'react';
import { Phone, Send, CheckCircle, RefreshCw } from 'lucide-react';

interface PhoneVerificationProps {
  phone: string;
  onVerified: () => void;
  onCancel: () => void;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  phone,
  onVerified,
  onCancel
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const sendOTP = async () => {
    setSending(true);
    setError('');
    
    try {
      // Simulate OTP sending - replace with actual SMS API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll show a success message
      console.log(`OTP sent to ${phone}: 123456`);
      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      setError('OTP পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError('৬ সংখ্যার OTP কোড লিখুন');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate OTP verification - replace with actual verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept 123456 as valid OTP
      if (otp === '123456') {
        onVerified();
      } else {
        setError('ভুল OTP কোড। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setError('OTP যাচাই করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP automatically when component mounts
  useEffect(() => {
    sendOTP();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-primary-700" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          ফোন নম্বর যাচাই করুন
        </h3>
        <p className="text-gray-600">
          আমরা আপনার ফোন নম্বরে একটি OTP কোড পাঠিয়েছি
        </p>
        <p className="font-medium text-gray-900 mt-2">{phone}</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            OTP কোড (৬ সংখ্যা)
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="input-field text-center text-2xl tracking-widest"
            placeholder="123456"
            maxLength={6}
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            ডেমোর জন্য: 123456 ব্যবহার করুন
          </p>
        </div>

        <button
          onClick={verifyOTP}
          disabled={loading || otp.length !== 6}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>যাচাই করুন</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-between">
          <button
            onClick={sendOTP}
            disabled={!canResend || sending}
            className="text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>
              {canResend ? 'আবার OTP পাঠান' : `${timeLeft}s পর আবার পাঠান`}
            </span>
          </button>

          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            বাতিল
          </button>
        </div>
      </div>
    </div>
  );
};