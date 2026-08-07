import { colors } from "@/constants/theme";
import GardenTile from "@/components/garden-tile";
import PeriodNav from "@/components/period-nav";
import { DATE_FORMAT } from "@/constants";
import "@/i18n";
import { useAppSelector } from "@/store/hooks";
import selectDaySummaries, { EMPTY_SUMMARY } from "@/store/selectors/selectDaySummaries";
import moment from "moment";
import "moment/locale/ru";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLUMNS = 7;
const TILE_GAP = 6;

export default function MonthScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { locale } = useAppSelector((state) => state.locale);
  const selectedDate = useAppSelector((state) => state.date.selectedDate);
  const summaries = useAppSelector(selectDaySummaries);

  const [anchor, setAnchor] = useState(() =>
    moment(selectedDate, DATE_FORMAT).startOf("month")
  );

  const today = moment().startOf("day");
  const isCurrentMonth = anchor.isSame(today, "month");

  const available = Math.min(width, 560) - 32;
  const tileSize = Math.floor((available - TILE_GAP * (COLUMNS - 1)) / COLUMNS);

  // Calendar grid: pad the first row so weekdays line up in columns.
  const cells = useMemo(() => {
    const start = anchor.clone().startOf("month");
    const leading = start.isoWeekday() - 1;
    const daysInMonth = start.daysInMonth();

    return [
      ...Array.from({ length: leading }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) =>
        start.clone().add(index, "day")
      ),
    ];
  }, [anchor]);

  const totals = useMemo(
    () =>
      cells.reduce(
        (sum, day) => {
          if (!day) return sum;
          const summary = summaries[day.format(DATE_FORMAT)] ?? EMPTY_SUMMARY;
          return {
            praises: sum.praises + summary.praisePoints,
            gratitudes: sum.gratitudes + summary.gratitudePoints,
          };
        },
        { praises: 0, gratitudes: 0 }
      ),
    [cells, summaries]
  );

  const weekdays = useMemo(() => {
    const names = moment.localeData(locale).weekdaysMin();
    // moment starts the week on Sunday; the grid starts on Monday.
    return [...names.slice(1), names[0]];
  }, [locale]);

  const shift = (months: number) => setAnchor(anchor.clone().add(months, "month"));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <PeriodNav
        title={anchor.clone().locale(locale).format("MMMM YYYY")}
        onPrevious={() => shift(-1)}
        onNext={() => shift(1)}
        nextDisabled={isCurrentMonth}
        testID="month"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.grid, { gap: TILE_GAP, width: available }]}>
          {weekdays.map((name) => (
            <Text key={name} style={[styles.weekday, { width: tileSize }]}>
              {name}
            </Text>
          ))}

          {cells.map((day, index) =>
            day ? (
              <GardenTile
                key={day.format(DATE_FORMAT)}
                date={day.format(DATE_FORMAT)}
                size={tileSize}
                label={day.format("D")}
                dimmed={day.isAfter(today, "day")}
              />
            ) : (
              <View key={`pad-${index}`} style={{ width: tileSize }} />
            )
          )}
        </View>

        <Text style={styles.totals} testID="monthTotals">
          {t("month.totals", {
            praises: t("month.praisesCount", { count: totals.praises }),
            gratitudes: t("month.gratitudesCount", { count: totals.gratitudes }),
          })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // stone-50
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  weekday: {
    fontSize: 10,
    textAlign: "center",
    color: colors.textMuted, // stone-400
    fontWeight: "300",
    marginBottom: 2,
  },
  totals: {
    marginTop: 24,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "300",
    textAlign: "center",
  },
});
