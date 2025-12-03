import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { createSharedStyles } from '@/components/sharedStyles';
import {
  Colors,
  Gradients,
  borderRadiusLG,
  borderRadiusXL,
  getCardShadow,
  spacingLG,
  spacingSM,
  spacingXL,
} from '@/constants/theme';
import { useUser } from 'context/UserContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useUser();
  const colorScheme = useColorScheme() ?? 'light';
  const darkMode = colorScheme === 'dark';
  const palette = Colors[darkMode ? 'dark' : 'light'];
  const shared = createSharedStyles(darkMode ? 'dark' : 'light');
  const cardShadow = getCardShadow(darkMode ? 'dark' : 'light');

  const logo = darkMode
    ? require('../assets/images/bimbi-dark.png')
    : require('../assets/images/bimbi-light.png');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) return Alert.alert('Please fill all fields');
    const success = await login(username, password);
    if (success) router.replace('/(tabs)');
    else Alert.alert('Login failed', 'Incorrect username or password');
  };

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
              styles.formCard,
              {
                backgroundColor: darkMode ? palette.surface : '#FFFFFF',
                borderColor: palette.borderSubtle,
                ...cardShadow,
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
            </View>

            <Text style={[styles.title,{ color: palette.textMain }]}>Welcome Back!</Text>
            <Text style={[styles.subtitle, { color: palette.textMuted }, {textAlign: 'center'}]}>❤︎Login to your BimBi account❤︎</Text>

            <TextInput
              placeholder="Username"
              placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'}
              style={[
                styles.input,
                {
                  backgroundColor: darkMode ? palette.surface : '#F7F8FF',
                  color: palette.textMain,
                  borderColor: darkMode ? palette.borderSubtle : '#D9DDFE',
                },
              ]}
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'}
              style={[
                styles.input,
                {
                  backgroundColor: darkMode ? palette.surface : '#F7F8FF',
                  color: palette.textMain,
                  borderColor: darkMode ? palette.borderSubtle : '#D9DDFE',
                },
              ]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable onPress={handleLogin} style={shared.primaryButton}>
              <Text style={shared.primaryButtonText}>Login</Text>
            </Pressable>

            <Pressable
            onPress={() => router.push('/main')}
            style={[shared.secondaryButton, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={shared.secondaryButtonText}>Back</Text>
            </Pressable>
          </View>
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
    padding: spacingXL,
    paddingTop: height * 0.1,
  },
  formCard: {
    width: '100%',
    borderRadius: borderRadiusXL,
    padding: spacingXL,
    borderWidth: 1,
    gap: spacingLG,
  },
  logoContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingXL,
  },
  logo: {
    width: 350,
    height: 200,
    resizeMode: 'contain',
    marginLeft: -70,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacingSM,
    marginLeft: 40,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: spacingLG,
},

  input: {
    width: '100%',
    paddingVertical: spacingSM + 2,
    paddingHorizontal: spacingLG,
    borderRadius: borderRadiusLG,
    fontSize: 16,
    borderWidth: 1,
  },
});
