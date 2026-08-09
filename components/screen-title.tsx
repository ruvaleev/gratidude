import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Title row for screens that live outside the tab bar.
 *
 * They used to be pushed onto the root stack and borrow its native header;
 * now that they sit inside the tab group — so that both bars stay on screen —
 * the name and the way back have to come from the screen itself.
 */
export default function ScreenTitle({ title, testID }: { title: string; testID?: string }) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.back()}
        style={styles.back}
        accessibilityLabel={title}
        testID={testID}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textSubtle} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  back: {
    padding: 4,
    marginLeft: -8,
  },
  title: {
    fontSize: 20,
    color: colors.textStrong,
    fontWeight: "300",
  },
});
