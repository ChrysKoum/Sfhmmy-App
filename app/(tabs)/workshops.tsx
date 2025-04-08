import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Sample workshops data
const workshopsData = [
  { 
    id: '1', 
    title: 'Machine Learning Fundamentals', 
    presenter: 'Dr. Maria Johnson',
    time: '10:00 - 12:30',
    location: 'Workshop Room 1',
    capacity: '30 participants',
    description: 'This workshop introduces the fundamentals of machine learning algorithms and their practical applications. Participants will learn about supervised and unsupervised learning techniques through hands-on examples.',
    prerequisites: 'Basic programming knowledge, preferably in Python'
  },
  { 
    id: '2', 
    title: 'Web3 Development Bootcamp', 
    presenter: 'Alex Chen',
    time: '13:00 - 15:30',
    location: 'Workshop Room 2',
    capacity: '25 participants',
    description: 'Learn the basics of blockchain development, smart contracts, and decentralized applications (dApps). This hands-on workshop will guide you through creating your first smart contract on Ethereum.',
    prerequisites: 'JavaScript fundamentals, web development basics'
  },
  { 
    id: '3', 
    title: 'IoT Prototyping Workshop', 
    presenter: 'Sara Williams',
    time: '16:00 - 18:30',
    location: 'Lab A',
    capacity: '20 participants',
    description: 'Get started with Internet of Things prototyping using Arduino and Raspberry Pi. Build a simple IoT device that can collect and transmit data to the cloud.',
    prerequisites: 'Basic electronics knowledge helpful but not required'
  },
  { 
    id: '4', 
    title: 'Mobile App UI/UX Design', 
    presenter: 'James Rodriguez',
    time: '10:00 - 12:30',
    location: 'Design Studio',
    capacity: '25 participants',
    description: 'Learn essential principles of mobile app design and user experience. This workshop covers wireframing, prototyping, and user testing methods for creating intuitive mobile interfaces.',
    prerequisites: 'Interest in design, no technical skills required'
  },
  { 
    id: '5', 
    title: 'Cybersecurity Best Practices', 
    presenter: 'Michael Chen',
    time: '14:00 - 16:30',
    location: 'Workshop Room 3',
    capacity: '35 participants',
    description: 'Understand common cybersecurity threats and how to defend against them. This workshop covers security best practices, vulnerability assessment, and basic penetration testing techniques.',
    prerequisites: 'Basic networking knowledge helpful'
  },
];

export default function WorkshopsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderWorkshopItem = ({ item }: { item: typeof workshopsData[0] }) => {
    const isExpanded = expandedId === item.id;
    
    return (
      <ThemedView style={styles.workshopCard}>
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <ThemedText type="subtitle">{item.title}</ThemedText>
          <ThemedText style={styles.presenter}>Presented by: {item.presenter}</ThemedText>
          
          <ThemedView style={styles.detailsRow}>
            <ThemedText style={styles.detailText}>⏰ {item.time}</ThemedText>
            <ThemedText style={styles.detailText}>📍 {item.location}</ThemedText>
          </ThemedView>
          
          <ThemedText style={styles.capacity}>Capacity: {item.capacity}</ThemedText>
          
          {isExpanded && (
            <View style={styles.expandedContent}>
              <ThemedText style={styles.sectionTitle}>About this workshop:</ThemedText>
              <ThemedText style={styles.description}>{item.description}</ThemedText>
              
              <ThemedText style={styles.sectionTitle}>Prerequisites:</ThemedText>
              <ThemedText style={styles.description}>{item.prerequisites}</ThemedText>
            </View>
          )}
          
          <ThemedText style={styles.expandPrompt}>
            {isExpanded ? "Show less" : "Show more details..."}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.registerButton}>
          <ThemedText style={styles.registerButtonText}>Register</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.header}>Workshops</ThemedText>
        <ThemedText style={styles.subtitle}>
          Explore and register for hands-on workshops led by industry experts
        </ThemedText>
        
        <FlatList
          data={workshopsData}
          renderItem={renderWorkshopItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    marginBottom: 20,
    opacity: 0.7,
  },
  listContent: {
    paddingBottom: 20,
  },
  workshopCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  presenter: {
    marginTop: 6,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
  },
  capacity: {
    marginBottom: 10,
  },
  expandPrompt: {
    color: '#0a7ea4',
    marginVertical: 10,
    textAlign: 'center',
  },
  expandedContent: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
  },
  description: {
    lineHeight: 20,
  },
  registerButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});