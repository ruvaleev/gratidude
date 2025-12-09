import i18n from "@/i18n";
import { setLocale } from "@/store/slices/localeSlice";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { i18n: i18nInstance } = useTranslation();
  const currentLocale = i18nInstance.language;

  const handleLocaleChange = (locale: string) => {
    i18n.changeLanguage(locale);
    dispatch(setLocale(locale));
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        testID="burgerMenuButton"
        style={styles.burgerButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Ionicons name="menu" size={24} color="#44403c" />
      </Pressable>

      {isOpen && (
        <View style={styles.menu}>
          <Pressable
            testID="localeButtonEn"
            style={[
              styles.menuItem,
              currentLocale === 'en' && styles.menuItemActive
            ]}
            onPress={() => handleLocaleChange('en')}
          >
            <Text style={[
              styles.menuItemText,
              currentLocale === 'en' && styles.menuItemTextActive
            ]}>
              EN
            </Text>
          </Pressable>
          <Pressable
            testID="localeButtonRu"
            style={[
              styles.menuItem,
              currentLocale === 'ru' && styles.menuItemActive
            ]}
            onPress={() => handleLocaleChange('ru')}
          >
            <Text style={[
              styles.menuItemText,
              currentLocale === 'ru' && styles.menuItemTextActive
            ]}>
              RU
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
  },
  burgerButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: "rgba(231, 229, 228, 0.5)", // stone-200/50
    borderRadius: 4,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(231, 229, 228, 0.5)", // stone-200/50
  },
  menuItemActive: {
    backgroundColor: "rgba(231, 229, 228, 0.2)", // stone-200/20
  },
  menuItemText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 4,
    color: "#a8a29e", // stone-400
    fontWeight: "300",
  },
  menuItemTextActive: {
    fontWeight: "500",
  },
});
