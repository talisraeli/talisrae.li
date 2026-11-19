// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";

// https://astro.build/config
export default defineConfig({
  site: "https://talisrae.li",
  trailingSlash: "never",
  // Keep apostrophes and quotes as written instead of converting them to curly ones.
  integrations: [mdx({ processor: satteri({ features: { smartPunctuation: false } }) })],
});
