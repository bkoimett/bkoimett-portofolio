/* The shape of a figure is read off the record's own stack, so the plate
   says something true about the system rather than decorating it. */

const LABELS = {
  flow: ['client', 'service', 'store'],
  chain: ['block', 'link', 'seal'],
  offline: ['device', 'local cache', 'sync'],
  store: ['record', 'index', 'insert'],
  agent: ['queue', 'agent', 'log'],
};

const TITLES = {
  flow: 'Service flow',
  chain: 'Immutable chain',
  offline: 'Offline first',
  store: 'Record store',
  agent: 'Agent loop',
};

const has = (techs, ...needles) =>
  techs.some((t) => needles.some((n) => t.toLowerCase().includes(n.toLowerCase())));

export const plateShape = (project = {}) => {
  const techs = project.technologies || [];
  if (has(techs, 'PWA', 'Offline-first', 'Service Worker')) return 'offline';
  if (has(techs, 'Blockchain', 'Solana', 'Polygon', 'Smart Contract')) return 'chain';
  if (has(techs, 'agent', 'cli', 'automation', 'DevTool', 'approval', 'Argus', 'notification')) return 'agent';
  if (has(techs, 'React', 'Astro') && has(techs, 'MongoDB', 'PostgreSQL', 'Redis')) return 'flow';
  if (has(techs, 'MongoDB', 'PostgreSQL', 'Redis', 'REST API')) return 'store';
  return 'flow';
};

export const plateTitle = (shape) => TITLES[shape] || TITLES.flow;

export const plateLegend = (shape) => LABELS[shape] || LABELS.flow;

export const plateHash = (str = '') => {
  let h = 5381;
  for (let i = 0; i < str.length; i += 1) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
};

export const plateNumber = (seed) => String((seed % 90) + 10);
