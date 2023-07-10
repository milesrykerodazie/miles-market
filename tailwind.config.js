/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: 'class',
   content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',

      // Or if using `src` directory:
      './src/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   theme: {
      extend: {
         backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic':
               'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
         },
         colors: {
            primary: '#4c1d95',
            primarywhite: '#FFFFFF',
            basicBlack: '#000000',
         },
         zIndex: {
            60: '60',
            70: '70',
            80: '80',
            90: '90',
            100: '100',
         },
         transitionDuration: {
            400: '400ms',
            600: '600ms',
            800: '800ms',
            900: '900ms',
            1100: '1100ms',
            1200: '1200ms',
            1300: '1300ms',
            1400: '1400ms',
            1500: '1500ms',
            1600: '1600ms',
            1700: '1700ms',
            1800: '1800ms',
            1900: '1900ms',
            2000: '2000ms',
         },
      },
   },
   plugins: [],
};
