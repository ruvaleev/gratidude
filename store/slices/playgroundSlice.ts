import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { TrackName } from './settingsSlice';

/**
 * Dials of the garden workbench (`app/playground.tsx`).
 *
 * Kept in the store so the sandbox works the way the rest of the app does, but
 * deliberately left out of the persist whitelist in `store/index.ts`: these are
 * throwaway dev settings, and nothing here may ever reach a real diary.
 */

/** How points are handed out across a day's entries. */
export type Spread = 'low' | 'mixed' | 'high';

export type PresetKey = 'empty' | 'sparse' | 'usual' | 'goalMet' | 'overflow';

export interface Preset {
  key: PresetKey;
  count: number;
  spread: Spread;
}

/** The same five presets are offered for both tracks. */
export const PRESETS: Preset[] = [
  { key: 'empty', count: 0, spread: 'low' },
  { key: 'sparse', count: 1, spread: 'low' },
  { key: 'usual', count: 3, spread: 'mixed' },
  { key: 'goalMet', count: 5, spread: 'mixed' },
  { key: 'overflow', count: 14, spread: 'high' },
];

export const SPREADS: Spread[] = ['low', 'mixed', 'high'];

export const COUNT_MIN = 0;
export const COUNT_MAX = 20;
export const DAY_MIN = 1;
export const DAY_MAX = 28;

export interface TrackDials {
  count: number;
  spread: Spread;
  /** Which preset the pair above came from, or null once a dial was turned by hand. */
  preset: PresetKey | null;
}

export interface PlaygroundState {
  praises: TrackDials;
  gratitudes: TrackDials;
  goals: Record<TrackName, number>;
  /**
   * Mirrors `settings.points.enabled`, and decides what a plant's stage means:
   * off — the whole bed grows together as the day fills up; on — every plant
   * shows how hard its own entry was. Off is what the app ships with.
   */
  pointsEnabled: boolean;
  /** 1..12 — picks the flower of the month. */
  month: number;
  /** 1..28 — part of the date, and therefore the seed of the layout. */
  day: number;
}

const presetFor = (key: PresetKey): TrackDials => {
  const preset = PRESETS.find((item) => item.key === key)!;
  return { count: preset.count, spread: preset.spread, preset: key };
};

const initialState: PlaygroundState = {
  praises: presetFor('goalMet'),
  gratitudes: presetFor('usual'),
  goals: { praises: 5, gratitudes: 5 },
  pointsEnabled: false,
  month: 8,
  day: 7,
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.round(value)));

const playgroundSlice = createSlice({
  name: 'playground',
  initialState,
  reducers: {
    applyPreset: (state, action: PayloadAction<{ track: TrackName; preset: PresetKey }>) => {
      state[action.payload.track] = presetFor(action.payload.preset);
    },

    // Turning a dial by hand drops the preset badge: the row no longer shows
    // what a preset does, so nothing should stay highlighted.
    setCount: (state, action: PayloadAction<{ track: TrackName; count: number }>) => {
      const dials = state[action.payload.track];
      dials.count = clamp(action.payload.count, COUNT_MIN, COUNT_MAX);
      dials.preset = null;
    },

    setSpread: (state, action: PayloadAction<{ track: TrackName; spread: Spread }>) => {
      const dials = state[action.payload.track];
      dials.spread = action.payload.spread;
      dials.preset = null;
    },

    setPointsEnabled: (state, action: PayloadAction<boolean>) => {
      state.pointsEnabled = action.payload;
    },

    setPlaygroundGoal: (state, action: PayloadAction<{ track: TrackName; goal: number }>) => {
      state.goals[action.payload.track] = clamp(action.payload.goal, 1, 15);
    },

    /** Wraps around, so stepping past December lands on January. */
    setMonth: (state, action: PayloadAction<number>) => {
      state.month = ((Math.round(action.payload) - 1 + 12) % 12) + 1;
    },

    setDay: (state, action: PayloadAction<number>) => {
      state.day = clamp(action.payload, DAY_MIN, DAY_MAX);
    },
  },
});

export const {
  applyPreset,
  setCount,
  setSpread,
  setPointsEnabled,
  setPlaygroundGoal,
  setMonth,
  setDay,
} = playgroundSlice.actions;

export default playgroundSlice.reducer;
