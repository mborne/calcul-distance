import { defineConfig } from "vite";

export default defineConfig({
  // Chemins relatifs : le build fonctionne à la racine comme en sous-chemin
  // (ex. https://mborne.github.io/calcul-distance/).
  base: "./",
});
