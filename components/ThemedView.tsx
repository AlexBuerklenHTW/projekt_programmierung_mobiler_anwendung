import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor: string;
  darkColor: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  const validBackgroundColor = typeof backgroundColor === 'string' ? backgroundColor : 'transparent';

  return <View style={[{ backgroundColor: validBackgroundColor }, style]} {...otherProps} />;
}
