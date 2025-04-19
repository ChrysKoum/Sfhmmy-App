import React, { FC, useState, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { eventsData } from '@/data/agendaData';

// Define the shape of an event
interface EventItem {
  day: string;
  time: string;
  name: string;
  place: string;
  room: string;
  type: string;
}

// Define the shape for days
interface DayType {
  id: string;
  label: string;
}

const AgendaScreen: FC = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Derive unique days from eventsData
  const days: DayType[] = useMemo(() => {
    const uniqueDays = Array.from(new Set(eventsData.map((e: EventItem) => e.day)));
    return uniqueDays.map(day => ({ id: day, label: day }));
  }, []);

  // State for currently active day
  const [activeDay, setActiveDay] = useState<string>(days[0]?.id || '');

  // Initialize activeDay once days are loaded
  useEffect(() => {
    if (!activeDay && days.length > 0) {
      setActiveDay(days[0].id);
    }
  }, [days, activeDay]);

  // Group events by day
  const agendaByDay: Record<string, EventItem[]> = useMemo(() => {
    return days.reduce((acc, { id }) => {
      acc[id] = eventsData.filter((e: EventItem) => e.day === id);
      return acc;
    }, {} as Record<string, EventItem[]>);
  }, [days]);

  // Bottom padding for content
  const bottomPadding = 80 + (insets.bottom || 0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView className="flex-1 px-4">
        <ThemedText type="title" className="mt-8 mb-5">
          Πρόγραμμα Συνέδριου
        </ThemedText>

        {/* Day selector */}
        <View className="flex-row justify-between mb-5">
          {days.map(day => {
            const isActive = activeDay === day.id;
            return (
              <TouchableOpacity
                key={day.id}
                onPress={() => setActiveDay(day.id)}
                style={{ flex: 1, marginHorizontal: 4 }}
                className={`px-5 py-3 rounded-lg items-center ${
                  isActive
                    ? 'bg-blue-500'
                    : isDark
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
                }`}
                accessibilityLabel={`${day.label} tab`}
                accessibilityState={{ selected: isActive }}
              >
                <ThemedText
                  className={`font-semibold ${isActive ? 'text-white' : ''}`}
                >
                  {day.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Agenda list */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          showsVerticalScrollIndicator={false}
        >
          {activeDay &&
            agendaByDay[activeDay]?.map((item, index) => {
              const eventColor = getEventColor(item.type);
              return (
                <ThemedView
                  key={`${item.name}-${index}`}
                  className="p-4 mb-3 rounded-lg border-l-4 shadow-sm"
                  style={{ borderLeftColor: eventColor }}
                >
                  <ThemedText className="text-sm opacity-70 mb-2">
                    {item.time}
                  </ThemedText>
                  <ThemedText type="defaultSemiBold">
                    {item.name}
                  </ThemedText>
                  <ThemedText className="text-xs mt-1 opacity-80">
                    {item.place} — {item.room}
                  </ThemedText>
                  <View
                    className="self-start px-2.5 py-1 rounded mt-2"
                    style={{ backgroundColor: eventColor }}
                  >
                    <ThemedText
                      className="text-white text-xs font-semibold"
                    >
                      {item.type}
                    </ThemedText>
                  </View>
                </ThemedView>
              );
            })}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
};

// Helper to get a color based on event type
function getEventColor(type: string): string {
  switch (type) {
    case 'Registration':
      return '#4CAF50';
    case 'Opening Ceremony':
      return '#2196F3';
    case 'Speech':
      return '#FF9800';
    case 'Break':
      return '#9C27B0';
    case 'Quiz':
      return '#F44336';
    case 'Workshop Registration':
      return '#795548';
    case 'Workshop':
      return '#3F51B5';
    case 'Paper Presentation':
      return '#009688';
    case 'Company Talk':
      return '#00BCD4';
    case 'Panel':
      return '#CDDC39';
    case 'Hackathon':
      return '#E91E63';
    case 'Ceremony':
      return '#673AB7';
    case 'Συνεντύξεις':
      return '#607D8B';
    default:
      return '#9E9E9E';
  }
}

export default AgendaScreen;
