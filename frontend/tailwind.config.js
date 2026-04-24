/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#0B1020',
        cream: '#FFFDFB',
        blush: '#F7EEF2',
        berry: '#4F46E5',
      },
      boxShadow: {
        bento: '0 10px 30px rgba(11, 16, 32, 0.08)',
      },
    },
  },
  plugins: [],
}
