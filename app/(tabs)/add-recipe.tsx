import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { useRecipes } from 'context/RecipeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { Colors, borderRadiusLG, borderRadiusXL, getCardShadow, spacingLG, spacingSM, spacingXL } from '@/constants/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createSharedStyles } from '@/components/sharedStyles';

const TAGS = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Desserts',
  'Vegan',
  'Vegetarian',
  'Healthy',
  'Quick & Easy',
  'Gluten-Free',
  'Spicy',
  'Comfort Food',
  'Low Carb',
  'High Protein',
  'Kid-Friendly',
];

export default function AddRecipeScreen() {
  const { addRecipe } = useRecipes();
  const darkMode = useColorScheme() === 'dark';
  const palette = Colors[darkMode ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();
  const shared = createSharedStyles(darkMode ? 'dark' : 'light');
  const shadow = getCardShadow(darkMode ? 'dark' : 'light');

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [showPop, setShowPop] = useState(false);
  const [popMessage, setPopMessage] = useState('');

  const showPopup = (message: string) => {
    setPopMessage(message);
    setShowPop(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleAdd = () => {
    if (!title.trim()) {
      showPopup('Enter a title');
      return;
    }

    addRecipe(
      title,
      ingredients,
      instructions + '\n' + description,
      isPublic,
      imageUri || undefined,
      description,
      selectedTags
    );

    setTitle('');
    setIngredients('');
    setInstructions('');
    setDescription('');
    setIsPublic(false);
    setImageUri(null);
    setSelectedTags([]);
    showPopup('Recipe Added!');
  };

  const renderTagPill = (tag: string, selected: boolean) => (
    <Pressable
      key={tag}
      onPress={() => {
        if (selected) setSelectedTags(selectedTags.filter((t) => t !== tag));
        else setSelectedTags([...selectedTags, tag]);
      }}
      style={[
        selected ? shared.tagChipActive : shared.tagChip,
        !selected && { borderColor: palette.primary, borderWidth: 1 },
      ]}
    >
      <Text style={selected ? shared.tagChipActiveText : shared.tagChipText}>
        {tag}
      </Text>
    </Pressable>
  );

  return (
    <LinearGradient colors={[palette.background, palette.surface]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentInsetAdjustmentBehavior="never"
            style={{ flex: 1, backgroundColor: 'transparent' }}
            contentContainerStyle={{ padding: spacingXL, paddingBottom: 160, gap: spacingLG, paddingTop: insets.top + spacingSM }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.heading, { color: palette.textMain },{ textAlign: 'center' }]}>❤︎Add a Recipe❤︎</Text>
            <Text style={[styles.subheading, { color: palette.textMuted },{ textAlign: 'center' }]}>
              Capture your dish with rich details, tags, and a beautiful cover photo.
            </Text>

            <View
              style={[
                styles.section,
                { backgroundColor: palette.surface, borderColor: palette.borderSubtle, ...shadow },
              ]}
            >
              <Text style={[styles.label, { color: palette.textMain }]}>Title</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: darkMode ? palette.surface : '#F7F8FF',
                    color: palette.textMain,
                    borderColor: darkMode ? palette.borderSubtle : '#D9DDFE',
                  },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Creamy Tomato Pasta"
                placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'}
              />
            </View>

            <View
              style={[
                styles.section,
                { backgroundColor: palette.surface, borderColor: palette.borderSubtle, ...shadow },
              ]}
            >
              <Text style={[styles.label, { color: palette.textMain }]}>Ingredients</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: darkMode ? palette.surface : '#F7F8FF',
                    color: palette.textMain,
                    borderColor: darkMode ? palette.borderSubtle : '#D9DDFE',
                  },
                ]}
                value={ingredients}
                onChangeText={setIngredients}
                multiline
                placeholder="One per line"
                placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'}
              />
            </View>

            <View
              style={[
                styles.section,
                { backgroundColor: palette.surface, borderColor: palette.borderSubtle, ...shadow },
              ]}
            >
              <Text style={[styles.label, { color: palette.textMain }]}>Instructions</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    minHeight: 140,
                    backgroundColor: darkMode ? palette.surface : '#F7F8FF',
                    color: palette.textMain,
                    borderColor: darkMode ? palette.borderSubtle : '#D9DDFE',
                  },
                ]}
                value={instructions}
                onChangeText={setInstructions}
                multiline
                placeholder="Step by step"
                placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'}
              />
            </View>

            <View
              style={[
                styles.section,
                { backgroundColor: palette.surface, borderColor: palette.borderSubtle, ...shadow },
              ]}
            >
              <Text style={[styles.label, { color: palette.textMain }]}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: darkMode ? palette.surface : '#F7F8FF',
                    color: palette.textMain,
                    borderColor: darkMode ? palette.borderSubtle : '#D9DDFE',
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                multiline
                placeholder="Add a short story or tips"
                placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'}
              />
            </View>

            <View
              style={[
                styles.section,
                { backgroundColor: palette.surface, borderColor: palette.borderSubtle, ...shadow },
              ]}
            >
              <Text style={[styles.label, { color: palette.textMain }]}>Cover Image</Text>
              <Pressable onPress={pickImage} style={shared.primaryButton}>
                <Text style={shared.primaryButtonText}>{imageUri ? 'Change Image' : 'Add Image'}</Text>
              </Pressable>
              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: '100%', height: 220, borderRadius: 18, marginTop: 12 }}
                  resizeMode="cover"
                />
              )}
            </View>

            <View
              style={[
                styles.section,
                { backgroundColor: palette.surface, borderColor: palette.borderSubtle, ...shadow },
              ]}
            >
              <Text style={[styles.label, { color: palette.textMain }]}>Tags</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ gap: spacingSM, paddingVertical: spacingSM }}
              >
                {TAGS.map((tag) => renderTagPill(tag, selectedTags.includes(tag)))}
              </ScrollView>
            </View>

            <View
              style={[
                styles.section,
                { backgroundColor: palette.surface, borderColor: palette.borderSubtle, ...shadow },
              ]}
            >
              <Text style={[styles.label, { color: palette.textMain }]}>Visibility</Text>
              <View style={[styles.toggleGroup, { backgroundColor: palette.surfaceAlt, borderColor: palette.borderSubtle }]}>
                <Pressable
                  onPress={() => setIsPublic(true)}
                  style={[
                    styles.toggleOption,
                    { backgroundColor: isPublic ? palette.primary : 'transparent' },
                  ]}
                >
                  <Text
                    style={{
                      color: isPublic ? '#fff' : palette.textMain,
                      fontWeight: '700',
                    }}
                  >
                    Public
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setIsPublic(false)}
                  style={[
                    styles.toggleOption,
                    { backgroundColor: !isPublic ? palette.primary : 'transparent' },
                  ]}
                >
                  <Text
                    style={{
                      color: !isPublic ? '#fff' : palette.textMain,
                      fontWeight: '700',
                    }}
                  >
                    Private
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable onPress={handleAdd} style={shared.primaryButton}>
              <Text style={shared.primaryButtonText}>Add Recipe</Text>
            </Pressable>
          </ScrollView>
          </KeyboardAvoidingView>

        {showPop && (
          <Modal transparent animationType="slide" visible={showPop}>
            <View style={[styles.modalOverlay, { backgroundColor: darkMode ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.25)' }]}>
              <View
                style={[
                  styles.popContainer,
                  {
                    backgroundColor: darkMode ? 'rgba(16,22,43,0.92)' : 'rgba(255,255,255,0.9)',
                    borderColor: palette.borderSubtle,
                    ...shadow,
                  },
                ]}
              >
                <Text style={[styles.popTitle, { color: palette.textMain }]}>{popMessage}</Text>
                <Pressable
                  style={[shared.primaryButton, { marginTop: spacingSM }]}
                  onPress={() => setShowPop(false)}
                >
                  <Text style={shared.primaryButtonText}>OK</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 30, fontWeight: '800', textAlign: 'left' },
  subheading: { fontSize: 16, fontWeight: '600' },
  section: { borderRadius: borderRadiusLG, padding: spacingLG, gap: spacingSM, borderWidth: 1 },
  label: { fontWeight: '800', fontSize: 16 },
  input: { borderRadius: borderRadiusLG, padding: spacingLG, marginTop: spacingSM, textAlignVertical: 'top', borderWidth: 1, fontSize: 16 },
  textArea: { minHeight: 110 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  toggleGroup: { flexDirection: 'row', borderRadius: borderRadiusLG, borderWidth: 1, overflow: 'hidden' },
  toggleOption: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: spacingXL },
  popContainer: { padding: spacingXL, borderRadius: borderRadiusXL, width: '88%', alignItems: 'center', borderWidth: 1 },
  popTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
});
