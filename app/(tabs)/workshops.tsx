import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { workshopFetch } from '@/services/workshopService';
// Removed RenderHTML import as it's not needed on the list screen anymore
// import api from '@/services/api'; // Keep if BASE_IMAGE_URL logic depends on it, otherwise remove

interface Workshop {
  workshop_id: string;
  title: string;
  description: string; // Keep for potential future use or pass to details
  date: string;
  hour: string;
  end_time: string | null;
  availability: number;
  image_url: string;
  max_participants: number;
  created_at: string;
  updated_at: string;
}

const BASE_IMAGE_URL = 'http://192.168.10.160:8000/storage/';

export default function WorkshopsScreen() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter(); // Initialize router

  useEffect(() => {
    async function loadWorkshops() {
      setLoading(true); // Ensure loading is true at the start
      try {
        const data = await workshopFetch();
        setWorkshops(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load workshops:", error);
        setWorkshops([]);
      } finally {
        setLoading(false);
      }
    }
    loadWorkshops();
  }, []);

  const handlePressWorkshop = (workshopId: string) => {
    router.push(`/workshop/${workshopId}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100 dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? "#FFFFFF" : "#000000"} />
        <ThemedText className="mt-4 text-lg">Loading Workshops...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <ScrollView  className={`mb-16`} contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}>
        <ThemedText type="title" className="text-center mb-6 px-4">Available Workshops</ThemedText>
        {workshops && workshops.length > 0 ? (
          // Use flex-wrap for a grid-like layout if desired, or keep as a list
          <View className="flex-row flex-wrap justify-between">
            {workshops.map((workshop) => (
              <TouchableOpacity
                key={workshop.workshop_id}
                className={`w-[48%] mb-4 overflow-hidden rounded-xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                onPress={() => handlePressWorkshop(workshop.workshop_id)}
                activeOpacity={0.7}
              >
                {/* Image Section */}
                <View className="w-full aspect-square bg-gray-200 dark:bg-gray-700">
                  {workshop.image_url ? (
                    <Image
                      source={{ uri: `${BASE_IMAGE_URL}${workshop.image_url}` }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <ThemedText className="text-gray-500 text-xs">No Image</ThemedText>
                    </View>
                  )}
                </View>

                {/* Content Section (Minimal) */}
                <View className="p-3">
                  <ThemedText className="font-semibold text-sm mb-1" numberOfLines={2} ellipsizeMode="tail">
                    {workshop.title}
                  </ThemedText>
                  <ThemedText className="text-xs opacity-70 mb-1">
                    {new Date(workshop.date).toLocaleDateString('el-GR', { month: 'short', day: 'numeric' })}
                    {' @ '}
                    {workshop.hour.slice(0, 5)}
                  </ThemedText>
                  <ThemedText className={`text-xs font-bold ${workshop.availability <= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {workshop.availability > 0 ? `${workshop.availability} spots left` : 'Full'}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <ThemedView className="items-center justify-center py-10 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 mt-4">
            <ThemedText className="text-center text-gray-500 dark:text-gray-400">
              No workshops are currently available. Please check back later.
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}