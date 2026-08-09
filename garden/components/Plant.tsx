import { Circle, Ellipse, G, Path } from 'react-native-svg';
import { mix, withAlpha } from '../colors';
import {
  FLOWER_CENTER,
  FLOWER_CENTER_DEEP,
  FOLIAGE,
  PLANT_COLORS,
  PLANT_VARIANTS,
} from '../config';
import type { PlantSpec, SeasonSpec } from '../types';

/**
 * Every plant is built from the same handful of shapes below, layered
 * dark-to-light: a shape, a smaller lighter copy of it for the lit side, and a
 * soft dark blot underneath for contact with the soil. That layering is what
 * gives a flat SVG its bit of volume — there are no gradients per plant on
 * purpose, since a bed can hold twelve of them and a tile draws at 44px.
 */

const SHADOW = 'rgba(38, 26, 16, 0.26)';
const SOFT_SHADOW = 'rgba(38, 26, 16, 0.14)';

/* ---------------------------------------------------------------- shapes -- */

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

/** A blunt, spoon-shaped leaf: widest past the middle, rounded at the tip. */
function roundLeafPath(length: number, width: number): string {
  const half = width / 2;
  return [
    `M 0 0`,
    `C ${length * 0.1} ${-half * 0.86} ${length * 0.52} ${-half * 1.16} ${length * 0.92} ${-half * 0.3}`,
    `C ${length * 1.06} ${-half * 0.08} ${length * 1.06} ${half * 0.08} ${length * 0.92} ${half * 0.3}`,
    `C ${length * 0.52} ${half * 1.16} ${length * 0.1} ${half * 0.86} 0 0`,
    `Z`,
  ].join(' ');
}

/** A leaf with a soft lobe on each side — the bushier plants get these. */
function lobedLeafPath(length: number, width: number): string {
  const half = width / 2;
  return [
    `M 0 0`,
    `C ${length * 0.08} ${-half * 0.9} ${length * 0.3} ${-half * 1.1} ${length * 0.42} ${-half * 0.62}`,
    `C ${length * 0.56} ${-half * 1.06} ${length * 0.82} ${-half * 0.86} ${length} 0`,
    `C ${length * 0.82} ${half * 0.86} ${length * 0.56} ${half * 1.06} ${length * 0.42} ${half * 0.62}`,
    `C ${length * 0.3} ${half * 1.1} ${length * 0.08} ${half * 0.9} 0 0`,
    `Z`,
  ].join(' ');
}

/** Teardrop petal: narrow where it meets the centre, full and round at the rim. */
function petalPath(length: number, width: number): string {
  const half = width / 2;
  return [
    `M 0 0`,
    `C ${length * 0.3} ${-half * 0.98} ${length * 0.82} ${-half * 1.02} ${length} ${-half * 0.12}`,
    `C ${length * 1.05} ${0} ${length * 1.05} ${0} ${length} ${half * 0.12}`,
    `C ${length * 0.82} ${half * 1.02} ${length * 0.3} ${half * 0.98} 0 0`,
    `Z`,
  ].join(' ');
}

/** The same teardrop with a shallow dip at the tip — a daisy-ish petal. */
function notchedPetalPath(length: number, width: number): string {
  const half = width / 2;
  return [
    `M 0 0`,
    `C ${length * 0.26} ${-half} ${length * 0.78} ${-half * 0.96} ${length} ${-half * 0.34}`,
    `Q ${length * 0.86} ${0} ${length} ${half * 0.34}`,
    `C ${length * 0.78} ${half * 0.96} ${length * 0.26} ${half} 0 0`,
    `Z`,
  ].join(' ');
}

/** A closed bud: fat at the bottom, drawn to a soft point at the top. */
function budPath(width: number, height: number): string {
  const half = width / 2;
  return [
    `M 0 0`,
    `C ${-half} ${-height * 0.15} ${-half * 1.02} ${-height * 0.74} 0 ${-height}`,
    `C ${half * 1.02} ${-height * 0.74} ${half} ${-height * 0.15} 0 0`,
    `Z`,
  ].join(' ');
}

/** A hanging bell, scalloped along its rim. Drawn downwards from its neck. */
function bellPath(width: number, height: number): string {
  const half = width / 2;
  const lip = height * 0.86;
  return [
    `M ${-half * 0.42} 0`,
    `C ${-half * 0.96} ${height * 0.3} ${-half} ${lip} ${-half * 0.9} ${height}`,
    `Q ${-half * 0.42} ${height * 0.82} 0 ${height * 1.04}`,
    `Q ${half * 0.42} ${height * 0.82} ${half * 0.9} ${height}`,
    `C ${half} ${lip} ${half * 0.96} ${height * 0.3} ${half * 0.42} 0`,
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

/** Where a point sits along a stalk. 0 is the soil, 1 the head. */
function stemPoint(height: number, lean: number, t: number) {
  return { x: lean * height * 0.5 * t * t, y: -height * t };
}


/* ------------------------------------------------------------ leaf pieces -- */

type LeafShape = 'pointed' | 'round' | 'lobed';

function shapePath(shape: LeafShape, length: number, width: number) {
  if (shape === 'round') return roundLeafPath(length, width);
  if (shape === 'lobed') return lobedLeafPath(length, width);
  return leafPath(length, width);
}

/**
 * One leaf: the blade, a lit sheen down its upper half and a midrib. The two
 * details only appear on plants big enough to hold them — on a tile they would
 * be single pixels of noise.
 */
function Leaf({
  length,
  width,
  fill,
  shape = 'pointed',
  transform,
  fine,
}: {
  length: number;
  width: number;
  fill: string;
  shape?: LeafShape;
  transform?: string;
  fine: boolean;
}) {
  return (
    <G transform={transform}>
      <Path d={shapePath(shape, length, width)} fill={fill} />
      {fine && (
        <>
          <Path
            d={shapePath(shape, length * 0.6, width * 0.42)}
            fill={mix(fill, '#F4FFE0', 0.34)}
            opacity={0.7}
            transform={`translate(${length * 0.14}, ${-width * 0.15})`}
          />
          <Path
            d={`M ${length * 0.08} 0 Q ${length * 0.52} ${width * 0.05} ${length * 0.86} 0`}
            stroke={mix(fill, '#1B2E15', 0.45)}
            strokeWidth={Math.max(0.15, width * 0.05)}
            strokeLinecap="round"
            fill="none"
            opacity={0.4}
          />
        </>
      )}
    </G>
  );
}

/**
 * A repeatable 0..1 wobble. Plants are drawn from a spec, not from a generator,
 * so this is how one tuft ends up shaped differently from the next without the
 * scene having to describe every leaf.
 */
function wobble(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * The skirt of leaves every plant stands in. Back leaves are darker and shorter
 * than front ones, which is what stops a rosette reading as a flat green star.
 */
function Rosette({
  count,
  length,
  spread,
  lean,
  shape,
  fine,
  offsetY = 0,
}: {
  count: number;
  length: number;
  spread: number;
  lean: number;
  shape: LeafShape;
  fine: boolean;
  offsetY?: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const t = count === 1 ? 0.5 : index / (count - 1);
        const drift = wobble(index + lean * 7);
        const angle = -180 + (180 - spread) / 2 + spread * t + lean * 14 + (drift - 0.5) * 14;
        // Leaves nearest the middle stand up and reach further; the outer ones
        // flop towards the soil, so the tuft has a silhouette rather than a fan.
        const middle = Math.abs(t - 0.5) * 2;
        const size = length * (1 - middle * 0.26) * (0.85 + drift * 0.3);
        const upright = middle < 0.45;
        // Mixing blade shapes inside one tuft is what makes it read as grown.
        const leafShape: LeafShape = shape === 'lobed' && index % 2 ? 'round' : shape;
        return (
          <Leaf
            key={`rosette-${index}`}
            length={size}
            width={size * (leafShape === 'pointed' ? 0.5 : 0.62)}
            shape={leafShape}
            fill={FOLIAGE[upright ? (index % 2 ? 3 : 2) : index % 2 ? 1 : 0]}
            fine={fine && upright}
            transform={`translate(${0}, ${offsetY}) rotate(${angle})`}
          />
        );
      })}
    </>
  );
}

/** Leaves climbing the stalk, alternating sides and shrinking towards the head. */
function StalkLeaves({
  count,
  height,
  lean,
  shape,
  fine,
  from = 0.32,
}: {
  count: number;
  height: number;
  lean: number;
  shape: LeafShape;
  fine: boolean;
  from?: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const t = from + index * 0.22;
        const side = index % 2 ? 1 : -1;
        const { x, y } = stemPoint(height, lean, t);
        const length = height * (0.32 - index * 0.045);
        return (
          <Leaf
            key={`stalk-${index}`}
            length={length}
            width={length * (shape === 'round' ? 0.56 : 0.44)}
            shape={shape}
            fill={FOLIAGE[side > 0 ? 3 : 2]}
            fine={fine}
            transform={`translate(${x}, ${y}) rotate(${side > 0 ? -30 : -150})`}
          />
        );
      })}
    </>
  );
}

/* ---------------------------------------------------------- flower pieces -- */

/** The warm dome in the middle of a blossom, lit from the upper left. */
function Heart({ radius, detailed }: { radius: number; detailed: boolean }) {
  return (
    <>
      <Circle r={radius} fill={FLOWER_CENTER_DEEP} />
      <Circle cy={-radius * 0.1} r={radius * 0.72} fill={FLOWER_CENTER} />
      {detailed && (
        <Circle
          cx={-radius * 0.24}
          cy={-radius * 0.28}
          r={radius * 0.26}
          fill="rgba(255, 253, 235, 0.7)"
        />
      )}
    </>
  );
}

/**
 * One ring of petals. `tilt` rotates the whole ring, so a back ring can be
 * offset half a step and peek out between the petals of the front one.
 */
function Petals({
  count,
  length,
  width,
  radius,
  fill,
  tint,
  notched,
  tilt = 0,
  detailed,
}: {
  count: number;
  length: number;
  width: number;
  radius: number;
  fill: string;
  tint: string;
  notched?: boolean;
  tilt?: number;
  detailed: boolean;
}) {
  const d = notched ? notchedPetalPath(length, width) : petalPath(length, width);
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const angle = tilt + (index / count) * 360;
        // Petals pointing away from the light sit a shade deeper — the blossom
        // reads as a bowl instead of a sticker.
        const away = Math.cos(((angle - 250) * Math.PI) / 180);
        const base = index % 2 ? tint : fill;
        return (
          <G key={`petal-${index}`} transform={`rotate(${angle}) translate(${radius}, 0)`}>
            <Path d={d} fill={mix(base, '#4A2E38', Math.max(0, away) * 0.2)} />
            {detailed && (
              <Path
                d={notched
                  ? notchedPetalPath(length * 0.52, width * 0.46)
                  : petalPath(length * 0.52, width * 0.46)}
                fill={mix(base, '#FFFFFF', 0.4)}
                opacity={0.42}
                transform={`translate(${length * 0.18}, ${-width * 0.08})`}
              />
            )}
          </G>
        );
      })}
    </>
  );
}

/** A blossom: shadow, petals, heart. Everything with petals goes through here. */
function Blossom({
  radius,
  petals,
  fill,
  tint,
  detailed,
  notched,
  double,
  tilt = 0,
}: {
  radius: number;
  petals: number;
  fill: string;
  tint: string;
  detailed: boolean;
  notched?: boolean;
  double?: boolean;
  tilt?: number;
}) {
  const petalLength = radius * 0.94;
  const petalWidth = petalLength * (notched ? 0.56 : 0.78);
  return (
    <G>
      {/* a blot behind the head lifts it off the leaves underneath */}
      <Ellipse cy={radius * 0.2} rx={radius * 0.94} ry={radius * 0.84} fill={SOFT_SHADOW} />
      {/* The back ring is worth its paths only where it can be seen: a month
          grid draws thirty-odd beds at 44px, where it is a smudge. */}
      {double && detailed && (
        <Petals
          count={petals}
          length={petalLength * 1.16}
          width={petalWidth * 0.9}
          radius={radius * 0.2}
          fill={mix(fill, '#3E2732', 0.22)}
          tint={mix(tint, '#3E2732', 0.22)}
          notched={notched}
          tilt={tilt + 180 / petals}
          detailed={false}
        />
      )}
      <Petals
        count={petals}
        length={petalLength}
        width={petalWidth}
        radius={radius * 0.2}
        fill={fill}
        tint={tint}
        notched={notched}
        tilt={tilt}
        detailed={detailed}
      />
      <Heart radius={radius * (double && detailed ? 0.34 : 0.4)} detailed={detailed} />
    </G>
  );
}

/** A bud: the closed head, a lit side, and two sepals hugging its base. */
function Bud({
  width,
  height,
  fill,
  detailed,
}: {
  width: number;
  height: number;
  fill: string;
  detailed: boolean;
}) {
  return (
    <G>
      <Path d={budPath(width, height)} fill={mix(fill, '#4A2E38', 0.18)} />
      <Path
        d={budPath(width * 0.66, height * 0.92)}
        fill={fill}
        transform={`translate(${-width * 0.1}, 0)`}
      />
      {detailed && (
        <Path
          d={budPath(width * 0.3, height * 0.7)}
          fill={mix(fill, '#FFFFFF', 0.45)}
          opacity={0.7}
          transform={`translate(${-width * 0.16}, ${-height * 0.08})`}
        />
      )}
      <Path
        d={leafPath(height * 0.44, height * 0.2)}
        fill={FOLIAGE[1]}
        transform={`rotate(-138)`}
      />
      <Path
        d={leafPath(height * 0.44, height * 0.2)}
        fill={FOLIAGE[3]}
        transform={`rotate(-42)`}
      />
    </G>
  );
}

/* --------------------------------------------------------------- species -- */

type Species =
  | 'seedling'
  | 'leafBush'
  | 'budStalk'
  | 'budCluster'
  | 'daisy'
  | 'roundFlower'
  | 'sprig'
  | 'bell'
  | 'seasonal';

/**
 * Which plant a spec draws as. Stage decides how grown it is, `variant` picks
 * between the plants that live at that stage — bells and clusters get one of
 * the six slots against two or three for the everyday shapes, so a scattered
 * bed has something rarer in it now and then.
 */
function speciesFor(plant: PlantSpec): Species {
  const variant = plant.variant % PLANT_VARIANTS;
  if (plant.stage === 'seasonal') return 'seasonal';
  if (plant.stage === 'sprout') return variant < 3 ? 'seedling' : 'leafBush';
  if (plant.stage === 'bud') return variant < 4 ? 'budStalk' : 'budCluster';
  if (variant < 2) return 'daisy';
  if (variant < 4) return 'roundFlower';
  return variant < 5 ? 'sprig' : 'bell';
}

/** How tall each species stands relative to the plant's own size. */
const SPECIES_HEIGHT: Record<Species, number> = {
  seedling: 0.66,
  leafBush: 0.82,
  budStalk: 1,
  budCluster: 0.86,
  daisy: 1,
  roundFlower: 0.96,
  sprig: 1,
  bell: 1.04,
  seasonal: 1.06,
};

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
  const species = speciesFor(plant);
  const height = unit * plant.scale * SPECIES_HEIGHT[species];
  const lean = plant.lean;
  const color = PLANT_COLORS[plant.colorIndex % PLANT_COLORS.length];
  const tint = mix(color, '#FFF6EC', 0.3);
  // Veins and sheens are worth drawing only once a plant is a few pixels wide.
  const fine = detailed && height >= 15;
  const stemWidth = Math.max(1.1, height * 0.075);
  const tip = stemPoint(height, lean, 1);

  /** A stalk drawn twice: the shaded body, then a lit edge down one side. */
  const stem = (stalkHeight: number) => (
    <>
      <Path d={stemPath(stalkHeight, lean, stemWidth)} fill={FOLIAGE[1]} />
      <Path
        d={stemPath(stalkHeight * 0.97, lean, stemWidth * 0.42)}
        fill={FOLIAGE[3]}
        opacity={0.85}
        transform={`translate(${-stemWidth * 0.16}, 0)`}
      />
    </>
  );

  return (
    <G transform={`translate(${plant.x}, ${plant.y})`}>
      {/* two blots: the plant touches the soil, and casts a little further out */}
      <Ellipse cx={height * 0.06} cy={0} rx={height * 0.34} ry={height * 0.1} fill={SOFT_SHADOW} />
      <Ellipse cx={0} cy={0} rx={height * 0.2} ry={height * 0.06} fill={SHADOW} />

      {species === 'seedling' && (
        <G>
          {stem(height * 0.5)}
          {/* two seed leaves opening from the soil, and a third just unfurling */}
          <Leaf
            length={height * 0.62}
            width={height * 0.42}
            shape="round"
            fill={FOLIAGE[4]}
            fine={fine}
            transform={`translate(${tip.x * 0.4}, ${-height * 0.44}) rotate(${-152 + lean * 16})`}
          />
          <Leaf
            length={height * 0.58}
            width={height * 0.4}
            shape="round"
            fill={FOLIAGE[2]}
            fine={fine}
            transform={`translate(${tip.x * 0.4}, ${-height * 0.44}) rotate(${-28 + lean * 16})`}
          />
          <Leaf
            length={height * 0.34}
            width={height * 0.2}
            fill={FOLIAGE[3]}
            fine={false}
            transform={`translate(${tip.x * 0.5}, ${-height * 0.56}) rotate(${-96 + lean * 20})`}
          />
        </G>
      )}

      {species === 'leafBush' && (
        <G>
          <Rosette count={7} length={height * 0.78} spread={168} lean={lean} shape="lobed" fine={fine} />
          {/* a couple of young leaves standing in the middle of the tuft */}
          <Leaf
            length={height * 0.5}
            width={height * 0.3}
            shape="round"
            fill={FOLIAGE[4]}
            fine={fine}
            transform={`translate(0, ${-height * 0.18}) rotate(${-104 + lean * 20})`}
          />
          <Leaf
            length={height * 0.42}
            width={height * 0.26}
            shape="round"
            fill={FOLIAGE[3]}
            fine={fine}
            transform={`translate(0, ${-height * 0.14}) rotate(${-74 + lean * 20})`}
          />
        </G>
      )}

      {species === 'budStalk' && (
        <G>
          <Rosette count={4} length={height * 0.36} spread={152} lean={lean} shape="pointed" fine={false} />
          {stem(height)}
          <StalkLeaves count={3} height={height} lean={lean} shape="pointed" fine={fine} from={0.26} />
          {/* long blades sweeping up alongside the stalk, tulip fashion */}
          <Leaf
            length={height * 0.72}
            width={height * 0.21}
            fill={FOLIAGE[2]}
            fine={fine}
            transform={`rotate(${-114 + lean * 16})`}
          />
          <Leaf
            length={height * 0.62}
            width={height * 0.19}
            fill={FOLIAGE[1]}
            fine={fine}
            transform={`rotate(${-66 + lean * 16})`}
          />
          <G transform={`translate(${tip.x}, ${tip.y})`}>
            <Bud width={height * 0.27} height={height * 0.33} fill={color} detailed={detailed} />
          </G>
        </G>
      )}

      {species === 'budCluster' && (
        <G>
          <Rosette count={5} length={height * 0.46} spread={162} lean={lean} shape="round" fine={fine} />
          {stem(height * 0.82)}
          {[
            { t: 0.98, size: 1, angle: 0 },
            { t: 0.72, size: 0.76, angle: -22 },
            { t: 0.58, size: 0.64, angle: 20 },
          ].map((bud, index) => {
            const point = stemPoint(height * 0.82, lean, bud.t);
            const side = index === 1 ? -1 : 1;
            return (
              <G
                key={`cluster-${index}`}
                transform={`translate(${point.x + side * height * 0.12 * (index ? 1 : 0)}, ${point.y}) rotate(${bud.angle})`}
              >
                <Bud
                  width={height * 0.22 * bud.size}
                  height={height * 0.27 * bud.size}
                  fill={index ? mix(color, '#FFFFFF', 0.16) : color}
                  detailed={detailed}
                />
              </G>
            );
          })}
        </G>
      )}

      {species === 'daisy' && (
        <G>
          <Rosette count={4} length={height * 0.36} spread={152} lean={lean} shape="pointed" fine={false} />
          {stem(height)}
          <StalkLeaves count={3} height={height} lean={lean} shape="pointed" fine={fine} />
          <G transform={`translate(${tip.x}, ${tip.y})`}>
            <Blossom
              radius={height * 0.22}
              petals={detailed ? 9 : 7}
              fill={color}
              tint={tint}
              notched
              detailed={detailed}
              tilt={lean * 30}
            />
          </G>
        </G>
      )}

      {species === 'roundFlower' && (
        <G>
          <Rosette count={5} length={height * 0.42} spread={160} lean={lean} shape="round" fine={fine} />
          {stem(height)}
          <StalkLeaves count={2} height={height} lean={lean} shape="round" fine={fine} />
          <G transform={`translate(${tip.x}, ${tip.y})`}>
            <Blossom
              radius={height * 0.27}
              petals={detailed ? 6 : 5}
              fill={color}
              tint={tint}
              double
              detailed={detailed}
              tilt={lean * 24}
            />
          </G>
        </G>
      )}

      {species === 'sprig' && (
        <G>
          <Rosette count={4} length={height * 0.38} spread={156} lean={lean} shape="pointed" fine={false} />
          {stem(height * 0.88)}
          <StalkLeaves count={2} height={height * 0.88} lean={lean} shape="pointed" fine={fine} from={0.26} />
          {/* three small blossoms on their own side shoots, at different heights */}
          {[
            { t: 1, dx: 0, r: 0.16 },
            { t: 0.74, dx: -0.3, r: 0.13 },
            { t: 0.62, dx: 0.28, r: 0.12 },
          ].map((head, index) => {
            const point = stemPoint(height * 0.88, lean, head.t);
            const x = point.x + height * head.dx;
            const y = point.y - height * (index ? 0.06 : 0);
            return (
              <G key={`sprig-${index}`}>
                {index > 0 && (
                  <Path
                    d={`M ${point.x} ${point.y + height * 0.06} Q ${x * 0.8} ${point.y - height * 0.02} ${x} ${y}`}
                    stroke={FOLIAGE[2]}
                    strokeWidth={stemWidth * 0.5}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                <G transform={`translate(${x}, ${y})`}>
                  <Blossom
                    radius={height * head.r}
                    petals={5}
                    fill={index === 2 ? tint : color}
                    tint={tint}
                    detailed={detailed}
                    tilt={index * 26}
                  />
                </G>
              </G>
            );
          })}
        </G>
      )}

      {species === 'bell' && (
        <G>
          <Rosette count={4} length={height * 0.42} spread={150} lean={lean} shape="pointed" fine={fine} />
          {stem(height * 0.94)}
          <StalkLeaves count={2} height={height * 0.94} lean={lean} shape="pointed" fine={fine} from={0.22} />
          {/* a spike of bells, biggest and oldest at the bottom, hung on short
              side stalks that alternate — the shape of a foxglove */}
          {[
            { t: 0.46, size: 1 },
            { t: 0.64, size: 0.9 },
            { t: 0.82, size: 0.78 },
          ].map((bellSpec, index) => {
            const anchor = stemPoint(height * 0.94, lean, bellSpec.t);
            const side = index % 2 ? 1 : -1;
            const width = height * 0.24 * bellSpec.size;
            const bellHeight = height * 0.3 * bellSpec.size;
            const x = anchor.x + side * width * 0.66;
            return (
              <G key={`bell-${index}`}>
                <Path
                  d={`M ${anchor.x} ${anchor.y} Q ${anchor.x + side * width * 0.4} ${anchor.y - bellHeight * 0.16} ${x} ${anchor.y - bellHeight * 0.06}`}
                  stroke={FOLIAGE[2]}
                  strokeWidth={stemWidth * 0.42}
                  strokeLinecap="round"
                  fill="none"
                />
                <G
                  transform={`translate(${x}, ${anchor.y - bellHeight * 0.06}) rotate(${side * 9})`}
                >
                  <Path d={bellPath(width, bellHeight)} fill={mix(color, '#41293A', 0.22)} />
                  <Path
                    d={bellPath(width * 0.74, bellHeight * 0.95)}
                    fill={color}
                    transform={`translate(${-width * 0.06}, 0)`}
                  />
                  {detailed && (
                    <Path
                      d={bellPath(width * 0.3, bellHeight * 0.7)}
                      fill={mix(color, '#FFFFFF', 0.5)}
                      opacity={0.6}
                      transform={`translate(${-width * 0.17}, ${bellHeight * 0.1})`}
                    />
                  )}
                  {/* the green cap the bell hangs out of */}
                  <Path
                    d={leafPath(width * 0.36, width * 0.26)}
                    fill={FOLIAGE[1]}
                    transform={`translate(0, ${-bellHeight * 0.02}) rotate(160)`}
                  />
                  <Path
                    d={leafPath(width * 0.36, width * 0.26)}
                    fill={FOLIAGE[3]}
                    transform={`translate(0, ${-bellHeight * 0.02}) rotate(20)`}
                  />
                </G>
              </G>
            );
          })}
          {/* two buds still to open, at the very top of the spike */}
          <G transform={`translate(${tip.x}, ${tip.y + height * 0.06})`}>
            <Bud
              width={height * 0.12}
              height={height * 0.16}
              fill={mix(color, '#FFFFFF', 0.2)}
              detailed={false}
            />
          </G>
        </G>
      )}

      {species === 'seasonal' && (
        <G>
          <Rosette count={5} length={height * 0.44} spread={164} lean={lean} shape="lobed" fine={fine} />
          {stem(height)}
          <StalkLeaves count={2} height={height} lean={lean} shape="lobed" fine={fine} />
          <G transform={`translate(${tip.x}, ${tip.y})`}>
            <Blossom
              radius={height * 0.32}
              petals={detailed ? 8 : 6}
              fill={season.petals[0]}
              tint={season.petals[1]}
              double
              detailed={detailed}
              tilt={lean * 20}
            />
            {/* the flower of the month is the one thing on the bed that glints */}
            {detailed && (
              <>
                <Circle
                  cx={height * 0.3}
                  cy={-height * 0.26}
                  r={height * 0.035}
                  fill={withAlpha('#FFF6D0', 0.9)}
                />
                <Circle
                  cx={-height * 0.32}
                  cy={-height * 0.16}
                  r={height * 0.025}
                  fill={withAlpha('#FFF6D0', 0.75)}
                />
              </>
            )}
          </G>
        </G>
      )}
    </G>
  );
}
