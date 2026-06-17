/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4edea3',
        'primary-container': '#10b981',
        surface: '#101415',
        'surface-container': '#1d2022',
        'surface-container-highest': '#323537',
        'on-surface': '#e0e3e5',
        'on-surface-variant': '#bbcabf',
        secondary: '#bec6e0',
        error: '#ffb4ab',
      },
      fontSize: {
        'display-lg': ['64px', { fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'headline-md': ['32px', { fontWeight: '700', lineHeight: '1.3' }],
        'headline-sm': ['24px', { fontWeight: '600', lineHeight: '1.4' }],
        'body-lg': ['18px', { fontWeight: '400', lineHeight: '1.6' }],
        'body-md': ['16px', { fontWeight: '400', lineHeight: '1.6' }],
        'code-sm': ['14px', { fontWeight: '500', lineHeight: '1.5', fontFamily: 'JetBrains Mono' }],
      },
      spacing: {
        'gutter': '24px',
        'section-gap': '120px',
      },
      borderRadius: {
        'DEFAULT': '8px',
        'lg': '16px',
      },
    },
  },
  plugins: [],
}
