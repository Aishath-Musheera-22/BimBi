// app/_layout.tsx
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Text, View, useColorScheme } from 'react-native';
import { RecipeProvider } from 'context/RecipeContext';
import { UserProvider, useUser } from 'context/UserContext';
import { Colors } from '@/constants/theme';

function InnerLayout() {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // redirect to login if not logged in
  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      router.replace('/login');
    }
  }, [mounted, user]);

  if (!mounted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <UserProvider>
      <RecipeProvider>
        <ThemeProvider value={DefaultTheme}>
          <View style={{ flex: 1, backgroundColor: palette.background }}>
            <InnerLayout />
            <StatusBar style="dark" translucent backgroundColor="transparent" />
          </View>
        </ThemeProvider>
      </RecipeProvider>
    </UserProvider>
  );
}
