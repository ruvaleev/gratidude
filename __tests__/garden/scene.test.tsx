import { MAX_PLANTS, MAX_SPARKS } from '@/garden/config';
import { buildScene } from '@/garden/scene';
import type { GardenSettings } from '@/garden/types';
import type { Entry } from '@/store/types';

const DATE = '06.08.2026';

const settings = (overrides: Partial<GardenSettings> = {}): GardenSettings => ({
  tracks: { praises: true, gratitudes: true },
  goals: { praises: 5, gratitudes: 5 },
  points: { enabled: false, scale: 3 },
  ...overrides,
});

const entries = (count: number, points = 1): Entry[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `entry-${index}`,
    text: `Entry ${index}`,
    points,
    createdAt: '',
  }));

const day = (praises: number, gratitudes: number, points = 1) => ({
  date: DATE,
  praises: entries(praises, points),
  gratitudes: entries(gratitudes, points),
});

describe('buildScene', () => {
  describe('progress against the personal goal', () => {
    it('measures the day against the goal, not an absolute scale', () => {
      const scene = buildScene(day(3, 0), settings());

      expect(scene.praisePoints).toBe(3);
      expect(scene.praiseProgress).toBeCloseTo(0.6);
      expect(scene.goalReached).toBe(false);
    });

    it('reads the same day as full once the goal is lowered', () => {
      const modest = buildScene(day(3, 0), settings({ goals: { praises: 3, gratitudes: 5 } }));

      expect(modest.praiseProgress).toBe(1);
      expect(modest.goalReached).toBe(true);
    });

    it('grows the plants as the day fills up when points are off', () => {
      const early = buildScene(day(1, 0), settings());
      const full = buildScene(day(5, 0), settings());

      expect(early.plants[0].stage).toBe('sprout');
      expect(full.plants.some((plant) => plant.stage === 'seasonal')).toBe(true);
      expect(full.plants[0].scale).toBeGreaterThan(early.plants[0].scale);
    });
  });

  describe('when there are more entries than the bed can show', () => {
    const scene = buildScene(day(30, 0), settings());

    it('stops adding plants at the limit', () => {
      expect(scene.plants).toHaveLength(MAX_PLANTS.day);
    });

    it('makes the plants it does show bigger instead', () => {
      const modest = buildScene(day(5, 0), settings());
      const biggest = Math.max(...scene.plants.map((plant) => plant.scale));

      expect(biggest).toBeGreaterThan(Math.max(...modest.plants.map((plant) => plant.scale)));
    });

    it('still counts every entry towards the score', () => {
      expect(scene.praisePoints).toBe(30);
    });
  });

  describe('gratitude as light', () => {
    it('is dark when nothing was noticed', () => {
      expect(buildScene(day(3, 0), settings()).lightLevel).toBe(0);
    });

    it('reaches full light at the goal and does not overshoot', () => {
      expect(buildScene(day(3, 5), settings()).lightLevel).toBe(1);
      expect(buildScene(day(3, 20), settings()).lightLevel).toBe(1);
    });

    it('keeps sparks countable only while there is room for them', () => {
      expect(buildScene(day(0, 20), settings()).sparks).toHaveLength(MAX_SPARKS.day);
      expect(buildScene(day(0, 20), settings(), { variant: 'tile' }).sparks).toHaveLength(
        MAX_SPARKS.tile
      );
    });
  });

  describe('when a track is switched off', () => {
    it('leaves the bed evenly lit instead of cold', () => {
      const scene = buildScene(
        day(3, 4),
        settings({ tracks: { praises: true, gratitudes: false } })
      );

      expect(scene.lightLevel).toBeNull();
      expect(scene.sparks).toHaveLength(0);
      expect(scene.gratitudePoints).toBe(0);
    });

    it('leaves bare ground when praises are off', () => {
      const scene = buildScene(
        day(3, 4),
        settings({ tracks: { praises: false, gratitudes: true } })
      );

      expect(scene.plants).toHaveLength(0);
      expect(scene.groundCover.length).toBeGreaterThan(0);
    });
  });

  describe('points scale', () => {
    const withPoints = settings({ points: { enabled: true, scale: 3 } });

    it('lets a hard thing bloom while an easy one stays a sprout', () => {
      const easy = buildScene({ date: DATE, praises: entries(1, 1), gratitudes: [] }, withPoints);
      const hard = buildScene({ date: DATE, praises: entries(1, 3), gratitudes: [] }, withPoints);

      expect(easy.plants[0].stage).toBe('sprout');
      expect(hard.plants[0].stage).toBe('flower');
    });

    it('counts points, not entries, towards the goal', () => {
      const scene = buildScene(
        { date: DATE, praises: entries(2, 3), gratitudes: [] },
        withPoints
      );

      expect(scene.praisePoints).toBe(6);
      expect(scene.goalReached).toBe(true);
    });
  });

  describe('stability', () => {
    it('lays out the same day identically every time', () => {
      const first = buildScene(day(4, 3), settings());
      const second = buildScene(day(4, 3), settings());

      expect(second.plants).toEqual(first.plants);
      expect(second.sparks).toEqual(first.sparks);
    });

    it('lays out different days differently', () => {
      const other = buildScene({ ...day(4, 3), date: '07.08.2026' }, settings());
      const scene = buildScene(day(4, 3), settings());

      expect(other.plants[0].x).not.toBe(scene.plants[0].x);
    });

    it('picks the flower of the month from the date', () => {
      expect(buildScene(day(1, 1), settings()).season.name).toBe('sunflower');
      expect(buildScene({ ...day(1, 1), date: '14.12.2026' }, settings()).season.name).toBe(
        'poinsettia'
      );
    });
  });
});
