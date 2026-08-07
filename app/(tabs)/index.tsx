import DateForm from "@/components/date-form";
import DayProgress from "@/components/day-progress";
import GratitudeSection from "@/components/gratitude-section";
import Header from "@/components/header";
import PraisesSection from "@/components/praises-section";
import GardenBed from "@/garden/components/GardenBed";
import useGardenScene from "@/garden/useGardenScene";
import "@/i18n";
import { useAppSelector } from "@/store/hooks";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_BED = 360;

export default function Index() {
  const { width } = useWindowDimensions();
  const currentSelectedDate = useAppSelector((state) => state.date.selectedDate);
  const tracks = useAppSelector((state) => state.settings.tracks);
  const scene = useGardenScene(currentSelectedDate);

  const bedSize = Math.min(width - 48, MAX_BED);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <DateForm />

          <View style={styles.bed} testID="gardenBed">
            <GardenBed scene={scene} size={bedSize} />
          </View>

          <DayProgress scene={scene} />

          {tracks.gratitudes && <GratitudeSection />}
          {tracks.praises && <PraisesSection />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafaf9", // stone-50
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  content: {
    maxWidth: 448,
    width: "100%",
    alignSelf: "center",
    zIndex: 10,
  },
  bed: {
    alignItems: "center",
    paddingBottom: 4,
  },
});
