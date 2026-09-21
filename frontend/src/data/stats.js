export const stats = [
  {
    label: 'Projects shipped',
    value: '8+',
    target: 8,
    render: (n) => `${n}+`,
  },
  {
    label: 'Years experience',
    value: '4+',
    target: 4,
    render: (n) => `${n}+`,
  },
  { label: 'Production uptime', value: '24/7' },
  {
    label: 'Monthly views',
    value: '1.2k',
    target: 1200,
    render: (n) => (n < 1000 ? `${n}` : `${(n / 1000).toFixed(1)}k`),
  },
];