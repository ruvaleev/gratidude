import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PraisesState {
  items: { [date: string]: string[] };
}

const initialState: PraisesState = {
  items: {},
};

const praisesSlice = createSlice({
  name: 'praises',
  initialState,
  reducers: {
    addPraise: (state, action: PayloadAction<{ date: string; text: string }>) => {
      const { date, text } = action.payload;
      if (!state.items[date]) {
        state.items[date] = [];
      }
      state.items[date].push(text);
    },
    clearPraises: (state) => {
      state.items = {};
    },
  },
});

export const { addPraise, clearPraises } = praisesSlice.actions;
export default praisesSlice.reducer;
