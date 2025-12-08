import * as Localization from 'expo-localization';
import { default as i18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

// Get device locale and extract language code (e.g., "en-US" -> "en")
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

i18nInstance
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: deviceLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18nInstance;

