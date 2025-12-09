import "@/i18n";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function InspirationSection() {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t("index.inspiration")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(231, 229, 228, 0.5)", // stone-200/50
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 4,
    color: "#a8a29e", // stone-400
    fontWeight: "300",
  },
});
