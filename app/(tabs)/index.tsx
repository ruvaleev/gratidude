import { colors } from "@/constants/theme";
import DateForm from "@/components/date-form";
import DayProgress from "@/components/day-progress";
import GratitudeSection from "@/components/gratitude-section";
import PraisesSection from "@/components/praises-section";
import GardenBed from "@/garden/components/GardenBed";
import useGardenScene from "@/garden/useGardenScene";
import "@/i18n";
import { useAppSelector } from "@/store/hooks";
import { revealOffset } from "@/utils/keyboard";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

const MAX_BED = 360;

/** Breathing room left between the input row and the top of the keyboard. */
const REVEAL_GAP = 12;

export default function Index() {
  const { width } = useWindowDimensions();
  const currentSelectedDate = useAppSelector(
    (state) => state.date.selectedDate,
  );
  const tracks = useAppSelector((state) => state.settings.tracks);
  const scene = useGardenScene(currentSelectedDate);

  const scrollRef = useRef<ScrollView>(null);
  /** Wrapper around the scroll area, measured to learn where it sits on screen. */
  const viewportRef = useRef<View>(null);
  /** Bottom edge of the section whose field currently has focus. */
  const focusedBottom = useRef<number | null>(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const bedSize = Math.min(width - 48, MAX_BED);

  /**
   * Puts the focused input above the keyboard.
   *
   * The overlap is measured from where the scroll area actually sits on screen,
   * which stays correct whether the platform resizes the window for the keyboard
   * or draws over it — Android does the latter under edge-to-edge, where
   * `KeyboardAvoidingView` has no effect at all.
   */
  const reveal = useCallback((keyboardHeight: number) => {
    const sectionBottom = focusedBottom.current;
    if (sectionBottom === null) return;

    viewportRef.current?.measureInWindow((_x, viewportTop, _width, viewportHeight) => {
      const y = revealOffset({
        sectionBottom,
        viewportTop,
        viewportHeight,
        screenHeight: Dimensions.get("window").height,
        keyboardHeight,
        gap: REVEAL_GAP,
      });

      scrollRef.current?.scrollTo({ y, animated: true });
    });
  }, []);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const shown = Keyboard.addListener(showEvent, (event) => {
      const height = event.endCoordinates.height;
      setKeyboardHeight(height);
      reveal(height);
    });
    const hidden = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      focusedBottom.current = null;
    });

    return () => {
      shown.remove();
      hidden.remove();
    };
  }, [reveal]);

  const handleFieldFocus = useCallback(
    (sectionBottom: number) => {
      focusedBottom.current = sectionBottom;
      // Moving between fields while the keyboard is already up fires no event.
      if (keyboardHeight > 0) reveal(keyboardHeight);
    },
    [keyboardHeight, reveal],
  );

  return (
    <View style={styles.container}>
      <View ref={viewportRef} style={styles.viewport} collapsable={false}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          // The extra room is what makes it possible to scroll the last field
          // out from under the keyboard at all.
          contentContainerStyle={[
            styles.scrollContentContainer,
            { paddingBottom: 48 + keyboardHeight },
          ]}
          showsVerticalScrollIndicator={false}
          // Without this the first tap on the submit button only dismisses the keyboard.
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <DateForm />

            <View style={styles.bed} testID="gardenBed">
              <GardenBed scene={scene} size={bedSize} />
            </View>

            <DayProgress scene={scene} />

            {tracks.gratitudes && (
              <GratitudeSection onFieldFocus={handleFieldFocus} />
            )}
            {tracks.praises && (
              <PraisesSection onFieldFocus={handleFieldFocus} />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // stone-50
  },
  viewport: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
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
