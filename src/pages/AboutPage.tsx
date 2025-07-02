import React from 'react';
import { Users, Target, Award, Heart, Shield, Clock } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'নিরাপদ ও বিশ্বস্ত',
      description: 'সম্পূর্ণ নিরাপদ পেমেন্ট সিস্টেম এবং ভেরিফাইড প্রপার্টি অনার'
    },
    {
      icon: Clock,
      title: '২৪/৭ সাপোর্ট',
      description: 'যেকোনো সমস্যায় আমাদের দক্ষ টিম আপনার পাশে, সব সময়'
    },
    {
      icon: Heart,
      title: 'গ্রাহক সন্তুষ্টি',
      description: 'আমাদের প্রধান লক্ষ্য হলো গ্রাহকদের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করা'
    }
  ];

  const team = [
    {
      name: 'মোহাম্মদ রহিম',
      role: 'প্রতিষ্ঠাতা ও সিইও',
      description: 'চট্টগ্রামের রিয়েল এস্টেট সেক্টরে ১০+ বছরের অভিজ্ঞতা'
    },
    {
      name: 'ফাতেমা খাতুন',
      role: 'প্রোডাক্ট ম্যানেজার',
      description: 'টেকনোলজি ও কাস্টমার এক্সপেরিয়েন্স বিশেষজ্ঞ'
    },
    {
      name: 'আহমেদ হাসান',
      role: 'কাস্টমার সাপোর্ট হেড',
      description: 'গ্রাহক সেবায় নিবেদিত এবং সমস্যা সমাধানে দক্ষ'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            আমাদের সম্পর্কে
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            বাসা লাগবে হলো চট্টগ্রামের সবচেয়ে বিশ্বস্ত রেন্টাল প্ল্যাটফর্ম। 
            আমাদের লক্ষ্য হলো সহজ, নিরাপদ এবং দ্রুত উপায়ে আপনার স্বপ্নের বাসা খুঁজে দেওয়া।
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-primary-700 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">আমাদের লক্ষ্য</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                চট্টগ্রামের প্রতিটি মানুষের জন্য উপযুক্ত বাসস্থান খুঁজে পাওয়াকে সহজ করে তোলা। 
                আমরা চাই যেন ব্যাচেলর, স্টুডেন্ট, পরিবার এবং কর্পোরেট ক্লায়েন্ট সবাই 
                তাদের প্রয়োজন অনুযায়ী সঠিক প্রপার্টি খুঁজে পান।
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center mb-6">
                <Award className="h-8 w-8 text-primary-700 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">আমাদের দৃষ্টিভঙ্গি</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                বাংলাদেশের সবচেয়ে নির্ভরযোগ্য এবং ব্যবহারকারী-বান্ধব রেন্টাল প্ল্যাটফর্ম হিসেবে 
                প্রতিষ্ঠিত হওয়া। আমাদের স্বপ্ন হলো প্রতিটি শহরে আমাদের সেবা পৌঁছে দেওয়া 
                এবং ঘর খোঁজার অভিজ্ঞতাকে আনন্দদায়ক করে তোলা।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              কেন আমাদের বেছে নেবেন?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              আমাদের প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ যা আপনার ঘর খোঁজার অভিজ্ঞতাকে করবে অনন্য
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                    <IconComponent className="h-8 w-8 text-primary-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              আমাদের টিম
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              অভিজ্ঞ এবং নিবেদিতপ্রাণ পেশাদারদের নিয়ে গঠিত আমাদের টিম
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-primary-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">৫০০+</div>
              <div className="text-primary-100">সক্রিয় বিজ্ঞাপন</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">১০০০+</div>
              <div className="text-primary-100">সন্তুষ্ট গ্রাহক</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">২০০+</div>
              <div className="text-primary-100">বিশ্বস্ত মালিক</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">৪.৮</div>
              <div className="text-primary-100">গড় রেটিং</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            আমাদের সাথে যোগাযোগ করুন
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            কোনো প্রশ্ন বা সহায়তার প্রয়োজন হলে আমাদের সাথে যোগাযোগ করতে দ্বিধা করবেন না
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+8801234567890"
              className="btn-primary inline-flex items-center justify-center"
            >
              ফোন করুন
            </a>
            <a
              href="mailto:info@basalagbe.com"
              className="btn-secondary inline-flex items-center justify-center"
            >
              ইমেইল করুন
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};