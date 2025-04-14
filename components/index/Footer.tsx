import React from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from '@/hooks/useColorScheme';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Helper function to open external links
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className={`py-6 ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
      <View className="mx-auto px-6">
        <View className="flex flex-col items-center justify-center">
          {/* Logo and Social Media */}
          <View className="flex flex-col items-center">
            {/* Logo that changes based on theme */}
            <Image
              source={
                isDark
                  ? require("@/assets/images/logo/sfhmmy_logo_white.png")
                  : require("@/assets/images/logo/sfhmmy_logo_dark.png")
              }
              className="w-48 h-48"
              resizeMode="contain"
            />

            {/* "Υπό την αιγίδα" text and sponsor logos arranged vertically */}
            <View className="items-center">
              <Text className={`text-2xl mb-2 text-center font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                Υπό την αιγίδα
              </Text>
              <View className="flex-col items-center">
                {/* Sponsor logos */}
                <Image
                  source={require("@/assets/images/footer/thmmy.png")}
                  className="w-60 h-20 my-1"
                  resizeMode="contain"
                />
                {/* Wrap the auth.png Image in a View to apply conditional background */}
                <View className={`my-1 p-2 rounded ${!isDark ? 'bg-gray-800' : ''}`}>
                  <Image
                    source={require("@/assets/images/footer/auth.png")}
                    className="w-60 h-20"
                    resizeMode="contain"
                  />
                </View>
                <Image
                  source={require("@/assets/images/footer/macedonia.jpg")}
                  className="w-60 h-20 my-1"
                  resizeMode="contain"
                  style={{
                    borderRadius: 4 // Slight border radius for the image
                  }}
                />
              </View>
            </View>

            {/* Social Media Icons */}
            <View className="flex-row mt-4 space-x-4">
              <TouchableOpacity onPress={() => openLink("https://www.facebook.com/sfhmmy/?locale=el_GR")}>
                <Image
                  source={require("@/assets/images/socials/facebook.png")}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink("https://www.instagram.com/sfhmmy/?hl=el")}>
                <Image
                  source={require("@/assets/images/socials/instagram.png")}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink("https://gr.linkedin.com/company/ecescon")}>
                <Image
                  source={require("@/assets/images/socials/linkedin.png")}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink("https://www.youtube.com/@ecescon")}>
                <Image
                  source={require("@/assets/images/socials/youtube.png")}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Divider with theme-dependent color */}
        <View className={`h-px ${isDark ? 'bg-gray-800' : 'bg-gray-300'} w-full my-6`} />

        {/* Privacy Policy Link */}
        <TouchableOpacity onPress={() => openLink("https://drive.google.com/file/d/1mHXEyWWt3NIpDnhvcAUwqMR8Xq_eDJv5/view")}>
          <Text className="text-blue-500 underline text-center">
            Πολιτική απορρήτου
          </Text>
        </TouchableOpacity>

        {/* Copyright with theme-dependent color */}
        <Text className={`mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
          Copyright © {currentYear} ΣΦΗΜΜΥ16. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Footer;