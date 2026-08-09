import GardenBed from '@/garden/components/GardenBed';
import { buildScene } from '@/garden/scene';
import type { GardenSettings, GardenVariant } from '@/garden/types';
import { render } from '@testing-library/react-native';
import React from 'react';

const settings: GardenSettings = {
  tracks: { praises: true, gratitudes: true },
  goals: { praises: 5, gratitudes: 5 },
  points: { enabled: false, scale: 3 },
};

const sceneFor = (praises: number, gratitudes: number, variant: GardenVariant = 'day') =>
  buildScene(
    {
      date: '06.08.2026',
      praises: Array.from({ length: praises }, (_, i) => ({
        id: `p${i}`,
        text: `Praise ${i}`,
        points: 1,
        createdAt: '',
      })),
      gratitudes: Array.from({ length: gratitudes }, (_, i) => ({
        id: `g${i}`,
        text: `Gratitude ${i}`,
        points: 1,
        createdAt: '',
      })),
    },
    settings,
    { variant }
  );

describe('GardenBed', () => {
  it('renders an empty day', () => {
    expect(() => render(<GardenBed scene={sceneFor(0, 0)} size={300} />)).not.toThrow();
  });

  it('renders a full day', () => {
    expect(() => render(<GardenBed scene={sceneFor(7, 5)} size={300} />)).not.toThrow();
  });

  it('renders a day past the limit of what fits', () => {
    expect(() => render(<GardenBed scene={sceneFor(40, 40)} size={300} />)).not.toThrow();
  });

  it('renders a tile', () => {
    expect(() => render(<GardenBed scene={sceneFor(4, 3, 'tile')} size={44} />)).not.toThrow();
  });
});
