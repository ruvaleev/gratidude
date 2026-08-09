/**
 * UI chrome tokens: screens, lists, controls, type.
 *
 * The garden illustration has its own palette in `garden/config.ts` — soil,
 * foliage, petals and light belong to the artwork, not to the interface, and
 * the two must not bleed into each other.
 */

export const colors = {
  /** Page background — warm off-white (stone-50). */
  background: '#fafaf9',
  surface: '#ffffff',
  /** Cards over the page background. */
  surfaceMuted: 'rgba(255, 255, 255, 0.6)',
  surfaceSunken: 'rgba(231, 229, 228, 0.6)',

  border: 'rgba(231, 229, 228, 0.8)',
  borderSoft: 'rgba(231, 229, 228, 0.5)',

  textStrong: '#292524',
  text: '#44403c',
  textSubtle: '#78716c',
  textMuted: '#a8a29e',
  textDisabled: '#d6d3d1',
  onAccent: '#fafaf9',

  /** Scrim behind modals. */
  overlay: 'rgba(0, 0, 0, 0.5)',

  /** Growth: switches, active states. */
  accent: '#4e7f3a',
  accentSoft: '#7d9a5c',
  /** Light: today, goal reached, highlights. */
  gold: '#b08423',
  goldSurface: '#fbefd2',

  danger: '#a24a38',
  shadow: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

/**
 * The app speaks in light, wide-tracked type. Spread a preset and override the
 * difference rather than inventing a new size/weight pair.
 */
export const text = {
  /** Section headings inside a screen. */
  title: { fontSize: 18, fontWeight: '300', letterSpacing: 1 },
  /** Numbers on the day summary. */
  figure: { fontSize: 22, fontWeight: '300' },
  body: { fontSize: 15, fontWeight: '300' },
  bodySmall: { fontSize: 13, fontWeight: '300' },
  /** All-caps eyebrows and tab labels. */
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 3, fontWeight: '300' },
  labelSmall: { fontSize: 10, fontWeight: '300' },
  /** Wide-tracked button text. */
  button: { fontSize: 14, fontWeight: '300', textTransform: 'uppercase', letterSpacing: 4 },
} as const;
