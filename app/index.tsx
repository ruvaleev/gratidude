import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import "../i18n";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addGratitude } from "../store/slices/gratitudesSlice";
import { addPraise } from "../store/slices/praisesSlice";

export default function Index() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const gratitudes = useAppSelector((state) => state.gratitudes.items);
  const praises = useAppSelector((state) => state.praises.items);
  
  const [gratitudeText, setGratitudeText] = useState("");
  const [praiseText, setPraiseText] = useState("");

  const handleGratitudeSubmit = () => {
    if (gratitudeText.trim()) {
      dispatch(addGratitude(gratitudeText));
      setGratitudeText("");
    }
  };

  const handlePraiseSubmit = () => {
    if (praiseText.trim()) {
      dispatch(addPraise(praiseText));
      setPraiseText("");
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
        <Pressable style={styles.button} onPress={handleGratitudeSubmit}>
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("index.praisePlaceholder")}
          value={praiseText}
          onChangeText={setPraiseText}
        />
        <Pressable style={[styles.button, styles.praiseButton]} onPress={handlePraiseSubmit}>
          <Text style={styles.buttonText}>{t("index.praiseSubmitButton")}</Text>
        </Pressable>
      </View>

      <View style={styles.praisesList} testID="praisesList">
        {praises.map((praise, index) => (
          <Text key={index} style={styles.praiseItem}>
            {praise}
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
  praiseButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  gratitudesList: {
    marginBottom: 20,
  },
  gratitudeItem: {
    fontSize: 16,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  praisesList: {
    marginBottom: 20,
  },
  praiseItem: {
    fontSize: 16,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
  },
});
