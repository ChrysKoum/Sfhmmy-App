import React from 'react';
import { Modal, Pressable, View, Dimensions, Animated, Image, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';

interface QRCodePopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
}

export function QRCodePopup({ visible, onClose, title }: QRCodePopupProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { getQrCodeData } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  
  // Animation for modal appearance
  const [animation] = React.useState(new Animated.Value(0));
  
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Fetch QR code from API when modal is visible
    if (visible) {
      fetchQrCode();
    }
  }, [visible]);

  const fetchQrCode = async () => {
    setLoading(true);
    try {
      const qrUrl = await getQrCodeData();
      if (qrUrl) {
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      console.error('Error loading QR code:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const { width } = Dimensions.get('window');
  
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
        className="flex-1 justify-center items-center"
      >
        <Pressable 
          className="flex-1 justify-center items-center" 
          onPress={onClose}
        >
          <Animated.View 
            style={[
              {
                width: width * 0.85,
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
            className="p-6 rounded-xl items-center shadow-md"
          >
            <Pressable 
              className="absolute top-[-20] right-[-20] z-10" 
              onPress={onClose}
            >
              <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center shadow">
                <ThemedText className="text-base">✕</ThemedText>
              </View>
            </Pressable>
            
            <ThemedText type="title" className="mt-2.5 mb-6">{title}</ThemedText>
            
            <View className="w-[250px] h-[250px] p-4 bg-white rounded-xl mb-6 shadow justify-center items-center">
              {loading ? (
                <ActivityIndicator size="large" color="#297fff" />
              ) : qrCodeUrl ? (
                <Image 
                  source={{ uri: qrCodeUrl }} 
                  className="w-[250px] h-[250px]"
                  resizeMode="contain"
                />
              ) : (
                <QRCode
                  size={250}
                  color="#000"
                  backgroundColor="#fff"
                  logoBackgroundColor="#fff"
                />
              )}
            </View>
            
            <ThemedText className="text-center mb-4 opacity-70">
              Present this QR code at the registration desk and workshop sessions
            </ThemedText>
          
          </Animated.View>
        </Pressable>
      </BlurView>
    </Modal>
  );
}