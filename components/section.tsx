import { colors } from "@/constants/theme";
import ItemsList from "@/components/items-list";
import "@/i18n";
import type { Entry } from "@/store/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Section(
  { title, items, sectionId, onSubmit, buttonText, onFieldFocus }:
  {
    title: string,
    items: Entry[],
    sectionId: string,
    onSubmit: (value: string) => void,
    buttonText: string,
    /**
     * Called when the field is focused, with the offset of the section's bottom
     * edge in the page. The field and its button sit there, so that is the
     * point the screen has to lift above the keyboard.
     */
    onFieldFocus?: (sectionBottom: number) => void,
  }
) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [bottomY, setBottomY] = useState(0);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <View
      style={styles.section}
      testID={`${sectionId}Section`}
      onLayout={(event) => {
        const { y, height } = event.nativeEvent.layout;
        setBottomY(y + height);
      }}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <ItemsList items={items} testID={`${sectionId}List`} />
      <TextInput
        testID={`${sectionId}Input`}
        style={styles.input}
        placeholder={t("index.placeholder")}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        onFocus={() => onFieldFocus?.(bottomY)}
        // Keep the keyboard up after Enter — entries usually come in a run.
        submitBehavior="submit"
      />
      
      <Pressable 
        testID={`${sectionId}SubmitButton`}
        style={[styles.button, !value.trim() && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={!value.trim()}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 32,
    gap: 24,
    marginBottom: 48,
  },
  sectionHeader: {
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 1,
    color: colors.text, // stone-700
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSoft, // stone-200/50
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textStrong, // stone-800
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.text, // stone-700
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.textDisabled, // stone-300
  },
  buttonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "300",
    textTransform: "uppercase",
    letterSpacing: 4,
  },
});
