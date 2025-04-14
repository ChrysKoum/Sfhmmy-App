import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { days, agendaData, getEventColor } from '@/data/agendaData';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AgendaScreen() {
  const [activeDay, setActiveDay] = useState('day1');
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Calculate bottom padding to avoid content being hidden by tab bar
  const bottomPadding = 80 + (insets.bottom || 0);

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1 px-4">
        <ThemedText type="title" className="mb-5 mt-8">
          Conference Agenda
        </ThemedText>

        {/* Full-width day selector */}
        <View className="flex-row w-full justify-between mb-5">
          {days.map((day) => {
            const isActive = activeDay === day.id;
            
            return (
              <TouchableOpacity
                key={day.id}
                onPress={() => setActiveDay(day.id)}
                className={`flex-1 mx-1 px-5 py-3 rounded-lg items-center ${
                  isActive
                    ? 'bg-blue-500'
                    : isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}
                accessibilityLabel={`${day.label} tab, ${day.date}`}
                accessibilityState={{ selected: isActive }}
              >
                <ThemedText
                  className={`font-semibold ${isActive ? 'text-white' : ''}`}
                >
                  {day.label}
                </ThemedText>
                <ThemedText
                  className={`text-xs mt-1 ${isActive ? 'text-white' : ''}`}
                >
                  {day.date}
                </ThemedText>
                
                {/* Active indicator line */}
                {isActive && (
                  <View className="h-1 w-12 bg-white rounded-full absolute -bottom-1" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Agenda items with proper bottom padding */}
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          showsVerticalScrollIndicator={false}
        >
          {agendaData[activeDay].map((item, index) => {
            // Get the event color
            const eventColor = getEventColor(item.type);
            
            return (
              <ThemedView
                key={index}
                className="p-4 mb-3 rounded-lg border-l-4 shadow-sm"
                style={{ borderLeftColor: eventColor }}
              >
                <ThemedText className="text-sm opacity-70 mb-2">
                  {item.time}
                </ThemedText>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedView
                  className="self-start px-2.5 py-1 rounded mt-2"
                  style={{ backgroundColor: eventColor }}
                >
                  <ThemedText 
                    className="text-white text-xs font-semibold"
                    style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', 
                             textShadowOffset: {width: 0, height: 1}, 
                             textShadowRadius: 2 }}
                  >
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            );
          })}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}