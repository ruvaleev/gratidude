import { SettingsSection, StepperRow, ToggleRow } from "@/components/settings/setting-row";
import GardenBed from "@/garden/components/GardenBed";
import { MAX_PLANTS, SEASON_FLOWERS } from "@/garden/config";
import { buildScene } from "@/garden/scene";
import type { GardenSettings } from "@/garden/types";
import type { Entry } from "@/store/types";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * A workbench for the garden. Deliberately not localised and not wired to the
 * store: everything here is synthetic, so turning the knobs can never touch a
 * real diary. Reachable from Settings in development builds only.
 */

type Spread = "low" | "mixed" | "high";

const SPREADS: { key: Spread; label: string }[] = [
  { key: "low", label: "все 1" },
  { key: "mixed", label: "вперемешку" },
  { key: "high", label: "все 3" },
];

const PRESETS: { label: string; praises: number; gratitudes: number; spread: Spread }[] = [
  { label: "Пусто", praises: 0, gratitudes: 0, spread: "low" },
  { label: "Скудный", praises: 1, gratitudes: 0, spread: "low" },
  { label: "Обычный", praises: 3, gratitudes: 2, spread: "mixed" },
  { label: "Цель взята", praises: 5, gratitudes: 5, spread: "mixed" },
  { label: "Перебор", praises: 14, gratitudes: 9, spread: "high" },
];

function pointsFor(spread: Spread, index: number, scale: number): number {
  if (spread === "low") return 1;
  if (spread === "high") return scale;
  return 1 + (index % scale);
}

export default function PlaygroundScreen() {
  const { width } = useWindowDimensions();

  const [praiseCount, setPraiseCount] = useState(5);
  const [gratitudeCount, setGratitudeCount] = useState(3);
  const [spread, setSpread] = useState<Spread>("mixed");
  const [praiseGoal, setPraiseGoal] = useState(5);
  const [gratitudeGoal, setGratitudeGoal] = useState(5);
  const [pointsEnabled, setPointsEnabled] = useState(true);
  const [gratitudesOn, setGratitudesOn] = useState(true);
  const [month, setMonth] = useState(8);
  const [day, setDay] = useState(7);

  const settings: GardenSettings = useMemo(
    () => ({
      tracks: { praises: true, gratitudes: gratitudesOn },
      goals: { praises: praiseGoal, gratitudes: gratitudeGoal },
      points: { enabled: pointsEnabled, scale: 3 },
    }),
    [gratitudesOn, praiseGoal, gratitudeGoal, pointsEnabled]
  );

  const date = `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.2026`;

  const dayInput = useMemo(() => {
    const make = (prefix: string, count: number): Entry[] =>
      Array.from({ length: count }, (_, index) => ({
        id: `${prefix}-${index}`,
        text: `${prefix} ${index + 1}`,
        points: pointsFor(spread, index, 3),
        createdAt: "",
      }));

    return { date, praises: make("p", praiseCount), gratitudes: make("g", gratitudeCount) };
  }, [date, praiseCount, gratitudeCount, spread]);

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

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setPraiseCount(preset.praises);
    setGratitudeCount(preset.gratitudes);
    setSpread(preset.spread);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stage}>
          <GardenBed scene={dayScene} size={bedSize} />
          <View style={styles.tiles}>
            <View style={styles.tileBox}>
              <GardenBed scene={tileScene} size={44} />
              <Text style={styles.tileLabel}>плитка 44</Text>
            </View>
            <View style={styles.tileBox}>
              <GardenBed scene={tileScene} size={120} />
              <Text style={styles.tileLabel}>та же, крупно</Text>
            </View>
          </View>
        </View>

        <View style={styles.readout}>
          {[
            ["баллы дел", `${dayScene.praisePoints}`],
            ["прогресс", dayScene.praiseProgress.toFixed(2)],
            ["свет", dayScene.lightLevel === null ? "выкл" : dayScene.lightLevel.toFixed(2)],
            ["растений", `${dayScene.plants.length} / ${MAX_PLANTS.day}`],
            ["на плитке", `${tileScene.plants.length} / ${MAX_PLANTS.tile}`],
            ["искр", `${dayScene.sparks.length}`],
            ["стадии", Object.entries(stages).map(([k, v]) => `${k}:${v}`).join(" ") || "—"],
            ["цветок месяца", dayScene.season.name],
          ].map(([label, value]) => (
            <View key={label} style={styles.readoutRow}>
              <Text style={styles.readoutLabel}>{label}</Text>
              <Text style={styles.readoutValue}>{value}</Text>
            </View>
          ))}
        </View>

        <SettingsSection title="Заготовки">
          <View style={styles.chips}>
            {PRESETS.map((preset) => (
              <Pressable key={preset.label} style={styles.chip} onPress={() => applyPreset(preset)}>
                <Text style={styles.chipText}>{preset.label}</Text>
              </Pressable>
            ))}
          </View>
        </SettingsSection>

        <SettingsSection title="День">
          <StepperRow
            label="Дел"
            value={praiseCount}
            onChange={(next) => setPraiseCount(Math.max(0, Math.min(20, next)))}
            min={0}
            max={20}
            decreaseLabel="Меньше"
            increaseLabel="Больше"
            testID="pgPraises"
          />
          <StepperRow
            label="Благодарностей"
            value={gratitudeCount}
            onChange={(next) => setGratitudeCount(Math.max(0, Math.min(20, next)))}
            min={0}
            max={20}
            decreaseLabel="Меньше"
            increaseLabel="Больше"
            testID="pgGratitudes"
          />
          <View style={styles.segRow}>
            <Text style={styles.segLabel}>Баллы дел</Text>
            <View style={styles.seg}>
              {SPREADS.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => setSpread(item.key)}
                  style={[styles.segButton, spread === item.key && styles.segButtonActive]}
                >
                  <Text style={[styles.segText, spread === item.key && styles.segTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </SettingsSection>

        <SettingsSection title="Настройки пользователя">
          <StepperRow
            label="Цель по делам"
            value={praiseGoal}
            onChange={(next) => setPraiseGoal(Math.max(1, Math.min(15, next)))}
            min={1}
            max={15}
            decreaseLabel="Меньше"
            increaseLabel="Больше"
            testID="pgPraiseGoal"
          />
          <StepperRow
            label="Цель по благодарностям"
            value={gratitudeGoal}
            onChange={(next) => setGratitudeGoal(Math.max(1, Math.min(15, next)))}
            min={1}
            max={15}
            decreaseLabel="Меньше"
            increaseLabel="Больше"
            testID="pgGratitudeGoal"
          />
          <ToggleRow
            label="Баллы за запись"
            value={pointsEnabled}
            onChange={setPointsEnabled}
            testID="pgPoints"
          />
          <ToggleRow
            label="Трек благодарностей"
            value={gratitudesOn}
            onChange={setGratitudesOn}
            testID="pgGratitudeTrack"
          />
        </SettingsSection>

        <SettingsSection
          title="Дата"
          hint="Месяц выбирает сезонный цветок, число задаёт зерно раскладки — меняй, чтобы увидеть другие расстановки."
        >
          <StepperRow
            label={`Месяц — ${SEASON_FLOWERS[month - 1].name}`}
            value={month}
            onChange={(next) => setMonth(((next - 1 + 12) % 12) + 1)}
            min={1}
            max={12}
            decreaseLabel="Назад"
            increaseLabel="Вперёд"
            testID="pgMonth"
          />
          <StepperRow
            label="Число (зерно)"
            value={day}
            onChange={(next) => setDay(Math.max(1, Math.min(28, next)))}
            min={1}
            max={28}
            decreaseLabel="Назад"
            increaseLabel="Вперёд"
            testID="pgDay"
          />
        </SettingsSection>

        <Text style={styles.note}>
          Пропорции растений, лимиты и палитра живут в garden/config.ts — правь там, Metro
          перезагрузит экран сам.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafaf9" },
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
  tileLabel: { fontSize: 10, color: "#a8a29e" },

  readout: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(231, 229, 228, 0.8)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  readoutRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  readoutLabel: { fontSize: 12, color: "#a8a29e" },
  readoutValue: { fontSize: 12, color: "#44403c", fontVariant: ["tabular-nums"] },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "rgba(231, 229, 228, 0.7)",
  },
  chipText: { fontSize: 13, color: "#44403c" },

  segRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  segLabel: { fontSize: 15, color: "#44403c", fontWeight: "300" },
  seg: { flexDirection: "row", gap: 6 },
  segButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "rgba(231, 229, 228, 0.7)",
  },
  segButtonActive: { backgroundColor: "#44403c" },
  segText: { fontSize: 13, color: "#78716c" },
  segTextActive: { color: "#fafaf9", fontWeight: "500" },

  note: { fontSize: 12, color: "#a8a29e", lineHeight: 17, paddingHorizontal: 4 },
});
