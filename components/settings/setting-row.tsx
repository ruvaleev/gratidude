import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

export function SettingsSection({
  title,
  children,
  hint,
}: {
  title: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function ToggleRow({
  label,
  value,
  onChange,
  disabled = false,
  testID,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  testID: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: "#7d9a5c", false: "#d6d3d1" }}
        thumbColor="#fafaf9"
        testID={testID}
      />
    </View>
  );
}

export function StepperRow({
  label,
  value,
  onChange,
  min,
  max,
  decreaseLabel,
  increaseLabel,
  testID,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  decreaseLabel: string;
  increaseLabel: string;
  testID: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable
          onPress={() => onChange(value - 1)}
          disabled={value <= min}
          style={[styles.stepButton, value <= min && styles.stepButtonDisabled]}
          accessibilityLabel={decreaseLabel}
          testID={`${testID}Decrease`}
        >
          <Text style={styles.stepText}>−</Text>
        </Pressable>

        <Text style={styles.stepValue} testID={`${testID}Value`}>
          {value}
        </Text>

        <Pressable
          onPress={() => onChange(value + 1)}
          disabled={value >= max}
          style={[styles.stepButton, value >= max && styles.stepButtonDisabled]}
          accessibilityLabel={increaseLabel}
          testID={`${testID}Increase`}
        >
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 3,
    color: "#a8a29e", // stone-400
    fontWeight: "300",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(231, 229, 228, 0.8)", // stone-200
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(231, 229, 228, 0.9)",
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: "#44403c", // stone-700
    fontWeight: "300",
  },
  hint: {
    fontSize: 12,
    color: "#a8a29e",
    fontWeight: "300",
    lineHeight: 17,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "rgba(231, 229, 228, 0.6)",
  },
  stepButtonDisabled: {
    opacity: 0.4,
  },
  stepText: {
    fontSize: 18,
    color: "#44403c",
    lineHeight: 22,
  },
  stepValue: {
    minWidth: 34,
    textAlign: "center",
    fontSize: 17,
    color: "#292524", // stone-800
    fontWeight: "400",
  },
});
