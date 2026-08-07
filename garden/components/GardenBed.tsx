import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { mix, temperature, withAlpha } from '../colors';
import { GOLD, LIGHT, MOSS, plantUnitFactor, SOIL, SPARK, STEM, STONE } from '../config';
import type { Scene } from '../types';
import Plant from './Plant';

/** Everything is laid out in a 100×100 box and scaled by the Svg itself. */
const BOX = 100;

export default function GardenBed({ scene, size }: { scene: Scene; size: number }) {
  const detailed = scene.variant === 'day';
  const light = scene.lightLevel;

  const border = detailed ? 6 : 7.5;
  const soil = BOX - border * 2;
  const uid = `${scene.date.replace(/\./g, '')}-${scene.variant}`;

  const toX = (x: number) => border + x * soil;
  const toY = (y: number) => border + y * soil;

  const skyColor = temperature(scene.season.sky, light, '#FFE2A8', '#B9BCBC');
  const soilTop = temperature(SOIL.base, light, SOIL.warm, SOIL.cool);
  const soilBottom = temperature(SOIL.deep, light, '#6E5132', '#494741');
  const stoneColor = temperature(STONE.base, light, '#E8D5A6', '#B6B5AF');
  const stoneLight = temperature(STONE.light, light, '#F5E7C0', '#CFCEC8');

  const unit = soil * plantUnitFactor(scene.plants.length);
  const blocks = detailed ? 11 : 0;
  const blockStep = (BOX - border * 0.4) / Math.max(1, blocks);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${BOX} ${BOX}`}>
      <Defs>
        <LinearGradient id={`soil-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={soilTop} />
          <Stop offset="1" stopColor={soilBottom} />
        </LinearGradient>

        {/* No gratitude means no pool of light at all — an unlit bed, not a dim one. */}
        <RadialGradient id={`light-${uid}`} cx="50%" cy="44%" r="60%">
          <Stop offset="0" stopColor={LIGHT} stopOpacity={light === null ? 0.1 : light * 0.62} />
          <Stop offset="1" stopColor={LIGHT} stopOpacity={0} />
        </RadialGradient>

        <RadialGradient id={`spark-${uid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={SPARK} stopOpacity={0.95} />
          <Stop offset="0.45" stopColor={SPARK} stopOpacity={0.35} />
          <Stop offset="1" stopColor={SPARK} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* the day around the bed */}
      <Rect x={0} y={0} width={BOX} height={BOX} rx={10} fill={skyColor} />

      {/* stone kerb */}
      <Rect x={0} y={0} width={BOX} height={BOX} rx={10} fill={STONE.dark} />
      {Array.from({ length: blocks }, (_, i) => {
        const offset = border * 0.2 + i * blockStep;
        const long = blockStep * 0.86;
        const short = border * 0.8;
        const tone = i % 3 === 0 ? stoneLight : stoneColor;
        return (
          <G key={`stone-${i}`}>
            <Rect x={offset} y={border * 0.15} width={long} height={short} rx={short * 0.34} fill={tone} />
            <Rect x={offset} y={BOX - border * 0.95} width={long} height={short} rx={short * 0.34} fill={tone} />
            <Rect x={border * 0.15} y={offset} width={short} height={long} rx={short * 0.34} fill={tone} />
            <Rect x={BOX - border * 0.95} y={offset} width={short} height={long} rx={short * 0.34} fill={tone} />
          </G>
        );
      })}
      {!detailed && (
        <Rect
          x={border * 0.35}
          y={border * 0.35}
          width={BOX - border * 0.7}
          height={BOX - border * 0.7}
          rx={8}
          fill="none"
          stroke={stoneColor}
          strokeWidth={border * 0.8}
        />
      )}

      {/* soil */}
      <Rect x={border} y={border} width={soil} height={soil} rx={4} fill={`url(#soil-${uid})`} />

      {/* what is there whatever you wrote today */}
      {scene.groundCover.map((tuft, index) => {
        const x = toX(tuft.x);
        const y = toY(tuft.y);
        const s = unit * 0.16 * tuft.scale;
        if (!detailed) {
          return <Ellipse key={`cover-${index}`} cx={x} cy={y} rx={s * 0.6} ry={s * 0.35} fill={withAlpha(MOSS, 0.45)} />;
        }
        return (
          <Path
            key={`cover-${index}`}
            d={`M ${x} ${y} Q ${x - s * 0.4} ${y - s * 0.7} ${x - s * 0.7} ${y - s} M ${x} ${y} Q ${x + s * 0.4} ${y - s * 0.7} ${x + s * 0.7} ${y - s}`}
            stroke={withAlpha(STEM, 0.55)}
            strokeWidth={Math.max(0.5, s * 0.22)}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}

      {/* what you grew — sorted back to front so plants overlap correctly */}
      {[...scene.plants]
        .sort((a, b) => a.y - b.y)
        .map((plant) => (
          <Plant
            key={plant.entryId}
            plant={{ ...plant, x: toX(plant.x), y: toY(plant.y) }}
            unit={unit}
            season={scene.season}
            detailed={detailed}
          />
        ))}

      {/* what you noticed: light over the whole bed, then the fireflies */}
      <Rect x={0} y={0} width={BOX} height={BOX} rx={10} fill={`url(#light-${uid})`} />
      {scene.sparks.map((spark, index) => {
        const x = toX(spark.x);
        const y = toY(spark.y);
        const radius = (detailed ? 7 : 9) * (0.7 + spark.intensity * 0.5);
        return (
          <G key={`spark-${index}`}>
            <Circle cx={x} cy={y} r={radius} fill={`url(#spark-${uid})`} />
            <Circle cx={x} cy={y} r={detailed ? 1.1 : 0.9} fill="#FFFDF2" />
          </G>
        );
      })}

      {scene.goalReached && (
        <Rect
          x={0.8}
          y={0.8}
          width={BOX - 1.6}
          height={BOX - 1.6}
          rx={9.4}
          fill="none"
          stroke={mix(GOLD, '#FFFFFF', 0.15)}
          strokeWidth={1.6}
        />
      )}
    </Svg>
  );
}
