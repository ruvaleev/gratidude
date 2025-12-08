import DateTimePicker from '@react-native-community/datetimepicker';
import { fireEvent, within } from '@testing-library/react-native';
import moment from 'moment';
import React from 'react';
import Index from '../app/index';
import { DATE_FORMAT } from '../constants';
import i18n from '../i18n';
import { createStore, renderWithProviders } from './utils';

describe('Index Screen', () => {
  const today = moment().format(DATE_FORMAT);
  const yesterday = moment().subtract(1, 'day').format(DATE_FORMAT);
  const userGratitude = 'I am grateful for my health';
  const userPraise = 'I am proud of myself';

  describe('with empty store', () => {
    const store = createStore();

    it('user can enter gratitudes to Universe', () => {
      const component = renderWithProviders(<Index />, { store });

      const textInput = component.getByPlaceholderText(i18n.t('index.gratitudePlaceholder'));
      fireEvent.changeText(textInput, userGratitude);

      expect(textInput.props.value).toBe(userGratitude);

      const gratitudeSubmitButton = component.getByText(i18n.t('index.gratitudeSubmitButton'));
      fireEvent.press(gratitudeSubmitButton);

      expect(textInput.props.value).toBe('');

      const gratitudesList = component.getByTestId('gratitudesList');
      const gratitudeItem = within(gratitudesList).getByText(userGratitude);
      expect(gratitudeItem).toBeTruthy();

      expect(store.getState().gratitudes.items[today]).toEqual([userGratitude]);
    });

    it('user can enter praises to himself', () => {
      const component = renderWithProviders(<Index />, { store });

      const textInput = component.getByPlaceholderText(i18n.t('index.praisePlaceholder'));
      fireEvent.changeText(textInput, userPraise);

      expect(textInput.props.value).toBe(userPraise);

      const praiseSubmitButton = component.getByText(i18n.t('index.praiseSubmitButton'));
      fireEvent.press(praiseSubmitButton);

      expect(textInput.props.value).toBe('');

      const praisesList = component.getByTestId('praisesList');
      const praiseItem = within(praisesList).getByText(userPraise);
      expect(praiseItem).toBeTruthy();

      expect(store.getState().praises.items[today]).toEqual([userPraise]);
    });
  });

  describe('when user has a gratitude or praise in store already', () => {
    const store = createStore({
      date: { selectedDate: today },
      gratitudes: {
        items: { [today]: [userGratitude] },
      },
      praises: {
        items: { [yesterday]: [userPraise] },
      },
    });

    it('user can change date and see content according to the selected date', () => {
      const component = renderWithProviders(<Index />, { store });

      const currentDateElement = component.getByTestId('currentDate');
      expect(currentDateElement.props.children).toContain(today);

      const gratitudesList = component.getByTestId('gratitudesList');
      expect(
        within(gratitudesList).queryByText(userGratitude)
      ).toBeTruthy();

      const praisesList = component.getByTestId('praisesList');
      expect(
        within(praisesList).queryByText(userPraise)
      ).toBeNull();

      // Кликаем по дате
      fireEvent.press(currentDateElement);

      // Проверяем, что появился DatePicker
      const datePicker = component.getByTestId('datePicker');
      expect(datePicker).toBeTruthy();

      // Выбираем новую дату (например, вчерашний день)
      // yesterday.setDate(yesterday.getDate() - 1);
      
      // Находим DateTimePicker и вызываем его onChange
      const dateTimePicker = component.UNSAFE_getByType(DateTimePicker);
      fireEvent(dateTimePicker, 'onChange', {}, yesterday);

      // Подтверждаем выбор даты
      const confirmButton = component.getByTestId('confirmDateButton');
      fireEvent.press(confirmButton);

      // Проверяем, что отображается новая дата
      const newDateElement = component.getByTestId('currentDate');
      expect(newDateElement.props.children).toContain(yesterday);

      expect(store.getState().date.selectedDate).toBe(yesterday);

      expect(
        within(gratitudesList).queryByText(userGratitude)
      ).toBeNull();

      expect(
        within(praisesList).queryByText(userPraise)
      ).toBeTruthy();
    });
  });
});
