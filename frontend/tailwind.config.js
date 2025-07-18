/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scale: {
        103: "1.03",
        108: "1.08",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["night"],
  },
};
