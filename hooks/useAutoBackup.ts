import type { RootState } from "@/store";
import { convertStoreToCSV } from "@/utils/csvUtils";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useStore } from "react-redux";

const DEBOUNCE_MS = 2000;

/**
 * On Android: automatically saves Redux gratitudes/praises to CSV file
 * when data changes. No dialogs, no permissions (documentDirectory).
 * If documentDirectory is null, uses Storage Access Framework (one-time folder pick).
 */

// TODO: To Fix
export default function useAutoBackup() {
  const store = useStore<RootState>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGratitudesRef = useRef<string>("");
  const lastPraisesRef = useRef<string>("");

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const saveBackup = async () => {
      try {
        const state = store.getState();
        const csvContent = convertStoreToCSV(state);

        // 1. Сохраняем во временный файл
        const tempUri = `${FileSystem.cacheDirectory}gratitude_temp_${Date.now()}.csv`;
        await FileSystem.writeAsStringAsync(tempUri, csvContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // 2. Копируем в MediaLibrary
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status !== 'granted') {
          console.log("Нет разрешения на медиатеку, пропускаем бэкап");
          return;
        }

        const asset = await MediaLibrary.createAssetAsync(tempUri);
        const album = await MediaLibrary.getAlbumAsync('GratitudeBackups');
        
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync('GratitudeBackups', asset, false);
        }

        // 3. Очищаем временный файл
        await FileSystem.deleteAsync(tempUri);
        
        console.log('Авто-бэкап создан в медиатеке');
      } catch (error) {
        console.error("Auto backup failed:", error);
      }
    };

    const scheduleBackup = () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(
        () => saveBackup().catch((err) => console.error("Auto backup failed:", err)),
        DEBOUNCE_MS
      );
    };

    // Initial backup on mount (store is already rehydrated via PersistGate)
    saveBackup().catch((err) => console.error("Auto backup failed:", err));

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const gratitudesStr = JSON.stringify(state.gratitudes?.items ?? {});
      const praisesStr = JSON.stringify(state.praises?.items ?? {});

      if (
        gratitudesStr !== lastGratitudesRef.current ||
        praisesStr !== lastPraisesRef.current
      ) {
        lastGratitudesRef.current = gratitudesStr;
        lastPraisesRef.current = praisesStr;
        scheduleBackup();
      }
    });

    return () => {
      unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [store]);
}
