import Index from '@/app/index';
import i18n from '@/i18n';
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { renderWithProviders } from './utils';

describe('Change Locale', () => {
  it('user can change locale', () => {
    const component = renderWithProviders(<Index />);

    const burgerMenuButton = component.getByTestId('burgerMenuButton');
    expect(component.queryByTestId('localeButtonRu')).toBeNull();

    fireEvent.press(burgerMenuButton);

    const inspirationText = component.getByTestId('inspirationText');
    expect(inspirationText.props.children).toBe(i18n.t("index.inspiration", { locale: 'en' }));

    const localeButtonRu = component.getByTestId('localeButtonRu');
    fireEvent.press(localeButtonRu);

    // Check if translation is changed
    expect(inspirationText.props.children).toBe(i18n.t("index.inspiration", { locale: 'ru' }));
    // Check if burger menu is closed
    expect(component.queryByTestId('localeButtonEn')).toBeNull();

    fireEvent.press(burgerMenuButton);

    const localeButtonEn = component.getByTestId('localeButtonEn');
    fireEvent.press(localeButtonEn);

    expect(inspirationText.props.children).toBe(i18n.t("index.inspiration", { locale: 'en' }));
  });
});
