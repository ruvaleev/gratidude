import "@/i18n";
import type { Scene } from "@/garden/types";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

/**
 * The day against the person's own aim. Deliberately shows both numbers rather
 * than a percentage — "3 / 5" is a nudge, "60%" is a grade.
 */
export default function DayProgress({ scene }: { scene: Scene }) {
  const { t } = useTranslation();
  const settings = useAppSelector((state) => state.settings);

  return (
    <View style={styles.row} testID="dayProgress">
      <View style={styles.stat}>
        <Text style={styles.value} testID="praisesProgress">
          {scene.praisePoints}
          <Text style={styles.goal}> / {settings.goals.praises}</Text>
        </Text>
        <Text style={styles.label}>{t("garden.praisesLabel")}</Text>
      </View>

      {settings.tracks.gratitudes && (
        <View style={styles.stat}>
          <Text style={styles.value} testID="gratitudesProgress">
            {scene.gratitudePoints}
            <Text style={styles.goal}> / {settings.goals.gratitudes}</Text>
          </Text>
          <Text style={styles.label}>{t("garden.gratitudesLabel")}</Text>
        </View>
      )}

      {scene.goalReached && (
        <Text style={styles.badge} testID="goalReachedBadge">
          {t("garden.goalReached")}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  stat: {
    alignItems: "center",
  },
  value: {
    fontSize: 22,
    fontWeight: "300",
    color: "#292524", // stone-800
  },
  goal: {
    fontSize: 15,
    color: "#a8a29e", // stone-400
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 3,
    color: "#a8a29e",
    marginTop: 2,
    fontWeight: "300",
  },
  badge: {
    position: "absolute",
    right: 24,
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#b08423",
  },
});
