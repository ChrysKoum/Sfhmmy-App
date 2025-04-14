import React from 'react';
import { Image, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Footer from '@/components/index/Footer';
import { useColorScheme } from '@/hooks/useColorScheme';
import { topics } from '@/data/indexData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1">
      <ScrollView 
        className="flex-1 mt-10" 
        contentContainerStyle={{ paddingBottom: 80 }} // Add bottom padding to prevent content hiding
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <ThemedView className="p-6 items-center justify-center">
          {/* Check if image is loading correctly */}
          <View className="w-48 h-48 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center overflow-hidden">
            <Image 
              source={require('@/assets/images/logo/sfhmmy_logo_dark.png')} 
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          
          <ThemedText type="title" className="text-center mb-2">ΣΦΗΜΜΥ 16</ThemedText>
          
          <ThemedText className="text-center mb-4 px-5 text-base">
            16ο Συνέδριο Φοιτητών Ηλεκτρολόγων Μηχανικών και Μηχανικών Υπολογιστών
          </ThemedText>
          
          <ThemedText className="text-center mb-6 text-sm leading-5 opacity-80">
            Φέτος, το ΣΦΗΜΜΥ θα διεξαχθεί στη Θεσσαλονίκη, το τριήμερο 25 με 27 Απριλίου, 
            συγκεντρώνοντας φοιτητές, ακαδημαϊκούς και επαγγελματίες σε ένα περιβάλλον 
            γνώσης, καινοτομίας και networking!
          </ThemedText>
          
        </ThemedView>
        
        {/* Conference Visual */}
        <View className="h-[200px] w-full mb-8 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          <Image 
            source={require('@/assets/images/conference.jpg')} 
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30 justify-center items-center">
            <ThemedText className="text-white text-2xl font-bold">Conference Visual</ThemedText>
          </View>
        </View>
        
        {/* About Section */}
        <ThemedView className="p-6 mb-4">
          {/* <ThemedText type="subtitle" className="mb-4 text-blue-500">Σχετικά</ThemedText> */}
          
          <ThemedText type="title" className="mb-4">
            Τι είναι το ΣΦΗΜΜΥ;
          </ThemedText>
          
          <ThemedText className="text-sm leading-5 mb-4">
            Το ΣΦΗΜΜΥ (Συνέδριο Φοιτητών Ηλεκτρολόγων Μηχανικών και Μηχανικών Υπολογιστών) 
            είναι το μεγαλύτερο φοιτητικό συνέδριο του κλάδου στην Ελλάδα. Διοργανώνεται κάθε 
            χρόνο από φοιτητές για φοιτητές, με στόχο τη διάδοση της γνώσης, την ανταλλαγή ιδεών 
            και τη δικτύωση των συμμετεχόντων.
          </ThemedText>
          
          <ThemedText className="text-sm leading-5 mb-4">
            Ξεκίνησε το 2007 στην Αθήνα και, από τότε, έχει εξελιχθεί σε έναν σημαντικό θεσμό που 
            εδώ και πάνω από 15 χρόνια φέρνει κοντά φοιτητές, ακαδημαϊκούς και επαγγελματίες του χώρου.
          </ThemedText>
        </ThemedView>
        
        {/* Topics Section */}
        <ThemedView className="p-6">
          <ThemedText type="title" className="text-center mb-6">Θέματα Συνεδρίου</ThemedText>
          
          <View className="flex-row flex-wrap justify-between items-stretch">
            {topics && topics.length > 0 ? (
              topics.map((topic, index) => (
                <ThemedView 
                  key={index} 
                  className="w-[48%] p-3 rounded-lg border border-gray-300 dark:border-gray-700 mb-4 min-h-[120px]"
                >
                  <ThemedText className="text-sm font-semibold mb-2">{topic.title}</ThemedText>
                  <ThemedText className="text-xs leading-4 opacity-70">{topic.description}</ThemedText>
                </ThemedView>
              ))
            ) : (
              // Provide fallback content if topics array is empty or undefined
              <ThemedText className="text-center w-full py-4">
                Τα θέματα θα ανακοινωθούν σύντομα
              </ThemedText>
            )}
          </View>
        </ThemedView>
        
        {/* Footer */}
        <Footer/>
      </ScrollView>
    </SafeAreaView>
  );
}