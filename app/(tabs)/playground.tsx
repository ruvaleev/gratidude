import ScreenTitle from "@/components/screen-title";
import { SettingsSection, StepperRow } from "@/components/settings/setting-row";
import { colors } from "@/constants/theme";
import GardenBed from "@/garden/components/GardenBed";
import { MAX_PLANTS, SEASON_FLOWERS } from "@/garden/config";
import { buildScene } from "@/garden/scene";
import type { GardenSettings } from "@/garden/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  applyPreset,
  COUNT_MAX,
  COUNT_MIN,
  DAY_MAX,
  DAY_MIN,
  PRESETS,
  setCount,
  setDay,
  setMonth,
  setPlaygroundGoal,
  setPointsEnabled,
  setSpread,
  SPREADS,
  type Spread,
  type TrackDials,
} from "@/store/slices/playgroundSlice";
import type { TrackName } from "@/store/slices/settingsSlice";
import type { Entry } from "@/store/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";

/**
 * A workbench for the garden. Its dials live in `playgroundSlice`, but the
 * entries they describe are synthetic and never leave this screen, so turning
 * a knob here can't touch a real diary. Reachable from Settings.
 */

const GOAL_LIMITS = { min: 1, max: 15 };

/** Spreads a track's points across its entries the way the dial asks. */
function pointsFor(spread: Spread, index: number, scale: number): number {
  if (spread === "low") return 1;
  if (spread === "high") return scale;
  return 1 + (index % scale);
}

export default function PlaygroundScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const dials = useAppSelector((state) => state.playground);

  // Both tracks always run here: this is a sandbox, and a track you don't want
  // to look at is a track you simply leave empty.
  const settings: GardenSettings = useMemo(
    () => ({
      tracks: { praises: true, gratitudes: true },
      goals: dials.goals,
      points: { enabled: dials.pointsEnabled, scale: 3 },
    }),
    [dials.goals, dials.pointsEnabled]
  );

  const date = `${String(dials.day).padStart(2, "0")}.${String(dials.month).padStart(2, "0")}.2026`;

  const dayInput = useMemo(() => {
    const make = (prefix: string, track: TrackDials): Entry[] =>
      Array.from({ length: track.count }, (_, index) => ({
        id: `${prefix}-${index}`,
        text: `${prefix} ${index + 1}`,
        points: pointsFor(track.spread, index, 3),
        createdAt: "",
      }));

    return {
      date,
      praises: make("p", dials.praises),
      gratitudes: make("g", dials.gratitudes),
    };
  }, [date, dials.praises, dials.gratitudes]);

  const dayScene = useMemo(
    () => buildScene(dayInput, settings, { variant: "day" }),
    [dayInput, settings]
  );
  const tileScene = useMemo(
    () => buildScene(dayInput, settings, { variant: "tile" }),
    [dayInput, settings]
  );

  const bedSize = Math.min(width - 48, 320);
  const stages = dayScene.plants.reduce<Record<string, number>>((counts, plant) => {
    counts[plant.stage] = (counts[plant.stage] || 0) + 1;
    return counts;
  }, {});

  const readout: [string, string][] = [
    [t("playground.readout.praisePoints"), `${dayScene.praisePoints}`],
    [t("playground.readout.progress"), dayScene.praiseProgress.toFixed(2)],
    [
      t("playground.readout.light"),
      dayScene.lightLevel === null
        ? t("playground.readout.lightOff")
        : dayScene.lightLevel.toFixed(2),
    ],
    [t("playground.readout.plants"), `${dayScene.plants.length} / ${MAX_PLANTS.day}`],
    [t("playground.readout.onTile"), `${tileScene.plants.length} / ${MAX_PLANTS.tile}`],
    [t("playground.readout.sparks"), `${dayScene.sparks.length}`],
    [
      t("playground.readout.stages"),
      Object.entries(stages)
        .map(([stage, count]) => `${t(`garden.stages.${stage}`)}: ${count}`)
        .join(" · ") || t("playground.readout.none"),
    ],
    [t("playground.readout.seasonFlower"), t(`garden.flowers.${dayScene.season.name}`)],
  ];

  /** Presets, count and points spread for one track — the same block twice. */
  const renderTrack = (track: TrackName, testPrefix: string) => {
    const current = dials[track];
    const isPraises = track === "praises";

    return (
      <View style={styles.track}>
        <Text style={styles.trackTitle}>{t(`playground.tracks.${track}`)}</Text>

        <View style={styles.chips}>
          {PRESETS.map((preset) => {
            const active = current.preset === preset.key;
            return (
              <Pressable
                key={preset.key}
                onPress={() => dispatch(applyPreset({ track, preset: preset.key }))}
                style={[styles.chip, active && styles.chipActive]}
                testID={`${testPrefix}Preset-${preset.key}`}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {t(`playground.presets.${preset.key}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.dialRow}>
          <Text style={styles.dialLabel}>{t("playground.entries")}</Text>
          <Stepper
            value={current.count}
            onChange={(count) => dispatch(setCount({ track, count }))}
            min={COUNT_MIN}
            max={COUNT_MAX}
            decreaseLabel={t("playground.decrease")}
            increaseLabel={t("playground.increase")}
            testID={`${testPrefix}Count`}
          />
        </View>

        <View style={styles.dialColumn}>
          <Text style={styles.dialLabel}>{t("playground.pointsSpread")}</Text>
          <View style={styles.seg}>
            {/*
              Points only ever change how a *plant* reads, so the switch that
              turns them off belongs to this track and to no other. With it off
              the spread below still feeds the fireflies, but the bed grows by
              how full the day is — which is how the app behaves by default.
            */}
            {isPraises && (
              <Pressable
                onPress={() => dispatch(setPointsEnabled(false))}
                style={[styles.segButton, !dials.pointsEnabled && styles.segButtonActive]}
                testID={`${testPrefix}Spread-off`}
              >
                <Text style={[styles.segText, !dials.pointsEnabled && styles.segTextActive]}>
                  {t("playground.spreads.off")}
                </Text>
              </Pressable>
            )}
            {SPREADS.map((spread) => {
              const active =
                current.spread === spread && (!isPraises || dials.pointsEnabled);
              return (
                <Pressable
                  key={spread}
                  onPress={() => {
                    dispatch(setSpread({ track, spread }));
                    if (isPraises) dispatch(setPointsEnabled(true));
                  }}
                  style={[styles.segButton, active && styles.segButtonActive]}
                  testID={`${testPrefix}Spread-${spread}`}
                >
                  <Text style={[styles.segText, active && styles.segTextActive]}>
                    {t(`playground.spreads.${spread}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title={t("playground.title")} testID="playgroundBack" />

        <View style={styles.stage}>
          <GardenBed scene={dayScene} size={bedSize} />
          <View style={styles.tiles}>
            <View style={styles.tileBox}>
              <GardenBed scene={tileScene} size={44} />
              <Text style={styles.tileLabel}>{t("playground.tileSmall")}</Text>
            </View>
            <View style={styles.tileBox}>
              <GardenBed scene={tileScene} size={120} />
              <Text style={styles.tileLabel}>{t("playground.tileLarge")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.readout}>
          {readout.map(([label, value]) => (
            <View key={label} style={styles.readoutRow}>
              <Text style={styles.readoutLabel}>{label}</Text>
              <Text style={styles.readoutValue}>{value}</Text>
            </View>
          ))}
        </View>

        <SettingsSection
          title={t("playground.presetsSection")}
          hint={
            dials.pointsEnabled
              ? t("playground.pointsOnHint")
              : t("playground.pointsOffHint")
          }
        >
          {renderTrack("praises", "pgPraises")}
          {renderTrack("gratitudes", "pgGratitudes")}
        </SettingsSection>

        <SettingsSection title={t("playground.goalsSection")} hint={t("playground.goalsHint")}>
          <StepperRow
            label={t("playground.praisesGoal")}
            value={dials.goals.praises}
            onChange={(goal) => dispatch(setPlaygroundGoal({ track: "praises", goal }))}
            min={GOAL_LIMITS.min}
            max={GOAL_LIMITS.max}
            decreaseLabel={t("playground.decrease")}
            increaseLabel={t("playground.increase")}
            testID="pgPraisesGoal"
          />
          <StepperRow
            label={t("playground.gratitudesGoal")}
            value={dials.goals.gratitudes}
            onChange={(goal) => dispatch(setPlaygroundGoal({ track: "gratitudes", goal }))}
            min={GOAL_LIMITS.min}
            max={GOAL_LIMITS.max}
            decreaseLabel={t("playground.decrease")}
            increaseLabel={t("playground.increase")}
            testID="pgGratitudesGoal"
          />
        </SettingsSection>

        <SettingsSection title={t("playground.seasonSection")} hint={t("playground.seasonHint")}>
          <View style={styles.flowers}>
            {SEASON_FLOWERS.map((flower) => {
              const active = dials.month === flower.month;
              return (
                <Pressable
                  key={flower.month}
                  onPress={() => dispatch(setMonth(flower.month))}
                  style={[styles.flower, active && styles.flowerActive]}
                  testID={`pgMonth-${flower.month}`}
                >
                  {/* Two petal tones of the month, as the bed actually draws them. */}
                  <View style={[styles.petalOuter, { backgroundColor: flower.petals[1] }]}>
                    <View style={[styles.petalInner, { backgroundColor: flower.petals[0] }]} />
                  </View>
                  <Text style={[styles.flowerName, active && styles.flowerNameActive]}>
                    {t(`garden.flowers.${flower.name}`)}
                  </Text>
                  <Text style={styles.flowerMonth}>{flower.month}</Text>
                </Pressable>
              );
            })}
          </View>
        </SettingsSection>

        <SettingsSection title={t("playground.layoutSection")} hint={t("playground.layoutHint")}>
          <StepperRow
            label={t("playground.layoutRow")}
            value={dials.day}
            onChange={(day) => dispatch(setDay(day))}
            min={DAY_MIN}
            max={DAY_MAX}
            decreaseLabel={t("playground.decrease")}
            increaseLabel={t("playground.increase")}
            testID="pgDay"
          />
        </SettingsSection>

        <Text style={styles.note}>{t("playground.note")}</Text>
      </ScrollView>
    </View>
  );
}

/** The stepper of `StepperRow` without its label, for rows that carry their own. */
function Stepper({
  value,
  onChange,
  min,
  max,
  decreaseLabel,
  increaseLabel,
  testID,
}: {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  decreaseLabel: string;
  increaseLabel: string;
  testID: string;
}) {
  return (
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 20,
    paddingBottom: 48,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
  },
  stage: { alignItems: "center", gap: 14, marginBottom: 20 },
  tiles: { flexDirection: "row", alignItems: "flex-end", gap: 20 },
  tileBox: { alignItems: "center", gap: 6 },
  tileLabel: { fontSize: 10, color: colors.textMuted },

  readout: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  readoutRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  readoutLabel: { fontSize: 12, color: colors.textMuted },
  readoutValue: { fontSize: 12, color: colors.text, fontVariant: ["tabular-nums"] },

  track: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  trackTitle: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: colors.textSubtle,
    fontWeight: "500",
  },
  dialRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 },
  dialColumn: { gap: 8 },
  dialLabel: { fontSize: 15, color: colors.text, fontWeight: "300" },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.surfaceSunken,
  },
  chipActive: { backgroundColor: colors.accent },
  chipText: { fontSize: 13, color: colors.text },
  chipTextActive: { color: colors.onAccent, fontWeight: "500" },

  seg: { flexDirection: "row", gap: 6 },
  segButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.surfaceSunken,
  },
  segButtonActive: { backgroundColor: colors.text },
  segText: { fontSize: 13, color: colors.textSubtle },
  segTextActive: { color: colors.background, fontWeight: "500" },

  stepper: { flexDirection: "row", alignItems: "center", gap: 4 },
  stepButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colors.surfaceSunken,
  },
  stepButtonDisabled: { opacity: 0.4 },
  stepText: { fontSize: 18, color: colors.text, lineHeight: 22 },
  stepValue: {
    minWidth: 34,
    textAlign: "center",
    fontSize: 17,
    color: colors.textStrong,
    fontWeight: "400",
  },

  flowers: { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 12 },
  flower: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: 6,
    paddingRight: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.surfaceSunken,
  },
  flowerActive: { borderColor: colors.accent, backgroundColor: colors.surface },
  petalOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  petalInner: { width: 9, height: 9, borderRadius: 5 },
  flowerName: { fontSize: 13, color: colors.text },
  flowerNameActive: { color: colors.textStrong, fontWeight: "500" },
  flowerMonth: { fontSize: 11, color: colors.textMuted, fontVariant: ["tabular-nums"] },

  note: { fontSize: 12, color: colors.textMuted, lineHeight: 17, paddingHorizontal: 4 },
});
