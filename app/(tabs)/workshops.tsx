import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { workshopsData } from '@/data/workshopsData';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function WorkshopsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState('day1');
  const [activeStatus, setActiveStatus] = useState<'all' | 'waiting' | 'register' | 'checkin'>('all');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const days = [
    { id: 'day1', label: 'Day 1', date: 'April 25' },
    { id: 'day2', label: 'Day 2', date: 'April 26' },
    { id: 'day3', label: 'Day 3', date: 'April 27' },
  ];
  
  // Top row status filters: All & Waiting List
  const topStatusFilters = [
    { id: 'all', label: 'All' },
    { id: 'waiting', label: 'Waiting List' },
  ];

  // Bottom row status filters: Registered & Check In
  const bottomStatusFilters = [
    { id: 'registered', label: 'Registered' },
    { id: 'checkin', label: 'Check In' },
  ];

  // Helper to extract start time from a string like "10:00 - 12:30"
  const getStartTime = (timeStr: string): number => {
    const [start] = timeStr.split(' - ');
    const [hours, minutes] = start.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // First filter by day, then by status (if not 'all'), and finally sort by start time.
  const filteredWorkshops = workshopsData
    .filter(workshop => workshop.day === activeDay)
    .filter(workshop => activeStatus === 'all' || workshop.status === activeStatus)
    .sort((a, b) => getStartTime(a.time) - getStartTime(b.time));

  const renderWorkshopItem = ({ item }: { item: typeof workshopsData[0] }) => {
    const isExpanded = expandedId === item.id;

    return (
      <ThemedView className="p-4 rounded-xl mb-4 border border-gray-300 dark:border-gray-700">
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <ThemedText type="subtitle">{item.title}</ThemedText>
          <ThemedText className="mt-1.5 mb-3 italic">
            Presented by: {item.presenter}
          </ThemedText>

          <ThemedView className="flex-row justify-between mb-2">
            <ThemedText className="text-sm">⏰ {item.time}</ThemedText>
            <ThemedText className="text-sm">📍 {item.location}</ThemedText>
          </ThemedView>

          <ThemedText className="mb-2.5">Capacity: {item.capacity}</ThemedText>

          {isExpanded && (
            <View className="mt-2.5 p-2.5 bg-blue-50/20 dark:bg-blue-900/10 rounded-lg">
              <ThemedText className="font-semibold mb-1 mt-2.5">
                About this workshop:
              </ThemedText>
              <ThemedText className="leading-5">{item.description}</ThemedText>

              <ThemedText className="font-semibold mb-1 mt-2.5">
                Prerequisites:
              </ThemedText>
              <ThemedText className="leading-5">{item.prerequisites}</ThemedText>
            </View>
          )}

          <ThemedText className="text-blue-600 dark:text-blue-400 my-2.5 text-center">
            {isExpanded ? 'Show less' : 'Show more details...'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity className="bg-blue-600 py-2.5 px-4 rounded-lg items-center mt-2.5">
          <ThemedText className="text-white font-semibold">Register</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1 p-4 mb-12">
        <ThemedText type="title" className="mb-2.5 mt-2.5">
          Workshops
        </ThemedText>
        <ThemedText className="mb-5 opacity-70">
          Explore and register for hands-on workshops led by industry experts
        </ThemedText>

        {/* Day selection */}
        <View className="flex-row w-full justify-between mb-5">
          {days.map(day => (
            <TouchableOpacity
              key={day.id}
              onPress={() => setActiveDay(day.id)}
              className={`flex-1 mx-1 px-5 py-3 rounded-lg items-center ${
                activeDay === day.id
                  ? 'bg-blue-500'
                  : isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <ThemedText className={`font-semibold ${activeDay === day.id ? 'text-white' : ''}`}>
                {day.label}
              </ThemedText>
              <ThemedText className={`text-xs mt-1 ${activeDay === day.id ? 'text-white' : ''}`}>
                {day.date}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status filter: Two Rows */}
        <View className="mb-5">
          {/* Top row: All & Waiting List */}
          <View className="flex-row w-full justify-between mb-2">
            {topStatusFilters.map(filter => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveStatus(filter.id as 'all' | 'waiting' | 'register' | 'checkin')}
                className={`flex-1 mx-1 px-5 py-3 rounded-lg items-center ${
                  activeStatus === filter.id
                    ? 'bg-blue-500'
                    : isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <ThemedText className={`font-semibold ${activeStatus === filter.id ? 'text-white' : ''}`}>
                  {filter.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          {/* Bottom row: Registered & Check In */}
          <View className="flex-row w-full justify-between">
            {bottomStatusFilters.map(filter => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveStatus(filter.id as 'all' | 'waiting' | 'register' | 'checkin')}
                className={`flex-1 mx-1 px-5 py-3 rounded-lg items-center ${
                  activeStatus === filter.id
                    ? 'bg-blue-500'
                    : isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <ThemedText className={`font-semibold ${activeStatus === filter.id ? 'text-white' : ''}`}>
                  {filter.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Workshops list */}
        <FlatList
          data={filteredWorkshops}
          renderItem={renderWorkshopItem}
          keyExtractor={item => item.id}
          contentContainerClassName="pb-5"
        />
      </ThemedView>
    </SafeAreaView>
  );
}
