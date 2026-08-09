import { createSelector } from '@reduxjs/toolkit';
import type { EntriesByDate, Entry } from '../types';
import { selectGratitudeItems, selectPraiseItems } from './plainSelectors';

export interface DaySummary {
  praisePoints: number;
  gratitudePoints: number;
  praiseCount: number;
  gratitudeCount: number;
}

export interface DaySummaries {
  [date: string]: DaySummary;
}

export const EMPTY_SUMMARY: DaySummary = {
  praisePoints: 0,
  gratitudePoints: 0,
  praiseCount: 0,
  gratitudeCount: 0,
};

const sumPoints = (entries: Entry[]) =>
  entries.reduce((total, entry) => total + (entry.points || 1), 0);

/**
 * One pass over the whole diary, memoized on the two item maps. Week and month
 * screens read tiles out of this instead of re-reducing per day.
 */
const selectDaySummaries = createSelector(
  [selectPraiseItems, selectGratitudeItems],
  (praises: EntriesByDate, gratitudes: EntriesByDate): DaySummaries => {
    const summaries: DaySummaries = {};

    const ensure = (date: string) => {
      if (!summaries[date]) summaries[date] = { ...EMPTY_SUMMARY };
      return summaries[date];
    };

    for (const [date, entries] of Object.entries(praises)) {
      const summary = ensure(date);
      summary.praiseCount = entries.length;
      summary.praisePoints = sumPoints(entries);
    }

    for (const [date, entries] of Object.entries(gratitudes)) {
      const summary = ensure(date);
      summary.gratitudeCount = entries.length;
      summary.gratitudePoints = sumPoints(entries);
    }

    return summaries;
  }
);

export default selectDaySummaries;
