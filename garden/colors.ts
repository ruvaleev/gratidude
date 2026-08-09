/** Colour helpers shared by every part of the bed. */

/**
 * Accepts both `#rrggbb` and the `rgb(...)` this module produces, so mixes can
 * be nested without silently turning into NaN.
 */
function parseColor(color: string): [number, number, number] {
  if (!color.startsWith('#')) {
    const [r = 0, g = 0, b = 0] = (color.match(/\d+/g) ?? []).map(Number);
    return [r, g, b];
  }

  let value = color.slice(1);
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }

  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

export function mix(from: string, to: string, amount: number): string {
  const t = Math.max(0, Math.min(1, amount));
  const [r1, g1, b1] = parseColor(from);
  const [r2, g2, b2] = parseColor(to);
  const channel = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${channel(r1, r2)}, ${channel(g1, g2)}, ${channel(b1, b2)})`;
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = parseColor(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * A day with no gratitude in it goes grey rather than dark: the bed should read
 * as unlit, never as punished. `light` of null means the track is off, so the
 * scene sits at an even daylight instead of anywhere on the cold-warm ramp.
 */
export function temperature(base: string, light: number | null, warm: string, cool: string) {
  if (light === null) return mix(base, warm, 0.25);
  return mix(mix(base, cool, (1 - light) * 0.55), warm, light * 0.6);
}
