import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Image, Linking } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { sponsorsData } from '@/data/SponsorsData';

export default function SponsorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sponsor = sponsorsData.find((s) => s.slug === id);

  if (!sponsor) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText type="title" className="text-red-600">Sponsor not found.</ThemedText>
      </ThemedView>
    );
  }

  const links = [sponsor.link, sponsor.link2, sponsor.link3].filter(Boolean);

  return (
    <ScrollView className="flex-1 bg-black px-4 pt-10">
      <View className="items-center mb-8">
        <Image
          source={sponsor.image}
          style={{ width: 120, height: 120, resizeMode: 'contain' }}
        />
        <ThemedText type="title" className="mt-4 text-white text-center">{sponsor.name}</ThemedText>
      </View>
      {sponsor.description_gr?.trim() ? (
        <>
          <ThemedText type="subtitle" className="text-white underline mb-2">Περιγραφή:</ThemedText>
          <ThemedText className="mb-8 text-white">{sponsor.description_gr}</ThemedText>
        </>
      ) : null}
      {links.length > 0 && (
        <>
          <ThemedText type="subtitle" className="text-white underline mb-4">Links:</ThemedText>
          <View className="mb-8">
            {links.map((url, idx) => (
              <ThemedText
                key={idx}
                className="text-blue-400 mb-2 underline"
                onPress={() => Linking.openURL(url)}
              >
                {url}
              </ThemedText>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}