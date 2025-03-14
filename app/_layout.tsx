import { Stack } from "expo-router";
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { MensaProvider } from '@/context/MensaContext';
import { RoleProvider } from "@/context/RoleContext";
import { ThemeProvider, useThemeContext } from '@/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { themeColors } = useThemeContext();

  const theme = {
    ...DefaultTheme,
    colors: themeColors,
  };

  return (
    <PaperProvider theme={theme}>
      <MensaProvider>
        <RoleProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </RoleProvider>
      </MensaProvider>
    </PaperProvider>
  );
}
