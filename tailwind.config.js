/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {

    fontFamily:{
      'sans': ['roboto', 'sans-serif']
    },

    extend: {
      backgroundImage:{
        "home": "url('../images/bg.png')"
      }
    },
  },
  plugins: [],
}

