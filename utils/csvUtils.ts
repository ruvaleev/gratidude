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
 * Produces a readable table: Type, Date, Text (one row per gratitude/praise).
 */
export function convertStoreToCSV(state: RootState): string {
  const rows: string[][] = [["Type", "Date", "Text"]];

  const gratitudes = state.gratitudes?.items ?? {};
  for (const [date, texts] of Object.entries(gratitudes)) {
    for (const text of texts ?? []) {
      rows.push(["gratitude", date, text]);
    }
  }

  const praises = state.praises?.items ?? {};
  for (const [date, texts] of Object.entries(praises)) {
    for (const text of texts ?? []) {
      rows.push(["praise", date, text]);
    }
  }

  if (rows.length === 1) {
    return rows[0].join(",");
  }

  return rows
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
}
