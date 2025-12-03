import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { useRecipes } from '@/context/RecipeContext';
import { useRouter } from 'expo-router';
import {
  borderRadiusXL,
  getCardShadow,
  spacingSM,
  spacingLG,
  spacingXL,
} from '@/constants/theme';
import { createSharedStyles } from '@/components/sharedStyles';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const shadow = getCardShadow(colorScheme === 'dark' ? 'dark' : 'light');
  const shared = createSharedStyles(colorScheme === 'dark' ? 'dark' : 'light');
  const { user, updateProfilePic } = useUser();
  const { recentlyViewed, addRecentlyViewed } = useRecipes();
  const router = useRouter();

  const [profileName, setProfileName] = useState(user?.username ?? '');
  const [profilePic, setProfilePic] = useState<string | null>(user?.profilePic ?? null);
  const recentToShow = recentlyViewed.slice(0, 5);
  const openRecipeFromRecentlyViewed = (recipe: any) => {
    addRecentlyViewed(recipe);
    router.push('/(tabs)/explore');
  };

  useEffect(() => {
    if (user) {
      setProfileName(user.username);
      setProfilePic(user.profilePic ?? null);
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0].uri && user) {
      const uri = result.assets[0].uri;
      setProfilePic(uri);
      await updateProfilePic(uri);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          style={{ flex: 1 }}
          contentContainerStyle={styles.screenContent}
        >
          <LinearGradient
            colors={[palette.surfaceAlt, palette.surface]}
            style={[
              styles.heroCard,
              { borderColor: palette.borderSubtle, ...shadow },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroLeft}>
              <Pressable onPress={pickImage} style={[styles.avatar, { borderColor: palette.primarySoft }]}>
                {profilePic ? (
                  <Image source={{ uri: profilePic }} style={styles.avatarImage} />
                ) : (
                  <MaterialIcons name="person" size={32} color={palette.primaryLight} />
                )}
              </Pressable>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={[styles.heroTitle, { color: palette.textMain }]}>
                  Welcome back, {profileName || 'Chef'}
                </Text>
                <Text style={[styles.heroSubtitle, { color: palette.textMuted }]}>
                  What would you like to cook today?
                </Text>
              </View>
            </View>
          </LinearGradient>

          {recentToShow.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={[styles.sectionTitle, { color: palette.textMain },{ textAlign: 'center' }]}>❤︎ Recently Viewed ❤︎</Text>
              <Text style={[styles.sectionSubtitle, { color: palette.textMuted },{ textAlign: 'center' }]}>
                Quickly jump back to dishes you’ve checked out.
              </Text>

              <View style={[styles.recentlyViewedContainer, { rowGap: spacingLG }]}>
                {recentToShow.map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    style={[
                      styles.recentCard,
                      { borderColor: palette.borderSubtle, ...shadow },
                    ]}
                    activeOpacity={0.9}
                    onPress={() => openRecipeFromRecentlyViewed(recipe)}
                  >
                    <LinearGradient
                      colors={[palette.surface, palette.surfaceAlt]}
                      style={styles.cardGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {recipe.imageUri ? (
                        <Image
                          source={{ uri: recipe.imageUri }}
                          style={[styles.recentImage, { backgroundColor: palette.surfaceAlt }]}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.recentImagePlaceholder, { backgroundColor: palette.surfaceAlt }]}>
                          <Text style={styles.recentEmoji}>🍽️</Text>
                        </View>
                      )}

                      <View style={styles.recentTextBlock}>
                        <Text style={[styles.recentTitle, { color: palette.textMain }]} numberOfLines={1}>
                          {recipe.title}
                        </Text>

                        {recipe.tags && recipe.tags.length > 0 && (
                          <View style={shared.mintChip}>
                            <Text style={shared.mintChipText} numberOfLines={1}>
                              {recipe.tags[0]}
                            </Text>
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 18,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  screenContent: {
    paddingHorizontal: spacingXL,
    paddingBottom: spacingXL,
    paddingTop: spacingLG,
    gap: spacingXL,
  },
  heroCard: {
    borderRadius: borderRadiusXL,
    paddingHorizontal: spacingXL,
    paddingTop: spacingXL,
    paddingBottom: spacingLG,
    marginTop: 12,
    marginBottom: spacingXL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 130,
    borderWidth: 1,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingLG,
    flex: 1,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 16,
    marginTop: spacingSM,
    fontWeight: '600',
  },
  recentSection: {
    marginTop: 24,
    paddingHorizontal: spacingXL,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  recentlyViewedContainer: {
    width: '100%',
    paddingHorizontal: spacingLG,
    marginTop: spacingLG,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recentCard: {
    width: '48%',
    borderRadius: borderRadiusXL,
    padding: 1,
    marginBottom: 0,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardGradient: {
    flex: 1,
    borderRadius: borderRadiusXL - 4,
    padding: spacingLG,
  },
  recentImage: {
    width: '100%',
    height: 110,
    borderRadius: 16,
    marginBottom: 10,
  },
  recentImagePlaceholder: {
    width: '100%',
    height: 110,
    borderRadius: 16,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentEmoji: {
    fontSize: 36,
  },
  recentTextBlock: {
    gap: 2,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  chip: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
});
