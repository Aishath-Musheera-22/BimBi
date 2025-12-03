import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

export type Recipe = {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  username: string;
  isPublic: boolean;
  imageUri?: string;
  description?: string;
  tags?: string[];
};

type RecipeContextType = {
  recipes: Recipe[];
  publicRecipes: Recipe[];
  recentlyViewed: Recipe[];
  addRecentlyViewed: (recipe: Recipe) => Promise<void>;
  addRecipe: (
    title: string,
    ingredients: string,
    instructions: string,
    isPublic: boolean,
    imageUri?: string,
    description?: string,
    tags?: string[]
  ) => Promise<void>;
  editRecipe: (
    id: string,
    title: string,
    ingredients: string,
    instructions: string,
    isPublic: boolean,
    imageUri?: string,
    description?: string,
    tags?: string[]
  ) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  refreshRecipes: () => Promise<void>;
  markRecipeViewed: (recipe: Recipe) => Promise<void>;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);
const PUBLIC_KEY = 'recipes_public';
const RECENT_PREFIX = 'recentlyViewed_';

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Recipe[]>([]);

  useEffect(() => {
    refreshRecipes();
  }, [user]);

  const refreshRecipes = async () => {
    if (!user) {
      setRecipes([]);
      setRecentlyViewed([]);
      return;
    }
    try {
      const userKey = `recipes_${user.username}`;
      const stored = await AsyncStorage.getItem(userKey);
      setRecipes(stored ? JSON.parse(stored) : []);
      const storedPublic = await AsyncStorage.getItem(PUBLIC_KEY);
      const parsedPublic = storedPublic ? JSON.parse(storedPublic) : [];
      setPublicRecipes(parsedPublic.reverse());
      const recentKey = `${RECENT_PREFIX}${user.username}`;
      const storedRecent = await AsyncStorage.getItem(recentKey);
      setRecentlyViewed(storedRecent ? JSON.parse(storedRecent) : []);
    } catch (err) {
      console.log('Failed refresh:', err);
    }
  };

  const saveUserRecipes = async (updated: Recipe[]) => {
    if (!user) return;
    const key = `recipes_${user.username}`;
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    setRecipes(updated);
  };

  const savePublicRecipes = async (updated: Recipe[]) => {
    await AsyncStorage.setItem(PUBLIC_KEY, JSON.stringify(updated));
    setPublicRecipes(updated.reverse());
  };

  const saveRecentlyViewed = async (items: Recipe[]) => {
    if (!user) return;
    const key = `${RECENT_PREFIX}${user.username}`;
    await AsyncStorage.setItem(key, JSON.stringify(items));
    setRecentlyViewed(items);
  };

  const addRecipe = async (
    title: string,
    ingredients: string,
    instructions: string,
    isPublic: boolean,
    imageUri?: string,
    description?: string,
    tags?: string[]
  ) => {
    if (!user) return;
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      title,
      ingredients,
      instructions,
      username: user.username,
      isPublic,
      imageUri,
      description,
      tags,
    };
    const updatedUser = [...recipes, newRecipe];
    await saveUserRecipes(updatedUser);
    if (isPublic) {
      const updatedPublic = [...publicRecipes, newRecipe];
      await savePublicRecipes(updatedPublic);
    }
    await refreshRecipes();
  };

  const editRecipe = async (
    id: string,
    title: string,
    ingredients: string,
    instructions: string,
    isPublic: boolean,
    imageUri?: string,
    description?: string,
    tags?: string[]
  ) => {
    if (!user) return;
    const updated: Recipe = {
      id,
      title,
      ingredients,
      instructions,
      isPublic,
      imageUri,
      username: user.username,
      description,
      tags,
    };
    const updatedUser = recipes.map(r => (r.id === id ? updated : r));
    await saveUserRecipes(updatedUser);
    const filteredPublic = publicRecipes.filter(r => r.id !== id);
    if (isPublic) filteredPublic.push(updated);
    await savePublicRecipes(filteredPublic);
    await refreshRecipes();
  };

  const deleteRecipe = async (id: string) => {
    if (!user) return;
    const updatedUser = recipes.filter(r => r.id !== id);
    await saveUserRecipes(updatedUser);
    const updatedPublic = publicRecipes.filter(r => r.id !== id);
    await savePublicRecipes(updatedPublic);
    await refreshRecipes();
  };

  const markRecipeViewed = async (recipe: Recipe) => {
    if (!user) return;
    const filtered = recentlyViewed.filter(r => r.id !== recipe.id);
    const updated = [recipe, ...filtered].slice(0, 10);
    await saveRecentlyViewed(updated);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        publicRecipes,
        recentlyViewed,
        addRecentlyViewed: markRecipeViewed,
        addRecipe,
        editRecipe,
        deleteRecipe,
        refreshRecipes,
        markRecipeViewed,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error('useRecipes must be used inside RecipeProvider');
  return ctx;
};
