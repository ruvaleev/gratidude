import { colors } from "@/constants/theme";
import GardenTile from "@/components/garden-tile";
import PeriodNav from "@/components/period-nav";
import { DATE_FORMAT } from "@/constants";
import "@/i18n";
import { useAppSelector } from "@/store/hooks";
import moment from "moment";
import "moment/locale/ru";
import { useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

const TILE_GAP = 10;

export default function WeekScreen() {
  const { width } = useWindowDimensions();
  const { locale } = useAppSelector((state) => state.locale);
  const selectedDate = useAppSelector((state) => state.date.selectedDate);

  const [anchor, setAnchor] = useState(() =>
    moment(selectedDate, DATE_FORMAT).startOf("isoWeek")
  );

  const days = Array.from({ length: 7 }, (_, index) =>
    anchor.clone().locale(locale).add(index, "day")
  );

  const today = moment().startOf("day");
  const isCurrentWeek = anchor.isSame(today, "isoWeek");

  // Seven across is unreadable on a phone, so narrow screens get two rows of four.
  const columns = width < 560 ? 4 : 7;
  const available = Math.min(width, 700) - 32;
  const tileSize = Math.floor((available - TILE_GAP * (columns - 1)) / columns);

  const shift = (weeks: number) => setAnchor(anchor.clone().add(weeks, "week"));

  const title = `${days[0].format("D MMM")} — ${days[6].format("D MMM")}`;

  return (
    <View style={styles.container}>
      <PeriodNav
        title={title}
        onPrevious={() => shift(-1)}
        onNext={() => shift(1)}
        nextDisabled={isCurrentWeek}
        testID="week"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.grid, { gap: TILE_GAP }]}>
          {days.map((day) => (
            <GardenTile
              key={day.format(DATE_FORMAT)}
              date={day.format(DATE_FORMAT)}
              size={tileSize}
              label={day.format("dd")}
              dimmed={day.isAfter(today, "day")}
            />
          ))}
        </View>
      </ScrollView>
    </View>
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
    justifyContent: "center",
  },
});
