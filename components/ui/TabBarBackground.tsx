import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

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
