import { useAppSelector } from '@/store/hooks';
import type { Entry } from '@/store/types';
import { useMemo } from 'react';
import { buildScene } from './scene';
import type { GardenVariant, Scene } from './types';

const NO_ENTRIES: Entry[] = [];

/**
 * Bridges the store to the garden. Screens ask for a date and get a finished
 * scene — none of them needs to know how a day turns into plants.
 */
export default function useGardenScene(date: string, variant: GardenVariant = 'day'): Scene {
  const praiseItems = useAppSelector((state) => state.praises.items);
  const gratitudeItems = useAppSelector((state) => state.gratitudes.items);
  const settings = useAppSelector((state) => state.settings);

  return useMemo(
    () =>
      buildScene(
        {
          date,
          praises: praiseItems[date] ?? NO_ENTRIES,
          gratitudes: gratitudeItems[date] ?? NO_ENTRIES,
        },
        settings,
        { variant }
      ),
    [date, praiseItems, gratitudeItems, settings, variant]
  );
}
