import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import dateReducer from './slices/dateSlice';
import gratitudesReducer from './slices/gratitudesSlice';
import localeReducer from './slices/localeSlice';
import praisesReducer from './slices/praisesSlice';
import settingsReducer from './slices/settingsSlice';

const DATA_VERSION = 2;

/**
 * `web.output: "static"` renders every route in Node, where AsyncStorage's web
 * backend reaches for `window.localStorage` and throws. There is nothing worth
 * persisting during a server render, so it writes to nowhere instead.
 * Native always has a window, so this never affects the phone.
 */
const isServerRender = Platform.OS === 'web' && typeof window === 'undefined';

const serverStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

const persistConfig = {
  key: 'root',
  storage: isServerRender ? serverStorage : AsyncStorage,
  version: DATA_VERSION,
  whitelist: ['gratitudes', 'praises', 'date', 'locale', 'settings'],
  migrate: (state: any, currentVersion: number) => {
    if (state && state._persist && state._persist.version === currentVersion) {
      // return current state if version is actual
      return Promise.resolve(state);
    }
    // clear state if version is outdated; if necessary, can implement migrations here
    return Promise.resolve(undefined);
  },
};

export const rootReducer = combineReducers({
  gratitudes: gratitudesReducer,
  praises: praisesReducer,
  date: dateReducer,
  locale: localeReducer,
  settings: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
