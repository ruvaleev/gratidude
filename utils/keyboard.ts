export interface RevealInput {
  /** Offset of the focused section's bottom edge inside the scroll content. */
  sectionBottom: number;
  /** Where the scroll area starts on screen. */
  viewportTop: number;
  /** How tall the scroll area is. */
  viewportHeight: number;
  screenHeight: number;
  /** Reported by the keyboard event; 0 when the keyboard is closed. */
  keyboardHeight: number;
  /** Breathing room left between the input row and the keyboard. */
  gap: number;
}

/**
 * Scroll offset that brings a focused input out from under the keyboard.
 *
 * Only the part of the keyboard that actually overlaps the scroll area counts.
 * That keeps the result right on both platforms: when the window is resized for
 * the keyboard the scroll area has already shrunk and the overlap is zero, and
 * when the keyboard is drawn over the app — Android under edge-to-edge — the
 * overlap carries the whole correction.
 */
export function revealOffset({
  sectionBottom,
  viewportTop,
  viewportHeight,
  screenHeight,
  keyboardHeight,
  gap,
}: RevealInput): number {
  if (viewportHeight <= 0) return 0;

  const viewportBottom = viewportTop + viewportHeight;
  const overlap = Math.max(0, viewportBottom - (screenHeight - keyboardHeight));
  const visible = viewportHeight - overlap;

  return Math.max(0, sectionBottom - visible + gap);
}
