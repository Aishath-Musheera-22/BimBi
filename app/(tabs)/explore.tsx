import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  FlatList,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRecipes, Recipe } from 'context/RecipeContext';
import { Colors } from '@/constants/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  borderRadiusLG,
  borderRadiusXL,
  getCardShadow,
  spacingLG,
  spacingSM,
  spacingXL,
} from '@/constants/theme';
import { createSharedStyles } from '@/components/sharedStyles';

const TAGS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Vegan', 'Healthy'];

export default function ExploreScreen() {
  const { publicRecipes, markRecipeViewed } = useRecipes();
  const darkMode = useColorScheme() === 'dark';
  const palette = Colors[darkMode ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();
  const shared = createSharedStyles(darkMode ? 'dark' : 'light');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState('All');
  const [filteredRecipes, setFilteredRecipes] = useState(publicRecipes);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const [tagScales, setTagScales] = useState(TAGS.map(() => new Animated.Value(1)));

  useEffect(() => {
    if (selectedTag === 'All') setFilteredRecipes(publicRecipes);
    else setFilteredRecipes(publicRecipes.filter((r) => r.tags?.includes(selectedTag)));

    cardAnim.setValue(0);
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [selectedTag, publicRecipes]);

  const onPressTag = (index: number, tag: string) => {
    setSelectedTag(tag);

    Animated.sequence([
      Animated.timing(tagScales[index], { toValue: 1.2, duration: 120, useNativeDriver: true }),
      Animated.timing(tagScales[index], { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  return (
    <LinearGradient colors={[palette.background, palette.surface]} style={styles.container}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 8 }}>
          <Text style={[styles.pageTitle, { color: palette.textMain }, { textAlign: 'center' }]}>❤︎Explore Recipes❤︎</Text>
          <Text style={[styles.pageSubtitle, { color: palette.textMuted }, { textAlign: 'center' }]}>Find something tasty to cook next.</Text>
        </View>

      <View style={styles.tagContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tagScroll, { paddingHorizontal: 20 }]}
        >
          {TAGS.map((tag, index) => (
            <Animated.View key={tag} style={{ transform: [{ scale: tagScales[index] }] }}>
              <TouchableOpacity
                onPress={() => onPressTag(index, tag)}
                style={[
                  selectedTag === tag ? shared.tagChipActive : shared.tagChip,
                  selectedTag !== tag && { borderColor: palette.primary, borderWidth: 1 },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    selectedTag === tag ? shared.tagChipActiveText : shared.tagChipText,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      <Animated.FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20, paddingTop: 20, gap: 16 }}
        style={{ opacity: cardAnim, backgroundColor: 'transparent' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedRecipe(item);
              markRecipeViewed(item as Recipe);
            }}
            activeOpacity={0.9}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.borderSubtle,
                  ...getCardShadow(darkMode ? 'dark' : 'light'),
                },
              ]}
            >
              {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.image} />}
              <LinearGradient
                colors={darkMode ? ['transparent', 'rgba(0,0,0,0.15)'] : ['transparent', 'rgba(255,255,255,0.3)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={{ padding: spacingLG, gap: spacingSM }}>
                <Text style={[styles.title, { color: palette.textMain }]}>{item.title}</Text>
                <Text style={[styles.by, { color: palette.textMuted }]}>by {item.username}</Text>
                {item.tags && item.tags.length > 0 && (
                  <View style={styles.tagRow}>
                    {item.tags.slice(0, 3).map((tag: string) => (
                      <View key={tag} style={[styles.tagPill, { backgroundColor: palette.surfaceAlt, borderColor: palette.primary }]}>
                        <Text style={{ color: palette.primary, fontWeight: '700', fontSize: 12 }}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {item.description && (
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ color: palette.textMuted, fontSize: 15 }}
                  >
                    {item.description}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedRecipe && (
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: darkMode ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.25)' },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: darkMode ? 'rgba(16,22,43,0.92)' : 'rgba(255,255,255,0.9)',
                borderColor: palette.borderSubtle,
                ...getCardShadow(darkMode ? 'dark' : 'light'),
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {selectedRecipe.imageUri && (
                <Image source={{ uri: selectedRecipe.imageUri }} style={styles.modalImage} />
              )}
              <Text style={[styles.modalTitle, { color: palette.textMain }]}>{selectedRecipe.title}</Text>
              <Text style={[styles.by, { color: palette.textMuted }]}>by {selectedRecipe.username}</Text>
              <Text style={[styles.sectionTitle, { color: palette.textMain }]}>Ingredients</Text>
              {selectedRecipe.ingredients
                .split(/[\n,]+/)
                .filter(Boolean)
                .map((ing: string, i: number) => (
                  <Text key={i} style={[styles.text, { color: palette.textMuted }]}>
                    • {ing.trim()}
                  </Text>
                ))}
              <Text style={[styles.sectionTitle, { color: palette.textMain }]}>Instructions</Text>
              <Text style={[styles.text, { color: palette.textMuted }]}>
                {selectedRecipe.instructions}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: palette.primary }]}
              onPress={() => setSelectedRecipe(null)}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitle: { fontSize: 30, fontWeight: '800' },
  pageSubtitle: { fontSize: 16, marginTop: 4, fontWeight: '600' },
  tagContainer: { paddingVertical: spacingSM },
  tagScroll: { alignItems: 'center', gap: spacingSM },
  card: {
    borderRadius: borderRadiusXL,
    overflow: 'hidden',
    borderWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '800' },
  by: { fontSize: 13, fontWeight: '600' },
  image: { width: '100%', aspectRatio: 16 / 9, resizeMode: 'cover' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacingSM },
  tagPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: borderRadiusLG, borderWidth: 1 },
  sectionTitle: { fontWeight: '800', fontSize: 18, marginTop: 12, marginBottom: 8 },
  text: { fontSize: 15, lineHeight: 24, marginBottom: 6 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: { borderRadius: borderRadiusXL, padding: spacingXL, maxHeight: '90%', gap: spacingSM, borderWidth: 1 },
  modalTitle: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
  modalImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: 16, resizeMode: 'cover', marginBottom: 14 },
  closeButton: { padding: 14, borderRadius: 18, alignItems: 'center', marginTop: 12 },
});
