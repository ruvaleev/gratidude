import createEntriesSlice from './createEntriesSlice';

const praisesSlice = createEntriesSlice('praises');

export const {
  add: addPraise,
  remove: removePraise,
  setPoints: setPraisePoints,
  clear: clearPraises,
} = praisesSlice.actions;

export default praisesSlice.reducer;
