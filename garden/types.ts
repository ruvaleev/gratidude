import type { Entry } from '@/store/types';

/** How much room the bed gets. Drives how much detail is worth drawing. */
export type GardenVariant = 'day' | 'tile';

export type PlantStage = 'sprout' | 'bud' | 'flower' | 'seasonal';

export interface DayInput {
  /** DD.MM.YYYY — doubles as the seed, so a day always looks the same. */
  date: string;
  praises: Entry[];
  gratitudes: Entry[];
}

export interface GardenSettings {
  tracks: { praises: boolean; gratitudes: boolean };
  goals: { praises: number; gratitudes: number };
  points: { enabled: boolean; scale: number };
}

export interface PlantSpec {
  /** Id of the entry it grew from, so a plant can be traced back to its line. */
  entryId: string;
  /** Position inside the soil, 0..1 of its width and height. */
  x: number;
  y: number;
  stage: PlantStage;
  /** 0..1 within its stage — how tall this particular plant is. */
  scale: number;
  /** Index into the palette; keeps a plant the same colour between renders. */
  colorIndex: number;
  /**
   * 0..5 — which plant of its stage this one is (a tuft of leaves or a seedling,
   * a daisy or a bell). Stage says how grown a plant is, this says what it is.
   */
  variant: number;
  /** Small per-plant tilt in radians, so a bed never looks stamped. */
  lean: number;
}

export interface SparkSpec {
  x: number;
  y: number;
  /** 0..1 — bright sparks come from entries worth more points. */
  intensity: number;
}

export interface SeasonSpec {
  month: number;
  name: string;
  petals: [string, string];
  sky: string;
}

export interface Scene {
  date: string;
  variant: GardenVariant;

  /** Sum of points, and where it stands against the personal goal. */
  praisePoints: number;
  gratitudePoints: number;
  /** praisePoints / goal — can exceed 1 on a big day. */
  praiseProgress: number;
  /** 0..1, or null when the gratitude track is switched off entirely. */
  lightLevel: number | null;

  plants: PlantSpec[];
  sparks: SparkSpec[];
  /** Blades of grass that are there whatever you wrote. Positions only. */
  groundCover: { x: number; y: number; scale: number }[];

  season: SeasonSpec;
  /** True once the day is past the goal — the bed gets its golden trim. */
  goalReached: boolean;
}
