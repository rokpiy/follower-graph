/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(0 0% 100% / 0.1)",
        input: "hsl(0 0% 100% / 0.1)",
        ring: "hsl(0 0% 100%)",
        background: "hsl(0 0% 0%)",
        foreground: "hsl(0 0% 100%)",
        primary: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(0 0% 0%)",
        },
        secondary: {
          DEFAULT: "hsl(0 0% 100% / 0.1)",
          foreground: "hsl(0 0% 100%)",
        },
        muted: {
          DEFAULT: "hsl(0 0% 100% / 0.1)",
          foreground: "hsl(0 0% 100% / 0.6)",
        },
        accent: {
          DEFAULT: "hsl(0 0% 100% / 0.1)",
          foreground: "hsl(0 0% 100%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
}

