import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080b14",
        panel: "#101522",
        line: "#202a3d",
        muted: "#8b97ad",
        accent: "#8b5cf6",
        cyan: "#22d3ee"
      },
      boxShadow: { glow: "0 0 45px rgba(139,92,246,.18)" }
    }
  },
  plugins: []
};
export default config;
