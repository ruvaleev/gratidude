import ItemsList from "@/components/items-list";
import "@/i18n";
import type { Entry } from "@/store/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Section(
  { title, items, sectionId, onSubmit, buttonText }:
  { title: string, items: Entry[], sectionId: string, onSubmit: (value: string) => void, buttonText: string }
) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <ItemsList items={items} testID={`${sectionId}List`} />
      <TextInput
        testID={`${sectionId}Input`}
        style={styles.input}
        placeholder={t("index.placeholder")}
        placeholderTextColor="#a8a29e"
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
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
    color: "#44403c", // stone-700
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(231, 229, 228, 0.5)", // stone-200/50
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#292524", // stone-800
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#44403c", // stone-700
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#d6d3d1", // stone-300
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "300",
    textTransform: "uppercase",
    letterSpacing: 4,
  },
});
