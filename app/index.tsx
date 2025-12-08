import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import "../i18n";

export default function Index() {
  const { t } = useTranslation();
  const [gratitudeText, setGratitudeText] = useState("");
  const [gratitudes, setGratitudes] = useState<string[]>([]);

  const handleSubmit = () => {
    if (gratitudeText.trim()) {
      setGratitudes([...gratitudes, gratitudeText]);
      setGratitudeText("");
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("index.gratitudePlaceholder")}
          value={gratitudeText}
          onChangeText={setGratitudeText}
        />
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t("index.gratitudeSubmitButton")}</Text>
        </Pressable>
      </View>

      <View style={styles.gratitudesList} testID="gratitudesList">
        {gratitudes.map((gratitude, index) => (
          <Text key={index} style={styles.gratitudeItem}>
            {gratitude}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  gratitudesList: {
    flex: 1,
  },
  gratitudeItem: {
    fontSize: 16,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
});
