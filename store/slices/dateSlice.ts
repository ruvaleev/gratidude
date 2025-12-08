import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DateState {
  selectedDate: string; // ISO string format
}

const initialState: DateState = {
  selectedDate: new Date().toISOString(),
};

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { setSelectedDate } = dateSlice.actions;
export default dateSlice.reducer;
