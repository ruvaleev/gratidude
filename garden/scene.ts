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

/** Jittered grid, so plants scatter without landing on top of each other. */
function scatter(count: number, random: () => number) {
  const gridSize = Math.max(2, Math.ceil(Math.sqrt(Math.max(1, count))));
  const slots: { x: number; y: number }[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      slots.push({
        x: (col + 0.5) / gridSize + (random() - 0.5) * (0.5 / gridSize),
        y: (row + 0.62) / gridSize + (random() - 0.5) * (0.4 / gridSize),
      });
    }
  }

  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  return slots.slice(0, count);
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
  const positions = scatter(visible, random);

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

  const plants: PlantSpec[] = praises.slice(0, visible).map((entry, index) => {
    const ratio = settings.points.enabled
      ? clamp(((entry.points || 1) - 1) / (pointsScale - 1), 0, 1)
      : fill;

    // Hitting the goal earns the day one flower of the month.
    const isSeasonal = goalReached && entry.id === strongest?.id;

    return {
      entryId: entry.id,
      x: positions[index]?.x ?? 0.5,
      y: positions[index]?.y ?? 0.6,
      stage: stageFor(ratio, isSeasonal),
      scale: clamp(0.55 + ratio * 0.25 + fill * 0.2 + sizeBonus, 0.4, 1.6),
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
