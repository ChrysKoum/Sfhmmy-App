import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, ScrollView, Switch, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { QRCodePopup } from '@/components/QRCodePopup';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PersonalInfo } from '@/components/profile/PersonalInfo';
import { WorkshopsList } from '@/components/profile/WorkshopsList'; // <-- use new component

import { useThemeContext } from '@/hooks/useThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { formatUserData } from '@/services/profileService';

interface ProfileHeaderProps {
  userData: {
    name: string;
    role: string;
    university: string;
  };
  onShowQRCode: () => void;
}

export function ProfileHeader({ userData, onShowQRCode }: ProfileHeaderProps) {
  return (
    <ThemedView className="items-center my-5">
      {userData.imageUrl ? (
        <Image
          source={{ uri: userData.imageUrl }}
          className="w-48 h-48 rounded-full mb-4"
        />
      ) : (
        <View className="w-48 h-48 rounded-full mb-4 bg-gray-200 items-center justify-center">
          <IconSymbol name="person.fill" size={80} color="#9ca3af" />
        </View>
      )}
      <ThemedText type="title">{userData.name}</ThemedText>
      <ThemedText className="opacity-70 mt-1">{userData.role}</ThemedText>
      <ThemedText className="opacity-70 mb-4">{userData.university}</ThemedText>
      {/* Optionally add QR code button here */}
    </ThemedView>
  );
}

export default function ProfileScreen() {
  const { isDark, theme, setTheme } = useThemeContext();
  const { user, signOut, isLoading, refreshUserProfile } = useAuth();

  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [themeDarkEnabled, setThemeDarkEnabled] = useState(isDark);

  const themeProgress = useSharedValue(themeDarkEnabled ? 1 : 0);

  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - themeProgress.value }],
    opacity: 1 - themeProgress.value,
  }));

  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: themeProgress.value }],
    opacity: themeProgress.value,
  }));

  const userData = formatUserData(user);

  useEffect(() => {
    if (!user) {
      refreshUserProfile();
    }
  }, []);

  useEffect(() => {
    setThemeDarkEnabled(isDark);
    themeProgress.value = withTiming(isDark ? 1 : 0, { duration: 500 });
  }, [isDark]);

  const handleShowQRCode = () => setIsQRCodeVisible(true);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
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
              <WorkshopsList /> {/* <-- Use new component here */}

              {/* Settings Section */}
              <ThemedView className="p-4 mt-8 rounded-xl border border-gray-300 dark:border-gray-700">
                <ThemedText type="subtitle" className="mb-4">
                  Settings
                </ThemedText>
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