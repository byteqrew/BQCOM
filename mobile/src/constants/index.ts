export const RELIGIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Other',
] as const;

export const MOTHER_TONGUES = [
  'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati',
  'Punjabi', 'Bengali', 'Odia', 'Assamese', 'Urdu', 'English', 'Other',
] as const;

export const VISA_STATUSES = [
  'US Citizen', 'Green Card', 'H1B', 'H4', 'F1', 'Other',
] as const;

export const DIET_PREFERENCES = [
  'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain Vegetarian',
] as const;

export const RASHIS = [
  'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)',
  'Singh (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
  'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)',
] as const;

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
] as const;

export const APP_NAME = 'BandhanUSA';
export const SUPPORT_EMAIL = 'support@bandhanusa.com';

export const COLORS = {
  primary: '#C0392B',       // deep red — auspicious in Indian culture
  primaryLight: '#E74C3C',
  primaryDark: '#922B21',
  secondary: '#F39C12',     // saffron/gold accent
  secondaryLight: '#F9CA54',
  background: '#FDF6F0',    // warm cream
  surface: '#FFFFFF',
  text: '#2C2C2C',
  textSecondary: '#7F8C8D',
  border: '#E8DDD5',
  success: '#27AE60',
  error: '#E74C3C',
  like: '#E74C3C',
  pass: '#BDC3C7',
  superLike: '#2980B9',
} as const;

export const MAX_PHOTOS = 6;
export const MIN_AGE = 18;
export const MAX_AGE = 60;
