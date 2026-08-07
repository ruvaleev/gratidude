import InspirationSection from "@/components/header/inspiration-section";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <InspirationSection />
      <Link href="/settings" asChild>
        <Pressable style={styles.settingsButton} testID="settingsButton">
          <Ionicons name="settings-outline" size={22} color="#a8a29e" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 100,
  },
  settingsButton: {
    position: "absolute",
    right: 8,
    top: 20,
    padding: 8,
  },
});
