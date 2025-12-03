import { Platform } from 'react-native';

const pastelBlueberryCream = {
  light: {
    background: '#FFF8F0',
    surface: '#F5F6FF',
    surfaceAlt: '#EAEBFF',
    primary: '#7B8CFF',
    primarySoft: '#A9B6FF',
    secondary: '#FFBFD2',
    accentMint: '#A8E4D4',
    accentPeach: '#FFD8B5',
    textMain: '#1C2140',
    textMuted: '#6F7390',
    borderSubtle: '#E3E5F5',
    error: '#FF5C7A',
    success: '#2BAF7C',
  },
  dark: {
    background: '#070B1A',
    surface: '#10162B',
    surfaceAlt: '#181E3A',
    primary: '#9FAEFF',
    primarySoft: '#7B8CFF',
    secondary: '#FF9FBD',
    accentMint: '#8FE3D1',
    accentPeach: '#FFBC92',
    textMain: '#F5F4FF',
    textMuted: '#A5A9C4',
    borderSubtle: '#2B3252',
    error: '#FF6E86',
    success: '#3AD29D',
  },
};

export const borderRadiusXL = 28;
export const borderRadiusLG = 22;
export const spacingXS = 4;
export const spacingSM = 8;
export const spacingMD = 12;
export const spacingLG = 16;
export const spacingXL = 20;
export const spacing2XL = 24;

export const LightShadow = {
  shadowColor: '#AAB0D8',
  shadowOpacity: 0.15,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 3 },
  elevation: 4,
};

export const DarkShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.3,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
};

export const getCardShadow = (colorScheme: 'light' | 'dark' = 'light') =>
  colorScheme === 'dark' ? DarkShadow : LightShadow;

// Backward-compatible Colors export, now mapped to the Pastel Blueberry Cream palette.
export const Colors = {
  light: {
    ...pastelBlueberryCream.light,
    text: pastelBlueberryCream.light.textMain,
    tint: pastelBlueberryCream.light.primary,
    icon: pastelBlueberryCream.light.textMain,
    background: pastelBlueberryCream.light.background,
    tabIconDefault: pastelBlueberryCream.light.textMuted,
    tabIconSelected: pastelBlueberryCream.light.primary,
    primary: pastelBlueberryCream.light.primary,
    primaryDark: pastelBlueberryCream.light.primary,
    primaryLight: pastelBlueberryCream.light.primarySoft,
    primarySoft: pastelBlueberryCream.light.primarySoft,
    secondary: pastelBlueberryCream.light.secondary,
    accentMint: pastelBlueberryCream.light.accentMint,
    accentPeach: pastelBlueberryCream.light.accentPeach,
    cardBackground: pastelBlueberryCream.light.surface,
    surface: pastelBlueberryCream.light.surface,
    surfaceAlt: pastelBlueberryCream.light.surfaceAlt,
    gradientLight: pastelBlueberryCream.light.primarySoft,
    gradientDark: pastelBlueberryCream.light.primary,
    textDark: pastelBlueberryCream.light.textMain,
    textMedium: pastelBlueberryCream.light.textMuted,
    textLight: pastelBlueberryCream.light.primarySoft,
    borderSubtle: pastelBlueberryCream.light.borderSubtle,
    error: pastelBlueberryCream.light.error,
    success: pastelBlueberryCream.light.success,
  },
  dark: {
    ...pastelBlueberryCream.dark,
    text: pastelBlueberryCream.dark.textMain,
    tint: pastelBlueberryCream.dark.primary,
    icon: pastelBlueberryCream.dark.textMain,
    background: pastelBlueberryCream.dark.background,
    tabIconDefault: pastelBlueberryCream.dark.textMuted,
    tabIconSelected: pastelBlueberryCream.dark.primary,
    primary: pastelBlueberryCream.dark.primary,
    primaryDark: pastelBlueberryCream.dark.primary,
    primaryLight: pastelBlueberryCream.dark.primarySoft,
    primarySoft: pastelBlueberryCream.dark.primarySoft,
    secondary: pastelBlueberryCream.dark.secondary,
    accentMint: pastelBlueberryCream.dark.accentMint,
    accentPeach: pastelBlueberryCream.dark.accentPeach,
    cardBackground: pastelBlueberryCream.dark.surface,
    surface: pastelBlueberryCream.dark.surface,
    surfaceAlt: pastelBlueberryCream.dark.surfaceAlt,
    gradientLight: pastelBlueberryCream.dark.primary,
    gradientDark: pastelBlueberryCream.dark.surfaceAlt,
    textDark: pastelBlueberryCream.dark.textMain,
    textMedium: pastelBlueberryCream.dark.textMuted,
    textLight: pastelBlueberryCream.dark.primarySoft,
    borderSubtle: pastelBlueberryCream.dark.borderSubtle,
    error: pastelBlueberryCream.dark.error,
    success: pastelBlueberryCream.dark.success,
  },
};

export const Gradients = {
  splashLight: ['#7B8CFF', '#A9B6FF', '#FFF8F0'] as const,
  splashDark: ['#070B1A', '#181E3A', '#7B8CFF'] as const,
  authLight: ['#7B8CFF', '#A9B6FF', '#FFBFD2'] as const,
  authDark: ['#070B1A', '#181E3A', '#9FAEFF'] as const,
  tabsHeaderLight: ['#F3F1FF', '#FFF8F0'] as const,
  tabsHeaderDark: ['#10162B', '#181E3A'] as const,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
