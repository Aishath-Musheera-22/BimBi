import { useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { createSharedStyles } from '@/components/sharedStyles';
import {
  Colors,
  Gradients,
  borderRadiusXL,
  getCardShadow,
  spacingLG,
  spacingXL,
} from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function MainScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const darkMode = colorScheme === 'dark';

  const palette = Colors[darkMode ? 'dark' : 'light'];
  const shared = createSharedStyles(darkMode ? 'dark' : 'light');
  const cardShadow = getCardShadow(darkMode ? 'dark' : 'light');
  const bimbiLogo = darkMode
    ? require('../assets/images/bimbi-dark.png')
    : require('../assets/images/bimbi-light.png');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient
        colors={darkMode ? Gradients.authDark : Gradients.authLight}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          <View
            style={[
              styles.logoCard,
              {
                backgroundColor: darkMode ? palette.surface : '#FFFFFF',
                borderColor: palette.borderSubtle,
                ...cardShadow,
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image source={bimbiLogo} style={styles.logo} />
            </View>
          </View>

          <Text style={[styles.tagline, { color: palette.textMain }]}>
            ❤︎ Create, explore, & enjoy recipes ❤︎
          </Text>

          <Pressable 
            onPress={() => router.push('/login')}
            style={shared.primaryButton}
          >
            <Text style={shared.primaryButtonText}>Login</Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push('/register')}
            style={[shared.secondaryButton, { backgroundColor: '#B277DFFF' }]}>
            <Text style={[shared.secondaryButtonText, { color: '#fff' }]}>Register</Text>
            </Pressable>

        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: height * 0.1,
    paddingHorizontal: spacingXL,
    gap: spacingLG,
  },
  logoCard: {
    width: '100%',
    borderRadius: borderRadiusXL,
    paddingVertical: spacingXL,
    paddingHorizontal: spacingLG,
    borderWidth: 1,
    marginBottom: spacingLG,
  },
  logoContainer: {
    width,
    height: height * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  logo: {
    width: 400,
    height: 300,
    marginLeft: -50,
    resizeMode: 'contain'
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    fontFamily: 'DancingScript-Regular'
  }
});
