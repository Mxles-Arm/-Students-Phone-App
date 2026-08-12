import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* PaperProvider supplies the icon font used by <Icon source="..." />. */}
      <PaperProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name='index' />
          <Stack.Screen name='addPhone' />
          <Stack.Screen name='editPhone' />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
