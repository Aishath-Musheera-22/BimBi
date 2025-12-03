import { Recipe, useRecipes } from '@/context/RecipeContext';
import { useUser } from '@/context/UserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, borderRadiusLG, borderRadiusXL, getCardShadow, spacingLG, spacingMD, spacingSM, spacingXL } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createSharedStyles } from '@/components/sharedStyles';

const { height } = Dimensions.get('window');

const TAGS = ['Breakfast','Lunch','Dinner','Snacks','Desserts','Vegan','Vegetarian','Healthy','Quick & Easy','Gluten-Free','Spicy','Comfort Food','Low Carb','High Protein','Kid-Friendly'];

export default function RecipesScreen() {
  const { recipes, deleteRecipe, editRecipe, markRecipeViewed } = useRecipes();
  const { user, updateProfilePic, updateProfileName, updateProfilePassword, logout } = useUser();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const shared = createSharedStyles(colorScheme);
  const shadow = getCardShadow(colorScheme === 'dark' ? 'dark' : 'light');
  const darkMode = colorScheme === 'dark';
  const router = useRouter();

  const [profileName, setProfileName] = useState(user?.username ?? '');
  const [profilePic, setProfilePic] = useState<string | null>(user?.profilePic ?? null);
  const [editUsername, setEditUsername] = useState(profileName);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [errorName, setErrorName] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirm, setErrorConfirm] = useState('');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editIngredients, setEditIngredients] = useState('');
  const [editInstructions, setEditInstructions] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [editImageUri, setEditImageUri] = useState<string | null>(null);
  const [editSelectedTags, setEditSelectedTags] = useState<string[]>([]);
  const [showDeletePop, setShowDeletePop] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showEditPop, setShowEditPop] = useState(false);
  const [editTarget, setEditTarget] = useState<Recipe | null>(null);

  useEffect(() => {
    if (user) {
      setProfileName(user.username);
      setProfilePic(user.profilePic ?? null);
      setEditUsername(user.username);
      setNewPassword('');
      setConfirmPassword('');
      setErrorName('');
      setErrorPassword('');
      setErrorConfirm('');
    }
  }, [user]);

  const openEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setEditTitle(recipe.title);
    setEditIngredients(recipe.ingredients);
    setEditInstructions(recipe.instructions);
    setEditDescription(recipe.description ?? '');
    setEditIsPublic(recipe.isPublic);
    setEditImageUri(recipe.imageUri ?? null);
    setEditSelectedTags(recipe.tags ?? []);
  };

  const handleSaveEdit = () => {
    if (!editingRecipe) return;
    editRecipe(
      editingRecipe.id,
      editTitle,
      editIngredients,
      editInstructions,
      editIsPublic,
      editImageUri ?? undefined,
      editDescription,
      editSelectedTags
    );
    setEditingRecipe(null);
  };

  const pickRecipeImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0].uri) setEditImageUri(result.assets[0].uri);
  };

  const pickProfileImage = async () => {
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

  const saveProfileChanges = async () => {
    setErrorName('');
    setErrorPassword('');
    setErrorConfirm('');

    if (!user) return;
    const newName = editUsername.trim();
    let hasError = false;
    if (!newName || newName.length < 2) {
      setErrorName('Name must be at least 2 characters.');
      hasError = true;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorPassword('Password must be at least 6 characters.');
      hasError = true;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorConfirm('Passwords do not match.');
      hasError = true;
    }

    if (hasError) return;

    try {
      if (newName !== user.username) {
        await updateProfileName(newName);
        setProfileName(newName);
      }
      if (newPassword) {
        await updateProfilePassword(newPassword);
      }
      Alert.alert('Profile updated!');
      setShowEditProfileModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to update profile');
    }
  };

  return (
    <LinearGradient colors={[palette.background, palette.surface]} style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
        <ScrollView
          style={{ flex: 1 }}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={styles.screenContent}
        >
        <View style={{ marginBottom: 16 }}>
          <LinearGradient
            colors={darkMode ? ['#181E3A', '#7B8CFF'] : ['#A9B6FF', '#F3F1FF']}
            style={[
              styles.profileHeaderCard,
              { backgroundColor: palette.surfaceAlt, borderColor: palette.borderSubtle, shadowColor: palette.primarySoft },
            ]}
          >
            <View style={styles.profileHeaderContent}>
              <View style={styles.profileHeaderLeft}>
                <Pressable
                  onPress={pickProfileImage}
                  style={[styles.profileAvatar, { borderColor: palette.primarySoft, backgroundColor: palette.surface }]}
                >
                  {profilePic ? (
                    <Image source={{ uri: profilePic }} style={styles.profileAvatarImage} />
                  ) : (
                    <MaterialIcons name="person" size={36} color={palette.primary} />
                  )}
                </Pressable>
                <View style={{ gap: 2 }}>
                  <Text style={[styles.profileTitle, { color: palette.textMain }]}>My Profile</Text>
                  <Text style={[styles.profileName, { color: palette.textMain }]}>{profileName || 'Chef'}</Text>
                  <Text style={[styles.profileSubtitle, { color: palette.textMuted }]}>Your cooking journey, all in one place.</Text>
                </View>
              </View>
              <View style={styles.profileHeaderRight}>
                <TouchableOpacity
                  style={[styles.editProfileButton, { backgroundColor: palette.secondary }]}
                  onPress={() => setShowEditProfileModal(true)}
                >
                  <Text style={[styles.editProfileButtonText, { color: palette.textMain, textAlign: 'center' }]}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.profileHeaderDivider} />

            <TouchableOpacity
              style={styles.logoutRow}
              onPress={async () => {
                await logout();
                router.replace('/login');
              }}
            >
              <Text style={[styles.logoutRowText, { color: palette.error, textAlign: 'center' }]}>Log out</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.yourRecipesSection}>
          <Text style={{ fontSize: 30, fontWeight: '800', color: palette.textMain, marginBottom: 8, textAlign: 'center'}}>
            ❤︎ Your Recipes ❤︎
          </Text>
          <Text style={{ color: palette.textMuted, fontSize: 15, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
            Manage, edit, and savor your saved creations.
          </Text>
        </View>

        <View style={styles.recipesGrid}>
          {recipes.length === 0 ? (
            <View style={[styles.emptyStateCard, { backgroundColor: palette.surface, borderColor: palette.borderSubtle }]}>
              <Text style={[styles.emptyStateTitle, { color: palette.textMain }]}>No recipes yet!</Text>
              <Text style={[styles.emptyStateSubtitle, { color: palette.textMuted }]}>
                Start by adding your first recipe to see it here.
              </Text>
            </View>
          ) : (
            recipes.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.recipeCard,
                  { backgroundColor: palette.surface, borderColor: palette.borderSubtle, shadowColor: palette.primarySoft },
                ]}
              >
                <Pressable
                  onPress={() => { markRecipeViewed(item); setEditTarget(item); setShowEditPop(true); }}
                  style={styles.card}
                >
                  <View style={styles.cardButtons}>
                    <Pressable
                      style={[styles.smallBtn, { backgroundColor: palette.primarySoft }]}
                      onPress={() => { setEditTarget(item); setShowEditPop(true); }}
                    >
                      <MaterialIcons name="edit" size={18} color={palette.primary} />
                    </Pressable>
                    <Pressable
                      style={[styles.smallBtn, { backgroundColor: palette.secondary }]}
                      onPress={() => { setDeleteTarget(item.id); setShowDeletePop(true); }}
                    >
                      <MaterialIcons name="delete" size={18} color="#7D1233" />
                    </Pressable>
                  </View>
                  {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.cardImage} />}
                  <Text style={[styles.cardTitle, { color: palette.textMain }]} numberOfLines={2}>{item.title}</Text>
                  {item.tags && item.tags.length > 0 && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {item.tags.slice(0, 2).map((tag) => (
                        <View key={tag} style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: palette.surfaceAlt, borderWidth: 1, borderColor: palette.primary }}>
                          <Text style={{ color: palette.primary, fontWeight: '700', fontSize: 12 }}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text style={{ color: palette.textMuted, fontSize: 14, marginTop: 6 }} numberOfLines={2}>
                    {item.description ?? ''}
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        {showEditProfileModal && (
          <Modal transparent animationType="fade" visible={showEditProfileModal}>
            <Pressable
              style={[styles.modalOverlay, { backgroundColor: darkMode ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.25)' }]}
              onPress={() => setShowEditProfileModal(false)}
            >
              <View
                style={[
                  styles.profileModal,
                  {
                    backgroundColor: darkMode ? 'rgba(16,22,43,0.92)' : 'rgba(255,255,255,0.9)',
                    borderColor: palette.borderSubtle,
                    ...shadow,
                  },
                ]}
              >
                <Text style={[styles.profileModalTitle, { color: palette.textMain }]}>Edit Profile</Text>

                <Pressable onPress={pickProfileImage} style={{ alignSelf: 'center' }}>
                  {profilePic ? (
                    <Image source={{ uri: profilePic }} style={[styles.avatarLarge, { borderColor: palette.primarySoft }]} />
                  ) : (
                    <View style={[styles.avatarLarge, { borderColor: palette.primarySoft, justifyContent: 'center', alignItems: 'center' }]}>
                      <MaterialIcons name="person" size={40} color={palette.textMain} />
                    </View>
                )}
              </Pressable>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: darkMode ? palette.surface : '#F7F8FF',
                      color: palette.textMain,
                      borderColor: darkMode ? palette.borderSubtle : '#D9DDFE',
                    },
                  ]}
                  value={editUsername}
                  onChangeText={setEditUsername}
                  maxLength={100}
                  placeholder="Enter username"
                  placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'}
                />
                {errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}

                <View style={{ marginTop: 8 }}>
                  <Text style={[styles.label, { color: palette.textMain }]}>New password (optional)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: darkMode ? palette.surface : '#F7F8FF', color: palette.textMain, borderColor: darkMode ? palette.borderSubtle : '#D9DDFE' }]}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'}
                    secureTextEntry={!showPassword}
                  />
                  {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}
                </View>

                <View style={{ marginTop: 8 }}>
                  <Text style={[styles.label, { color: palette.textMain }]}>Confirm new password</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: darkMode ? palette.surface : '#F7F8FF', color: palette.textMain, borderColor: darkMode ? palette.borderSubtle : '#D9DDFE' }]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'}
                    secureTextEntry={!showPassword}
                  />
                  {errorConfirm ? <Text style={styles.errorText}>{errorConfirm}</Text> : null}
                </View>

                <Pressable onPress={() => setShowPassword(!showPassword)} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                  <Text style={{ color: palette.primary, fontWeight: '700', textAlign: 'center' }}>{showPassword ? 'Hide' : 'Show'} passwords</Text>
                </Pressable>

                <Pressable onPress={saveProfileChanges} style={[shared.primaryButton, { width: '100%' }]}>
                  <Text style={[shared.primaryButtonText, { textAlign: 'center' }]}>Save</Text>
                </Pressable>
                <Pressable onPress={() => setShowEditProfileModal(false)} style={[shared.secondaryButton, { width: '100%' }]}>
                  <Text style={[shared.secondaryButtonText, { textAlign: 'center' }]}>Cancel</Text>
                </Pressable>
              </View>
            </Pressable>
          </Modal>
        )}

        {showDeletePop && (
          <Modal transparent animationType="fade" visible={showDeletePop}>
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
                <Text style={[styles.popTitle, { color: palette.textMain }]}>Delete Recipe?</Text>
                <Text style={{ color: palette.textMuted, textAlign: 'center', marginBottom: 20, fontWeight: '700' }}>
                  You sure you want to remove this recipe?
                </Text>
                <Pressable
                  style={[shared.destructiveButton, { width: '100%' }]}
                  onPress={() => { if (deleteTarget) deleteRecipe(deleteTarget); setShowDeletePop(false); }}
                >
                  <Text style={[shared.destructiveButtonText, { textAlign: 'center' }]}>Delete</Text>
                </Pressable>
                <Pressable style={[shared.secondaryButton, { width: '100%' }]} onPress={() => setShowDeletePop(false)}>
                  <Text style={[shared.secondaryButtonText, { textAlign: 'center' }]}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}

        {showEditPop && (
          <Modal transparent animationType="fade" visible={showEditPop}>
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
                <Text style={[styles.popTitle, { color: palette.textMain }]}>Edit Recipe?</Text>
                <Text style={{ color: palette.textMuted, textAlign: 'center', marginBottom: 20, fontWeight: '700' }}>
                  Do you want to edit this recipe now?
                </Text>
                <Pressable style={[shared.primaryButton, { width: '100%' }]} onPress={() => { if (editTarget) openEdit(editTarget); setShowEditPop(false); }}>
                  <Text style={[shared.primaryButtonText, { textAlign: 'center' }]}>Edit</Text>
                </Pressable>
                <Pressable style={[shared.secondaryButton, { width: '100%' }]} onPress={() => setShowEditPop(false)}>
                  <Text style={[shared.secondaryButtonText, { textAlign: 'center' }]}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}

        {editingRecipe && (
          <Modal transparent animationType="slide" visible={!!editingRecipe}>
            <View
              style={[
                styles.modalOverlay,
                { justifyContent: 'flex-start', paddingTop: 40, backgroundColor: darkMode ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.25)' },
              ]}
            >
              <LinearGradient
                colors={[palette.background, palette.surface]}
                style={[
                  styles.modalContainer,
                  {
                    height: height - 80,
                    borderRadius: borderRadiusXL,
                    borderColor: palette.borderSubtle,
                    borderWidth: 1,
                    backgroundColor: darkMode ? 'rgba(16,22,43,0.92)' : 'rgba(255,255,255,0.9)',
                    ...shadow,
                  },
                ]}
              >
                <ScrollView contentContainerStyle={{ paddingHorizontal: spacingXL, paddingBottom: spacingLG }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacingLG, marginTop: spacingXL }}>
                    <Pressable style={[shared.secondaryButton, { flex: 1, marginRight: spacingSM }]} onPress={() => setEditingRecipe(null)}>
                      <Text style={[shared.secondaryButtonText, { textAlign: 'center' }]}>Cancel</Text>
                    </Pressable>
                    <Pressable style={[shared.primaryButton, { flex: 1, marginLeft: spacingSM }]} onPress={handleSaveEdit}>
                      <Text style={[shared.primaryButtonText, { textAlign: 'center' }]}>Save</Text>
                    </Pressable>
                  </View>

                  <Text style={[styles.label, { color: palette.textMain }]}>Title</Text>
                  <TextInput style={[styles.input, { backgroundColor: darkMode ? palette.surface : '#F7F8FF', color: palette.textMain, borderColor: darkMode ? palette.borderSubtle : '#D9DDFE' }]} value={editTitle} onChangeText={setEditTitle} placeholder="Title" placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'} />

                  <Text style={[styles.label, { color: palette.textMain }]}>Description</Text>
                  <TextInput style={[styles.input, { backgroundColor: darkMode ? palette.surface : '#F7F8FF', color: palette.textMain, borderColor: darkMode ? palette.borderSubtle : '#D9DDFE', height: 100 }]} value={editDescription} onChangeText={setEditDescription} placeholder="Description" placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'} multiline />

                  <Text style={[styles.label, { color: palette.textMain }]}>Ingredients</Text>
                  <TextInput style={[styles.input, { backgroundColor: darkMode ? palette.surface : '#F7F8FF', color: palette.textMain, borderColor: darkMode ? palette.borderSubtle : '#D9DDFE', height: 120 }]} value={editIngredients} onChangeText={setEditIngredients} placeholder="Ingredients" placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'} multiline />

                  <Text style={[styles.label, { color: palette.textMain }]}>Instructions</Text>
                  <TextInput style={[styles.input, { backgroundColor: darkMode ? palette.surface : '#F7F8FF', color: palette.textMain, borderColor: darkMode ? palette.borderSubtle : '#D9DDFE', height: 180 }]} value={editInstructions} onChangeText={setEditInstructions} placeholder="Instructions" placeholderTextColor={darkMode ? palette.textMuted : '#A8A9C2'} multiline />

                  <Text style={[styles.label, { color: palette.textMain }]}>Tags:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: spacingSM }}>
                    {TAGS.map(tag => {
                      const selected = editSelectedTags.includes(tag);
                      return (
                        <Pressable
                          key={tag}
                          onPress={() => { if (selected) setEditSelectedTags(editSelectedTags.filter(t => t !== tag)); else setEditSelectedTags([...editSelectedTags, tag]); }}
                          style={selected ? shared.tagChipActive : shared.tagChip}
                        >
                          <Text style={selected ? shared.tagChipActiveText : shared.tagChipText}>{tag}</Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>

                  <View style={{ marginBottom: 16 }}>
                    {editImageUri && <Image source={{ uri: editImageUri }} style={{ width: '100%', height: 250, borderRadius: 16, marginBottom: 8 }} />}
                    <Pressable style={shared.primaryButton} onPress={pickRecipeImage}>
                      <Text style={[shared.primaryButtonText, { textAlign: 'center' }]}>Add Image</Text>
                    </Pressable>
                  </View>

                  <Pressable
                    style={[
                      shared.secondaryButton,
                      {
                        backgroundColor: editIsPublic ? palette.primary : 'transparent',
                        borderColor: editIsPublic ? palette.primary : palette.primarySoft,
                      },
                    ]}
                    onPress={() => setEditIsPublic(!editIsPublic)}
                  >
                    <Text style={{ color: editIsPublic ? '#fff' : palette.primary, fontWeight: '800', textAlign: 'center' }}>{editIsPublic ? 'Public' : 'Private'}</Text>
                  </Pressable>
                </ScrollView>
              </LinearGradient>
            </View>
          </Modal>
        )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  profileHeaderCard: {
    borderRadius: borderRadiusXL,
    paddingHorizontal: spacingXL,
    paddingTop: spacingXL,
    paddingBottom: spacingMD,
    marginHorizontal: spacingXL,
    marginTop: spacingXL,
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    borderWidth: 1,
  },
  profileHeaderContent: { flexDirection: 'row', alignItems: 'center' },
  profileHeaderLeft: { flex: 1, paddingRight: 12 },
  profileHeaderRight: { justifyContent: 'center', alignItems: 'flex-end' },
  profileAvatar: { width: 76, height: 76, borderRadius: 38, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  profileAvatarImage: { width: '100%', height: '100%', borderRadius: 36 },
  profileTitle: { fontSize: 18, fontWeight: '800' },
  profileName: { fontSize: 24, fontWeight: '800' },
  profileSubtitle: { fontSize: 14, marginTop: 4, fontWeight: '600' },
  editProfileButton: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 999 },
  editProfileButtonText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  profileHeaderDivider: { marginTop: 12, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255, 255, 255, 0.25)' },
  logoutRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  logoutIcon: { marginRight: 6 },
  logoutRowText: { fontSize: 13, fontWeight: '500', opacity: 0.9, textAlign: 'center' },
  yourRecipesSection: { marginTop: spacingXL, paddingHorizontal: spacingXL },
  recipesGrid: {
    marginTop: spacingLG,
    paddingHorizontal: spacingXL,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: '48%',
    borderRadius: borderRadiusXL,
    paddingVertical: spacingLG,
    paddingHorizontal: spacingLG,
    marginBottom: spacingLG,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
  },
  recipeCardInner: { gap: 6 },
  emptyStateCard: {
    width: '100%',
    borderRadius: borderRadiusXL,
    paddingVertical: spacingXL,
    paddingHorizontal: spacingXL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingLG,
    borderWidth: 1,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  card: { position: 'relative', gap: 4 },
  cardImage: { width: '100%', height: 140, borderRadius: 16, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  cardButtons: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', gap: 8, zIndex: 10 },
  smallBtn: { padding: 6, borderRadius: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center', padding: spacingXL },
  modalContainer: { borderRadius: borderRadiusXL, flex: 1 },
  label: { fontSize: 16, marginTop: spacingSM, fontWeight: '800' },
  input: { paddingVertical: spacingSM + 2, paddingHorizontal: spacingLG, borderRadius: borderRadiusLG, fontSize: 16, borderWidth: 1, marginBottom: spacingSM },
  popContainer: { padding: spacingXL, borderRadius: borderRadiusXL, width: '85%', alignSelf: 'center', borderWidth: 1 },
  popTitle: { fontSize: 20, fontWeight: '800', marginBottom: spacingSM, textAlign: 'center' },
  profileModal: { padding: spacingXL, borderRadius: borderRadiusXL, width: '88%', alignSelf: 'center', gap: spacingLG, borderWidth: 1 },
  profileModalTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  avatarLarge: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, marginVertical: spacingLG },
  errorText: { color: '#FF5C7A', marginTop: 4, fontWeight: '600', },
});


