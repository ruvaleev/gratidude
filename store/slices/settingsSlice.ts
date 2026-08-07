import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TrackName = 'praises' | 'gratitudes';

export interface SettingsState {
  /** Which of the two diaries the person keeps. Both can't be off at once. */
  tracks: Record<TrackName, boolean>;
  /** How many entries a day the person aims for. Drives how full the bed looks. */
  goals: Record<TrackName, number>;
  /** Per-entry difficulty. The model carries it already; the picker comes later. */
  points: { enabled: boolean; scale: number };
  /** Garden skin. Only the flower bed exists so far. */
  template: 'bed';
}

export const GOAL_MIN = 1;
export const GOAL_MAX = 15;

const initialState: SettingsState = {
  tracks: { praises: true, gratitudes: true },
  goals: { praises: 5, gratitudes: 5 },
  points: { enabled: false, scale: 3 },
  template: 'bed',
};

const clampGoal = (value: number) => Math.max(GOAL_MIN, Math.min(GOAL_MAX, Math.round(value)));

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTrackEnabled: (
      state,
      action: PayloadAction<{ track: TrackName; enabled: boolean }>
    ) => {
      const { track, enabled } = action.payload;
      const other: TrackName = track === 'praises' ? 'gratitudes' : 'praises';
      // Turning off the last remaining track would leave nothing to write.
      if (!enabled && !state.tracks[other]) return;
      state.tracks[track] = enabled;
    },

    setGoal: (state, action: PayloadAction<{ track: TrackName; goal: number }>) => {
      const { track, goal } = action.payload;
      state.goals[track] = clampGoal(goal);
    },

    setPointsEnabled: (state, action: PayloadAction<boolean>) => {
      state.points.enabled = action.payload;
    },

    setPointsScale: (state, action: PayloadAction<number>) => {
      state.points.scale = action.payload;
    },
  },
});

export const { setTrackEnabled, setGoal, setPointsEnabled, setPointsScale } =
  settingsSlice.actions;

export default settingsSlice.reducer;
