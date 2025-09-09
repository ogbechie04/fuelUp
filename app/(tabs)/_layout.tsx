import { Tabs } from 'expo-router';
import React from 'react';
import HomeIconBold from '@/assets/icon/home-2-bold.svg';
import HomeIconOutline from '@/assets/icon/home-2-outline.svg';
import SearchIconBold from '@/assets/icon/search-normal-bold.svg';
import SearchIconOutline from '@/assets/icon/search-normal-outline.svg';
import OrderIconBold from '@/assets/icon/document-text-bold.svg';
import OrderIconOutline from '@/assets/icon/document-text-outline.svg';
import SupportIconBold from '@/assets/icon/messages-2-bold.svg';
import SupportIconOutline from '@/assets/icon/messages-2-outline.svg';
import ProfileImage from '@/assets/images/profile-image.svg'

import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Feather from '@expo/vector-icons/Feather';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/ui/TabBarIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              activeColor={color}
              active={HomeIconBold}
              inactive={HomeIconOutline}
              inactiveColor={'#84868C'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              activeColor={color}
              active={SearchIconBold}
              inactive={SearchIconOutline}
              inactiveColor={'#84868C'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              activeColor={color}
              active={OrderIconBold}
              inactive={OrderIconOutline}
              inactiveColor={'#84868C'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              activeColor={color}
              active={SupportIconBold}
              inactive={SupportIconOutline}
              inactiveColor={'#84868C'}
            />
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({}) => <ProfileImage />  }}/>
    </Tabs>
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    //     headerShown: false,
    //     tabBarButton: HapticTab,
    //     tabBarBackground: TabBarBackground,
    //     tabBarStyle: Platform.select({
    //       ios: {
    //         // Use a transparent background on iOS to show the blur effect
    //         position: 'absolute',
    //       },
    //       default: {},
    //     }),
    //   }}>
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: 'Home',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="explore"
    //     options={{
    //       title: 'Explore',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
    //     }}
    //   />
    // </Tabs>
  );
}
