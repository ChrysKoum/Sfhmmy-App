import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

// Define the type for our auth state
type AuthState = {
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

// Create the auth context
const AuthContext = createContext<AuthState | undefined>(undefined);

// Mock API function for login
async function mockSignInAPI(email: string, password: string): Promise<{ token: string }> {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be a fetch call to your authentication API
  if (email && password) {
    return { token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15) };
  }
  
  throw new Error('Invalid credentials');
}

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if token exists in storage on app load
  useEffect(() => {
    async function loadTokenFromStorage() {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
          router.replace('/(tabs)');
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadTokenFromStorage();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockSignInAPI(email, password);
      
      // Store the token
      await SecureStore.setItemAsync('userToken', response.token);
      setToken(response.token);
      
      // Navigate to main app
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
      await SecureStore.deleteItemAsync('userToken');
      setToken(null);
      router.replace('/sign-in');
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}