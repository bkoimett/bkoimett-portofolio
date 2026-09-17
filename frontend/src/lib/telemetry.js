/* Deterministic telemetry helper - terminal aesthetic only
   Not presented as measured analytics. View counts from Project.findByIdAndUpdate
   are real per-project counts (Phase 3). */

// Simulate terminal response data
export const getTelemetryData = () => ({
  uptime: Math.floor(Math.random() * 999999),
  projectsCount: 8,
  viewsTotal: 1245,
  viewsToday: Math.floor(Math.random() * 50),
  trend: Math.random() > 0.5 ? 'up' : 'down',
});

// Generate deterministic terminal response for macro commands
export const terminalResponse = (command) => {
  const responses = {
    $help: 'Available commands: $help $projects $stack $uptime $contact',
    $projects: '8 projects shipped across healthcare, agriculture, blockchain, and PWA',
    $stack: 'React, Node.js, TypeScript, Go, MongoDB, Docker, Solana, Polygon',
    $uptime: `Up ${Math.floor(Math.random() * 9999)} mins`,
    $contact: 'koimettb@gmail.com | GitHub: bkoimett',
  };

  return responses[command] || '';
};