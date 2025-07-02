/*
  # Add Sample Data for Testing

  1. Sample Data
    - Add sample listings with proper user relationships
    - Add sample images for listings
    - Ensure all foreign key relationships are valid

  2. Data Integrity
    - Only add data if tables are empty
    - Use proper UUIDs for relationships
    - Add realistic Bengali property data
*/

-- First, let's add some sample data only if the tables are empty
DO $$
DECLARE
  sample_area_khulshi uuid;
  sample_area_gec uuid;
  sample_area_nasirabad uuid;
  sample_area_agrabad uuid;
  sample_user_id uuid;
BEGIN
  -- Only proceed if there are no listings currently
  IF NOT EXISTS (SELECT 1 FROM listings LIMIT 1) THEN
    
    -- Get area IDs
    SELECT id INTO sample_area_khulshi FROM areas WHERE name = 'খুলশী' LIMIT 1;
    SELECT id INTO sample_area_gec FROM areas WHERE name = 'জিইসি মোড়' LIMIT 1;
    SELECT id INTO sample_area_nasirabad FROM areas WHERE name = 'নাসিরাবাদ' LIMIT 1;
    SELECT id INTO sample_area_agrabad FROM areas WHERE name = 'আগ্রাবাদ' LIMIT 1;
    
    -- Create a sample user for demo purposes (this will be replaced when real users sign up)
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      'demo-user-1',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'demo@basalagbe.com',
      '$2a$10$demo.encrypted.password.hash',
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Demo User"}',
      false,
      '',
      '',
      '',
      ''
    ) ON CONFLICT (id) DO NOTHING;
    
    -- Create corresponding public user
    INSERT INTO users (id, email, name, role) VALUES (
      'demo-user-1',
      'demo@basalagbe.com',
      'Demo Property Owner',
      'owner'
    ) ON CONFLICT (id) DO NOTHING;
    
    -- Add sample listings if areas exist
    IF sample_area_khulshi IS NOT NULL THEN
      -- Listing 1: Khulshi Flat
      INSERT INTO listings (
        id,
        owner_id,
        title,
        description,
        rent,
        advance,
        category,
        rooms,
        bathrooms,
        furnishing,
        facilities,
        area_id,
        address,
        size,
        available_from,
        status
      ) VALUES (
        gen_random_uuid(),
        'demo-user-1',
        'খুলশীতে সুন্দর ২ রুমের ফ্ল্যাট',
        'খুলশী এলাকায় অবস্থিত একটি সুন্দর ২ রুমের ফ্ল্যাট। সব ধরনের সুবিধা সহ। পরিবার ও ব্যাচেলর উভয়ের জন্য উপযুক্ত। কাছেই স্কুল, কলেজ, হাসপাতাল ও বাজার।',
        15000,
        30000,
        'flat',
        2,
        1,
        'semi_furnished',
        '["বিদ্যুৎ", "পানি", "গ্যাস", "ইন্টারনেট", "পার্কিং", "নিরাপত্তা"]'::jsonb,
        sample_area_khulshi,
        'রোড নং ৫, খুলশী, চট্টগ্রাম',
        800,
        CURRENT_DATE,
        'active'
      );
    END IF;
    
    IF sample_area_gec IS NOT NULL THEN
      -- Listing 2: GEC Circle Room
      INSERT INTO listings (
        id,
        owner_id,
        title,
        description,
        rent,
        advance,
        category,
        rooms,
        bathrooms,
        furnishing,
        facilities,
        area_id,
        address,
        size,
        available_from,
        status
      ) VALUES (
        gen_random_uuid(),
        'demo-user-1',
        'জিইসি মোড়ে ব্যাচেলর রুম',
        'জিইসি মোড়ের কাছে ব্যাচেলরদের জন্য সুন্দর রুম। সব ধরনের সুবিধা আছে। ইউনিভার্সিটি ও অফিসের কাছে। নিরাপদ এলাকা।',
        8000,
        16000,
        'room',
        1,
        1,
        'furnished',
        '["বিদ্যুৎ", "পানি", "ইন্টারনেট", "নিরাপত্তা", "লিফট"]'::jsonb,
        sample_area_gec,
        'জিইসি মোড়, চট্টগ্রাম',
        400,
        CURRENT_DATE,
        'active'
      );
    END IF;
    
    IF sample_area_nasirabad IS NOT NULL THEN
      -- Listing 3: Nasirabad Family House
      INSERT INTO listings (
        id,
        owner_id,
        title,
        description,
        rent,
        advance,
        category,
        rooms,
        bathrooms,
        furnishing,
        facilities,
        area_id,
        address,
        size,
        available_from,
        status
      ) VALUES (
        gen_random_uuid(),
        'demo-user-1',
        'নাসিরাবাদে পারিবারিক বাসা',
        'নাসিরাবাদ এলাকায় পরিবারের জন্য উপযুক্ত ৩ রুমের বাসা। শান্ত পরিবেশ, সব ধরনের সুবিধা। স্কুল, কলেজ, হাসপাতাল কাছেই।',
        25000,
        50000,
        'family_house',
        3,
        2,
        'unfurnished',
        '["বিদ্যুৎ", "পানি", "গ্যাস", "পার্কিং", "গার্ডেন", "ছাদ"]'::jsonb,
        sample_area_nasirabad,
        'নাসিরাবাদ আবাসিক এলাকা, চট্টগ্রাম',
        1200,
        CURRENT_DATE,
        'active'
      );
    END IF;
    
    IF sample_area_agrabad IS NOT NULL THEN
      -- Listing 4: Agrabad Office Space
      INSERT INTO listings (
        id,
        owner_id,
        title,
        description,
        rent,
        advance,
        category,
        rooms,
        bathrooms,
        furnishing,
        facilities,
        area_id,
        address,
        size,
        available_from,
        status
      ) VALUES (
        gen_random_uuid(),
        'demo-user-1',
        'আগ্রাবাদে অফিস স্পেস',
        'আগ্রাবাদ বাণিজ্যিক এলাকায় অফিসের জন্য উপযুক্ত স্পেস। ব্যাংক, আদালত ও সরকারি অফিসের কাছে। পার্কিং সুবিধা আছে।',
        35000,
        70000,
        'office',
        4,
        2,
        'furnished',
        '["বিদ্যুৎ", "পানি", "ইন্টারনেট", "পার্কিং", "লিফট", "জেনারেটর", "সিসি ক্যামেরা"]'::jsonb,
        sample_area_agrabad,
        'আগ্রাবাদ বাণিজ্যিক এলাকা, চট্টগ্রাম',
        1500,
        CURRENT_DATE,
        'active'
      );
    END IF;
    
    -- Add more sample listings
    IF sample_area_khulshi IS NOT NULL THEN
      INSERT INTO listings (
        id,
        owner_id,
        title,
        description,
        rent,
        advance,
        category,
        rooms,
        bathrooms,
        furnishing,
        facilities,
        area_id,
        address,
        size,
        available_from,
        status
      ) VALUES (
        gen_random_uuid(),
        'demo-user-1',
        'খুলশীতে স্টুডেন্ট হোস্টেল',
        'খুলশী এলাকায় ছাত্রছাত্রীদের জন্য হোস্টেল। নিরাপদ পরিবেশ, সব সুবিধা। ইউনিভার্সিটির কাছে।',
        6000,
        12000,
        'hostel',
        1,
        1,
        'furnished',
        '["বিদ্যুৎ", "পানি", "ইন্টারনেট", "নিরাপত্তা", "খাবার"]'::jsonb,
        sample_area_khulshi,
        'খুলশী, চট্টগ্রাম',
        300,
        CURRENT_DATE,
        'active'
      );
    END IF;
    
    -- Add sample images for listings (using placeholder image URLs)
    INSERT INTO listing_images (listing_id, image_url)
    SELECT 
      l.id,
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    FROM listings l
    WHERE NOT EXISTS (SELECT 1 FROM listing_images WHERE listing_id = l.id);
    
    INSERT INTO listing_images (listing_id, image_url)
    SELECT 
      l.id,
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'
    FROM listings l
    WHERE l.category = 'flat'
    AND NOT EXISTS (SELECT 1 FROM listing_images WHERE listing_id = l.id AND image_url LIKE '%1571453%');
    
  END IF;
END $$;