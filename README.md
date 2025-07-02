# বাসা লাগবে - Chittagong Rental Platform

A modern, responsive rental platform for Chittagong city, Bangladesh that helps bachelors, students, families, and corporate clients find, view, and book rental properties.

## Features

- **Multi-language Support**: Bengali and English interface
- **User Authentication**: Email/password and Google OAuth
- **Phone Verification**: OTP-based phone number verification
- **Property Listings**: Detailed property information with image galleries
- **Advanced Search**: Location-based filtering with Chittagong areas
- **Booking System**: Secure booking with payment integration
- **User Dashboards**: Separate dashboards for renters and owners
- **Mobile Responsive**: Optimized for all device sizes

## Tech Stack

- **Frontend**: React.js + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payment**: Stripe (test mode initially)
- **Maps**: Google Maps API
- **SMS**: Twilio/local SMS providers
- **Hosting**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd basa-lagbe-rental-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your Supabase credentials and other configuration.

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL migrations in `/supabase/migrations/`
   - Configure Row Level Security (RLS) policies

5. Start the development server:
```bash
npm run dev
```

## Database Schema

### Core Tables

- **users**: User profiles with role-based access
- **areas**: Chittagong city areas for location filtering
- **listings**: Property listings with detailed information
- **listing_images**: Image galleries for properties
- **bookings**: Booking requests and management
- **payments**: Payment transaction records

### Authentication

- Supabase Auth for user management
- Row Level Security (RLS) for data protection
- Phone verification via SMS OTP

## User Roles

- **Renter**: Search properties, save favorites, book homes
- **Owner/Agent**: Post/manage listings, handle bookings
- **Admin**: Platform management and moderation

## Location Coverage

All major Chittagong areas including:
- GEC মোড়, খুলশী, পাঁচলাইশ, আগ্রাবাদ
- নাসিরাবাদ, বহদ্দারহাট, মুরাদপুর, অক্সিজেন মোড়
- চান্দগাঁও, হালিশহর, বায়েজিদ বোস্তামী, পতেঙ্গা
- And 30+ more areas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.