import type { Entry } from '@/store/types';
import {
  GROUND_COVER,
  MAX_PLANTS,
  MAX_SIZE_BONUS,
  MAX_SPARKS,
  PLANT_COLORS,
  SEASON_FLOWERS,
} from './config';
import { randomForDate } from './random';
import type {
  DayInput,
  GardenSettings,
  GardenVariant,
  PlantSpec,
  PlantStage,
  Scene,
  SeasonSpec,
  SparkSpec,
} from './types';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const sumPoints = (entries: Entry[]) =>
  entries.reduce((total, entry) => total + (entry.points || 1), 0);

/** DD.MM.YYYY → 1..12. Falls back to January on anything unparseable. */
function monthOf(date: string): number {
  const month = Number(date.split('.')[1]);
  return Number.isFinite(month) && month >= 1 && month <= 12 ? month : 1;
}

export function seasonFor(date: string): SeasonSpec {
  return SEASON_FLOWERS[monthOf(date) - 1];
}

/**
 * Growth stage of a single plant.
 *
 * With the points scale on, the stage says how hard that particular thing was.
 * With it off, every entry weighs the same, so the whole bed grows together as
 * the day fills up: sprouts early, buds halfway, flowers once the goal is met.
 */
function stageFor(ratio: number, isSeasonal: boolean): PlantStage {
  if (isSeasonal) return 'seasonal';
  if (ratio <= 0.34) return 'sprout';
  if (ratio <= 0.67) return 'bud';
  return 'flower';
}

/**
 * Jittered grid, so plants scatter without landing on top of each other.
 *
 * Plants are anchored at their base and grow upwards, so the band stops well
 * short of the top and sides — otherwise a tall flower runs over the kerb.
 */
const PLOT = { left: 0.14, right: 0.86, top: 0.34, bottom: 0.94 };

/**
 * How much smaller a plant at the back of the bed is drawn than one at the front.
 * Large on purpose: rows sit close together on a square bed, and without a real
 * size difference the front row simply hides the back one.
 */
const DEPTH_SHRINK = 0.3;

function scatter(count: number, random: () => number) {
  if (count === 0) return [];

  const cols = Math.max(2, Math.ceil(Math.sqrt(count)));
  const rows = Math.ceil(count / cols);
  const spanX = PLOT.right - PLOT.left;
  const spanY = PLOT.bottom - PLOT.top;
  const slots: { x: number; y: number }[] = [];

  for (let index = 0; index < count; index++) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    // The last row is usually short; centre it instead of leaving a gap on one side.
    const inThisRow = Math.min(cols, count - row * cols);
    const offset = (cols - inThisRow) / 2;

    slots.push({
      x: PLOT.left + spanX * ((col + offset + 0.5) / cols) + (random() - 0.5) * (spanX * 0.5) / cols,
      y: PLOT.top + spanY * ((row + 0.5) / rows) + (random() - 0.5) * (spanY * 0.4) / rows,
    });
  }

  return slots;
}

/**
 * Turns a day of the diary into everything the bed needs to draw itself.
 *
 * This is the single place that answers "what does five things done look like,
 * and what does ten look like". The rules, in order:
 *
 *  - the day is measured against the person's own goal, not an absolute scale,
 *    so lowering the goal makes the same day read as fuller;
 *  - one entry is one plant, but only up to what fits — beyond that the plants
 *    already on the bed grow instead of new ones appearing;
 *  - gratitude never becomes another object competing for pixels: it is light,
 *    which survives being shrunk to a tile.
 */
export function buildScene(
  day: DayInput,
  settings: GardenSettings,
  options: { variant?: GardenVariant } = {}
): Scene {
  const variant = options.variant ?? 'day';
  const random = randomForDate(day.date, variant);

  const praises = settings.tracks.praises ? day.praises : [];
  const gratitudes = settings.tracks.gratitudes ? day.gratitudes : [];

  const praisePoints = sumPoints(praises);
  const gratitudePoints = sumPoints(gratitudes);

  const praiseGoal = Math.max(1, settings.goals.praises);
  const gratitudeGoal = Math.max(1, settings.goals.gratitudes);

  const praiseProgress = praisePoints / praiseGoal;
  const goalReached = praiseProgress >= 1;

  // How full the bed feels. Everything visual leans on this rather than on the
  // raw count, which is what makes the goal setting meaningful.
  const fill = clamp(praiseProgress, 0, 1);

  const lightLevel = settings.tracks.gratitudes
    ? clamp(gratitudePoints / gratitudeGoal, 0, 1)
    : null;

  const visible = Math.min(praises.length, MAX_PLANTS[variant]);
  // Sorted back to front, so plants lower on the bed overlap the ones behind.
  const positions = scatter(visible, random).sort((a, b) => a.y - b.y);

  // Entries that did not get their own plant push the whole bed up a size.
  const hidden = praises.length - visible;
  const sizeBonus = clamp(
    (hidden / MAX_PLANTS[variant]) * MAX_SIZE_BONUS + Math.max(0, praiseProgress - 1) * 0.15,
    0,
    MAX_SIZE_BONUS
  );

  const pointsScale = Math.max(2, settings.points.scale);
  const strongest = praises.reduce(
    (best, entry) => ((entry.points || 1) > (best?.points || 0) ? entry : best),
    praises[0]
  );

  // When not everything fits — a tile holds four plants — show the day at its
  // best rather than whatever happened to be written first, but keep the
  // survivors in the order they were written so the bed stays stable.
  const shown =
    praises.length <= visible
      ? praises
      : praises
          .map((entry, order) => ({ entry, order }))
          .sort((a, b) => (b.entry.points || 1) - (a.entry.points || 1))
          .slice(0, visible)
          .sort((a, b) => a.order - b.order)
          .map((item) => item.entry);

  const plants: PlantSpec[] = shown.map((entry, index) => {
    const ratio = settings.points.enabled
      ? clamp(((entry.points || 1) - 1) / (pointsScale - 1), 0, 1)
      : fill;

    // Hitting the goal earns the day one flower of the month.
    const isSeasonal = goalReached && entry.id === strongest?.id;

    const y = positions[index]?.y ?? 0.6;
    // Rows overlap heavily on a square bed; shrinking the far ones keeps every
    // plant readable and makes the bed read as having depth.
    const depth = 1 - DEPTH_SHRINK * (1 - (y - PLOT.top) / (PLOT.bottom - PLOT.top));

    return {
      entryId: entry.id,
      x: positions[index]?.x ?? 0.5,
      y,
      stage: stageFor(ratio, isSeasonal),
      scale: clamp((0.55 + ratio * 0.25 + fill * 0.2 + sizeBonus) * depth, 0.4, 1.6),
      colorIndex: Math.floor(random() * PLANT_COLORS.length),
      lean: (random() - 0.5) * 0.5,
    };
  });

  const sparkCount = Math.min(gratitudes.length, MAX_SPARKS[variant]);
  const sparks: SparkSpec[] = gratitudes.slice(0, sparkCount).map((entry) => ({
    x: 0.1 + random() * 0.8,
    y: 0.08 + random() * 0.72,
    intensity: clamp((entry.points || 1) / pointsScale, 0.3, 1),
  }));

  const groundCover = Array.from({ length: GROUND_COVER[variant] }, () => ({
    x: 0.05 + random() * 0.9,
    y: 0.12 + random() * 0.84,
    scale: 0.6 + random() * 0.6,
  }));

  return {
    date: day.date,
    variant,
    praisePoints,
    gratitudePoints,
    praiseProgress,
    lightLevel,
    plants,
    sparks,
    groundCover,
    season: seasonFor(day.date),
    goalReached,
  };
}
