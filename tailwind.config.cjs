/* eslint-env node */
module.exports = {
  content: [`./src/**/*.{vue,js,ts,jsx,tsx}`],
  theme: {
    fontFamily: {
      spartan: ['Spartan', 'sans-serif']
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c35fa1'
        },
        secondary: {
          DEFAULT: '#30c39e'
        },
        tertiary: {
          DEFAULT: '#e9ecef'
        },
        grey: {
          dark: '#333333',
          light: '#b1b5c0'
        },
        raiderio: {
          DEFAULT: '#e5a023'
        }
      }
    }
  }
}
