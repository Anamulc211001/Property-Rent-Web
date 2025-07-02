/*
  # Complete Database Schema for Basa Lagbe Rental Platform

  1. New Tables
    - `areas` - Chittagong city areas for location filtering
    - `listings` - Property listings with detailed information
    - `listing_images` - Image galleries for properties
    - `bookings` - Booking requests and management
    - `payments` - Payment transaction records
    - `favorites` - User saved listings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Data
    - Pre-populate areas with Chittagong locations
    - Set up proper relationships between tables
*/

-- Create areas table
CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL DEFAULT 'চট্টগ্রাম',
  created_at timestamptz DEFAULT now()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  rent integer NOT NULL,
  advance integer NOT NULL,
  category text NOT NULL CHECK (category IN ('room', 'flat', 'family_house', 'office', 'hostel')),
  rooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  furnishing text NOT NULL CHECK (furnishing IN ('furnished', 'semi_furnished', 'unfurnished')),
  facilities jsonb DEFAULT '[]'::jsonb,
  area_id uuid REFERENCES areas(id) NOT NULL,
  address text NOT NULL,
  size integer NOT NULL,
  available_from date DEFAULT CURRENT_DATE,
  notes text,
  location point,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'rented')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create listing_images table
CREATE TABLE IF NOT EXISTS listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  renter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  booking_date date DEFAULT CURRENT_DATE,
  advance_paid integer NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  booking_status text NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
  contact_phone text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  payment_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Update users table to include additional fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone_verified'
  ) THEN
    ALTER TABLE users ADD COLUMN phone_verified boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text DEFAULT 'renter' CHECK (role IN ('renter', 'owner', 'admin'));
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for areas (public read)
CREATE POLICY "Areas are viewable by everyone"
  ON areas FOR SELECT
  TO authenticated, anon
  USING (true);

-- RLS Policies for listings
CREATE POLICY "Listings are viewable by everyone"
  ON listings FOR SELECT
  TO authenticated, anon
  USING (status = 'active');

CREATE POLICY "Users can insert their own listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- RLS Policies for listing_images
CREATE POLICY "Listing images are viewable by everyone"
  ON listing_images FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can manage images for their listings"
  ON listing_images FOR ALL
  TO authenticated
  USING (
    listing_id IN (
      SELECT id FROM listings WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = renter_id OR 
    listing_id IN (SELECT id FROM listings WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Listing owners can update booking status"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    listing_id IN (SELECT id FROM listings WHERE owner_id = auth.uid())
  );

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE 
      renter_id = auth.uid() OR 
      listing_id IN (SELECT id FROM listings WHERE owner_id = auth.uid())
    )
  );

-- RLS Policies for favorites
CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Insert Chittagong areas
INSERT INTO areas (name, city) VALUES
  ('জিইসি মোড়', 'চট্টগ্রাম'),
  ('খুলশী', 'চট্টগ্রাম'),
  ('পাঁচলাইশ', 'চট্টগ্রাম'),
  ('আগ্রাবাদ', 'চট্টগ্রাম'),
  ('আগ্রাবাদ ব্যাঙ্ক কলোনি', 'চট্টগ্রাম'),
  ('নাসিরাবাদ', 'চট্টগ্রাম'),
  ('বহদ্দারহাট', 'চট্টগ্রাম'),
  ('মুরাদপুর', 'চট্টগ্রাম'),
  ('অক্সিজেন মোড়', 'চট্টগ্রাম'),
  ('চান্দগাঁও', 'চট্টগ্রাম'),
  ('হালিশহর', 'চট্টগ্রাম'),
  ('বায়েজিদ বোস্তামী', 'চট্টগ্রাম'),
  ('পতেঙ্গা', 'চট্টগ্রাম'),
  ('লালখান বাজার', 'চট্টগ্রাম'),
  ('কাজীর দেউড়ি', 'চট্টগ্রাম'),
  ('টাইগার পাস', 'চট্টগ্রাম'),
  ('ফিরিঙ্গি বাজার', 'চট্টগ্রাম'),
  ('জুবলি রোড', 'চট্টগ্রাম'),
  ('চকবাজার', 'চট্টগ্রাম'),
  ('কাতালগঞ্জ', 'চট্টগ্রাম'),
  ('বন্দর', 'চট্টগ্রাম'),
  ('সিপাহীপাড়া', 'চট্টগ্রাম'),
  ('শোলোকবাহার', 'চট্টগ্রাম'),
  ('আমিনজারী', 'চট্টগ্রাম'),
  ('পাহাড়তলী', 'চট্টগ্রাম'),
  ('চান্দগাঁও আবাসিক', 'চট্টগ্রাম'),
  ('CDA আবাসিক', 'চট্টগ্রাম'),
  ('ফইল্যাতলি', 'চট্টগ্রাম'),
  ('ফৌজদারহাট', 'চট্টগ্রাম'),
  ('উনাইনগর', 'চট্টগ্রাম'),
  ('রাউজান', 'চট্টগ্রাম'),
  ('সীতাকুণ্ড', 'চট্টগ্রাম'),
  ('হাটহাজারী', 'চট্টগ্রাম'),
  ('কর্ণফুলী', 'চট্টগ্রাম'),
  ('আনোয়ারা', 'চট্টগ্রাম'),
  ('সন্দ্বীপ', 'চট্টগ্রাম'),
  ('চন্দনাইশ', 'চট্টগ্রাম'),
  ('বোয়ালখালী', 'চট্টগ্রাম'),
  ('পটিয়া', 'চট্টগ্রাম')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_area_id ON listings(area_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_rent ON listings(rent);
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);