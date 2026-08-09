/**
 * One line of the diary — a praise to yourself or a gratitude to the Universe.
 *
 * `points` is how hard it was: 1 by default, up to `settings.points.scale`.
 * The garden turns points into the growth stage of a plant, so a record is
 * never just a number on the screen.
 */
export interface Entry {
  id: string;
  text: string;
  points: number;
  createdAt: string;
}

/** Entries grouped by date in DATE_FORMAT (DD.MM.YYYY). */
export interface EntriesByDate {
  [date: string]: Entry[];
}

export interface EntriesState {
  items: EntriesByDate;
}
