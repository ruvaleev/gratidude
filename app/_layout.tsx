import { Stack } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store";

export default function RootLayout() {
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ headerShown: false }} 
          />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
