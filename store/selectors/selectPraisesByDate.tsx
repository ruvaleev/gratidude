import { createSelector } from '@reduxjs/toolkit';
import { selectPraiseItems } from './plainSelectors';

const selectPraisesByDate = createSelector(
  [(_, date) => date, selectPraiseItems],
  (date, items) => items[date] || [],
);

export default selectPraisesByDate;
