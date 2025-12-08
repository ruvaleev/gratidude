import { fireEvent, render, within } from '@testing-library/react-native';
import React from 'react';
import Index from '../app/index';
import i18n from '../i18n';

describe('Index Screen', () => {
  const userGratitude = 'I am grateful for my health';
  const userPraise = 'I am proud of myself';

  it('user can enter gratitudes to Universe', () => {
    const component = render(<Index />);

    const textInput = component.getByPlaceholderText(i18n.t('index.gratitudePlaceholder'));
    fireEvent.changeText(textInput, userGratitude);

    expect(textInput.props.value).toBe(userGratitude);

    const gratitudeSubmitButton = component.getByText(i18n.t('index.gratitudeSubmitButton'));
    fireEvent.press(gratitudeSubmitButton);

    expect(textInput.props.value).toBe('');

    const gratitudesList = component.getByTestId('gratitudesList');
    const gratitudeItem = within(gratitudesList).getByText(userGratitude);
    expect(gratitudeItem).toBeTruthy();
  });

  it('user can enter praises to himself', () => {
    const component = render(<Index />);

    const textInput = component.getByPlaceholderText(i18n.t('index.praisePlaceholder'));
    fireEvent.changeText(textInput, userPraise);

    expect(textInput.props.value).toBe(userPraise);

    const praiseSubmitButton = component.getByText(i18n.t('index.praiseSubmitButton'));
    fireEvent.press(praiseSubmitButton);

    expect(textInput.props.value).toBe('');

    const praisesList = component.getByTestId('praisesList');
    const praiseItem = within(praisesList).getByText(userPraise);
    expect(praiseItem).toBeTruthy();
  });
});
