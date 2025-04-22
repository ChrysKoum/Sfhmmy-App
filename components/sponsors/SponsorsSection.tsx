import React from 'react';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { sponsorsData } from '@/data/SponsorsData';

const levelColors: Record<string, string> = {
  Diamond: '#38bdf8', // sky-400
  Platinum: '#e5e4e2',
  Gold: '#f59e42',
  Silver: '#a3a3a3',
};

const levels = ['Diamond', 'Platinum', 'Gold', 'Silver'];

export function SponsorsSection() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  return (
    <ThemedView className="py-10">
      <ThemedText type="title" className="text-center mb-8">
        Our Sponsors
      </ThemedText>
      {levels.map((level) => {
        const levelSponsors = sponsorsData.filter((s) => s.level === level);
        if (levelSponsors.length === 0) return null;
        return (
          <View key={level} className="mb-10">
            <ThemedText
              className="text-2xl font-bold mb-4 text-center"
              style={{ color: levelColors[level] || (isDark ? '#fff' : '#222') }}
            >
              {level.toUpperCase()} SPONSORS
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 24, paddingHorizontal: 8 }}>
              {levelSponsors.map((sponsor) => (
                <TouchableOpacity
                  key={sponsor.slug}
                  onPress={() => router.push({ pathname: '/sponsor/[id]', params: { id: sponsor.slug } })}
                  className="h-32 w-32 mx-2 bg-white dark:bg-black rounded-xl shadow items-center justify-center"
                  activeOpacity={0.8}
                >
                  <Image
                    source={sponsor.image}
                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      })}
    </ThemedView>
  );
}