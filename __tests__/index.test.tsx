import DateTimePicker from '@react-native-community/datetimepicker';
import { fireEvent, within } from '@testing-library/react-native';
import React from 'react';
import Index from '../app/index';
import i18n from '../i18n';
import { renderWithProviders } from './utils';

describe('Index Screen', () => {
  const userGratitude = 'I am grateful for my health';
  const userPraise = 'I am proud of myself';

  it('user can enter gratitudes to Universe', () => {
    const component = renderWithProviders(<Index />);

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
    const component = renderWithProviders(<Index />);

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

  it('user can change date', () => {
    const component = renderWithProviders(<Index />);

    // Проверяем, что отображается текущая дата
    const today = new Date().toLocaleDateString();
    const currentDateElement = component.getByTestId('currentDate');
    expect(currentDateElement.props.children).toContain(today);

    // Кликаем по дате
    fireEvent.press(currentDateElement);

    // Проверяем, что появился DatePicker
    const datePicker = component.getByTestId('datePicker');
    expect(datePicker).toBeTruthy();

    // Выбираем новую дату (например, вчерашний день)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Находим DateTimePicker и вызываем его onChange
    const dateTimePicker = component.UNSAFE_getByType(DateTimePicker);
    fireEvent(dateTimePicker, 'onChange', {}, yesterday);

    // Подтверждаем выбор даты
    const confirmButton = component.getByTestId('confirmDateButton');
    fireEvent.press(confirmButton);

    // Проверяем, что отображается новая дата
    const newDateElement = component.getByTestId('currentDate');
    expect(newDateElement.props.children).toContain(yesterday.toLocaleDateString());
  });

  describe('when user has a gratitude or praise in store already', () => {
    const preloadedState = {
      gratitudes: {
        items: [userGratitude],
      },
      praises: {
        items: [userPraise],
      },
    };

    it('should display the gratitude or praise in the list', () => {
      const component = renderWithProviders(<Index />, { preloadedState });

      const gratitudesList = component.getByTestId('gratitudesList');
      const gratitudeItem = within(gratitudesList).getByText(userGratitude);
      expect(gratitudeItem).toBeTruthy();

      const praisesList = component.getByTestId('praisesList');
      const praiseItem = within(praisesList).getByText(userPraise);
      expect(praiseItem).toBeTruthy();
    });
  });
});
