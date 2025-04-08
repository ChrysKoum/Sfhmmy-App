import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { QRCodePopup } from '@/components/QRCodePopup';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const { token, signOut, isLoading } = useAuth();
  
  // User data (would come from API/authentication in a real app)
  const userData = {
    name: "John Doe",
    role: "Student",
    university: "Athens University of Technology",
    email: "john.doe@example.com",
    ticketId: token || "SFHMMY-2023-12345"
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.header}>
            <Image 
              source={require('@/assets/images/icon.png')}
              style={styles.avatar}
            />
            <ThemedText type="title">{userData.name}</ThemedText>
            <ThemedText style={styles.roleText}>{userData.role}</ThemedText>
            <ThemedText style={styles.universityText}>{userData.university}</ThemedText>
            
            <TouchableOpacity 
              style={styles.badgeButton}
              onPress={() => setIsQRCodeVisible(true)}
            >
              <IconSymbol name="qrcode" size={20} color="white" />
              <ThemedText style={styles.badgeButtonText}>Show My Badge</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Personal Information</ThemedText>
            
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Email</ThemedText>
              <ThemedText>{userData.email}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Ticket ID</ThemedText>
              <ThemedText>{userData.ticketId}</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Settings</ThemedText>
            
            <ThemedView style={styles.settingItem}>
              <ThemedText>Push Notifications</ThemedText>
              <Switch 
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#767577", true: "#0a7ea4" }}
              />
            </ThemedView>
            
            <ThemedView style={styles.settingItem}>
              <ThemedText>Dark Mode</ThemedText>
              <Switch 
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#767577", true: "#0a7ea4" }}
              />
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>My Conference</ThemedText>
            
            <Link href="/(tabs)/agenda" asChild>
              <TouchableOpacity style={styles.menuItem}>
                <ThemedView style={styles.menuItemContent}>
                  <IconSymbol name="list.bullet" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                  <ThemedText>My Agenda</ThemedText>
                </ThemedView>
                <IconSymbol name="chevron.right" size={16} color="#9BA1A6" />
              </TouchableOpacity>
            </Link>
            
            <Link href="/(tabs)/workshops" asChild>
              <TouchableOpacity style={styles.menuItem}>
                <ThemedView style={styles.menuItemContent}>
                  <IconSymbol name="person.2.fill" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                  <ThemedText>My Workshops</ThemedText>
                </ThemedView>
                <IconSymbol name="chevron.right" size={16} color="#9BA1A6" />
              </TouchableOpacity>
            </Link>
          </ThemedView>
          
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={signOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#EB4D3D" />
            ) : (
              <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
      
      {/* QR Code Popup */}
      <QRCodePopup
        visible={isQRCodeVisible}
        onClose={() => setIsQRCodeVisible(false)}
        title="My Conference Badge"
        qrData={userData.ticketId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  roleText: {
    opacity: 0.7,
    marginTop: 4,
  },
  universityText: {
    opacity: 0.7,
    marginBottom: 16,
  },
  badgeButton: {
    backgroundColor: '#0a7ea4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  badgeButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    paddingBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 10,
  },
  infoLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  signOutButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signOutText: {
    color: '#EB4D3D',
    fontWeight: '600',
  },
});