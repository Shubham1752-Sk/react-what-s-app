/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "chat-background": "url('/chat-bg.png')",
      },
      colors:{
        "panel-bg": "#202c33",
        "primary-green":"#62e38b",
        "secondary-green":"#b5d7b8",
        "border-green":"#082913"
      }
    },
  },
  plugins: [],
}

