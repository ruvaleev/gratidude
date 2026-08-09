import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { EntriesState, Entry } from '../types';

const initialState: EntriesState = {
  items: {},
};

interface AddPayload {
  date: string;
  text: string;
  points: number;
  id: string;
  createdAt: string;
}

/**
 * Praises and gratitudes are stored identically — same shape, same operations.
 * The only difference is the slice name, so both are built from here.
 */
export default function createEntriesSlice(name: 'praises' | 'gratitudes') {
  return createSlice({
    name,
    initialState,
    reducers: {
      add: {
        reducer: (state, action: PayloadAction<AddPayload>) => {
          const { date, id, text, points, createdAt } = action.payload;
          if (!state.items[date]) {
            state.items[date] = [];
          }
          state.items[date].push({ id, text, points, createdAt });
        },
        prepare: ({ date, text, points = 1 }: { date: string; text: string; points?: number }) => ({
          payload: {
            date,
            text,
            points,
            id: nanoid(),
            createdAt: new Date().toISOString(),
          },
        }),
      },

      remove: (state, action: PayloadAction<{ date: string; id: string }>) => {
        const { date, id } = action.payload;
        const entries = state.items[date];
        if (!entries) return;

        state.items[date] = entries.filter((entry: Entry) => entry.id !== id);
        if (state.items[date].length === 0) {
          delete state.items[date];
        }
      },

      setPoints: (state, action: PayloadAction<{ date: string; id: string; points: number }>) => {
        const { date, id, points } = action.payload;
        const entry = state.items[date]?.find((item: Entry) => item.id === id);
        if (entry) {
          entry.points = points;
        }
      },

      clear: (state) => {
        state.items = {};
      },
    },
  });
}
