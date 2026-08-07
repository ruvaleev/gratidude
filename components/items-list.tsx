import { colors } from "@/constants/theme";
import type { Entry } from "@/store/types";
import { StyleSheet, Text, View } from "react-native";

export default function ItemsList({ items, testID }: { items: Entry[], testID: string }) {
  return (
    items.length > 0
      ? (
        <View style={styles.listContainer} testID={testID}>
          {items.map((item: Entry) => (
            <View key={item.id} style={styles.listItem}>
              <Text style={styles.sectionTitle}>{item.text}</Text>
            </View>
          ))}
        </View>
      )
      : null
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 1,
    color: colors.text, // stone-700
  },
  listContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft, // stone-200/50
    gap: 16,
  },
  listItem: {
    paddingHorizontal: 16,
  },
});
