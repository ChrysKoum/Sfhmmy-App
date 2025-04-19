import { API_URL } from '@/constants/Config';
import { Alert, Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export function formatUserData(user: any) {
  if (!user) return {
    name: "Guest User",
    role: "Guest",
    university: "Not logged in",
    email: "guest@example.com",
    city: "Unknown",
    school: "Unknown",
    year: "Unknown"
  };

  return {
    name: user.name,
    role: user.role || "Attendee",
    university: user.university || "Not specified",
    email: user.email,
    city: user.city || "Not specified",
    school: user.school || "Not specified",
    year: user.year?.toString() || "Not specified"
  };
}