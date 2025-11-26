/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Healthcare color palette - calming blues, whites, soft greens
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#005bb3',
          700: '#004380',
          800: '#002b4d',
          900: '#00131a',
        },
        success: {
          50: '#e6f7ed',
          100: '#b3e6cc',
          200: '#80d6ab',
          300: '#4dc58a',
          400: '#1ab569',
          500: '#00a550',
          600: '#00843f',
          700: '#00632f',
          800: '#00421f',
          900: '#00210f',
        },
        warning: {
          50: '#fff8e6',
          100: '#ffecb3',
          200: '#ffe080',
          300: '#ffd44d',
          400: '#ffc81a',
          500: '#e6b000',
          600: '#b38900',
          700: '#806200',
          800: '#4d3b00',
          900: '#1a1400',
        },
        danger: {
          50: '#ffe6e6',
          100: '#ffb3b3',
          200: '#ff8080',
          300: '#ff4d4d',
          400: '#ff1a1a',
          500: '#e60000',
          600: '#b30000',
          700: '#800000',
          800: '#4d0000',
          900: '#1a0000',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0d0f11',
        }
      },
      fontSize: {
        // Ensure minimum 16px base font size
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      spacing: {
        // Touch-friendly spacing (44x44px minimum)
        'touch': '44px',
      }
    },
  },
  plugins: [],
}
