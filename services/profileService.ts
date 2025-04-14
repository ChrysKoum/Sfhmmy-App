import { API_URL } from '@/constants/Config';
import { Alert, Linking } from 'react-native';

export async function fetchCV(token: string) {
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_URL}/cv`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Unexpected error loading CV:', error);
    return null;
  }
}

export async function viewCV(cvUrl: string | null) {
  if (cvUrl) {
    try {
      await Linking.openURL(cvUrl);
    } catch (err) {
      console.error("Error opening CV URL:", err);
      Alert.alert("Error", "Cannot open CV preview");
    }
  } else {
    Alert.alert("Info", "No CV available to view");
  }
}

export function formatUserData(user: any) {
  if (!user) return {
    name: "Guest User",
    role: "Guest",
    university: "Not logged in",
    email: "guest@example.com",
    city: "Unknown",
    school: "Unknown",
    year: "Unknown",
    cv: null
  };

  return {
    name: user.name,
    role: user.role || "Attendee",
    university: user.university || "Not specified",
    email: user.email,
    city: user.city || "Not specified",
    school: user.school || "Not specified",
    year: user.year?.toString() || "Not specified",
    cv: user.cv || null
  };
}
