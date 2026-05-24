import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF6F2",
          50: "#FDFBF9",
          100: "#FAF6F2",
          200: "#F5EEE6",
        },
        blush: {
          50: "#FDF4F2",
          100: "#F9E7E3",
          200: "#F5D5D0",
          300: "#EFC1BB",
          400: "#E8B4B8",
          500: "#DE9AA0",
          600: "#C77D85",
        },
        nude: {
          DEFAULT: "#F0E0D6",
          50: "#FBF4EE",
          100: "#F5E8DD",
          200: "#F0E0D6",
          300: "#E5CDBF",
        },
        bordeaux: {
          DEFAULT: "#8B4B5C",
          50: "#F5E9EC",
          100: "#E8CDD3",
          400: "#A85F71",
          500: "#8B4B5C",
          600: "#6E3A48",
          700: "#522B36",
        },
        champagne: {
          DEFAULT: "#C9A876",
          50: "#F8F1E5",
          100: "#F0E3CB",
          400: "#D4B888",
          500: "#C9A876",
          600: "#A88A5C",
        },
        ink: {
          DEFAULT: "#3D2B2E",
          50: "#F3EDED",
          400: "#6B5256",
          500: "#523A3D",
          600: "#3D2B2E",
          700: "#2A1D1F",
        },
        sage: {
          DEFAULT: "#A8B5A0",
          50: "#EFF2EC",
          100: "#DDE3D8",
          500: "#A8B5A0",
          600: "#869682",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-allura)", "cursive"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.75rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(139, 75, 92, 0.08), 0 2px 8px -4px rgba(139, 75, 92, 0.06)",
        "soft-lg": "0 12px 40px -12px rgba(139, 75, 92, 0.12), 0 4px 16px -4px rgba(139, 75, 92, 0.08)",
        "soft-xl": "0 24px 60px -16px rgba(139, 75, 92, 0.18), 0 8px 24px -8px rgba(139, 75, 92, 0.1)",
        glow: "0 0 0 1px rgba(201, 168, 118, 0.2), 0 8px 32px -8px rgba(201, 168, 118, 0.25)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "paper-texture":
          "radial-gradient(circle at 20% 10%, rgba(245, 213, 208, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 90%, rgba(201, 168, 118, 0.08) 0%, transparent 50%)",
        "blush-fade":
          "linear-gradient(180deg, #FAF6F2 0%, #F9E7E3 100%)",
        "cream-fade":
          "linear-gradient(180deg, #FBF4EE 0%, #FAF6F2 100%)",
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "soft-pulse": "soft-pulse 2.4s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
