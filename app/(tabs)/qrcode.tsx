import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';

export default function QRCodeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { getQrCodeData } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { width } = Dimensions.get('window');

  useEffect(() => {
    fetchQrCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <View
          style={{
            width: width * 0.85,
            maxWidth: 400,
            borderRadius: 20,
            backgroundColor: isDark ? '#1c1c1e' : '#fff',
            padding: 24,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <ThemedText type="title" className="mb-6 text-center">
            My Conference Badge
          </ThemedText>
          <View
            style={{
              backgroundColor: isDark ? '#f3f4f6' : '#f3f4f6',
              borderRadius: 24,
              padding: 16,
              margin: 8,
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
                  backgroundColor: '#fff',
                }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('@/assets/images/logo/sfhmmy_logo_white.png')}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 16,
                  backgroundColor: '#fff',
                }}
                resizeMode="contain"
              />
            )}
          </View>
          <ThemedText className="text-center mt-4 opacity-70">
            Present this QR code at the registration desk and workshop sessions
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}