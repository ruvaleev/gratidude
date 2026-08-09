import useLocale from "@/hooks/useLocal";
import "@/i18n";
import { Stack } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store";

function RootLayoutContent() {
  useLocale();
  // useAutoBackup();

  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        console.error(`Error fetching latest Expo update: ${error}`);
      }
    }

    // Check for updates in production/preview builds (not in dev mode)
    // Note: checkAutomatically: "ON_LOAD" in app.json also handles this automatically,
    // but this manual check provides more control and immediate feedback
    if (!__DEV__ && Updates.isEnabled) {
      onFetchUpdateAsync();
    }
  }, []);

  return (
    // Every route lives in the tab group, so the two bars never leave the screen.
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootLayoutContent />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
