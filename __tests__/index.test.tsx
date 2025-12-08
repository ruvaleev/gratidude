import { fireEvent, render, within } from '@testing-library/react-native';
import React from 'react';
import Index from '../app/index';
import i18n from '../i18n';

describe('Index Screen', () => {
  const userGratitude = 'I am grateful for my health';

  it('user can enter gratitudes to Universe', () => {
    const component = render(<Index />);

    const textInput = component.getByPlaceholderText(i18n.t('index.gratitudePlaceholder'));
    fireEvent.changeText(textInput, userGratitude);

    expect(textInput.props.value).toBe(userGratitude);

    const gratitudeSubmitButton = component.getByText(i18n.t('index.gratitudeSubmitButton'));
    fireEvent.press(gratitudeSubmitButton);

    expect(textInput.props.value).toBe('');

    const gratitudesList = component.getByTestId('gratitudesList');
    const gratitudeItem = within(gratitudesList).getByText('I am grateful for my health');
    expect(gratitudeItem).toBeTruthy();
  });
});
