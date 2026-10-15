import { defineConfig } from "vite";

export default defineConfig({
  // Chemins relatifs : l'application fonctionne aussi bien à la racine
  // qu'en sous-chemin (ex. https://mborne.github.io/calcul-distance/).
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        mentionsLegales: new URL("./mentions-legales.html", import.meta.url).pathname,
      },
    },
  },
});
