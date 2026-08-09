import createEntriesSlice from './createEntriesSlice';

const gratitudesSlice = createEntriesSlice('gratitudes');

export const {
  add: addGratitude,
  remove: removeGratitude,
  setPoints: setGratitudePoints,
  clear: clearGratitudes,
} = gratitudesSlice.actions;

export default gratitudesSlice.reducer;
