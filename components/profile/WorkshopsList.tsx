import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface WorkshopsListProps {
  workshops: string[];
}

export function WorkshopsList({ workshops }: WorkshopsListProps) {
  return (
    <ThemedView className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <ThemedView className="flex-row justify-between items-center mb-4">
        <ThemedText type="subtitle" className="mb-4">Registered Workshops</ThemedText>
      </ThemedView>
      
      {workshops.length > 0 ? (
        workshops.map((workshop, index) => (
          <ThemedView 
            key={index} 
            className="flex-row items-center py-2.5 px-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 mb-2"
          >
            <IconSymbol 
              name="chevron.left.forwardslash.chevron.right" 
              size={16} 
              color={'#297fff'} 
              style={{marginRight: 8}} 
            />
            <ThemedText className="flex-1 text-base">{workshop}</ThemedText>
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