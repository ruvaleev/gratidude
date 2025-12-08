import { createSelector } from '@reduxjs/toolkit';
import { selectGratitudeItems } from './plainSelectors';

const selectGratitudesByDate = createSelector(
  [(_, date) => date, selectGratitudeItems],
  (date, items) => items[date] || [],
);

export default selectGratitudesByDate;
