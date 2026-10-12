import React from 'react';
import { plateShape, plateLegend, plateNumber, plateHash, plateTitle } from '../../utils/plates';

/* A survey plate is drawn, not photographed. Its geometry comes from the
   project's own stack, so the figure tells the reader the shape of the
   system before they read a word of the case notes. */

/* ------------------------------------------------------------------ parts */

const Hair = ({ x1, y1, x2, y2, className = 'plate-hatch' }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} className={className} strokeWidth="1" vectorEffect="non-scaling-stroke" />
);

const Box = ({ x, y, w, h, lit = false }) => (
  <rect x={x} y={y} width={w} height={h} className={lit ? 'plate-block-lit' : 'plate-block'} strokeWidth="1" vectorEffect="non-scaling-stroke" />
);

const Arrow = ({ x1, y1, x2, y2, queued = false }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const back = 4;
  const bx = x2 - ux * back;
  const by = y2 - uy * back;
  const px = -uy * 3;
  const py = ux * 3;
  return (
    <g className={queued ? 'plate-queued' : 'plate-flow'} strokeWidth="1" vectorEffect="non-scaling-stroke">
      <line x1={x1} y1={y1} x2={bx} y2={by} />
      <polyline points={`${bx + px},${by + py} ${x2},${y2} ${bx - px},${by - py}`} fill="none" />
    </g>
  );
};

const GraphPaper = () => (
  <g aria-hidden="true">
    {Array.from({ length: 9 }, (_, i) => (
      <Hair key={`v${i}`} x1={20 + i * 35} y1={12} x2={20 + i * 35} y2={168} />
    ))}
    {Array.from({ length: 5 }, (_, i) => (
      <Hair key={`h${i}`} x1={12} y1={12 + i * 39} x2={308} y2={12 + i * 39} />
    ))}
  </g>
);

const CornerTicks = () => (
  <g className="plate-stroke" strokeWidth="1" vectorEffect="non-scaling-stroke">
    <polyline points="12,26 12,12 26,12" fill="none" />
    <polyline points="294,12 308,12 308,26" fill="none" />
    <polyline points="308,154 308,168 294,168" fill="none" />
    <polyline points="26,168 12,168 12,154" fill="none" />
  </g>
);

const Hatch = ({ at = 120 }) => (
  <g className="plate-hatch" strokeWidth="1" vectorEffect="non-scaling-stroke">
    <line x1={at} y1={12} x2={at - 18} y2={168} />
    <line x1={at + 9} y1={12} x2={at - 9} y2={168} />
    <line x1={at + 18} y1={12} x2={at} y2={168} />
  </g>
);

const FieldLines = ({ x, y, w, count = 3, gap = 13, last = 0.5 }) =>
  Array.from({ length: count }, (_, i) => (
    <Hair key={i} x1={x} y1={y + i * gap} x2={x + (i === count - 1 ? w * last : w)} y2={y + i * gap} className="plate-hatch" />
  ));

/* ----------------------------------------------------------------- shapes */

const Flow = () => (
  <g>
    <Box x={22} y={52} w={76} h={76} />
    <rect x={36} y={68} width={48} height={34} className="plate-field" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    <Hair x1={36} y1={76} x2={84} y2={76} />
    <FieldLines x={36} y={112} w={48} count={2} gap={7} last={0.7} />

    <Box x={122} y={52} w={76} h={76} />
    <g className="plate-stroke" strokeWidth="1" vectorEffect="non-scaling-stroke">
      <rect x={144} y={72} width={10} height={10} />
      <rect x={162} y={72} width={10} height={10} />
      <rect x={153} y={90} width={10} height={10} />
    </g>
    <FieldLines x={144} y={112} w={32} count={1} last={1} />

    <Box x={222} y={52} w={76} h={76} />
    <FieldLines x={236} y={72} w={48} count={4} gap={13} last={0.62} />

    <Arrow x1={100} y1={82} x2={118} y2={82} />
    <Arrow x1={118} y1={98} x2={100} y2={98} />
    <Arrow x1={200} y1={82} x2={218} y2={82} />
    <Arrow x1={218} y1={98} x2={200} y2={98} />
  </g>
);

const Chain = () => (
  <g>
    <Hair x1={40} y1={34} x2={280} y2={34} className="plate-flow" strokeDasharray="4 4" />
    {[40, 128, 216].map((x) => (
      <Hair key={x} x1={x} y1={28} x2={x} y2={40} className="plate-stroke" />
    ))}

    {[32, 128, 224].map((x, i) => (
      <g key={x}>
        <Box x={x} y={54} w={64} h={64} lit={false} />
        {Array.from({ length: 9 }, (_, k) => {
          const cx = x + 14 + (k % 3) * 14;
          const cy = 70 + Math.floor(k / 3) * 14;
          return (
            <rect
              key={k}
              x={cx}
              y={cy}
              width={8}
              height={8}
              className={i === 2 && k === 4 ? 'plate-block-lit' : 'plate-stroke'}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        <Hair x1={x + 14} y1={114} x2={x + 48} y2={114} className="plate-hatch" />
      </g>
    ))}

    <rect x={252} y={90} width={20} height={20} className="plate-block-lit" />
    <Arrow x1={98} y1={86} x2={124} y2={86} />
    <Arrow x1={194} y1={86} x2={220} y2={86} />
    <Hair x1={288} y1={54} x2={288} y2={118} className="plate-stroke" />
  </g>
);

const Offline = () => (
  <g>
    <rect x={24} y={30} width={108} height={120} className="plate-field" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    <Hair x1={24} y1={44} x2={132} y2={44} className="plate-stroke" />
    <rect x={38} y={56} width={80} height={80} className="plate-block" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    <FieldLines x={50} y={68} w={56} count={5} gap={13} last={0.55} />
    <Hair x1={62} y1={150} x2={94} y2={150} className="plate-stroke" />

    <Box x={188} y={48} w={104} h={84} />
    <FieldLines x={202} y={64} w={76} count={3} gap={14} last={0.45} />
    <rect x={268} y={112} width={16} height={16} className="plate-block-lit" />

    <Arrow x1={136} y1={80} x2={182} y2={80} />
    <Arrow x1={182} y1={116} x2={136} y2={116} queued />
  </g>
);

const Store = () => (
  <g>
    <Box x={34} y={26} w={252} h={128} />
    <Hair x1={62} y1={26} x2={62} y2={154} className="plate-stroke" />
    {Array.from({ length: 7 }, (_, i) => (
      <Hair key={i} x1={38} y1={36 + i * 17} x2={56} y2={36 + i * 17} className="plate-hatch" />
    ))}
    {Array.from({ length: 4 }, (_, i) => {
      const y = 40 + i * 28;
      return (
        <g key={i}>
          <Hair x1={78} y1={y + 6} x2={150} y2={y + 6} className="plate-hatch" />
          <Hair x1={170} y1={y + 6} x2={i === 3 ? 208 : 254} y2={y + 6} className="plate-stroke" />
        </g>
      );
    })}
    <rect x={78} y={118} width={44} height={12} className="plate-block-lit" />
    <rect x={258} y={118} width={3} height={12} className="plate-block-lit" />
  </g>
);

const Agent = () => (
  <g>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={22} y={48 + i * 20} width={66} height={12} className="plate-block" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <Hair x1={28} y1={54 + i * 20} x2={i === 1 ? 62 : 80} y2={54 + i * 20} className="plate-hatch" />
      </g>
    ))}
    <Arrow x1={92} y1={76} x2={116} y2={76} />

    <Box x={120} y={40} w={84} h={68} />
    {Array.from({ length: 4 }, (_, k) => (
      <rect
        key={k}
        x={134 + (k % 2) * 22}
        y={54 + Math.floor(k / 2) * 20}
        width={16}
        height={14}
        className={k === 0 ? 'plate-block-lit' : 'plate-stroke'}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    ))}

    <Arrow x1={208} y1={76} x2={228} y2={76} />

    <Box x={232} y={40} w={64} h={68} />
    <FieldLines x={244} y={54} w={40} count={5} gap={10} last={0.6} />

    <g className="plate-flow" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
      <polyline points="264,112 264,140 55,140 55,116" />
    </g>
    <polyline points="55,116 51,124 59,124" className="plate-flow" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" />
  </g>
);

const SHAPES = { flow: Flow, chain: Chain, offline: Offline, store: Store, agent: Agent };

/* --------------------------------------------------------------- the plate */

const SchematicPlate = ({ project = {}, compact = false, className = '' }) => {
  const shape = plateShape(project);
  const Drawing = SHAPES[shape] || Flow;
  const seed = plateHash(project.slug || project.title || 'plate');
  const no = plateNumber(seed);
  const tools = String(project.technologies?.length || 0).padStart(2, '0');

  const drawing = (
    <svg
      viewBox="0 0 320 180"
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Schematic plate: ${plateTitle(shape).toLowerCase()} drawing of ${project.title || 'this record'}`}
    >
      <GraphPaper />
      <Hatch at={140 + (seed % 120)} />
      <CornerTicks />
      <Drawing />
      <g className="plate-stroke" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <line x1={12} y1={163} x2={308} y2={163} />
        <line x1={12} y1={166} x2={308} y2={166} />
      </g>
    </svg>
  );

  if (compact) {
    return (
      <div className={`plate-mat ${className}`}>
        <div className="bg-paper p-2">{drawing}</div>
        <div className="flex items-center justify-between border-t border-rule px-2 py-1.5">
          <span className="file-index-sm">Pl. {no}</span>
          <span className="file-index-sm">{tools} tools</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`plate-mat ${className}`}>
      <div className="flex items-center justify-between border-b border-rule px-3 py-2">
        <span className="file-index-sm">PL. {no} · {plateTitle(shape)}</span>
        <span className="file-index-sm">{tools} tools</span>
      </div>

      <div className="bg-paper p-3 sm:p-4">{drawing}</div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule px-3 py-2">
        {plateLegend(shape).map((label) => (
          <span key={label} className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
            <span aria-hidden="true" className="inline-block h-2 w-2 border border-rule-strong" />
            {label}
          </span>
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">Schematic · not a screenshot</span>
      </div>
    </div>
  );
};

export default SchematicPlate;
