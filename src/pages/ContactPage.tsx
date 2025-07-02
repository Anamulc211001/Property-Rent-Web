import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setLoading(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'ফোন',
      details: ['+৮৮০ ১২৩৪ ৫৬৭৮৯০', '+৮৮০ ০৯৮৭ ৬৫৪৩২১'],
      description: 'সরাসরি কথা বলুন আমাদের সাথে'
    },
    {
      icon: Mail,
      title: 'ইমেইল',
      details: ['info@basalagbe.com', 'support@basalagbe.com'],
      description: 'যেকোনো প্রশ্নের জন্য ইমেইল করুন'
    },
    {
      icon: MapPin,
      title: 'ঠিকানা',
      details: ['খুলশী, চট্টগ্রাম', 'বাংলাদেশ'],
      description: 'আমাদের অফিসে আসুন'
    },
    {
      icon: Clock,
      title: 'কার্যসময়',
      details: ['সকাল ৯টা - রাত ৯টা', 'সপ্তাহের ৭ দিন'],
      description: 'আমরা সবসময় আপনার সেবায়'
    }
  ];

  const subjects = [
    'সাধারণ অনুসন্ধান',
    'প্রপার্টি সংক্রান্ত',
    'বুকিং সমস্যা',
    'পেমেন্ট সমস্যা',
    'টেকনিক্যাল সাপোর্ট',
    'অভিযোগ',
    'পরামর্শ',
    'অন্যান্য'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            যোগাযোগ করুন
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            আমাদের সাথে যোগাযোগ করুন। আমরা আপনার সব প্রশ্নের উত্তর দিতে এবং 
            সাহায্য করতে সর্বদা প্রস্তুত।
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                যোগাযোগের তথ্য
              </h2>
              <p className="text-gray-600 mb-8">
                নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারেন। 
                আমরা যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করব।
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary-700" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {info.title}
                        </h3>
                        <div className="space-y-1 mb-2">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-800 font-medium">
                              {detail}
                            </p>
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Contact */}
            <div className="bg-primary-700 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">দ্রুত যোগাযোগ</h3>
              <div className="space-y-3">
                <a
                  href="tel:+8801234567890"
                  className="flex items-center space-x-3 p-3 bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>এখনই কল করুন</span>
                </a>
                <a
                  href="https://wa.me/8801234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-green-600 rounded-lg hover:bg-green-500 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp এ মেসেজ করুন</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                আমাদের মেসেজ পাঠান
              </h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-green-600" />
                    <p className="text-green-700 font-medium">
                      আপনার মেসেজ সফলভাবে পাঠানো হয়েছে!
                    </p>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ইমেইল ঠিকানা *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="আপনার ইমেইল লিখুন"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ফোন নম্বর
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="০১৭xxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      বিষয় *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">বিষয় নির্বাচন করুন</option>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    আপনার মেসেজ *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="input-field"
                    placeholder="আপনার প্রশ্ন বা মন্তব্য বিস্তারিত লিখুন..."
                  />
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
                      <span>মেসেজ পাঠান</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              প্রায়শই জিজ্ঞাসিত প্রশ্ন
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              আমাদের কাছে সবচেয়ে বেশি আসা প্রশ্নগুলোর উত্তর
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                কিভাবে প্রপার্টি বুক করব?
              </h3>
              <p className="text-gray-600">
                প্রপার্টি দেখে "বুক করুন" বাটনে ক্লিক করুন, তথ্য পূরণ করুন এবং অগ্রিম পেমেন্ট করুন।
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                পেমেন্ট কিভাবে করব?
              </h3>
              <p className="text-gray-600">
                আমরা bKash, Nagad, Rocket এবং ব্যাংক ট্রান্সফার গ্রহণ করি। সব পেমেন্ট নিরাপদ।
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                বুকিং বাতিল করা যাবে?
              </h3>
              <p className="text-gray-600">
                হ্যাঁ, নির্দিষ্ট শর্তের অধীনে বুকিং বাতিল করা যাবে। বিস্তারিত জানতে যোগাযোগ করুন।
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                প্রপার্টি দেখতে যেতে পারি?
              </h3>
              <p className="text-gray-600">
                অবশ্যই! মালিকের সাথে যোগাযোগ করে সময় ঠিক করে প্রপার্টি দেখতে যেতে পারেন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};