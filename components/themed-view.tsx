import { View, type ViewProps } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'background' | 'surface' | 'surfaceAlt';
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'background',
  ...otherProps
}: ThemedViewProps) {
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];
  const colorKey = variant ?? 'background';
  const backgroundColor =
    lightColor || darkColor
      ? useThemeColor({ light: lightColor, dark: darkColor }, 'background')
      : palette[colorKey];

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
