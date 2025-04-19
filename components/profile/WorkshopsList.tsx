import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeContext } from '@/hooks/useThemeContext';
import { getUserWorkshops } from '@/services/workshopService';

interface Workshop {
  workshop_id: number;
  title: string;
  description?: string;
  date?: string;
  hour?: string;
  availability?: number;
  image_url?: string;
  max_participants?: number;
  created_at?: string;
  updated_at?: string;
  end_time?: string;
  pivot?: any;
}

export function WorkshopsList() {
  const { isDark } = useThemeContext();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWorkshops = async () => {
      try {
        const data: Workshop[] = await getUserWorkshops();
        if (isMounted) setWorkshops(data);
      } catch (error) {
        // Optionally show a toast or error message
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchWorkshops();
    return () => { isMounted = false; };
  }, []);

  return (
    <ThemedView className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <ThemedText type="subtitle" className="mb-4">Registered Workshops</ThemedText>
      {isLoading ? (
        <ActivityIndicator color="#297fff" className="my-4" />
      ) : workshops.length > 0 ? (
        workshops.map((workshop) => (
          <ThemedView
            key={workshop.workshop_id}
            className={`flex-row items-center py-2.5 px-2 rounded-lg mb-2 ${isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-100'}`}
          >
            <ThemedText className={`flex-1 text-base ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              {workshop.title}
            </ThemedText>
          </ThemedView>
        ))
      ) : (
        <ThemedText className="italic opacity-70 text-center py-5">
          You haven't registered for any workshops yet.
        </ThemedText>
      )}
    </ThemedView>
  );
}