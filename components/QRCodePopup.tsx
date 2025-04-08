import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Dimensions, Animated } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

interface QRCodePopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  qrData: string;
}

export function QRCodePopup({ visible, onClose, title, qrData }: QRCodePopupProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Animation for modal appearance
  const [animation] = React.useState(new Animated.Value(0));
  
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);
  
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView 
        tint={isDark ? 'dark' : 'light'}
        intensity={20} 
        style={styles.modalOverlay}
      >
        <TouchableOpacity 
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} 
          activeOpacity={1} 
          onPress={onClose}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: isDark ? '#1c1c1e' : 'white',
                opacity: animation,
                transform: [
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <View style={styles.closeButtonCircle}>
                <ThemedText style={{ fontSize: 16 }}>✕</ThemedText>
              </View>
            </TouchableOpacity>
            
            <ThemedText type="title" style={styles.title}>{title}</ThemedText>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={qrData}
                size={250}
                color="#000"
                backgroundColor="#fff"
                logoBackgroundColor="#fff"
              />
            </View>
            
            <ThemedText style={styles.description}>
              Present this QR code at the registration desk and workshop sessions
            </ThemedText>
            
            <ThemedText style={styles.ticketId}>
              Ticket ID: {qrData}
            </ThemedText>
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    right: -20,
    zIndex: 1,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    marginTop: 10,
    marginBottom: 24,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  ticketId: {
    fontWeight: '500',
  },
});