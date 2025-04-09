import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, Pressable, Image, Keyboard, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/hooks/useAuth';

export default function SignInScreen() {
  const [email, setEmail] = useState('chyrkoum@gmail.com');
  const [password, setPassword] = useState('12345678');
  const { signIn, isLoading, error } = useAuth();

  const handleSignIn = () => {
    Keyboard.dismiss();
    signIn(email, password);
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{flex: 1}}>
      <ThemedView className="flex-1 p-6 justify-center">
        <ThemedView className="items-center mb-12">
          <Image 
            source={require('@/assets/images/sfhmmy_logo_dark.png')} 
            className="h-56 w-56"
            resizeMode="contain"
          />
          <ThemedText type="title" className="text-center">SFHMMY Conference</ThemedText>
          <ThemedText className="text-center mt-2">Sign in to access the conference app</ThemedText>
        </ThemedView>
        
        {error && (
          <ThemedView className="bg-red-100 dark:bg-red-900 p-3 rounded-lg mb-4">
            <ThemedText className="text-red-700 dark:text-red-100 text-center">{error}</ThemedText>
          </ThemedView>
        )}
        
        <ThemedView className="space-y-4 mb-8">
          <TextInput
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
            placeholderTextColor="#9BA1A6"
          />
          
          <TextInput
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
            placeholderTextColor="#9BA1A6"
          />
        </ThemedView>
        
        <Pressable 
          className={`rounded-lg py-4 ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
          onPress={handleSignIn}
          disabled={isLoading}
          style={{alignItems: 'center'}}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText className="text-white text-center font-semibold">Sign In</ThemedText>
          )}
        </Pressable>
        
        <ThemedView className="flex-row justify-center mt-6">
          <ThemedText>Don't have an account? </ThemedText>
          <Link href="/register">
            <ThemedText className="text-blue-500">Register</ThemedText>
          </Link>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}