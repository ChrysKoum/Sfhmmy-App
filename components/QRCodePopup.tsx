import React from 'react';
import { Modal, Pressable, View, Dimensions, Image, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from '@/components/ThemedText';
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

  const { width } = Dimensions.get('window');

  React.useEffect(() => {
    if (visible) {
      fetchQrCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const fetchQrCode = async () => {
    setLoading(true);
    try {
      const qrUrl = await getQrCodeData();
      if (qrUrl) {
        setQrCodeUrl(qrUrl);
      } else {
        setQrCodeUrl(null);
      }
    } catch (error) {
      setQrCodeUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            width: width * 0.85,
            maxWidth: 400,
            borderRadius: 20,
            backgroundColor: isDark ? '#1c1c1e' : '#fff',
            padding: 24,
            alignItems: 'center',
            position: 'relative',
          }}
          onPress={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <Pressable
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
            }}
            hitSlop={12}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isDark ? '#33383d' : '#e5e7eb',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <ThemedText
                style={{
                  color: isDark ? '#fff' : '#222',
                  fontSize: 22,
                  fontWeight: 'bold',
                }}
              >
                ×
              </ThemedText>
            </View>
          </Pressable>

          <ThemedText type="title" className="mt-2.5 mb-6">{title}</ThemedText>

          <View
            style={{
              backgroundColor: isDark ? '#f3f4f6' : '#f3f4f6',
              borderRadius: 24,
              padding: 16,
              margin: 8,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#297fff" />
            ) : qrCodeUrl ? (
              <Image
                source={{ uri: qrCodeUrl }}
                style={{
                  width: 210,
                  height: 210,
                  borderRadius: 16,
                  backgroundColor: '#fff',
                }}
                resizeMode="contain"
              />
            ) : (
              <QRCode
                size={210}
                color="#000"
                backgroundColor="#fff"
                logoBackgroundColor="#fff"
                value="No QR code"
              />
            )}
          </View>

          <ThemedText className="text-center mb-4 opacity-70">
            Present this QR code at the registration desk and workshop sessions
          </ThemedText>
        </Pressable>
      </Pressable>
    </Modal>
  );
}