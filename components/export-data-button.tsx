import { convertStoreToCSV } from "@/utils/csvUtils";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { useStore } from "react-redux";
import type { RootState } from "@/store";

export default function ExportDataButton() {
  const [isExporting, setIsExporting] = useState(false);
  const store = useStore<RootState>();
  const { t } = useTranslation();

  const exportToCSV = async () => {
    try {
      setIsExporting(true);

      const storeData = store.getState();
      const csvContent = convertStoreToCSV(storeData);
      const fileName = "gratitude_backup.csv";

      if (Platform.OS === "web") {
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        const documentDir = FileSystem.documentDirectory;
        if (!documentDir) {
          throw new Error("Document directory not available");
        }
        const fileUri = `${documentDir}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "text/csv",
            dialogTitle: t("index.exportData", "Export data"),
          });
        } else {
          Alert.alert(
            t("index.fileSaved", "File saved"),
            `${t("index.fileSavedAt", "File saved at")}: ${fileUri}`,
            [{ text: "OK" }]
          );
        }
      }

      if (Platform.OS !== "web") {
        Alert.alert(
          t("index.exportSuccess", "Success"),
          t("index.exportSuccessMessage", "Data exported to CSV successfully")
        );
      }
    } catch (error) {
      console.error("Export error:", error);
      if (Platform.OS === "web") {
        window.alert(t("index.exportErrorMessage", "Failed to export data"));
      } else {
        Alert.alert(
          t("index.exportError", "Error"),
          t("index.exportErrorMessage", "Failed to export data")
        );
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    if (Platform.OS === "web") {
      // Alert.alert is a no-op on web (react-native-web), export directly
      exportToCSV();
    } else {
      Alert.alert(
        t("index.exportData", "Export data"),
        t("index.exportConfirm", "Export all gratitudes and praises to CSV?"),
        [
          { text: t("index.cancel", "Cancel"), style: "cancel" },
          { text: t("index.export", "Export"), onPress: exportToCSV },
        ]
      );
    }
  };

  return (
    <Pressable
      testID="exportDataButton"
      style={[styles.menuItem, isExporting && styles.menuItemDisabled]}
      onPress={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <ActivityIndicator size="small" color="#a8a29e" />
      ) : (
        <>
          <Ionicons
            name="download-outline"
            size={16}
            color="#a8a29e"
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>
            {t("index.exportToCsv", "Export to CSV")}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(231, 229, 228, 0.5)",
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 8,
  },
  menuItemText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 4,
    color: "#a8a29e",
    fontWeight: "300",
  },
});
