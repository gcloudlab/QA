/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        primary: "#CD5348",
        secondary: "#448B81",
        fan: "#F5E6D8",
      },
      backgroundColor: {
        primary: "#CD5348",
        secondary: "#448B81",
        fan: "#F5E6D8",
        fan1: "#fcdfc5",
      },
      borderColor: {
        primary: "#CD5348",
        secondary: "#448B81",
        fan: "#F5E6D8",
      },
      ringColor: {
        primary: "#CD5348",
        secondary: "#448B81",
        fan: "#F5E6D8",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@headlessui/tailwindcss")],
};
