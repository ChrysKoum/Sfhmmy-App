import React from 'react';
import { ActivityIndicator, TouchableOpacity, View as RNView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface CVSectionProps {
  isLoading: boolean;
  cvUploaded: boolean;
  cvFileName: string;
  cvUrl: string | null;
  onViewCV: () => void;
  isDark?: boolean;
}

export function CVSection({ 
  isLoading, 
  cvUploaded, 
  cvFileName, 
  cvUrl,
  onViewCV,
  isDark
}: CVSectionProps) {
  return (
    <ThemedView className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <ThemedText type="subtitle" className="mb-4">CV / Resume</ThemedText>
      
      <ThemedView className="mt-2">
        {isLoading ? (
          <ActivityIndicator 
            size="large" 
            color="#297fff" 
            className="my-7.5" 
          />
        ) : cvUploaded ? (
          <ThemedView className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3">
            <RNView className="flex-row items-center mb-2.5">
              <IconSymbol 
                name="chevron.left.forwardslash.chevron.right" 
                size={24} 
                color={'#EB4D3D'} 
                style={{marginRight: 10}} 
              />
              <ThemedText className="text-base font-medium flex-1">{cvFileName}</ThemedText>
            </RNView>
            
            {cvUrl && (
              <RNView className="flex-row justify-end">
                <TouchableOpacity
                  className="bg-blue-500 px-4 py-1.5 rounded"
                  onPress={onViewCV}
                >
                  <ThemedText className="text-white font-semibold text-sm">View</ThemedText>
                </TouchableOpacity>
              </RNView>
            )}
          </ThemedView>
        ) : (
          <ThemedView className="items-center border border-gray-300 dark:border-gray-600 rounded-lg p-5 mb-3">
            <IconSymbol 
              name="chevron.left.forwardslash.chevron.right" 
              size={36} 
              color={isDark ? '#444' : '#ddd'} 
            />
            <ThemedText className="text-base font-medium mt-3 mb-2">No CV uploaded</ThemedText>
          </ThemedView>
        )}
        
        <ThemedText className="text-sm opacity-70 mt-2">
          Your CV can be shared with sponsors for potential job opportunities at the event.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}