import { revealOffset } from '@/utils/keyboard';

/** iPhone 14-ish: screen 844, header eats 100, tab bar eats 94, keyboard 336. */
const phone = {
  screenHeight: 844,
  viewportTop: 100,
  viewportHeight: 650,
  gap: 12,
};

describe('revealOffset', () => {
  describe('when the keyboard is closed', () => {
    it('scrolls only far enough to show the section', () => {
      const offset = revealOffset({ ...phone, sectionBottom: 1100, keyboardHeight: 0 });

      // Viewport bottom is 750 on an 844 screen, so nothing overlaps it.
      expect(offset).toBe(1100 - 650 + 12);
    });

    it('stays at the top when the section already fits', () => {
      expect(revealOffset({ ...phone, sectionBottom: 300, keyboardHeight: 0 })).toBe(0);
    });
  });

  describe('when the keyboard is drawn over the app', () => {
    // Android under edge-to-edge, and iOS: the viewport keeps its full height.
    const keyboardHeight = 336;

    it('subtracts only the part of the keyboard that covers the scroll area', () => {
      const offset = revealOffset({ ...phone, sectionBottom: 1100, keyboardHeight });

      // Keyboard top is at 508; the viewport runs 100..750, so 242 of it is hidden.
      expect(offset).toBe(1100 - (650 - 242) + 12);
    });

    it('scrolls further than it would with the keyboard closed', () => {
      const closed = revealOffset({ ...phone, sectionBottom: 1100, keyboardHeight: 0 });
      const open = revealOffset({ ...phone, sectionBottom: 1100, keyboardHeight });

      expect(open).toBeGreaterThan(closed);
    });

    it('lifts a section that would otherwise sit under the keys', () => {
      // Section bottom at 900 is inside the closed viewport but under the keyboard.
      const offset = revealOffset({ ...phone, sectionBottom: 900, keyboardHeight });

      expect(offset).toBeGreaterThan(0);
    });
  });

  describe('when the platform resizes the window instead', () => {
    it('adds no correction, because the viewport already shrank', () => {
      const resized = revealOffset({
        ...phone,
        viewportHeight: 650 - 336,
        sectionBottom: 1100,
        keyboardHeight: 336,
      });

      // Viewport now ends at 414, well above the keyboard top at 508.
      expect(resized).toBe(1100 - 314 + 12);
    });
  });

  describe('before anything has been measured', () => {
    it('does not scroll', () => {
      expect(
        revealOffset({ ...phone, viewportHeight: 0, sectionBottom: 1100, keyboardHeight: 336 })
      ).toBe(0);
    });
  });
});
