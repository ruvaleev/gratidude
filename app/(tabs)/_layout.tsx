import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
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
    </Tabs>
  );
}
