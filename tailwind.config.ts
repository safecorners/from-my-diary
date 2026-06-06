import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#fffaf0",
        "surface-soft": "#faf5e8",
        "surface-card": "#f5f0e0",
        "surface-raised": "#ffffff",
        ink: "#0a0a0a",
        body: "#34312d",
        muted: "#6d665d",
        hairline: "#e7ddca",
        primary: "#0a0a0a",
        "on-primary": "#ffffff",
        "diary-pink": "#ff7aa8",
        "diary-teal": "#1f4a46",
        "diary-lavender": "#c5b5f2",
        "diary-peach": "#ffb58f",
        "diary-ochre": "#e5b84d",
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#dc2626"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 30px rgb(10 10 10 / 0.06)"
      }
    }
  },
  plugins: []
} satisfies Config;
