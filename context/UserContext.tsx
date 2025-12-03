// usercontext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type User = {
  username: string;
  password: string;
  profilePic?: string | null;
};

type UserContextType = {
  user: User | null;
  users?: User[];
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsername: (newUsername: string) => Promise<void>;
  updateProfilePic: (profilePic: string | null) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfileName: (newName: string) => Promise<void>;
  updateProfilePassword: (newPassword: string) => Promise<void>;
  updateProfileImage: (profilePic: string | null) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Load current user on app start
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.username && parsed.password) setUserState(parsed);
      }
      const storedUsers = await AsyncStorage.getItem(USERS_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    })();
  }, []);

  // Save users array to AsyncStorage
  const saveUsers = async (users: User[]) => {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  // Register new user
  const register = async (username: string, password: string) => {
    const stored = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = stored ? JSON.parse(stored) : [];

    if (users.find(u => u.username === username)) throw new Error('Username already exists');

    const newUser: User = { username, password, profilePic: null };
    users.push(newUser);

    await saveUsers(users);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setUserState(newUser);
  };

  // Login
  const login = async (username: string, password: string) => {
    const stored = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = stored ? JSON.parse(stored) : [];

    const found = users.find(u => u.username === username && u.password === password);
    if (!found) return false;

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    setUserState(found);
    return true;
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setUserState(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Update username safely
  const updateUsername = async (newUsername: string) => {
    if (!user) return;

    const stored = await AsyncStorage.getItem(USERS_KEY);
    let users: User[] = stored ? JSON.parse(stored) : [];

    // Check if new username already exists
    if (users.find(u => u.username === newUsername)) {
      throw new Error('Username already exists');
    }

    // Remove old username completely
    users = users.filter(u => u.username !== user.username);

    const updatedUser = { ...user, username: newUsername };
    users.push(updatedUser);

    await saveUsers(users);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    setUserState(updatedUser);
    setUsers(users);
  };

  // Update profile picture
  const updateProfilePic = async (profilePic: string | null) => {
    if (!user) return;

    const stored = await AsyncStorage.getItem(USERS_KEY);
    let users: User[] = stored ? JSON.parse(stored) : [];

    users = users.map(u => u.username === user.username ? { ...u, profilePic } : u);

    await saveUsers(users);

    const updatedUser = { ...user, profilePic };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    setUserState(updatedUser);
    setUsers(users);
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    if (!user) return;

    const stored = await AsyncStorage.getItem(USERS_KEY);
    let users: User[] = stored ? JSON.parse(stored) : [];

    users = users.map(u => u.username === user.username ? { ...u, password: newPassword } : u);

    await saveUsers(users);

    const updatedUser = { ...user, password: newPassword };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    setUserState(updatedUser);
    setUsers(users);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        users,
        login,
        register,
        logout,
        updateUsername,
        updateProfilePic,
        updatePassword,
        updateProfileName: updateUsername,
        updateProfilePassword: updatePassword,
        updateProfileImage: updateProfilePic,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used inside UserProvider');
  return context;
};
