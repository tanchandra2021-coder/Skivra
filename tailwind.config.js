/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f0f7f4',
          100: '#d8ede6',
          200: '#b0dace',
          300: '#7fc2ae',
          400: '#4fa58f',
          500: '#318a74',
          600: '#23705e',
          700: '#1c5a4c',
          800: '#17483d',
          900: '#143c33',
        },
        ivory: {
          50:  '#fdfcf8',
          100: '#faf7f0',
          200: '#f4ede0',
          300: '#ecdfc9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
