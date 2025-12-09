import BurgerMenu from "@/components/header/burger-menu";
import InspirationSection from "@/components/header/inspiration-section";
import { StyleSheet, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <InspirationSection />
      <BurgerMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 100,
  },
});
