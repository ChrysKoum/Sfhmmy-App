import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

// Components
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { QRCodePopup } from '@/components/QRCodePopup';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PersonalInfo } from '@/components/profile/PersonalInfo';
import { WorkshopsList } from '@/components/profile/WorkshopsList';
import { CVSection } from '@/components/profile/CVSection';

// Hooks and Services
import { useThemeContext } from '@/hooks/useThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { fetchCV, formatUserData, viewCV } from '@/services/profileService';

// Sample workshop data
const sampleWorkshops = [
  "Introduction to Machine Learning", 
  "Web3 Development",
  "IoT Prototyping"
];

export default function ProfileScreen() {
  // Theme context instead of useColorScheme
  const { isDark, theme, setTheme } = useThemeContext();
  const { user, token, signOut, isLoading, refreshUserProfile } = useAuth();
  
  // States for profile and CV data
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvFileName, setCvFileName] = useState("No CV uploaded");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isCvLoading, setIsCvLoading] = useState(false);
  
  // Local settings states - now tied to theme context
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [themeDarkEnabled, setThemeDarkEnabled] = useState(isDark);

  // Animation shared value: 0 = light mode (sun visible), 1 = dark mode (moon visible)
  const themeProgress = useSharedValue(themeDarkEnabled ? 1 : 0);

  // Animated styles for the sun and moon icons
  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - themeProgress.value }],
    opacity: 1 - themeProgress.value,
  }));
  
  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: themeProgress.value }],
    opacity: themeProgress.value,
  }));
  
  // Format user data
  const userData = formatUserData(user);
  
  // Fetch user data on mount
  useEffect(() => {
    if (!user) {
      refreshUserProfile();
    }
  }, []);
  
  // Fetch CV data when user is loaded
  useEffect(() => {
    loadCV();
  }, [user]);
  
  // Sync local theme toggle with context value
  useEffect(() => {
    setThemeDarkEnabled(isDark);
    themeProgress.value = withTiming(isDark ? 1 : 0, { duration: 500 });
  }, [isDark]);
  
  // Load CV data
  const loadCV = async () => {
    setIsCvLoading(true);
    try {
      const result = await fetchCV(token);
      
      if (result && typeof result === 'object' && result.exists === true) {
        setCvUrl(result.url);
        setCvFileName(result.filename || "My CV");
        setCvUploaded(true);
      } else if (user?.cv) {
        setCvFileName(user.cv);
        setCvUploaded(true);
      } else {
        setCvUrl(null);
        setCvFileName("No CV uploaded");
        setCvUploaded(false);
      }
    } finally {
      setIsCvLoading(false);
    }
  };
  
  // Handler functions
  const handleShowQRCode = () => setIsQRCodeVisible(true);
  const handleViewCV = () => viewCV(cvUrl);
  
  // Handlers for settings toggles
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  
  // Theme toggle: update the local state, trigger the animated transition and change the actual theme.
  const toggleTheme = () => {
    const newThemeDark = !themeDarkEnabled;
    setThemeDarkEnabled(newThemeDark);
    setTheme(newThemeDark ? 'dark' : 'light');
    themeProgress.value = withTiming(newThemeDark ? 1 : 0, { duration: 500 });
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <ThemedView className="flex-1 p-4">
          {isLoading ? (
            <ActivityIndicator size="large" color="#297fff" className="mt-10" />
          ) : (
            <>
              <ProfileHeader 
                userData={userData} 
                onShowQRCode={handleShowQRCode} 
              />
              
              <PersonalInfo 
                userData={userData} 
                emailVerified={!!user?.email_verified_at} 
              />
              
              <WorkshopsList workshops={sampleWorkshops} />
              
              <CVSection 
                isLoading={isCvLoading}
                cvUploaded={cvUploaded}
                cvFileName={cvFileName}
                cvUrl={cvUrl}
                onViewCV={handleViewCV}
                isDark={isDark}
              />
  
              {/* Settings Section */}
              <ThemedView className="p-4 mt-8 rounded-xl border border-gray-300 dark:border-gray-700">
                <ThemedText type="subtitle" className="mb-4">
                  Settings
                </ThemedText>
  
                {/* Notifications Toggle */}
                <View className="flex-row items-center justify-between mb-4">
                  <ThemedText className="text-base">
                    Notifications
                  </ThemedText>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={toggleNotifications}
                    trackColor={{ false: "#767577", true: "#297fff" }}
                    thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                  />
                </View>
  
                {/* Theme Toggle with Sun & Moon Animation */}
                <View className="flex-row items-center justify-between">
                  <ThemedText className="text-base">
                    Dark Theme
                  </ThemedText>
                  <View className="relative flex-row items-center">
                    <Animated.View style={[sunStyle]} className="mr-2">
                      <Ionicons name="sunny" size={24} color={themeDarkEnabled ? "#f4f3f4" : "#297fff"} />
                    </Animated.View>
                    <Animated.View style={[moonStyle, { position: 'absolute', left: 0 }]}>
                      <Ionicons name="moon" size={24} color={themeDarkEnabled ? "#297fff" : "#f4f3f4"} />
                    </Animated.View>
                    <Switch
                      value={themeDarkEnabled}
                      onValueChange={toggleTheme}
                      trackColor={{ false: "#767577", true: "#297fff" }}
                      thumbColor={themeDarkEnabled ? "#f4f3f4" : "#f4f3f4"}
                    />
                  </View>
                </View>
               
              </ThemedView>
  
              <TouchableOpacity 
                className="py-4 rounded-lg border border-red-600 items-center mt-5 mb-20"
                onPress={signOut}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#EB4D3D" />
                ) : (
                  <ThemedText className="text-red-600 font-semibold">
                    Sign Out
                  </ThemedText>
                )}
              </TouchableOpacity>

            </>
          )}
        </ThemedView>
      </ScrollView>
      
      <QRCodePopup
        visible={isQRCodeVisible}
        onClose={() => setIsQRCodeVisible(false)}
        title="My Conference Badge"
      />
    </SafeAreaView>
  );
}
