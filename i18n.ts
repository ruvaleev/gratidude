import * as Localization from 'expo-localization';
import * as i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

// Get device locale and extract language code (e.g., "en-US" -> "en")
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

// Initialize i18n synchronously with device language
// The locale will be synced from Redux store after it loads (see _layout.tsx)
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: deviceLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

