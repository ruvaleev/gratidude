import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PraisesState {
  items: string[];
}

const initialState: PraisesState = {
  items: [],
};

const praisesSlice = createSlice({
  name: 'praises',
  initialState,
  reducers: {
    addPraise: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload);
    },
    clearPraises: (state) => {
      state.items = [];
    },
  },
});

export const { addPraise, clearPraises } = praisesSlice.actions;
export default praisesSlice.reducer;
