import { colors } from "@/constants/theme";
import GardenBed from "@/garden/components/GardenBed";
import useGardenScene from "@/garden/useGardenScene";
import { DATE_FORMAT } from "@/constants";
import { useAppDispatch } from "@/store/hooks";
import { setSelectedDate } from "@/store/slices/dateSlice";
import { useRouter } from "expo-router";
import moment from "moment";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * One day on the week and month maps. Tapping it opens that day in the garden,
 * so the overview doubles as navigation.
 */
export default function GardenTile({
  date,
  size,
  label,
  dimmed = false,
}: {
  date: string;
  size: number;
  label?: string;
  dimmed?: boolean;
}) {
  const scene = useGardenScene(date, "tile");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isToday = date === moment().format(DATE_FORMAT);

  const openDay = () => {
    dispatch(setSelectedDate(date));
    router.push("/");
  };

  return (
    <Pressable
      onPress={openDay}
      testID={`gardenTile-${date}`}
      accessibilityRole="button"
      style={[styles.tile, dimmed && styles.dimmed]}
    >
      <View style={[styles.bed, isToday && styles.today]}>
        <GardenBed scene={scene} size={size} />
      </View>
      {label !== undefined && (
        <Text style={[styles.label, isToday && styles.labelToday]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    gap: 4,
  },
  dimmed: {
    opacity: 0.35,
  },
  bed: {
    borderRadius: 12,
    overflow: "hidden",
  },
  today: {
    borderWidth: 2,
    borderColor: colors.gold,
  },
  label: {
    fontSize: 10,
    color: colors.textMuted, // stone-400
    fontWeight: "300",
  },
  labelToday: {
    color: colors.text, // stone-700
    fontWeight: "500",
  },
});
