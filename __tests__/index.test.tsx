import DateTimePicker from '@react-native-community/datetimepicker';
import { fireEvent, within } from '@testing-library/react-native';
import moment from 'moment';
import React from 'react';
import Index from '../app/index';
import { DATE_FORMAT } from '../constants';
import i18n from '../i18n';
import { createStore, renderWithProviders, setPlatform } from './utils';

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
    describe('on Android', () => {
      beforeEach(() => {
        setPlatform('android');
      });

      it('user can change date and see content according to the selected date', () => {
        const store = createStore({
          date: { selectedDate: today },
          gratitudes: {
            items: { [today]: [userGratitude] },
          },
          praises: {
            items: { [yesterday]: [userPraise] },
          },
        });

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

        fireEvent.press(currentDateElement);

        const datePicker = component.getByTestId('datePicker');
        expect(datePicker).toBeTruthy();

        const dateTimePicker = component.UNSAFE_getByType(DateTimePicker);
        fireEvent(dateTimePicker, 'onChange', {}, yesterday);

        const confirmButton = component.getByTestId('confirmDateButton');
        fireEvent.press(confirmButton);

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

    describe('on web', () => {
      beforeEach(() => {
        setPlatform('web');
      });

      it('user does not see date picker', () => {
        const component = renderWithProviders(<Index />);

        const currentDateElement = component.getByTestId('currentDate');
        fireEvent.press(currentDateElement);

        const datePicker = component.queryByTestId('datePicker');
        expect(datePicker).toBeNull();
      });

      it('user can navigate to previous day using left button', () => {
        const store = createStore({
          date: { selectedDate: today },
          gratitudes: {
            items: { [today]: [userGratitude] },
          },
          praises: {
            items: { [yesterday]: [userPraise] },
          },
        });

        const component = renderWithProviders(<Index />, { store });

        const currentDateElement = component.getByTestId('currentDate');
        expect(currentDateElement.props.children).toContain(today);

        const previousDayButton = component.getByTestId('previousDayButton');
        fireEvent.press(previousDayButton);

        expect(currentDateElement.props.children).toContain(yesterday);
        expect(store.getState().date.selectedDate).toBe(yesterday);
      });

      it('user can navigate to next day using right button when not on today', () => {
        const twoDaysAgo = moment().subtract(2, 'days').format(DATE_FORMAT);
        const storeWithOldDate = createStore({
          date: { selectedDate: twoDaysAgo },
          gratitudes: {
            items: {},
          },
          praises: {
            items: {},
          },
        });

        const component = renderWithProviders(<Index />, { store: storeWithOldDate });

        const currentDateElement = component.getByTestId('currentDate');
        expect(currentDateElement.props.children).toContain(twoDaysAgo);

        const nextDayButton = component.getByTestId('nextDayButton');
        expect(nextDayButton.props.accessibilityState.disabled).toBe(false);

        fireEvent.press(nextDayButton);

        expect(currentDateElement.props.children).toContain(yesterday);
        expect(storeWithOldDate.getState().date.selectedDate).toBe(yesterday);
      });

      it('right button is disabled when current date is today', () => {
        const store = createStore({
          date: { selectedDate: today },
          gratitudes: {
            items: { [today]: [userGratitude] },
          },
          praises: {
            items: { [yesterday]: [userPraise] },
          },
        });

        const component = renderWithProviders(<Index />, { store });

        const currentDateElement = component.getByTestId('currentDate');
        expect(currentDateElement.props.children).toContain(today);

        const nextDayButton = component.getByTestId('nextDayButton');
        expect(nextDayButton.props.accessibilityState.disabled).toBe(true);
      });
    });
  });
});
