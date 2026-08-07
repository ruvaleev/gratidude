import Section from '@/components/section';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('Section', () => {
  const renderSection = (onFieldFocus?: (offsetY: number) => void) =>
    render(
      <Section
        title="I praise myself for..."
        items={[]}
        sectionId="praises"
        onSubmit={jest.fn()}
        buttonText="Praise"
        onFieldFocus={onFieldFocus}
      />
    );

  describe('when the field is focused', () => {
    it('reports its bottom edge, where the input and button sit', () => {
      const onFieldFocus = jest.fn();
      const { getByTestId } = renderSection(onFieldFocus);

      // The section learns its box from layout; simulate the measurement.
      fireEvent(getByTestId('praisesSection'), 'layout', {
        nativeEvent: { layout: { x: 0, y: 640, width: 360, height: 220 } },
      });
      fireEvent(getByTestId('praisesInput'), 'focus');

      // Not 640: lifting the title above the keyboard would leave the field under it.
      expect(onFieldFocus).toHaveBeenCalledWith(860);
    });
  });

  describe('when no handler is given', () => {
    it('still focuses without blowing up', () => {
      const { getByTestId } = renderSection();

      expect(() => fireEvent(getByTestId('praisesInput'), 'focus')).not.toThrow();
    });
  });
});
