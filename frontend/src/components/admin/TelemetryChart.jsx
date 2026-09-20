import React from 'react';

const TelemetryChart = ({ projects }) => {
  const viewsData = projects.map((p) => ({
    title: p.title,
    views: p.views || 0,
  }));
  const ordered = [...viewsData].sort((a, b) => b.views - a.views);
  const maxViews = Math.max(1, ...ordered.map((d) => d.views));

  const rowH = 34;
  const labelW = 220;
  const height = Math.max(180, ordered.length * rowH + 40);

  return (
    <figure>
      <figcaption className="mb-4">
        <p className="file-index-sm">CONSOLE — BK / TELEMETRY</p>
        <h3 className="mt-1 text-title font-semibold text-ink">
          Portfolio views by record
        </h3>
      </figcaption>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 800 ${height}`}
        role="img"
        aria-label="Horizontal bar chart of portfolio views per project record"
        className="max-w-3xl"
        preserveAspectRatio="xMidYMid meet"
      >
        {ordered.map((d, i) => {
          const y = i * rowH + 12;
          const barMax = 800 - labelW - 60;
          const barW = (d.views / maxViews) * barMax;
          const title = d.title.length > 28 ? `${d.title.slice(0, 27)}…` : d.title;
          return (
            <g key={d.title}>
              <text
                x="0"
                y={y + 14}
                fontFamily="IBM Plex Mono, ui-monospace, monospace"
                fontSize="12"
                fill="var(--ink-muted)"
              >
                {title}
              </text>
              <rect
                x={labelW}
                y={y}
                width={Math.max(4, barW)}
                height="7"
                fill="var(--registry)"
              />
              <text
                x={labelW + barMax + 12}
                y={y + 14}
                fontFamily="IBM Plex Mono, ui-monospace, monospace"
                fontSize="12"
                fontWeight="600"
                fill="var(--ink)"
              >
                {d.views}
              </text>
            </g>
          );
        })}
        <line
          x1={labelW}
          y1={height - 8}
          x2={800}
          y2={height - 8}
          stroke="var(--rule-strong)"
          strokeWidth="1"
        />
      </svg>
    </figure>
  );
};

export default TelemetryChart;