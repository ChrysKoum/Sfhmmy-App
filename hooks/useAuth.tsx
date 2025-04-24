import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { ActivityIndicator, Image, View, StyleSheet, Platform } from 'react-native';
import { API_URL, API_CONFIG } from '@/constants/Config';

// Import our custom secure storage implementation for web
import secureStorage from '@/utils/secureStorage';

// Use the appropriate storage method based on platform
const storage = Platform.OS === 'web' ? secureStorage : SecureStore;

// Define types for user data
type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  university?: string;
  email_verified_at?: string | null; // Add this line
  // Add other user fields as needed
};

// Define the type for our auth state
type AuthState = {
  token: string | null;
  user: UserData | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  getQrCodeData: () => Promise<string>;
  error: string | null;
  isAuthenticated: boolean; // New property to track authentication state
};

// Create the auth context with default values
const AuthContext = createContext<AuthState>({
  token: null,
  user: null,
  isLoading: false,
  signIn: async () => {},
  signOut: async () => {},
  refreshUserProfile: async () => {},
  getQrCodeData: async () => "",
  error: null,
  isAuthenticated: false, // Initial value
});

// Login API function
async function loginAPI(email: string, password: string): Promise<{ token: string }> {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    // console.log('Login response:', data); // Log the response for debugging
    if (!response.ok) {
      // Improved error handling
      const errorMessage = data.message || `Authentication failed with status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data; // The Laravel endpoint returns { token: "..." }
  } catch (error) {
    if (error instanceof Error) {
      // Specific error message
      throw new Error(`Login failed: ${error.message}`);
    } else {
      throw new Error('Login failed: Network error occurred');
    }
  }
}

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(true); // State for initial app loading
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  // Check if token exists in storage on app load
  useEffect(() => {
    async function loadTokenFromStorage() {
      try {
        const storedToken = await storage.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
          
          // Try to fetch user profile with the stored token
          try {
            await fetchUserProfile(storedToken);
            // Set authentication state to true instead of navigating
            setIsAuthenticated(true);
          } catch (profileError) {
            // If profile fetch fails, token might be invalid
            console.error('Profile fetch failed, clearing token', profileError);
            await storage.deleteItemAsync('userToken');
            setToken(null);
            setIsAuthenticated(false);
          }
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsAppLoading(false); // Initial loading complete
        setIsLoading(false);
      }
    }

    loadTokenFromStorage();
  }, []);

  // Fetch user profile with token
  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = `Failed to fetch user profile: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      await fetchUserProfile(token);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Get QR code data
  const getQrCodeData = async (): Promise<string> => {
    if (!token) return "";
    
    try {
      // For direct binary data like images, we need to handle it differently
      const response = await fetch(`${API_URL}/user/qrcode`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'image/png',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch QR code: ${response.status}`);
      }

      // Handle web and native platforms differently for blob URLs
      if (Platform.OS === 'web') {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } else {
        // For native platforms, convert blob to base64 data URL
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch QR code');
      return "";
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      // Get token from API
      const response = await loginAPI(email, password);
      const authToken = response.token;
      
      // Store the token
      await storage.setItemAsync('userToken', authToken);
      setToken(authToken);
      
      // Fetch user profile
      await fetchUserProfile(authToken);
      
      // Set authentication state instead of navigating here
      setIsAuthenticated(true);
      
      // Navigate to main app - only after auth state is set
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred during sign in');
      console.error('Sign in error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Call logout endpoint to invalidate token on server
      if (token) {
        try {
          const response = await fetch(`${API_URL}/logout`, {
            method: 'GET', // Note: Your endpoint uses GET
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            console.warn(`Sign out API call failed: ${response.status}`);
            // Continue with local sign out even if API call fails
          }
        } catch (apiError) {
          console.warn('Error calling logout API:', apiError);
          // Continue with local sign out even if API call fails
        }
      }

      // Clear local storage and state
      await storage.deleteItemAsync('userToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Navigate back to sign-in
      router.replace('/sign-in');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred during sign out');
      console.error('Sign out error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    token,
    user,
    isLoading,
    signIn,
    signOut,
    refreshUserProfile,
    getQrCodeData,
    error,
    isAuthenticated, // Include the authentication state in the context
  };

  return (
    <AuthContext.Provider value={value}>
      {isAppLoading ? (
        <View style={styles.appLoadingContainer}>
          <Image 
            source={require('@/assets/images/logo/sfhmmy_logo_dark.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#297fff" />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth
export function useAuth() {
  return useContext(AuthContext);
}

const styles = StyleSheet.create({
  appLoadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});