import selectGratitudesByDate from '../../../store/selectors/selectGratitudesByDate';

describe('selectGratitudesByDate', () => {
  const dateOne = '01.01.2026';
  const dateTwo = '02.01.2026';
  const gratitudeOne = 'Gratitude One';
  const gratitudeTwo = 'Gratitude Two';

  describe('when gratitude presented in gratitudes slice', () => {
    const state = {
      gratitudes: {
        items: {
          [dateOne]: [gratitudeOne],
          [dateTwo]: [gratitudeTwo],
        },
      },
    };

    it('returns gratitude from gratitudes slice according to the date', () => {
      expect(selectGratitudesByDate(state, dateOne)).toEqual([gratitudeOne]);
    });
  });

  describe('when gratitude not presented in gratitudes slice', () => {
    const state = {
      gratitudes: {
        items: {},
      },
    };

    it('returns empty array', () => {
      expect(selectGratitudesByDate(state, dateOne)).toEqual([]);
    });
  });
});
