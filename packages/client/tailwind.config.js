/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    darkMode: 'selector',
    extend: {
      boxShadow: {
        'inset-light': 'inset 1px 1px 4px 0 rgba(0, 0, 0, 0.1)',
        'inset-dark': 'inset 1px 1px 4px 0 rgba(0, 0, 0, 0.3)',
        'outer-light': '0px 0px 4px 1px rgba(0,0,0,0.1)',
        'outer-dark': '0px 0px 6px 1px rgba(0,0,0,0.2)',
      },
      borderColor: {
        'btn-light': 'rgb(3, 105, 161)',
        'btn-dark': 'rgb(30, 41, 59)',
        'form-light': 'rgb(248, 250, 252)',
        'form-dark': 'rgb(71, 85, 105)',
      },
      backgroundColor: {
        'btn-light': 'rgb(3, 105, 161)',
        'btn-dark': 'rgb(30, 41, 59)',
        'form-light': 'rgb(248, 250, 252)',
        'form-dark': 'rgb(71, 85, 105)',
        'main-light': '#e0f2fe',
        'main-dark': '#374151',
        'input-dark': '#d1d5db',
      },
      borderRadius: {
        'main-radius': '10px',
      },
      colors: {
        'main-blue': '#0369a1',
        'main-black': '#3f3f46',
        'main-white': '#FFF',
        'main-red-light': '#ef4444',
        'main-red-dark': '#f87171',
      },
      fontSize: {},
      fontWeight: {},
    },
  },
  plugins: [],
};
