import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import secureStorage from '@/utils/secureStorage';

// Use the appropriate storage method based on platform
const storage = Platform.OS === 'web' ? secureStorage : SecureStore;

type ThemeType = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: ThemeType;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark', // Changed default to dark
  colorScheme: 'dark', // Changed default to dark
  setTheme: () => {},
  isDark: true, // Changed default to true
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme() || 'light';
  // Initialize theme state as 'dark' instead of 'system'
  const [theme, setThemeState] = useState<ThemeType>('dark');
  
  // Determine active color scheme - use dark as default even for 'system'
  const colorScheme = theme === 'system' ? deviceColorScheme : theme;
  const isDark = colorScheme === 'dark';
  
  // Load saved theme preference on mount, but default to dark if not found
  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await storage.getItemAsync('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
          setThemeState(savedTheme as ThemeType);
        } else {
          // If no saved preference, set to dark and save it
          setThemeState('dark');
          await storage.setItemAsync('theme', 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        // In case of error, still default to dark
        setThemeState('dark');
      }
    }
    
    loadTheme();
  }, []);
  
  // Save theme preference when it changes
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await storage.setItemAsync('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}