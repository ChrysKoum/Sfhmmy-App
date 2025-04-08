import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  
  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        tint={colorScheme === 'dark' ? 'dark' : 'light'} 
        intensity={80} 
        style={StyleSheet.absoluteFill}
      />
    );
  }
  
  return (
    <View 
      style={[
        StyleSheet.absoluteFill, 
        { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f2f2f7' }
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}