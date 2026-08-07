import SettingsScreen from '@/app/settings';
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { renderWithProviders } from './utils';

describe('Change Locale', () => {
  it('user can change locale from settings', () => {
    const { store, getByTestId, queryByText } = renderWithProviders(<SettingsScreen />);

    fireEvent.press(getByTestId('localeButtonRu'));

    expect(store.getState().locale.locale).toBe('ru');
    expect(queryByText('Что я веду')).toBeTruthy();
    expect(queryByText('What I keep')).toBeNull();

    fireEvent.press(getByTestId('localeButtonEn'));

    expect(store.getState().locale.locale).toBe('en');
    expect(queryByText('What I keep')).toBeTruthy();
    expect(queryByText('Что я веду')).toBeNull();
  });
});
