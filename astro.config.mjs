// @ts-check
import { defineConfig, envField } from "astro/config";

import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";

// https://astro.build/config
export default defineConfig({
  site: "https://talisrae.li",
  trailingSlash: "never",
  // Keep apostrophes and quotes as written instead of converting them to curly ones.
  env: {
    schema: {
      // Analytics IDs are public (they end up in the page), so they're client variables. Leave unset to disable them.
      PUBLIC_GA_MEASUREMENT_ID: envField.string({ context: "client", access: "public", optional: true }),
      PUBLIC_GTM_CONTAINER_ID: envField.string({ context: "client", access: "public", optional: true }),
      PUBLIC_CLARITY_PROJECT_ID: envField.string({ context: "client", access: "public", optional: true }),
      // The Negishot accessibility widget's code. Leave unset to disable the widget.
      PUBLIC_NEGISHOT_WIDGET_CODE: envField.string({ context: "client", access: "public", optional: true }),
    },
  },
  integrations: [mdx({ processor: satteri({ features: { smartPunctuation: false } }) })],
});
