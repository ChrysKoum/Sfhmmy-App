
// Suppress react-native-render-html defaultProps warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  const warningMsg = typeof args[0] === 'string' ? args[0] : '';
  if (
    warningMsg.includes('Support for defaultProps will be removed') &&
    (warningMsg.includes('TRenderEngineProvider') ||
     warningMsg.includes('MemoizedTNodeRenderer') ||
     warningMsg.includes('TNodeChildrenRenderer') ||
     warningMsg.includes('bound renderChildren'))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";



import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ThemeProvider, useThemeContext } from '@/hooks/useThemeContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Root layout wrapper that includes providers
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}

// Navigation component that uses auth state
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colorScheme } = useThemeContext();
  const segments = useSegments();
  const router = useRouter();

  // Effect to handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;
  
    const inTabsGroup = segments[0] === '(tabs)';
    const isWorkshopRoute = segments[0] === 'workshop';
    const isSignInRoute = segments[0] === 'sign-in';
    
    // Allow workshop routes for authenticated users
    if (isAuthenticated) {
      // If user is authenticated and not in tabs or workshop route, redirect to tabs
      if (!inTabsGroup && !isWorkshopRoute) {
        router.replace('/(tabs)');
      }
    } else {
      // If user is not authenticated and not on sign-in page, redirect to sign-in
      if (!isSignInRoute) {
        router.replace('/sign-in');
      }
    }
  }, [isAuthenticated, segments, isLoading, router]);

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="workshop/[id]" 
          options={{ 
            presentation: 'card',
            headerBackTitle: 'Back',
            title: 'Workshop Details' 
          }} 
        />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}