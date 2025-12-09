import dateReducer from '@/store/slices/dateSlice';
import gratitudesReducer from '@/store/slices/gratitudesSlice';
import localeReducer from '@/store/slices/localeSlice';
import praisesReducer from '@/store/slices/praisesSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react-native';
import React, { ReactElement } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';

const rootReducer = combineReducers({
  gratitudes: gratitudesReducer,
  praises: praisesReducer,
  date: dateReducer,
  locale: localeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof createStore>;
}

export function createStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    store = createStore(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export const setPlatform = (platform: string) => (
  Object.defineProperty(Platform, 'OS', {
    get: jest.fn(() => platform),
  })
);
