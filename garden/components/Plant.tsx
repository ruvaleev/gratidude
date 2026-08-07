import { Circle, Ellipse, G, Path } from 'react-native-svg';
import { PLANT_COLORS, STEM, STEM_LIGHT } from '../config';
import { mix } from '../colors';
import type { PlantSpec, SeasonSpec } from '../types';

/**
 * One record, grown. Everything is drawn around (0, 0) at the plant's base and
 * scaled by `unit`, so the same component works on a full screen bed and on a
 * month tile.
 */
export default function Plant({
  plant,
  unit,
  season,
  detailed,
}: {
  plant: PlantSpec;
  unit: number;
  season: SeasonSpec;
  detailed: boolean;
}) {
  const height = unit * plant.scale;
  const tipX = plant.lean * height * 0.5;
  const tipY = -height;
  const stroke = Math.max(detailed ? 1.1 : 0.5, height * 0.07);
  const color = PLANT_COLORS[plant.colorIndex % PLANT_COLORS.length];

  const leafPairs = plant.stage === 'sprout' ? 1 : plant.stage === 'bud' ? 2 : 3;
  const leaves = [];
  const positions = [[0.62], [0.45, 0.74], [0.36, 0.58, 0.79]][leafPairs - 1];

  for (let i = 0; i < leafPairs; i++) {
    const t = positions[i];
    // Point on the stem's quadratic curve at t.
    const x = 2 * (1 - t) * t * (tipX * 0.35) + t * t * tipX;
    const y = 2 * (1 - t) * t * (tipY * 0.6) + t * t * tipY;
    const size = height * 0.26 * (1 - i * 0.12);

    leaves.push(
      <G key={`leaf-${i}`}>
        <Ellipse
          cx={x - size * 0.42}
          cy={y}
          rx={size * 0.52}
          ry={size * 0.2}
          fill={i % 2 ? STEM_LIGHT : STEM}
          transform={`rotate(-32 ${x - size * 0.42} ${y})`}
        />
        <Ellipse
          cx={x + size * 0.42}
          cy={y + size * 0.1}
          rx={size * 0.52}
          ry={size * 0.2}
          fill={i % 2 ? STEM : STEM_LIGHT}
          transform={`rotate(32 ${x + size * 0.42} ${y + size * 0.1})`}
        />
      </G>
    );
  }

  const headRadius = height * (plant.stage === 'seasonal' ? 0.26 : 0.17);

  return (
    <G x={plant.x} y={plant.y}>
      <Path
        d={`M 0 0 Q ${tipX * 0.35} ${tipY * 0.6} ${tipX} ${tipY}`}
        stroke={STEM}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      {leaves}

      {plant.stage === 'bud' && (
        <Ellipse
          cx={tipX}
          cy={tipY - headRadius * 0.3}
          rx={headRadius * 0.5}
          ry={headRadius * 0.75}
          fill={color}
        />
      )}

      {plant.stage === 'flower' && (
        <G>
          {[0, 1, 2, 3, 4].map((index) => {
            const angle = (index / 5) * Math.PI * 2;
            const cx = tipX + Math.cos(angle) * headRadius * 0.6;
            const cy = tipY + Math.sin(angle) * headRadius * 0.6;
            return (
              <Ellipse
                key={index}
                cx={cx}
                cy={cy}
                rx={headRadius * 0.55}
                ry={headRadius * 0.42}
                fill={color}
                transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
              />
            );
          })}
          <Circle cx={tipX} cy={tipY} r={headRadius * 0.34} fill={mix(color, '#F8E6A4', 0.6)} />
        </G>
      )}

      {plant.stage === 'seasonal' && (
        <G>
          {Array.from({ length: detailed ? 8 : 6 }, (_, index) => {
            const petals = detailed ? 8 : 6;
            const angle = (index / petals) * Math.PI * 2;
            const cx = tipX + Math.cos(angle) * headRadius * 0.62;
            const cy = tipY + Math.sin(angle) * headRadius * 0.62;
            return (
              <Ellipse
                key={index}
                cx={cx}
                cy={cy}
                rx={headRadius * 0.5}
                ry={headRadius * 0.34}
                fill={season.petals[index % 2]}
                transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
              />
            );
          })}
          <Circle cx={tipX} cy={tipY} r={headRadius * 0.32} fill="#F6E7A8" />
        </G>
      )}
    </G>
  );
}
