import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Shared ‹ title › header for the week and month maps. */
export default function PeriodNav({
  title,
  onPrevious,
  onNext,
  nextDisabled = false,
  testID,
}: {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  testID: string;
}) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onPrevious} style={styles.button} testID={`${testID}Previous`}>
        <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
      </Pressable>

      <Text style={styles.title} testID={`${testID}Title`}>
        {title}
      </Text>

      <Pressable
        onPress={onNext}
        disabled={nextDisabled}
        style={[styles.button, nextDisabled && styles.disabled]}
        testID={`${testID}Next`}
      >
        <Ionicons name="chevron-forward" size={20} color={nextDisabled ? colors.textDisabled : colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 16,
  },
  button: {
    padding: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 16,
    color: colors.text, // stone-700
    fontWeight: "300",
    letterSpacing: 1,
    minWidth: 160,
    textAlign: "center",
    textTransform: "capitalize",
  },
});
