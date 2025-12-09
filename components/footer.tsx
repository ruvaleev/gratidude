import "@/i18n";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function Footer(
  { gratitudesLength, praisesLength }:
  { gratitudesLength: number, praisesLength: number }
) {
  const { t } = useTranslation();
  
  return (
    <View style={styles.footer}>
      <View style={styles.footerStat}>
        <Text style={styles.footerStatNumber}>{gratitudesLength}</Text>
        <Text style={styles.footerStatLabel}>{t("index.gratitudes")}</Text>
      </View>
      <View style={styles.footerStat}>
        <Text style={styles.footerStatNumber}>{praisesLength}</Text>
        <Text style={styles.footerStatLabel}>{t("index.praises")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(231, 229, 228, 0.5)", // stone-200/50
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 48,
  },
  footerStat: {
    alignItems: "center",
  },
  footerStatNumber: {
    fontSize: 30,
    fontWeight: "300",
    color: "#292524", // stone-800
  },
  footerStatLabel: {
    fontSize: 12,
    color: "#a8a29e", // stone-400
    textTransform: "uppercase",
    letterSpacing: 4,
    marginTop: 4,
    fontWeight: "300",
  },
});
