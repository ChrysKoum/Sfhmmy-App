import { Tabs } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { QRCodePopup } from '@/components/QRCodePopup';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const insets = useSafeAreaInsets();

  // Create a ref to track if the component is mounted
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Custom tab bar using Tailwind (NativeWind) classes
  function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
      <View
        className="absolute bottom-0 left-0 right-0"
        style={{ paddingBottom: insets.bottom }}
      >
        <TabBarBackground />
        <View className="flex-row h-[60px] px-2.5 pt-5 items-center justify-around">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            // Skip the QR code route from the normal tab list, BUT ONLY if it exists
            if (route.name === 'qrcode') return null;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate({ name: route.name, merge: true } as any);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                className="flex-1 items-center justify-center h-full"
              >
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    color: isFocused
                      ? Colors[colorScheme ?? 'light'].tint
                      : Colors[colorScheme ?? 'light'].tabIconDefault,
                    size: 28,
                  })}
                <View className="mt-2 h-3 w-20">
                  {isFocused && (
                    <View
                      className="h-full w-full rounded-[2px]"
                      style={{
                        backgroundColor: Colors[colorScheme ?? 'light'].tint,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Special center QR button wrapped in its own container */}
        <View className="absolute bottom-[30px] left-0 right-0 items-center">
          <TouchableOpacity
            className="w-[56px] h-[56px] rounded-full justify-center items-center shadow-lg"
            style={{
              backgroundColor: Colors[colorScheme ?? 'light'].tint,
            }}
            onPress={() => {
              if (isMounted.current) {
                setIsQRCodeVisible(true);
              }
            }}
          >
            <IconSymbol size={28} name="qrcode" color="white" />
          </TouchableOpacity>
        </View>

        {/* QR Code Popup */}
        <QRCodePopup
          visible={isQRCodeVisible}
          onClose={() => {
            if (isMounted.current) {
              setIsQRCodeVisible(false);
            }
          }}
          title="My Conference Badge"
        />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      {/* Make sure this tab exists in your file structure */}
      <Tabs.Screen
        name="workshops"
        options={{
          title: 'Workshops',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}