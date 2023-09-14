import type { Review } from './review';

interface Campsite {
  name: string;
  description: string;
  type: CampsiteType;
  contact: {
    contactNo: {
      mobileNo: string;
      name: string;
    }[];
    socialLinks: Record<SocialMedia, string>[];
    address: Address;
  };
  location: Location;
  facilities: CampsiteFacility[];
  fee: Fee;
  cover_image: string;
  images: string[];
  slug: string;
  availability: CampsiteAvailability;
  reviews: Review[];

  created_at: Date;
  updated_at: Date;
}

enum CampsiteAvailability {
  Open = 'open',
  Close = 'closed'
}

enum CampsiteType {
  River = 'river',
  Beach = 'beach',
  Lake = 'lake',
  Waterfall = 'waterfall',
  Mountain = 'mountain',
  Forest = 'forest',
  Campervan = 'campervan',
  Cave = 'cave',
}

enum SocialMedia {
  Instagram = 'instagram',
  Facebook = 'facebook',
  Tiktok = 'tiktok',
  GoogleMap = 'google_map',
  Twitter = 'twitter',
}

enum CampsiteFacility {
  Toilet = 'toilet',
  Shower = 'shower',
  DrinkingWater = 'drinking_water',
  PicnicTables = 'picnic_tables',
  CampfirePit = 'campfire_pit',
  BBQGrill = 'bbq_grill',
  ElectricityHookup = 'electricity_hookup',
  PetFriendly = 'pet_friendly',
  Wifi = 'wifi',
  TrashDisposal = 'trash_disposal',
  Hiking = 'hiking',
  Fishing = 'fishing',
  Swimming = 'swimming',
  Boating = 'boating',
  CanoeRentals = 'canoe_rentals',
  KayakRentals = 'kayak_rentals',
  RVHookup = 'rv_hookup',
  Playground = 'playground',
  Store = 'camp_store',
  Restaurant = 'restaurant',
  LaundryFacilities = 'laundry_facilities',
  RangerStation = 'ranger_station',
  AccessibilityFriendly = 'accessibility_friendly',
  SecurityPatrol = 'security_patrol',
  FirstAidStation = 'first_aid_station',
  WildlifeViewing = 'wildlife_viewing',
  Birdwatching = 'birdwatching',
}

interface Fee {
  from: Price;
  to: Price;
}

interface Price {
  currency: string;
  total: number;
}

interface Address {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

export type {
  Campsite
};
