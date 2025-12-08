import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { DATE_FORMAT } from '../../constants';

interface DateState {
  selectedDate: string;
}

const initialState: DateState = {
  selectedDate: moment().format(DATE_FORMAT),
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
