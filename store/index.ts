import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
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
import praisesReducer from './slices/praisesSlice';

const DATA_VERSION = 1;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: DATA_VERSION,
  whitelist: ['gratitudes', 'praises', 'date'],
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
