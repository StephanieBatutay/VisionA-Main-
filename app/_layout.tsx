import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Camera Screen */}
        <Stack.Screen
          name="camera"
          options={{
            headerShown: false,
            title: "Camera",
          }}
        />

        {/* Preview Screen */}
        <Stack.Screen
          name="preview"
          options={{
            headerShown: false,
            title: "Preview",
          }}
        />

        {/* Result Screen */}
        <Stack.Screen
          name="result"
          options={{
            headerShown: false,
            title: "Result",
          }}
        />

        {/* Modal */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
