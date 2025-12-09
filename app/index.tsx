import DateForm from "@/components/date-form";
import Footer from "@/components/footer";
import GratitudeSection from "@/components/gratitude-section";
import InspirationSection from "@/components/inspiration-section";
import PraisesSection from "@/components/praises-section";
import "@/i18n";
import { useAppSelector } from "@/store/hooks";
import selectGratitudesByDate from "@/store/selectors/selectGratitudesByDate";
import selectPraisesByDate from "@/store/selectors/selectPraisesByDate";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Index() {
  const currentSelectedDate = useAppSelector((state) => state.date.selectedDate);
  const gratitudes = useAppSelector((state) => selectGratitudesByDate(state, currentSelectedDate));
  const praises = useAppSelector((state) => selectPraisesByDate(state, currentSelectedDate));
  
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <InspirationSection />
          <DateForm />
          <GratitudeSection />
          <PraisesSection />
          <Footer gratitudesLength={gratitudes.length} praisesLength={praises.length} />
        </View>
      </ScrollView>
    </View>
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
  },
  content: {
    maxWidth: 448, // max-w-md equivalent
    width: "100%",
    alignSelf: "center",
    zIndex: 10,
  },
});
