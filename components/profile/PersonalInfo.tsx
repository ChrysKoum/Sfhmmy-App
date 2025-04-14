import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface PersonalInfoProps {
  userData: {
    name: string;
    email: string;
    university: string;
    school: string;
    city: string;
    year: string;
  };
  emailVerified?: boolean;
}

export function PersonalInfo({ userData, emailVerified }: PersonalInfoProps) {
  return (
    <ThemedView className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <ThemedText type="subtitle" className="mb-4">Personal Information</ThemedText>
      
      <InfoField label="Full Name" value={userData.name} />
      <InfoField 
        label="Email" 
        value={userData.email} 
        verified={emailVerified}
      />
      <InfoField label="University" value={userData.university} />
      <InfoField label="School" value={userData.school} />
      <InfoField label="City" value={userData.city} />
      <InfoField label="Year of Study" value={userData.year} />
    </ThemedView>
  );
}

interface InfoFieldProps {
  label: string;
  value: string;
  verified?: boolean;
}

function InfoField({ label, value, verified }: InfoFieldProps) {
  return (
    <ThemedView className="mb-4">
      <ThemedView className="flex-row justify-between items-center mb-1">
        <ThemedText className="text-sm opacity-70">{label}</ThemedText>
      </ThemedView>
      
      <ThemedText className="text-base font-medium">
        {value}
        {verified && (
          <ThemedText className="text-sm italic opacity-60"> (verified)</ThemedText>
        )}
      </ThemedText>
    </ThemedView>
  );
}