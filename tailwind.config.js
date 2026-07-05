// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/**/*.{js,jsx@}', // For Vite or Next.js: adjust to match your file structure
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts}"],
  theme: {
    extend: {
      colors: {
        darkNavy: 'rgb(17,24,39)', 
        mediumNavy: 'rgb(31,41,55)', 
      },
    },
  },
  plugins: [],
}