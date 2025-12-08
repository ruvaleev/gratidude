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

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['gratitudes', 'praises', 'date'],
};

export const rootReducer = combineReducers({
  gratitudes: gratitudesReducer,
  praises: praisesReducer,
  date: dateReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const setupStore = (preloadedState?: Partial<RootState>) => {
//   return configureStore({
//     reducer: persistedReducer,
//     preloadedState,
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         serializableCheck: {
//           ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//         },
//       }),
//   });
// };

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
