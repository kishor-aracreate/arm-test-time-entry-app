import { defineConfig } from "unocss";
import presetWind4 from "@unocss/preset-wind4";
import presetAttributify from "@unocss/preset-attributify";

export default defineConfig({
  theme: {
    darkMode: "class",
    colors: {
      bg: "var(--bg)",
      text: "var(--text)",
      textSecondary: "var(--text-secondary)",
      button: "var(--button-bg)",
      buttonHover: "var(--button-hover-bg)",
      textLink: "var(--text-link)",
      glass: "var(--glass-bg)",
      primary: "var(--primary)",
      shadow: "var(--shadow-color)",
      bgAuth: "var(--bg-auth-colour)",
      authButton: "var(--auth-button-bg)",
      bgInput: "var(--bg-input)",
      textInput: "var(--text-input)",
    },
    boxShadow: {
      soft: "0 0 20px var(--shadow-color)", // subtle glow
      spread: "0 0 30px 6px var(--shadow-color)", // spread in all directions
      md: "0 4px 6px -1px var(--shadow-color), 0 2px 4px -2px var(--shadow-color)", // material style
    },
  },
  shortcuts: {
    "glass-card": "bg-glass backdrop-blur-md rounded-xl p-4",
  },
  presets: [presetWind4(), presetAttributify()],
  content: {
    pipeline: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["node_modules", "dist"],
    },
  },
});
