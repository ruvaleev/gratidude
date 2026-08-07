import { colors } from "@/constants/theme";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function InspirationSection() {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text testID="inspirationText" style={styles.text}>{t("index.inspiration")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft, // stone-200/50
    justifyContent: "center",
    paddingVertical: 16,
    width: '100%'
  },
  text: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 4,
    color: colors.textMuted, // stone-400
    fontWeight: "300",
  },
});
