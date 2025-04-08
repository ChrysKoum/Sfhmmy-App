import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Platform, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { QRCodePopup } from '@/components/QRCodePopup';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const insets = useSafeAreaInsets();

  // User data (would come from a context or store in a real app)
  const userData = {
    ticketId: "SFHMMY-2023-12345"
  };

  // Custom tab bar function
  function CustomTabBar({ state, descriptors, navigation }) {
    return (
      <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
        <TabBarBackground />
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.title || route.name;
            const isFocused = state.index === index;

            // Skip rendering the QR code tab in the normal flow
            if (route.name === 'qrcode') return null;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
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
                style={styles.tab}
              >
                {options.tabBarIcon && 
                  options.tabBarIcon({ 
                    color: isFocused 
                      ? Colors[colorScheme ?? 'light'].tint
                      : Colors[colorScheme ?? 'light'].tabIconDefault, 
                    size: 28 
                  })
                }
                <View style={styles.labelContainer}>
                  {isFocused && (
                    <View 
                      style={[
                        styles.focusIndicator, 
                        { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                      ]} 
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Special center QR button */}
          <TouchableOpacity 
            style={[
              styles.qrButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={() => setIsQRCodeVisible(true)}
          >
            <IconSymbol size={28} name="qrcode" color="white" />
          </TouchableOpacity>
        </View>

        {/* QR Code Popup */}
        <QRCodePopup
          visible={isQRCodeVisible}
          onClose={() => setIsQRCodeVisible(false)}
          title="My Conference Badge"
          qrData={userData.ticketId}
        />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      {/* Hidden QR screen - we'll handle it with our custom tab bar */}
      {/* <Tabs.Screen
        name="qrcode"
        options={{
          title: 'QR Code',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="qrcode" color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="workshops"
        options={{
          title: 'Workshops',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 10,
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  labelContainer: {
    marginTop: 2,
    height: 3,
    width: 20,
  },
  focusIndicator: {
    height: '100%',
    width: '100%',
    borderRadius: 2,
  },
  qrButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});