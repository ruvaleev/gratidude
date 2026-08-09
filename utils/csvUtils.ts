import type { RootState } from "@/store";

/**
 * Escapes a CSV cell value (handles commas, quotes, newlines).
 */
function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Converts gratidude Redux store data to CSV format.
 * Produces a readable table: Type, Date, Text, Points (one row per entry).
 */
export function convertStoreToCSV(state: RootState): string {
  const rows: string[][] = [["Type", "Date", "Text", "Points"]];

  const gratitudes = state.gratitudes?.items ?? {};
  for (const [date, entries] of Object.entries(gratitudes)) {
    for (const entry of entries ?? []) {
      rows.push(["gratitude", date, entry.text, String(entry.points ?? 1)]);
    }
  }

  const praises = state.praises?.items ?? {};
  for (const [date, entries] of Object.entries(praises)) {
    for (const entry of entries ?? []) {
      rows.push(["praise", date, entry.text, String(entry.points ?? 1)]);
    }
  }

  if (rows.length === 1) {
    return rows[0].join(",");
  }

  return rows
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
}
