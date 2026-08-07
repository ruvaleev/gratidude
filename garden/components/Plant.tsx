import { Circle, Ellipse, G, Path } from 'react-native-svg';
import { mix } from '../colors';
import { FLOWER_CENTER, FLOWER_CENTER_DEEP, FOLIAGE, PLANT_COLORS } from '../config';
import type { PlantSpec, SeasonSpec } from '../types';

/**
 * A pointed oval — two mirrored curves from the stalk out to the tip. Reads as
 * a leaf at 60px and still as a green blob at 8px, which an ellipse does not.
 */
export function leafPath(length: number, width: number): string {
  const half = width / 2;
  return [
    `M 0 0`,
    `C ${length * 0.25} ${-half} ${length * 0.72} ${-half * 0.82} ${length} 0`,
    `C ${length * 0.72} ${half * 0.82} ${length * 0.25} ${half} 0 0`,
    `Z`,
  ].join(' ');
}

/** A closed bud: fat at the bottom, drawn to a soft point at the top. */
function budPath(width: number, height: number): string {
  const half = width / 2;
  return [
    `M 0 0`,
    `C ${-half} ${-height * 0.15} ${-half} ${-height * 0.72} 0 ${-height}`,
    `C ${half} ${-height * 0.72} ${half} ${-height * 0.15} 0 0`,
    `Z`,
  ].join(' ');
}

/** Tapered stalk — thick at the soil, thin at the head. */
function stemPath(height: number, lean: number, width: number): string {
  const base = width / 2;
  const tip = base * 0.4;
  const tipX = lean * height * 0.5;
  const ctrl = lean * height * 0.18;
  return [
    `M ${-base} 0`,
    `C ${ctrl - base} ${-height * 0.5} ${tipX - tip} ${-height * 0.6} ${tipX - tip} ${-height}`,
    `L ${tipX + tip} ${-height}`,
    `C ${tipX + tip} ${-height * 0.6} ${ctrl + base} ${-height * 0.5} ${base} 0`,
    `Z`,
  ].join(' ');
}

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
  const isSprout = plant.stage === 'sprout';
  // A sprout is a cluster of leaves close to the soil, not a bare stick with a
  // couple of leaves on it — so it keeps most of its size in the rosette.
  const height = unit * plant.scale * (isSprout ? 0.85 : 1);
  const tipX = plant.lean * height * 0.5;
  const tipY = -height;
  const color = PLANT_COLORS[plant.colorIndex % PLANT_COLORS.length];

  const rosette = isSprout ? 5 : 4;
  const rosetteScale = isSprout ? 0.85 : 0.3;
  const stalkLeaves = isSprout ? 0 : plant.stage === 'bud' ? 2 : 3;
  const headRadius = height * (plant.stage === 'seasonal' ? 0.27 : 0.2);

  return (
    <G transform={`translate(${plant.x}, ${plant.y})`}>
      {/* the plant sits on the soil rather than floating above it */}
      <Ellipse
        cx={0}
        cy={0}
        rx={height * 0.26}
        ry={height * 0.07}
        fill="rgba(38, 26, 16, 0.28)"
      />

      {/* leaves fanning out at ground level — even a sprout reads as a plant */}
      {Array.from({ length: rosette }, (_, index) => {
        const spread = 150;
        const angle = -165 + spread * (index / Math.max(1, rosette - 1)) + plant.lean * 12;
        const middle = Math.abs(index - (rosette - 1) / 2);
        const length = height * rosetteScale * (1 - middle * 0.12);
        return (
          <Path
            key={`base-${index}`}
            d={leafPath(length, length * 0.52)}
            // Sprouts sit low against dark soil, so they get the brighter greens.
            fill={FOLIAGE[(isSprout ? 2 : 0) + (index % 2)]}
            transform={`translate(0, ${-height * 0.03}) rotate(${angle})`}
          />
        );
      })}

      <Path
        // A sprout is mostly rosette: its stalk barely clears the soil.
        d={stemPath(height * (isSprout ? 0.45 : 1), plant.lean, Math.max(1.2, height * 0.09))}
        fill={FOLIAGE[2]}
      />

      {/* leaves up the stalk, alternating sides and shrinking towards the head */}
      {Array.from({ length: stalkLeaves }, (_, index) => {
        const t = 0.34 + index * 0.22;
        const side = index % 2 ? 1 : -1;
        const x = tipX * t * t;
        const y = tipY * t;
        const length = height * (0.32 - index * 0.04);
        return (
          <Path
            key={`stalk-${index}`}
            d={leafPath(length, length * 0.46)}
            fill={FOLIAGE[side > 0 ? 3 : 2]}
            transform={`translate(${x}, ${y}) rotate(${side > 0 ? -28 : -152}) `}
          />
        );
      })}

      {plant.stage === 'bud' && (
        <G transform={`translate(${tipX}, ${tipY})`}>
          <Path d={budPath(headRadius * 1.05, headRadius * 1.5)} fill={color} />
          <Path
            d={budPath(headRadius * 0.5, headRadius * 1.15)}
            fill={mix(color, '#FFFFFF', 0.3)}
            transform={`translate(${-headRadius * 0.16}, 0)`}
          />
          {/* sepals hugging the base of the bud */}
          <Path
            d={leafPath(headRadius * 0.72, headRadius * 0.34)}
            fill={FOLIAGE[1]}
            transform={`rotate(-142)`}
          />
          <Path
            d={leafPath(headRadius * 0.72, headRadius * 0.34)}
            fill={FOLIAGE[2]}
            transform={`rotate(-38)`}
          />
        </G>
      )}

      {(plant.stage === 'flower' || plant.stage === 'seasonal') && (
        <G transform={`translate(${tipX}, ${tipY})`}>
          {(() => {
            const seasonal = plant.stage === 'seasonal';
            const petals = seasonal ? (detailed ? 8 : 6) : detailed ? 6 : 5;
            const petalColor = seasonal ? season.petals[0] : color;
            const petalTint = seasonal ? season.petals[1] : mix(color, '#FFFFFF', 0.28);
            const petalLength = headRadius * (seasonal ? 1.05 : 0.92);
            const petalWidth = petalLength * (seasonal ? 0.62 : 0.72);

            return (
              <>
                {Array.from({ length: petals }, (_, index) => {
                  const angle = (index / petals) * 360;
                  return (
                    <Path
                      key={`petal-${index}`}
                      d={leafPath(petalLength, petalWidth)}
                      fill={index % 2 ? petalTint : petalColor}
                      transform={`rotate(${angle}) translate(${headRadius * 0.18}, 0)`}
                    />
                  );
                })}
                <Circle r={headRadius * 0.42} fill={FLOWER_CENTER_DEEP} />
                <Circle r={headRadius * 0.32} fill={FLOWER_CENTER} />
                {detailed && (
                  <Circle
                    cx={-headRadius * 0.09}
                    cy={-headRadius * 0.09}
                    r={headRadius * 0.12}
                    fill="rgba(255, 255, 255, 0.55)"
                  />
                )}
              </>
            );
          })()}
        </G>
      )}
    </G>
  );
}
