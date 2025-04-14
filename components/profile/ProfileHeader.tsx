import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

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
      <Image 
        source={require('@/assets/images/icon.png')}
        className="w-48 h-48 rounded-full mb-4"
      />
      <ThemedText type="title">{userData.name}</ThemedText>
      <ThemedText className="opacity-70 mt-1">{userData.role}</ThemedText>
      <ThemedText className="opacity-70 mb-4">{userData.university}</ThemedText>
      
      {/* <TouchableOpacity 
        className="bg-blue-500 flex-row items-center py-2.5 px-4 rounded-full mt-2.5"
        onPress={onShowQRCode}
      >
        <IconSymbol name="qrcode" size={20} color="white" />
        <ThemedText className="text-white ml-2 font-semibold">Show My Badge</ThemedText>
      </TouchableOpacity> */}
    </ThemedView>
  );
}