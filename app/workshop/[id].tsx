import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Image, ScrollView, View, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHTML from 'react-native-render-html';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // For focus refresh

import { BASE_IMAGE_URL } from '@/constants/Config';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  workshopFetch, // Assuming this fetches ALL workshops
  workshopEnroll,
  workshopUnenroll,
  getUserWorkshops,
  joinWaitingList,
  leaveWaitingList,
  getUserWaitingList,
} from '@/services/workshopService';
import { useAuth } from '@/hooks/useAuth'; // To check if user is logged in

// Interface matching the one in workshops.tsx
interface Workshop {
  workshop_id: string;
  title: string;
  description: string;
  date: string;
  hour: string;
  end_time: string | null;
  availability: number;
  image_url: string;
  max_participants: number;
  created_at: string;
  updated_at: string;
}

export default function WorkshopDetailsScreen() {
  const { id: workshopId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth(); // Get user authentication status/details
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [spotsFilled, setSpotsFilled] = useState<number>(0);

  // Enrollment states
  const [registered, setRegistered] = useState<boolean>(false);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [unenrolling, setUnenrolling] = useState<boolean>(false);

  // Waiting-list states
  const [waitingListed, setWaitingListed] = useState<boolean>(false);
  const [joiningWait, setJoiningWait] = useState<boolean>(false);
  const [leavingWait, setLeavingWait] = useState<boolean>(false);

  const fetchWorkshopData = useCallback(async () => {
    if (!workshopId || !user) { // Ensure user is logged in before fetching user-specific data
        setLoading(false);
        // Optionally redirect to login or show message if user is not logged in
        if (!user) Alert.alert("Authentication Required", "Please log in to view workshop details and register.");
        return;
    }
    setLoading(true);
    try {
      // Fetch all workshops and user's status concurrently
      const [allWorkshops, userEnrollments, userWaitingList] = await Promise.all([
        workshopFetch(),
        getUserWorkshops(),
        getUserWaitingList(),
      ]);

      const workshopsArray = Array.isArray(allWorkshops) ? allWorkshops : [];
      const currentWorkshop = workshopsArray.find((w: Workshop) => w.workshop_id === workshopId) ?? null;

      setWorkshop(currentWorkshop);

      if (currentWorkshop) {
        const filled = currentWorkshop.max_participants - currentWorkshop.availability;
        setSpotsFilled(filled);

        // Check user's enrollment status
        const enrolledIds = (Array.isArray(userEnrollments) ? userEnrollments : []).map((e: any) => e.workshop_id);
        setRegistered(enrolledIds.includes(workshopId));

        // Check user's waiting list status
        const waitingIds = (Array.isArray(userWaitingList) ? userWaitingList : []).map((w: any) => w.workshop_id);
        // Keep waiting list status sticky unless explicitly left
        setWaitingListed((prev) => prev || waitingIds.includes(workshopId));
      } else {
        // Handle case where workshop is not found
        setRegistered(false);
        setWaitingListed(false);
      }
    } catch (err) {
      console.error("Error fetching workshop details:", err);
      Alert.alert("Error", "Could not load workshop details. Please try again.");
      // Reset state on error
      setWorkshop(null);
      setRegistered(false);
      setWaitingListed(false);
    } finally {
      setLoading(false);
    }
  }, [workshopId, user]); // Depend on user state

  // Initial fetch
  useEffect(() => {
    fetchWorkshopData();
  }, [fetchWorkshopData]);

  // Refetch when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchWorkshopData();
      // Optional: Set up interval polling like the web version if needed
      // const intervalId = setInterval(fetchWorkshopData, 30000);
      // return () => clearInterval(intervalId);
    }, [fetchWorkshopData])
  );

  const isFull = !!workshop && workshop.availability <= 0;

  // --- Action Handlers ---
  const handleRegister = async () => {
    if (!workshop || isFull || registered || enrolling || unenrolling || !user) return;
    setEnrolling(true);
    try {
      await workshopEnroll(workshop.workshop_id);
      await fetchWorkshopData(); // Refresh data
      Alert.alert("Success", "You have been registered for the workshop!");
    } catch (err: any) {
      console.error("Enrollment failed:", err);
      Alert.alert("Error", `Enrollment failed: ${err.message || 'Please try again.'}`);
    } finally {
      setEnrolling(false);
    }
  };

  const handleLeave = async () => {
    if (!workshop || !registered || enrolling || unenrolling || !user) return;
    setUnenrolling(true);
    try {
      await workshopUnenroll(workshop.workshop_id);
      setRegistered(false); // Optimistic update
      await fetchWorkshopData(); // Refresh data
      Alert.alert("Success", "You have unenrolled from the workshop.");
    } catch (err: any) {
      console.error("Unenrollment failed:", err);
      Alert.alert("Error", `Unenrollment failed: ${err.message || 'Please try again.'}`);
    } finally {
      setUnenrolling(false);
    }
  };

  const handleJoinWaiting = async () => {
    if (!workshop || !isFull || joiningWait || leavingWait || !user) return;
    setJoiningWait(true);
    try {
      await joinWaitingList(workshop.workshop_id);
      setWaitingListed(true); // Optimistic update
      await fetchWorkshopData(); // Refresh data
      Alert.alert("Success", "You have joined the waiting list.");
    } catch (err: any) {
      console.error("Join waiting list failed:", err);
      Alert.alert("Error", `Failed to join waiting list: ${err.message || 'Please try again.'}`);
    } finally {
      setJoiningWait(false);
    }
  };

  const handleLeaveWaiting = async () => {
    if (!workshop || !waitingListed || joiningWait || leavingWait || !user) return;
    setLeavingWait(true);
    try {
      await leaveWaitingList(workshop.workshop_id);
      setWaitingListed(false); // Optimistic update
      await fetchWorkshopData(); // Refresh data
      Alert.alert("Success", "You have left the waiting list.");
    } catch (err: any) {
      console.error("Leave waiting list failed:", err);
      Alert.alert("Error", `Failed to leave waiting list: ${err.message || 'Please try again.'}`);
    } finally {
      setLeavingWait(false);
    }
  };

  // --- Render Logic ---
  if (loading && !workshop) { // Show full screen loader only on initial load
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
        <ActivityIndicator size="large" color={isDark ? "#FFFFFF" : "#000000"} />
        <ThemedText className="mt-4 text-lg">Loading Workshop...</ThemedText>
      </SafeAreaView>
    );
  }

  if (!workshop) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <ThemedText className="text-lg text-red-500">Workshop not found.</ThemedText>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-2 bg-blue-500 rounded">
            <ThemedText className="text-white">Go Back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Define base text color for RenderHTML based on theme
  const baseTextColor = isDark ? '#D1D5DB' : '#374151';
  const strongTextColor = isDark ? '#F9FAFB' : '#1F2937';
  const linkColor = '#3b82f6';

  const renderActionButton = () => {
    if (!user) {
        return (
            <TouchableOpacity onPress={() => router.push('/sign-in')} className="bg-gray-500 py-3 px-6 rounded-lg items-center">
                <ThemedText className="text-white font-semibold">Log In to Register</ThemedText>
            </TouchableOpacity>
        );
    }
    if (registered) {
      return (
        <TouchableOpacity
          onPress={handleLeave}
          disabled={unenrolling || enrolling}
          className={`py-3 px-6 rounded-lg items-center ${unenrolling ? 'bg-gray-500' : 'bg-red-600'}`}
        >
          {unenrolling ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText className="text-white font-semibold">Leave Workshop</ThemedText>
          )}
        </TouchableOpacity>
      );
    } else if (isFull) {
      if (waitingListed) {
        return (
          <TouchableOpacity
            onPress={handleLeaveWaiting}
            disabled={leavingWait || joiningWait}
            className={`py-3 px-6 rounded-lg items-center ${leavingWait ? 'bg-gray-500' : 'bg-purple-600'}`}
          >
            {leavingWait ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText className="text-white font-semibold">Leave Waiting List</ThemedText>
            )}
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={handleJoinWaiting}
            disabled={joiningWait || leavingWait}
            className={`py-3 px-6 rounded-lg items-center ${joiningWait ? 'bg-gray-500' : 'bg-blue-600'}`}
          >
            {joiningWait ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText className="text-white font-semibold">Join Waiting List</ThemedText>
            )}
          </TouchableOpacity>
        );
      }
    } else { // Available and not registered
      return (
        <TouchableOpacity
          onPress={handleRegister}
          disabled={enrolling || unenrolling}
          className={`py-3 px-6 rounded-lg items-center ${enrolling ? 'bg-gray-500' : 'bg-green-600'}`}
        >
          {enrolling ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText className="text-white font-semibold">Register</ThemedText>
          )}
        </TouchableOpacity>
      );
    }
  };


  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
       <Stack.Screen options={{ title: workshop.title }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Image */}
        <View className={`w-full aspect-[16/9] ${isDark ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}>
          {workshop.image_url ? (
            <Image
              source={{ uri: `${BASE_IMAGE_URL}/images/${workshop.image_url}` }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <ThemedText className="text-gray-500">No Image</ThemedText>
            </View>
          )}
        </View>

        <View className="px-4">
          {/* Title */}
          <ThemedText type="title" className="mb-2 text-center">{workshop.title}</ThemedText>

          {/* Date & Time */}
          <View className="items-center mb-4 opacity-80">
            <ThemedText className="text-base">
              {new Date(workshop.date).toLocaleDateString('el-GR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </ThemedText>
            <ThemedText className="text-base">
              {workshop.hour.slice(0, 5)} - {workshop.end_time ? workshop.end_time.slice(0, 5) : "TBD"}
            </ThemedText>
          </View>

          {/* Availability */}
           <View className={`items-center mb-6 p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
             <ThemedText className="text-lg font-semibold">
               {spotsFilled} / {workshop.max_participants} spots filled
             </ThemedText>
             <ThemedText className={`text-sm font-bold ${workshop.availability <= 0 ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-green-400' : 'text-green-600')}`}>
               {workshop.availability > 0 ? `${workshop.availability} spots available` : 'Workshop Full'}
             </ThemedText>
           </View>

          {/* Action Button */}
          <View className="mb-6">
            {renderActionButton()}
          </View>

          {/* Description */}
          <ThemedText type="subtitle" className="mb-2">Details</ThemedText>
          <View className="mb-20">
            <RenderHTML
              contentWidth={width - 32} // Screen width - horizontal padding
              source={{ html: workshop.description }}
              tagsStyles={{
                 p: { color: baseTextColor, fontSize: 15, lineHeight: 22, marginBottom: 5 },
                 strong: { color: strongTextColor, fontWeight: 'bold' },
                 ul: { color: baseTextColor, marginVertical: 8, marginLeft: 10 },
                 li: { color: baseTextColor, fontSize: 15, lineHeight: 22, marginBottom: 6 },
                 a: { color: linkColor, textDecorationLine: 'underline' },
                 h1: { color: strongTextColor, fontSize: 24, marginBottom: 10 },
                 h2: { color: strongTextColor, fontSize: 20, marginBottom: 8 },
                 h3: { color: strongTextColor, fontSize: 18, marginBottom: 6 },
              }}
              baseStyle={{ color: baseTextColor }}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}