import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Localization from 'expo-localization';

interface LocaleState {
  locale: string;
}

// Get device locale and extract language code (e.g., "en-US" -> "en")
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

const initialState: LocaleState = {
  locale: deviceLanguage,
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<string>) => {
      state.locale = action.payload;
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
