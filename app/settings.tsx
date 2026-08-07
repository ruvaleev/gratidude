import ExportDataButton from "@/components/export-data-button";
import {
  SettingsSection,
  StepperRow,
  ToggleRow,
} from "@/components/settings/setting-row";
import i18n from "@/i18n";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocale } from "@/store/slices/localeSlice";
import {
  GOAL_MAX,
  GOAL_MIN,
  setGoal,
  setTrackEnabled,
} from "@/store/slices/settingsSlice";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOCALES = ["en", "ru"];

export default function SettingsScreen() {
  const { t, i18n: i18nInstance } = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const bothTracksOn = settings.tracks.praises && settings.tracks.gratitudes;

  const changeLocale = (locale: string) => {
    i18n.changeLanguage(locale);
    dispatch(setLocale(locale));
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsSection
          title={t("settings.tracksSection")}
          hint={bothTracksOn ? undefined : t("settings.lastTrackHint")}
        >
          <ToggleRow
            label={t("settings.praisesTrack")}
            value={settings.tracks.praises}
            // The last remaining diary can't be switched off.
            disabled={settings.tracks.praises && !settings.tracks.gratitudes}
            onChange={(enabled) =>
              dispatch(setTrackEnabled({ track: "praises", enabled }))
            }
            testID="praisesTrackToggle"
          />
          <ToggleRow
            label={t("settings.gratitudesTrack")}
            value={settings.tracks.gratitudes}
            disabled={settings.tracks.gratitudes && !settings.tracks.praises}
            onChange={(enabled) =>
              dispatch(setTrackEnabled({ track: "gratitudes", enabled }))
            }
            testID="gratitudesTrackToggle"
          />
        </SettingsSection>

        <SettingsSection title={t("settings.goalsSection")} hint={t("settings.goalHint")}>
          {settings.tracks.praises && (
            <StepperRow
              label={t("settings.praisesGoal")}
              value={settings.goals.praises}
              onChange={(goal) => dispatch(setGoal({ track: "praises", goal }))}
              min={GOAL_MIN}
              max={GOAL_MAX}
              decreaseLabel={t("settings.decrease")}
              increaseLabel={t("settings.increase")}
              testID="praisesGoal"
            />
          )}
          {settings.tracks.gratitudes && (
            <StepperRow
              label={t("settings.gratitudesGoal")}
              value={settings.goals.gratitudes}
              onChange={(goal) => dispatch(setGoal({ track: "gratitudes", goal }))}
              min={GOAL_MIN}
              max={GOAL_MAX}
              decreaseLabel={t("settings.decrease")}
              increaseLabel={t("settings.increase")}
              testID="gratitudesGoal"
            />
          )}
        </SettingsSection>

        <SettingsSection title={t("settings.languageSection")}>
          <View style={styles.localeRow}>
            {LOCALES.map((locale) => {
              const active = i18nInstance.language === locale;
              return (
                <Pressable
                  key={locale}
                  onPress={() => changeLocale(locale)}
                  style={[styles.localeButton, active && styles.localeButtonActive]}
                  testID={`localeButton${locale === "en" ? "En" : "Ru"}`}
                >
                  <Text style={[styles.localeText, active && styles.localeTextActive]}>
                    {locale.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </SettingsSection>

        <SettingsSection title={t("settings.dataSection")}>
          <ExportDataButton />
        </SettingsSection>

        {/* Development only — the workbench never ships to anyone's phone. */}
        {/*__DEV__ && ( */ /* temporary use it in any environment */
          true && ( /* temporary use it in any environment */
          <SettingsSection title="Разработка">
            <Link href="/playground" asChild>
              <Pressable style={styles.devRow} testID="playgroundLink">
                <Text style={styles.devText}>Песочница клумбы</Text>
                <Ionicons name="chevron-forward" size={18} color="#a8a29e" />
              </Pressable>
            </Link>
          </SettingsSection>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafaf9", // stone-50
  },
  content: {
    padding: 20,
    paddingBottom: 48,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
  },
  localeRow: {
    flexDirection: "row",
    padding: 10,
    gap: 8,
  },
  localeButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(231, 229, 228, 0.6)",
  },
  localeButtonActive: {
    backgroundColor: "#44403c", // stone-700
  },
  localeText: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#a8a29e",
    fontWeight: "300",
  },
  localeTextActive: {
    color: "#fafaf9",
    fontWeight: "500",
  },
  devRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  devText: {
    fontSize: 15,
    color: "#44403c",
    fontWeight: "300",
  },
});
