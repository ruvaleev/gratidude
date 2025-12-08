import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GratitudesState {
  items: string[];
}

const initialState: GratitudesState = {
  items: [],
};

const gratitudesSlice = createSlice({
  name: 'gratitudes',
  initialState,
  reducers: {
    addGratitude: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload);
    },
    clearGratitudes: (state) => {
      state.items = [];
    },
  },
});

export const { addGratitude, clearGratitudes } = gratitudesSlice.actions;
export default gratitudesSlice.reducer;
