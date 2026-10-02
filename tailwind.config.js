/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2F5D3A',
          dark: '#234A2C',
          light: '#3E7549',
        },
        sage: {
          DEFAULT: '#A9BFA0',
          light: '#C9D9C2',
          dark: '#8FA886',
        },
        cream: {
          DEFAULT: '#F6F1E7',
          dark: '#EDE5D0',
        },
        terracotta: {
          DEFAULT: '#C8643C',
          dark: '#A85230',
          light: '#D8805C',
        },
        denim: {
          DEFAULT: '#3E5C76',
          dark: '#2F4859',
          light: '#5A7890',
        },
        charcoal: '#2B2B2B',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(47, 93, 58, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        medium: '0 4px 16px rgba(47, 93, 58, 0.1), 0 2px 6px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
