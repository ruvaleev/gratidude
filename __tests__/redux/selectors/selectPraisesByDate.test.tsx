import selectPraisesByDate from '../../../store/selectors/selectPraisesByDate';
import { entry } from '../../utils';

describe('selectPraisesByDate', () => {
  const dateOne = '01.01.2026';
  const dateTwo = '02.01.2026';
  const praiseOne = entry('Praise One');
  const praiseTwo = entry('Praise Two');

  describe('when praise presented in praises slice', () => {
    const state = {
      praises: {
        items: {
          [dateOne]: [praiseOne],
          [dateTwo]: [praiseTwo],
        },
      },
    };

    it('returns praise from praises slice according to the date', () => {
      expect(selectPraisesByDate(state, dateOne)).toEqual([praiseOne]);
    });
  });

  describe('when praise not presented in praises slice', () => {
    const state = {
      praises: {
        items: {},
      },
    };

    it('returns empty array', () => {
      expect(selectPraisesByDate(state, dateOne)).toEqual([]);
    });
  });
});
