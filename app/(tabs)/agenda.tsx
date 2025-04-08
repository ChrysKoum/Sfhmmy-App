import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AgendaScreen() {
  const [activeDay, setActiveDay] = useState('day1');

  const days = [
    { id: 'day1', label: 'Day 1', date: 'June 10, 2024' },
    { id: 'day2', label: 'Day 2', date: 'June 11, 2024' },
    { id: 'day3', label: 'Day 3', date: 'June 12, 2024' },
  ];

  const agendaData = {
    day1: [
      { time: '09:00 - 10:00', title: 'Registration', type: 'general' },
      { time: '10:00 - 11:30', title: 'Opening Ceremony', type: 'general' },
      { time: '11:30 - 12:30', title: 'Industry Keynote', type: 'keynote' },
      { time: '12:30 - 14:00', title: 'Lunch Break', type: 'break' },
      { time: '14:00 - 15:30', title: 'Technical Sessions (Track A)', type: 'session' },
      { time: '15:30 - 16:00', title: 'Coffee Break', type: 'break' },
      { time: '16:00 - 17:30', title: 'Panel Discussion', type: 'panel' },
      { time: '19:00 - 21:00', title: 'Welcome Reception', type: 'social' },
    ],
    day2: [
      { time: '09:30 - 10:30', title: 'Academic Keynote', type: 'keynote' },
      { time: '10:30 - 12:00', title: 'Technical Sessions (Track B)', type: 'session' },
      { time: '12:00 - 13:30', title: 'Lunch Break', type: 'break' },
      { time: '13:30 - 15:00', title: 'Poster Sessions', type: 'session' },
      { time: '15:00 - 15:30', title: 'Coffee Break', type: 'break' },
      { time: '15:30 - 17:00', title: 'Workshops', type: 'workshop' },
      { time: 'Free Evening', title: 'Explore the City', type: 'social' },
    ],
    day3: [
      { time: '09:30 - 11:00', title: 'Technical Sessions (Track C)', type: 'session' },
      { time: '11:00 - 11:30', title: 'Coffee Break', type: 'break' },
      { time: '11:30 - 13:00', title: 'Industry Showcase', type: 'showcase' },
      { time: '13:00 - 14:30', title: 'Lunch Break', type: 'break' },
      { time: '14:30 - 16:00', title: 'Closing Ceremony', type: 'general' },
      { time: '16:00 - 17:30', title: 'Farewell Networking', type: 'social' },
    ]
  };

  const getEventColor = (type: string) => {
    switch(type) {
      case 'keynote': return '#E53935';
      case 'session': return '#43A047';
      case 'break': return '#1E88E5';
      case 'workshop': return '#FB8C00';
      case 'panel': return '#8E24AA';
      case 'social': return '#00ACC1';
      case 'showcase': return '#FFB300';
      default: return '#757575';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Conference Agenda</ThemedText>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
        {days.map((day) => (
          <TouchableOpacity 
            key={day.id}
            style={[
              styles.dayTab, 
              activeDay === day.id && styles.activeDay
            ]}
            onPress={() => setActiveDay(day.id)}
          >
            <ThemedText 
              style={[
                styles.dayText, 
                activeDay === day.id && styles.activeDayText
              ]}
            >
              {day.label}
            </ThemedText>
            <ThemedText 
              style={[
                styles.dateText, 
                activeDay === day.id && styles.activeDayText
              ]}
            >
              {day.date}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView style={styles.agendaScroll}>
        {agendaData[activeDay as keyof typeof agendaData].map((item, index) => (
          <ThemedView 
            key={index} 
            style={[
              styles.agendaItem, 
              { borderLeftColor: getEventColor(item.type) }
            ]}
          >
            <ThemedText style={styles.agendaTime}>{item.time}</ThemedText>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedView 
              style={[
                styles.eventType, 
                { backgroundColor: getEventColor(item.type) }
              ]}
            >
              <ThemedText style={styles.eventTypeText}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    marginTop: 50,
  },
  daysScroll: {
    maxHeight: 70,
    marginBottom: 20,
  },
  dayTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeDay: {
    backgroundColor: '#0a7ea4',
  },
  dayText: {
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  activeDayText: {
    color: 'white',
  },
  agendaScroll: {
    flex: 1,
  },
  agendaItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  agendaTime: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  eventType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  eventTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  }
});