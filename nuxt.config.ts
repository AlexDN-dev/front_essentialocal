import dotenv from "dotenv";

dotenv.config();

export default defineNuxtConfig({
  devtools: { enabled: false },
  plugins: ["~/plugins/element-plus.ts"],
  modules: ["nuxt3-leaflet"],
  ssr: false,
  runtimeConfig: {
    public: {
      serverAddress: process.env.SERVER_ADDRESS,
    },
  },
});
