export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  phone_verified: boolean;
  role: 'renter' | 'owner' | 'admin';
  created_at: string;
}

export interface Area {
  id: string;
  name: string;
  city: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  rent: number;
  advance: number;
  category: 'room' | 'flat' | 'family_house' | 'office' | 'hostel';
  rooms: number;
  bathrooms: number;
  furnishing: 'furnished' | 'semi_furnished' | 'unfurnished';
  facilities: string[];
  area_id: string;
  area?: Area;
  address: string;
  size: number;
  available_from: string;
  notes?: string;
  location?: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'inactive' | 'rented';
  images: ListingImage[];
  created_at: string;
  owner?: User;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  created_at: string;
}

export interface Booking {
  id: string;
  listing_id: string;
  renter_id: string;
  booking_date: string;
  advance_paid: number;
  payment_status: 'pending' | 'paid' | 'failed';
  booking_status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  contact_phone: string;
  created_at: string;
  listing?: Listing;
  renter?: User;
}

export interface SearchFilters {
  location?: string;
  category?: string;
  minRent?: number;
  maxRent?: number;
  rooms?: number;
  furnishing?: string;
  facilities?: string[];
  availableFrom?: string;
}