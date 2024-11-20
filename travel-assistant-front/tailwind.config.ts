import type { Config } from "tailwindcss";
import { plugin, content } from "flowbite-react/tailwind";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    content(),
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: '0px 4px 4px 0px #00000040',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: 'selector',
  plugins: [
    plugin(),
  ],
} satisfies Config;
