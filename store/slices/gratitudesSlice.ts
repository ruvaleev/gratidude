import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GratitudesState {
  items: { [date: string]: string[] };
}

const initialState: GratitudesState = {
  items: {},
};

const gratitudesSlice = createSlice({
  name: 'gratitudes',
  initialState,
  reducers: {
    addGratitude: (state, action: PayloadAction<{ date: string; text: string }>) => {
      const { date, text } = action.payload;
      if (!state.items[date]) {
        state.items[date] = [];
      }
      state.items[date].push(text);
    },
    clearGratitudes: (state) => {
      state.items = {};
    },
  },
});

export const { addGratitude, clearGratitudes } = gratitudesSlice.actions;
export default gratitudesSlice.reducer;
