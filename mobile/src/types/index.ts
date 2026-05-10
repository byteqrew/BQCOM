export type Religion =
  | 'Hindu'
  | 'Muslim'
  | 'Christian'
  | 'Sikh'
  | 'Jain'
  | 'Buddhist'
  | 'Parsi'
  | 'Other';

export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Separated';

export type VisaStatus = 'US Citizen' | 'Green Card' | 'H1B' | 'H4' | 'F1' | 'Other';

export type DietPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain Vegetarian';

export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';

export interface HoroscopeDetails {
  rashi?: string;       // moon sign
  nakshatra?: string;
  gotra?: string;
  manglik?: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string;          // ISO date
  gender: Gender;
  bio?: string;
  photos: string[];               // Supabase storage URLs

  // Location
  city: string;
  state: string;

  // Identity
  religion: Religion;
  caste?: string;
  subcaste?: string;
  mother_tongue: string;
  ethnicity?: string;             // e.g. Tamil, Punjabi, Bengali

  // Immigration
  visa_status: VisaStatus;
  willing_to_relocate?: boolean;

  // Lifestyle
  diet: DietPreference;
  drinks?: boolean;
  smokes?: boolean;
  height_cm?: number;

  // Education & Career
  education?: string;
  college?: string;
  profession?: string;
  employer?: string;
  annual_income_usd?: number;

  // Family
  family_type?: 'Nuclear' | 'Joint';
  family_values?: 'Traditional' | 'Moderate' | 'Liberal';
  siblings?: number;
  family_status?: 'Middle Class' | 'Upper Middle Class' | 'Affluent';

  // Horoscope
  horoscope?: HoroscopeDetails;
  horoscope_match_required?: boolean;

  // Preferences (what they're looking for)
  pref_age_min?: number;
  pref_age_max?: number;
  pref_religion?: Religion[];
  pref_caste?: string[];
  pref_diet?: DietPreference[];
  pref_visa_status?: VisaStatus[];

  // Meta
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  last_message?: string;
  last_message_at?: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  read: boolean;
}

export interface Like {
  id: string;
  from_user_id: string;
  to_user_id: string;
  created_at: string;
  is_super_like: boolean;
}
