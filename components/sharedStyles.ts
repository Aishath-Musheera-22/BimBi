import { StyleSheet } from 'react-native';

import {
  Colors,
  LightShadow,
  DarkShadow,
  borderRadiusXL,
  spacingXL,
  getCardShadow,
} from '@/constants/theme';

type Scheme = 'light' | 'dark';

const chipShadowLight = {
  shadowColor: '#BFC7FF',
  shadowOpacity: 0.2,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
};

const chipShadowDark = {
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
};

export const createSharedStyles = (colorScheme: Scheme = 'light') => {
  const palette = Colors[colorScheme];
  const shadow = getCardShadow(colorScheme);
  const chipShadow = colorScheme === 'dark' ? chipShadowDark : chipShadowLight;

  return StyleSheet.create({
    primaryButton: {
      backgroundColor: palette.primary,
      borderRadius: borderRadiusXL,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: palette.primarySoft,
      borderRadius: borderRadiusXL,
      paddingVertical: 12,
      paddingHorizontal: 18,
    },
    secondaryButtonText: {
      color: palette.primary,
      fontWeight: '500',
    },
    destructiveButton: {
      backgroundColor: palette.secondary,
      borderRadius: borderRadiusXL,
      paddingVertical: 12,
      paddingHorizontal: 18,
    },
    destructiveButtonText: {
      color: '#7D1233',
      fontWeight: '500',
    },
    tagChip: {
      backgroundColor: '#F1F2FF',
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    tagChipText: {
      color: palette.primary,
    },
    tagChipActive: {
      backgroundColor: palette.primary,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      ...chipShadow,
    },
    tagChipActiveText: {
      color: '#FFFFFF',
    },
    mintChip: {
      backgroundColor: palette.accentMint,
      borderRadius: 18,
      paddingVertical: 4,
      paddingHorizontal: 10,
    },
    mintChipText: {
      color: palette.textMain,
      fontWeight: '700',
    },
    card: {
      backgroundColor: palette.surface,
      borderRadius: borderRadiusXL,
      padding: spacingXL,
      ...shadow,
    },
  });
};

export const Shadows = { LightShadow, DarkShadow };
