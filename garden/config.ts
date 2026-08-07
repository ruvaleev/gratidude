import type { GardenVariant, SeasonSpec } from './types';

/** A comfortable daily aim, not a quota. Editable in settings. */
export const DEFAULT_GOALS = { praises: 5, gratitudes: 5 };

/**
 * Past this many plants a bed stops reading as "more" and starts reading as
 * clutter, so extra entries make the existing plants bigger instead.
 */
export const MAX_PLANTS: Record<GardenVariant, number> = { day: 12, tile: 4 };

/** Individual fireflies only stay countable while there is room for them. */
export const MAX_SPARKS: Record<GardenVariant, number> = { day: 8, tile: 3 };

export const GROUND_COVER: Record<GardenVariant, number> = { day: 22, tile: 8 };

/** How much bigger a plant may get when the day runs past its goal. */
export const MAX_SIZE_BONUS = 0.45;

/**
 * A crowded bed needs smaller plants to stay readable. Expressed as a fraction
 * of the soil's width so it holds at any rendered size.
 */
export function plantUnitFactor(count: number): number {
  if (count <= 4) return 0.32;
  if (count <= 9) return 0.27;
  return 0.2;
}

export const PLANT_COLORS = [
  '#E8859C',
  '#EFB03B',
  '#C88FD0',
  '#E6685A',
  '#7FB8D8',
  '#F2E7A8',
];

export const SOIL = { warm: '#9E7743', cool: '#7A746B', base: '#6B4E33', deep: '#4A3524' };
export const STONE = { base: '#CFC3A8', light: '#E4DAC2', dark: '#A9997C' };
export const LIGHT = '#FFC85F';
export const SPARK = '#FFF3C4';
export const STEM = '#4E7A3C';
export const STEM_LIGHT = '#6E9B57';
export const MOSS = '#6F8A4A';
export const GOLD = '#E9C46A';

/** Back leaves sit darker than front ones, which is what gives a plant depth. */
export const FOLIAGE = ['#37602F', '#416E36', '#4E8043', '#5E9450', '#6DA75C'];

/** Warm middle of a flower, and the ring just inside the petals. */
export const FLOWER_CENTER = '#F6D96A';
export const FLOWER_CENTER_DEEP = '#E0A93C';

/**
 * One signature flower per month: the bed changes through the year on its own,
 * without the person having to earn anything.
 */
export const SEASON_FLOWERS: SeasonSpec[] = [
  { month: 1, name: 'hellebore', petals: ['#D8DEEA', '#B9C6DE'], sky: '#C9D4DE' },
  { month: 2, name: 'snowdrop', petals: ['#F2F5F0', '#CFE0CB'], sky: '#CFD8DA' },
  { month: 3, name: 'crocus', petals: ['#9E86D0', '#C4AEE8'], sky: '#D6D3DE' },
  { month: 4, name: 'tulip', petals: ['#E4576B', '#F08A7E'], sky: '#DCE4D6' },
  { month: 5, name: 'lilac', petals: ['#B08BD4', '#D3B6E8'], sky: '#DDE6D4' },
  { month: 6, name: 'peony', petals: ['#EB8FA8', '#F6B9C6'], sky: '#E4E9CE' },
  { month: 7, name: 'daisy', petals: ['#F7F2E2', '#F2D96A'], sky: '#E9E5C6' },
  { month: 8, name: 'sunflower', petals: ['#EFB02F', '#F6D06A'], sky: '#EADFBE' },
  { month: 9, name: 'aster', petals: ['#C4568F', '#E08CB4'], sky: '#E2DCC4' },
  { month: 10, name: 'chrysanthemum', petals: ['#D9772E', '#EFA95A'], sky: '#DCD3BC' },
  { month: 11, name: 'heather', petals: ['#A0648F', '#C48FAF'], sky: '#CFCEC4' },
  { month: 12, name: 'poinsettia', petals: ['#C2413F', '#E27B6A'], sky: '#C8CCCC' },
];
