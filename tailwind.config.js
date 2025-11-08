import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cute Pastel Colors
        "cute-pink": "#FFE5EC",
        "cute-blue": "#E0F4FF",
        "cute-mint": "#D4F4DD",
        "cute-yellow": "#FFF9DB",
        "cute-purple": "#F0E5FF",
        "cute-orange": "#FFE8CC",
        "pastel-pink": "#FFC1CC",
        "pastel-blue": "#B3E5FC",
        "pastel-green": "#C8E6C9",
        "pastel-yellow": "#FFF59D",
        "pastel-purple": "#E1BEE7",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        cute: ["Fredoka", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        grow: {
          from: {
            transform: "scale(0.8)",
            opacity: "0",
          },
          to: {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-8px)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(69, 139, 0, 0.7)",
          },
          "50%": {
            boxShadow: "0 0 0 10px rgba(69, 139, 0, 0)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },
        "slide-in-up": {
          from: {
            transform: "translateY(20px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "slide-in-down": {
          from: {
            transform: "translateY(-20px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "bounce-in": {
          "0%": {
            transform: "scale(0.3)",
            opacity: "0",
          },
          "50%": {
            opacity: "1",
          },
          "70%": {
            transform: "scale(1.05)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "water-drop": {
          "0%": {
            transform: "translateY(-10px)",
            opacity: "0",
          },
          "50%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
        },
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-3deg)",
          },
          "50%": {
            transform: "rotate(3deg)",
          },
        },
        "heart-beat": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "25%": {
            transform: "scale(1.1)",
          },
          "50%": {
            transform: "scale(1)",
          },
          "75%": {
            transform: "scale(1.05)",
          },
        },
        "sparkle-spin": {
          "0%": {
            transform: "rotate(0deg) scale(1)",
            opacity: "0.8",
          },
          "50%": {
            transform: "rotate(180deg) scale(1.2)",
            opacity: "1",
          },
          "100%": {
            transform: "rotate(360deg) scale(1)",
            opacity: "0.8",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        grow: "grow 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        shimmer: "shimmer 2s infinite",
        "slide-in-up": "slide-in-up 0.5s ease-out",
        "slide-in-down": "slide-in-down 0.5s ease-out",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "water-drop": "water-drop 1s ease-in",
        wiggle: "wiggle 1s ease-in-out infinite",
        "heart-beat": "heart-beat 1.5s ease-in-out infinite",
        "sparkle-spin": "sparkle-spin 3s linear infinite",
      },
      boxShadow: {
        cute: "0 4px 15px rgba(255, 192, 203, 0.3), 0 2px 8px rgba(179, 229, 252, 0.2)",
        "cute-lg":
          "0 10px 30px rgba(255, 192, 203, 0.4), 0 5px 15px rgba(179, 229, 252, 0.3), 0 2px 8px rgba(200, 230, 201, 0.2)",
        "cute-xl":
          "0 20px 50px rgba(255, 192, 203, 0.5), 0 10px 25px rgba(179, 229, 252, 0.4), 0 5px 15px rgba(200, 230, 201, 0.3)",
      },
      backgroundImage: {
        "gradient-cute": "linear-gradient(135deg, #FFE5EC, #E0F4FF, #D4F4DD)",
        "gradient-green": "linear-gradient(135deg, #10b981, #14b8a6, #06b6d4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;