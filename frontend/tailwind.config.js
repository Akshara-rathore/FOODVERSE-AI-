/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F7FC",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#5546A6",
          light: "#EEEAFB",
          dark: "#3F3282",
        },
        secondary: {
          DEFAULT: "#8375D1",
          light: "#B8AFF0",
        },
        coral: {
          DEFAULT: "#F07868",
          light: "#FDEAE7",
          dark: "#D95847",
        },
        mainText: "#202039",
        secondaryText: "#77778F",
        border: "#E7E5F0",
        success: {
          DEFAULT: "#27866B",
          light: "#E7F5F0",
        },
        warning: {
          DEFAULT: "#D18A32",
          light: "#FAF0E3",
        },
        error: {
          DEFAULT: "#C74755",
          light: "#FAEAEC",
        },
        darkNav: {
          DEFAULT: "#22213B",
          hover: "#2D2C4D",
          active: "#38365E",
        },
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 8px -2px rgba(32, 32, 57, 0.05), 0 1px 4px -1px rgba(32, 32, 57, 0.03)",
        card: "0 4px 16px -4px rgba(32, 32, 57, 0.06), 0 2px 6px -2px rgba(32, 32, 57, 0.04)",
      },
    },
  },
  plugins: [],
}
