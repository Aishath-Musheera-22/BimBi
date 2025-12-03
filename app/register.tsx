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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useUser();
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

  const handleRegister = async () => {
    if (!username || !password) return Alert.alert('Please fill all fields');
    try {
      await register(username, password);
      Alert.alert('Success', 'User registered');
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
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

            <Text style={[styles.title, { color: palette.textMain }, {textAlign:'center'}]}>❤︎Create new account❤︎</Text>
            <Text style={[styles.subtitle, { color: palette.textMuted },{textAlign:'center'}]}>
              Sign up to start exploring recipes!
            </Text>

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

            <Pressable onPress={handleRegister} style={shared.primaryButton}>
              <Text style={shared.primaryButtonText}>Register</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/main')}
              style={shared.secondaryButton}>
              <Text style={[shared.secondaryButtonText, { textAlign: 'center' }]}>Back</Text>
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
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: spacingSM,
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
