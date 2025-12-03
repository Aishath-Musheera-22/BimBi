import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { borderRadiusXL, getCardShadow } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const shadow = getCardShadow(colorScheme === 'dark' ? 'dark' : 'light');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? 'rgba(7,11,26,0.94)' : 'rgba(245,246,255,0.94)',
          position: 'absolute',
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: borderRadiusXL,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 1,
          borderColor: palette.borderSubtle,
          ...shadow,
        },
        tabBarIconStyle: { marginBottom: -4 },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name="home-group"
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name="compass-rose"
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-recipe"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name="book-plus-multiple-outline"
              size={focused ? size + 6 : size + 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name="account-badge"
              size={focused ? size + 4 : size + 2}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
