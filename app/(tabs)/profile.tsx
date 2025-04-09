import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  ActivityIndicator,
  TextInput,
  Alert,
  View as RNView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

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
  const { user, token, signOut, isLoading, refreshUserProfile } = useAuth();
  const [qrCodeData, setQrCodeData] = useState("");
  
  // Personal Information Edit States
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  
  // CV States
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvFileName, setCvFileName] = useState("No CV uploaded");
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  
  // Workshop States
  const [isEditingWorkshops, setIsEditingWorkshops] = useState(false);
  
  // Mock workshop data - in a real app, this would come from your API
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
  console.log("User data:", user);
  // User data from API or fallback to dummy data
  const userData = user ? {
    name: user.name,
    role: user.role || "Attendee",
    university: user.university || "University not specified",
    email: user.email,
    ticketId: `SFHMMY-2023-${user.id}`,
    city: "Thessaloniki",
    school: "School of Electrical and Computer Engineering",
    year: "4"
  } : {
    name: "Guest User",
    role: "Guest",
    university: "Not logged in",
    email: "guest@example.com",
    ticketId: "Not available",
    city: "Unknown",
    school: "Unknown",
    year: "Unknown"
  };

  const handleShowQRCode = async () => {
    setIsQRCodeVisible(true);
  };

  // Handle field editing
  const handleEdit = (field: string) => {
    if (field === 'email') {
      Alert.alert("Cannot Edit", "Email cannot be edited.");
      return;
    }
    setEditField(field);
    setEditValue(userData[field as keyof typeof userData] as string);
  };

  const handleCancelEdit = () => {
    setEditField(null);
    setEditValue("");
  };

  const handleSaveEdit = async (field: string) => {
    // In a real app, you would call your API here
    Alert.alert("Success", `${field} updated successfully!`);
    setEditField(null);
  };
  
  // CV Upload Handlers
  const handleCVUpload = async () => {
    try {
      setIsUploadingCV(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Check file size (max 5MB)
        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert("File Too Large", "Please select a file smaller than 5MB");
          return;
        }
        
        // In a real app, you would upload the file to your server here
        setCvUploaded(true);
        setCvFileName(file.name);
        Alert.alert("Success", "CV uploaded successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload CV. Please try again.");
      console.error("CV upload error:", error);
    } finally {
      setIsUploadingCV(false);
    }
  };
  
  const handleRemoveCV = () => {
    Alert.alert(
      "Remove CV",
      "Are you sure you want to remove your CV?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            // In a real app, you would call your API here
            setCvUploaded(false);
            setCvFileName("No CV uploaded");
            Alert.alert("Success", "CV removed successfully!");
          }
        }
      ]
    );
  };
  
  // Workshop Management
  const handleRemoveWorkshop = (index: number) => {
    const updatedWorkshops = [...workshops];
    updatedWorkshops.splice(index, 1);
    setWorkshops(updatedWorkshops);
    Alert.alert("Success", "Workshop removed successfully!");
  };
  
  // Render functions for different sections
  const renderPersonalInformation = () => {
    return (
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Personal Information</ThemedText>
        
        {renderEditableField('name', 'Full Name', userData.name)}
        {renderEditableField('email', 'Email', userData.email, false)}
        {renderEditableField('university', 'University', userData.university)}
        {renderEditableField('school', 'School', userData.school)}
        {renderEditableField('city', 'City', userData.city)}
        {renderEditableField('year', 'Year of Study', userData.year)}
      </ThemedView>
    );
  };
  
  const renderEditableField = (field: string, label: string, value: string, editable: boolean = true) => {
    const isEditing = editField === field;
    
    return (
      <ThemedView style={styles.fieldContainer}>
        <ThemedView style={styles.fieldHeader}>
          <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
          {editable && !isEditing && (
            <TouchableOpacity
              onPress={() => handleEdit(field)}
              style={styles.editButton}
            >
              <IconSymbol name="chevron.left.forwardslash.chevron.right" size={16} color={colorScheme === 'dark' ? 'white' : 'black'} />
            </TouchableOpacity>
          )}
          
          {isEditing && (
            <ThemedView style={styles.editActions}>
              <TouchableOpacity
                onPress={() => handleSaveEdit(field)}
                style={[styles.actionButton, styles.saveButton]}
              >
                <ThemedText style={styles.actionButtonText}>Save</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={[styles.actionButton, styles.cancelButton]}
              >
                <ThemedText style={styles.actionButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>
        
        {isEditing ? (
          <TextInput
            value={editValue}
            onChangeText={setEditValue}
            style={styles.editInput}
            autoFocus
            selectionColor={'#0a7ea4'}
          />
        ) : (
          <ThemedText style={styles.fieldValue}>
            {value}
            {field === 'email' && (
              <ThemedText style={styles.verifiedBadge}> (verified)</ThemedText>
            )}
          </ThemedText>
        )}
      </ThemedView>
    );
  };
  
  const renderWorkshops = () => {
    return (
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Registered Workshops</ThemedText>
          
          {workshops.length > 0 && (
            <TouchableOpacity
              onPress={() => setIsEditingWorkshops(!isEditingWorkshops)}
              style={[styles.actionButton, isEditingWorkshops ? styles.saveButton : styles.editModeButton]}
            >
              <ThemedText style={styles.actionButtonText}>
                {isEditingWorkshops ? 'Done' : 'Edit'}
              </ThemedText>
            </TouchableOpacity>
          )}
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
              
              {isEditingWorkshops && (
                <TouchableOpacity
                  onPress={() => handleRemoveWorkshop(index)}
                  style={styles.removeButton}
                >
                  <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
                </TouchableOpacity>
              )}
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
        <ThemedText type="subtitle" style={styles.sectionTitle}>CV / Resume Management</ThemedText>
        
        <ThemedView style={styles.cvContainer}>
          {cvUploaded ? (
            <ThemedView style={styles.uploadedCvContainer}>
              <RNView style={styles.cvFileInfo}>
                <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={'#EB4D3D'} style={styles.cvIcon} />
                <ThemedText style={styles.cvFileName}>{cvFileName}</ThemedText>
              </RNView>
              
              <RNView style={styles.cvActions}>
                <TouchableOpacity
                  style={[styles.cvButton, styles.viewButton]}
                  onPress={() => Alert.alert("View CV", "CV viewing would open here in a real app")}
                >
                  <ThemedText style={styles.cvButtonText}>View</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.cvButton, styles.removeButton]}
                  onPress={handleRemoveCV}
                >
                  <ThemedText style={styles.cvButtonText}>Remove</ThemedText>
                </TouchableOpacity>
              </RNView>
            </ThemedView>
          ) : (
            <ThemedView style={styles.cvUploadContainer}>
              <IconSymbol name="chevron.left.forwardslash.chevron.right" size={36} color={colorScheme === 'dark' ? '#444' : '#ddd'} />
              <ThemedText style={styles.cvUploadTitle}>No CV uploaded yet</ThemedText>
              <ThemedText style={styles.cvUploadSubtitle}>PDF format, max 5MB</ThemedText>
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleCVUpload}
                disabled={isUploadingCV}
              >
                {isUploadingCV ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <ThemedText style={styles.uploadButtonText}>Upload CV</ThemedText>
                )}
              </TouchableOpacity>
            </ThemedView>
          )}
          
          <ThemedText style={styles.cvInfoText}>
            Your CV will be shared with sponsors for potential job opportunities at the event.
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
              
              {/* Settings Section */}
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
  editButton: {
    padding: 4,
  },
  editActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  editModeButton: {
    backgroundColor: '#0a7ea4',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 16,
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
  removeButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginLeft: 10,
  },
  viewButton: {
    backgroundColor: '#0a7ea4',
  },
  cvButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  cvUploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  cvUploadTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  cvUploadSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: '600',
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
    marginBottom: 40,
  },
  signOutText: {
    color: '#EB4D3D',
    fontWeight: '600',
  }
});