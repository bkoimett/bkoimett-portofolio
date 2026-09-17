import React from 'react';

const TelemetryChart = ({ projects, trend }) => {
  const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
  const viewsData = projects.map((p) => ({
    title: p.title,
    views: p.views || 0,
  }));

  const maxViews = viewsData.reduce((max, p) => Math.max(max, p.views), 1);
  const barHeight = 20;
  const padding = 20;

  return (
    <svg className="h-64 w-full max-w-md mx-auto" aria-label="Telemetry chart">
      <rect x="0" y="0" width="100" height="100" fill="#101415" />
      {viewsData.map((item, index) => {
        const barWidth = (item.views / maxViews) * 80;
        const y = padding + index * (barHeight + 10);
        return (
          <g key={item.title}>
            <rect
              x="10"
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#4edea3"
            />
            <text x="10" y={y + 14} fontSize="10" fill="#bbcabf" textAnchor="start">
              {item.title.split(' ')[0]}
            </text>
            <text
              x={barWidth + 10}
              y={y + 14}
              fontSize="10"
              fill="#bbcabf"
              textAnchor="middle"
            >
              {item.views}
            </text>
          </g>
        );
      })}
      <g fill="#bbcabf">
        <text x="10" y="90" fontSize="10">
          Total: {totalViews}
        </text>
        <text
          x="10"
          y={padding + viewsData.length * (barHeight + 10) - 10}
          fontSize="10"
        >
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trend}
        </text>
      </g>
    </svg>
  );
};

export default TelemetryChart;