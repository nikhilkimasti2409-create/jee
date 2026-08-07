/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f4f6ff',
        primary: '#4f46e5',
        secondary: '#0ea5e9',
        tertiary: '#10b981',
        neutral: '#64748b',
        surface: '#ffffff',
        'surface-variant': '#c9deff',
        'on-surface': '#203044',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      }
    },
  },
  plugins: [],
}
