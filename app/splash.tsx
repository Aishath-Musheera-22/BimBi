import { useUser } from 'context/UserContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Gradients } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { user } = useUser();
  const colorScheme = useColorScheme() ?? 'light';
  const darkMode = colorScheme === 'dark';

  const palette = Colors[darkMode ? 'dark' : 'light'];
  const logo = darkMode
    ? require('../assets/images/bimbi-dark.png')
    : require('../assets/images/bimbi-light.png');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) router.replace('/(tabs)');
      else router.replace('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <LinearGradient
      colors={darkMode ? Gradients.splashDark : Gradients.splashLight}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Image source={logo} style={styles.logo} />
      <Text
        style={[
          styles.tagline,
          { color: darkMode ? palette.primary : '#5E6FDA', opacity: 0.95 },
        ]}
      >
        ❤︎Create, explore, and enjoy recipes❤︎
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 16,
  },
  logo: { 
    width: 400,
    height: 300,
    resizeMode: 'contain',
    marginBottom: -40,
    marginLeft: 20,
  },
  tagline: { 
    fontSize: 16, 
    textAlign: 'center', 
    paddingHorizontal: 20,
  },
});
