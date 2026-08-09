import Header from "@/components/header";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Both bars belong to the layout, not to the screens: the top panel sits above
 * the navigator so it stays put while tabs change, and every route in this
 * group — including the ones hidden from the bar — keeps the tabs underneath.
 */
export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.text, // stone-700
          tabBarInactiveTintColor: colors.textMuted, // stone-400
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            letterSpacing: 1,
            fontWeight: "300",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("tabs.garden"),
            tabBarIcon: ({ color, size }) => <Ionicons name="flower-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="week"
          options={{
            title: t("tabs.week"),
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="month"
          options={{
            title: t("tabs.month"),
            tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
          }}
        />
        {/*
          Reached from the header and from Settings rather than from the bar, so
          they get no button of their own — `href: null` hides it while leaving
          the route navigable.
        */}
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="playground" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
