import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  View as RNView,
  Linking,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { QRCodePopup } from '@/components/QRCodePopup';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';

// API URL - Update with your actual Laravel API URL
const API_URL = 'http://192.168.1.4:8000/api';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const { user, token, signOut, isLoading, refreshUserProfile } = useAuth();
  
  // CV States
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvFileName, setCvFileName] = useState("No CV uploaded");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isCvLoading, setIsCvLoading] = useState(false);
  
  // Workshop States - In a real app, this would come from your API
  const [workshops, setWorkshops] = useState([
    "Introduction to Machine Learning", 
    "Web3 Development",
    "IoT Prototyping"
  ]);

  // Fetch user data when component mounts
  useEffect(() => {
    if (!user) {
      refreshUserProfile();
    }
  }, []);

  // Fetch CV data when component mounts
  useEffect(() => {
    fetchCV();
  }, [user]);

  const fetchCV = async () => {
    if (!token) return;
    
    setIsCvLoading(true);
    try {
      const response = await fetch(`${API_URL}/cv`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      const result = await response.json();
      console.log("CV result:", result);
      
      if (result && typeof result === 'object' && result.exists === true) {
        // CV exists and we got back valid data
        setCvUrl(result.url);
        setCvFileName(result.filename || "My CV");
        setCvUploaded(true);
      } else {
        // Check if user has CV field in user object
        if (user && user.cv) {
          setCvFileName(user.cv);
          setCvUploaded(true);
        } else {
          // No CV found
          setCvUrl(null);
          setCvFileName("No CV uploaded");
          setCvUploaded(false);
        }
      }
    } catch (error) {
      console.error('Unexpected error loading CV:', error);
      Alert.alert("Error", "Could not load CV. Please try again later.");
      
      // Check if user has CV field in user object as fallback
      if (user && user.cv) {
        setCvFileName(user.cv);
        setCvUploaded(true);
      } else {
        setCvFileName("Error loading CV");
        setCvUploaded(false);
      }
    } finally {
      setIsCvLoading(false);
    }
  };

  const handleViewCV = () => {
    if (cvUrl) {
      // Open the CV URL
      Linking.openURL(cvUrl).catch(err => {
        console.error("Error opening CV URL:", err);
        Alert.alert("Error", "Cannot open CV preview");
      });
    } else if (user && user.cv) {
      // If we have the CV name but no URL, maybe there's a way to view it
      Alert.alert("Info", "CV exists but direct viewing is not available in this version.");
    } else {
      Alert.alert("Info", "No CV available to view");
    }
  };

  // User data from API or fallback to dummy data
  const userData = user ? {
    name: user.name,
    role: user.role || "Attendee",
    university: user.university || "Not specified",
    email: user.email,
    ticketId: `SFHMMY-${user.user_id?.substring(0, 8) || '00000000'}`,
    city: user.city || "Not specified",
    school: user.school || "Not specified",
    year: user.year?.toString() || "Not specified",
    cv: user.cv || null
  } : {
    name: "Guest User",
    role: "Guest",
    university: "Not logged in",
    email: "guest@example.com",
    ticketId: "Not available",
    city: "Unknown",
    school: "Unknown",
    year: "Unknown",
    cv: null
  };

  const handleShowQRCode = () => {
    setIsQRCodeVisible(true);
  };
  
  // Render functions for different sections
  const renderPersonalInformation = () => {
    return (
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Personal Information</ThemedText>
        
        {renderField('name', 'Full Name', userData.name)}
        {renderField('email', 'Email', userData.email)}
        {renderField('university', 'University', userData.university)}
        {renderField('school', 'School', userData.school)}
        {renderField('city', 'City', userData.city)}
        {renderField('year', 'Year of Study', userData.year)}
      </ThemedView>
    );
  };
  
  const renderField = (field: string, label: string, value: string) => {
    return (
      <ThemedView style={styles.fieldContainer}>
        <ThemedView style={styles.fieldHeader}>
          <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
        </ThemedView>
        
        <ThemedText style={styles.fieldValue}>
          {value}
          {field === 'email' && user?.email_verified_at && (
            <ThemedText style={styles.verifiedBadge}> (verified)</ThemedText>
          )}
        </ThemedText>
      </ThemedView>
    );
  };
  
  const renderWorkshops = () => {
    return (
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Registered Workshops</ThemedText>
        </ThemedView>
        
        {workshops.length > 0 ? (
          workshops.map((workshop, index) => (
            <ThemedView key={index} style={styles.workshopItem}>
              <IconSymbol 
                name="chevron.left.forwardslash.chevron.right" 
                size={16} 
                color={'#0a7ea4'} 
                style={styles.workshopIcon} 
              />
              <ThemedText style={styles.workshopTitle}>{workshop}</ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText style={styles.emptyStateText}>
            You haven't registered for any workshops yet.
          </ThemedText>
        )}
      </ThemedView>
    );
  };
  
  const renderCV = () => {
    return (
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>CV / Resume</ThemedText>
        
        <ThemedView style={styles.cvContainer}>
          {isCvLoading ? (
            <ActivityIndicator size="large" color="#0a7ea4" style={styles.cvLoading} />
          ) : cvUploaded ? (
            <ThemedView style={styles.uploadedCvContainer}>
              <RNView style={styles.cvFileInfo}>
                <IconSymbol 
                  name="chevron.left.forwardslash.chevron.right" 
                  size={24} 
                  color={'#EB4D3D'} 
                  style={styles.cvIcon} 
                />
                <ThemedText style={styles.cvFileName}>{cvFileName}</ThemedText>
              </RNView>
              
              {cvUrl && (
                <RNView style={styles.cvActions}>
                  <TouchableOpacity
                    style={[styles.cvButton, styles.viewButton]}
                    onPress={handleViewCV}
                  >
                    <ThemedText style={styles.cvButtonText}>View</ThemedText>
                  </TouchableOpacity>
                </RNView>
              )}
            </ThemedView>
          ) : (
            <ThemedView style={styles.noCvContainer}>
              <IconSymbol 
                name="chevron.left.forwardslash.chevron.right" 
                size={36} 
                color={colorScheme === 'dark' ? '#444' : '#ddd'} 
              />
              <ThemedText style={styles.noCvText}>No CV uploaded</ThemedText>
            </ThemedView>
          )}
          
          <ThemedText style={styles.cvInfoText}>
            Your CV can be shared with sponsors for potential job opportunities at the event.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <ThemedView style={styles.container}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0a7ea4" style={{marginTop: 40}} />
          ) : (
            <>
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
                  onPress={handleShowQRCode}
                >
                  <IconSymbol name="qrcode" size={20} color="white" />
                  <ThemedText style={styles.badgeButtonText}>Show My Badge</ThemedText>
                </TouchableOpacity>
              </ThemedView>
              
              {/* Personal Information Section */}
              {renderPersonalInformation()}
              
              {/* Workshops Section */}
              {renderWorkshops()}
              
              {/* CV Section */}
              {renderCV()}
              
              
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
            </>
          )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  verifiedBadge: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.6,
  },
  workshopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    marginBottom: 8,
  },
  workshopIcon: {
    marginRight: 8,
  },
  workshopTitle: {
    flex: 1,
    fontSize: 16,
  },
  emptyStateText: {
    fontStyle: 'italic',
    opacity: 0.7,
    textAlign: 'center',
    marginVertical: 20,
  },
  cvContainer: {
    marginTop: 8,
  },
  cvLoading: {
    marginVertical: 30,
  },
  uploadedCvContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cvFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cvIcon: {
    marginRight: 10,
  },
  cvFileName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  cvActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cvButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  viewButton: {
    backgroundColor: '#0a7ea4',
  },
  cvButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  noCvContainer: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
  },
  noCvText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
  },
  cvInfoText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  signOutButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 80,
  },
  signOutText: {
    color: '#EB4D3D',
    fontWeight: '600',
  }
});