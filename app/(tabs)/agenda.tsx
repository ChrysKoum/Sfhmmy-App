import React, { FC, useState, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DateTime } from 'luxon';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { eventsData } from '@/data/agendaData';

interface EventItem {
  day: string;
  time: string;
  name: string;
  place: string;
  room: string;
  type: string;
}

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

  const [activeDay, setActiveDay] = useState<string>(days[0]?.id || '');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'now' | 'next'>('all');

  // Map Greek day names to ISO dates
  const dayToDate: Record<string, string> = {
    'Παρασκευή': '2025-04-25',
    'Σάββατο': '2025-04-26',
    'Κυριακή': '2025-04-27',
  };

  // Get today's date in Athens
  const todayAthens = DateTime.now().setZone('Europe/Athens').toISODate();

  // Check if the active day is today
  const isActiveDayToday =
    dayToDate[activeDay] && dayToDate[activeDay] === todayAthens;

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

  // Get unique places for the current day
  const places = useMemo(() => {
    if (!activeDay) return [];
    const events = agendaByDay[activeDay] || [];
    return Array.from(new Set(events.map(e => e.place)));
  }, [agendaByDay, activeDay]);

  // Get unique rooms for the selected place
  const rooms = useMemo(() => {
    if (!activeDay || !selectedPlace) return [];
    const events = agendaByDay[activeDay] || [];
    return Array.from(new Set(events.filter(e => e.place === selectedPlace).map(e => e.room)));
  }, [agendaByDay, activeDay, selectedPlace]);

  // Helper to parse event time (e.g., "09:00 AM - 10:00 AM")
  function parseEventTime(event: EventItem, day: string) {
    const [start, end] = event.time.split(' - ');
    const today = DateTime.now().setZone('Europe/Athens');
    const eventStart = DateTime.fromFormat(start.trim(), 'hh:mm a', { zone: 'Europe/Athens' }).set({
      year: today.year,
      month: today.month,
      day: today.day,
    });
    const eventEnd = DateTime.fromFormat(end.trim(), 'hh:mm a', { zone: 'Europe/Athens' }).set({
      year: today.year,
      month: today.month,
      day: today.day,
    });
    return { eventStart, eventEnd };
  }

  // Filtered events with time filter
  const filteredEvents = useMemo(() => {
    let events = agendaByDay[activeDay] || [];
    if (selectedPlace) {
      events = events.filter(e => e.place === selectedPlace);
    }
    if (selectedRoom) {
      events = events.filter(e => e.room === selectedRoom);
    }
    if (timeFilter !== 'all') {
      const now = DateTime.now().setZone('Europe/Athens');
      if (timeFilter === 'now') {
        events = events.filter(e => {
          const { eventStart, eventEnd } = parseEventTime(e, activeDay);
          return now >= eventStart && now <= eventEnd;
        });
      } else if (timeFilter === 'next') {
        const futureEvents = events
          .map(e => ({ ...e, ...parseEventTime(e, activeDay) }))
          .filter(e => e.eventStart > now)
          .sort((a, b) => a.eventStart.toMillis() - b.eventStart.toMillis());
        if (futureEvents.length > 0) {
          const nextStart = futureEvents[0].eventStart;
          events = futureEvents.filter(e => e.eventStart.equals(nextStart));
        } else {
          events = [];
        }
      }
    }
    return events;
  }, [agendaByDay, activeDay, selectedPlace, selectedRoom, timeFilter]);

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
                onPress={() => {
                  setActiveDay(day.id);
                  setSelectedPlace(null);
                  setSelectedRoom(null);
                }}
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

        {/* Filter Button */}
        <View className="flex-row justify-start mb-3">
          <TouchableOpacity
            className="px-4 py-2 bg-blue-500 rounded-lg"
            onPress={() => setFilterModalVisible(true)}
          >
            <ThemedText className="text-white font-semibold">Filter</ThemedText>
          </TouchableOpacity>
          
          {(selectedPlace || selectedRoom) && (
            <TouchableOpacity
              className={`ml-3 px-4 py-2 ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}
              onPress={() => {
                setSelectedPlace(null);
                setSelectedRoom(null);
              }}
            >
              <ThemedText className="text-white font-semibold">Clear</ThemedText>
            </TouchableOpacity>
          )}
          {/* Only show Now/Next if activeDay is today */}
          {isActiveDayToday && (
            <>
              <View style={{ width: 1, backgroundColor: isDark ? '#444' : '#ccc', marginLeft: 10 }} />
              <TouchableOpacity
                className={`ml-3 px-4 py-2 ${timeFilter === 'now' ? 'bg-green-600' : isDark ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}
                onPress={() => setTimeFilter(timeFilter === 'now' ? 'all' : 'now')}
              >
                <ThemedText className="text-white font-semibold">Now</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className={`ml-3 px-4 py-2 ${timeFilter === 'next' ? 'bg-yellow-600' : isDark ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}
                onPress={() => setTimeFilter(timeFilter === 'next' ? 'all' : 'next')}
              >
                <ThemedText className="text-white font-semibold">Next</ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Filter Modal */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}
            onPress={() => setFilterModalVisible(false)}
          >
            <Pressable
              style={{ width: '91.666667%', maxWidth: 400 }}
              onPress={e => e.stopPropagation()}
            >
              <View className={`${isDark ? 'bg-gray-900' : 'bg-white '} rounded-xl p-6`}>
                {/* Close Button */}
                <Pressable
                  onPress={() => setFilterModalVisible(false)}
                  style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
                  hitSlop={12}
                >
                  <View
                    className="w-10 h-10 rounded-full justify-center items-center shadow"
                    style={{
                      backgroundColor: isDark ? '#33383d' : '#e5e7eb',
                    }}
                  >
                    <ThemedText
                      className="text-xl font-bold"
                      style={{
                        color: isDark ? '#fff' : '#222',
                      }}
                    >
                      ×
                    </ThemedText>
                  </View>
                </Pressable>
                <ThemedText type="subtitle" className="mb-4 text-center">Filter by Place</ThemedText>
                {places.length === 0 && (
                  <ThemedText className="text-center mb-4">No places available for this day.</ThemedText>
                )}
                {places.map(place => (
                  <Pressable
                    key={place}
                    className={`py-2 px-4 rounded-lg mb-2 ${selectedPlace === place ? 'bg-blue-500' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                    onPress={() => {
                      setSelectedPlace(place);
                      setSelectedRoom(null);
                    }}
                  >
                    <ThemedText className={`text-base ${selectedPlace === place ? 'text-white' : ''}`}>{place}</ThemedText>
                  </Pressable>
                ))}
                {selectedPlace && (
                  <>
                    <ThemedText type="subtitle" className="mt-4 mb-2 text-center">Filter by Room</ThemedText>
                    {rooms.length === 0 && (
                      <ThemedText className="text-center mb-4">No rooms available for this place.</ThemedText>
                    )}
                    {rooms.map(room => (
                      <Pressable
                        key={room}
                        className={`py-2 px-4 rounded-lg mb-2 ${selectedRoom === room ? 'bg-blue-500' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                        onPress={() => setSelectedRoom(room)}
                      >
                        <ThemedText className={`text-base ${selectedRoom === room ? 'text-white' : ''}`}>{room}</ThemedText>
                      </Pressable>
                    ))}
                  </>
                )}
                <View className="flex-row justify-between mt-6">
                  <TouchableOpacity
                    className="px-4 py-2 bg-gray-400 rounded-lg"
                    onPress={() => {
                      setSelectedPlace(null);
                      setSelectedRoom(null);
                    }}
                  >
                    <ThemedText className="text-white font-semibold">Clear</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-4 py-2 bg-blue-500 rounded-lg"
                    onPress={() => setFilterModalVisible(false)}
                  >
                    <ThemedText className="text-white font-semibold">Apply</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Agenda list */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          showsVerticalScrollIndicator={false}
        >
          {activeDay &&
            (() => {
              let lastPlace: string | null = null;
              return filteredEvents.map((item, index) => {
                const eventColor = getEventColor(item.type);
                const showPlaceTitle = item.place !== lastPlace;
                lastPlace = item.place;
                return (
                  <React.Fragment key={`${item.name}-${index}`}>
                    {showPlaceTitle && (
                      <ThemedText className={`text-lg font-bold mt-6 mb-3 ${isDark ? "text-blue-600" : "text-blue-300"}`}>
                        {item.place}
                      </ThemedText>
                    )}
                    <ThemedView
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
                  </React.Fragment>
                );
              });
            })()
          }
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