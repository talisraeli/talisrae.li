import {defineCollection} from "astro:content";
import {glob} from "astro/loaders";
import {z} from "astro/zod";

const projects = defineCollection({
    loader: glob({pattern: "**/*.mdx", base: "./src/content/projects"}),
    schema: ({image}) => z.object({
        title: z.string(),
        // Used for the page's meta description.
        description: z.string(),
        // Shown in the project list.
        summary: z.string(),
        period: z.string(),
        technologies: z.array(z.string()),
        // Shown at the top of the project page, next to the cover image.
        intro: z.string(),
        cover: image(),
        coverAlt: z.string(),
        details: z.array(z.object({
            area: z.string(),
            details: z.string(),
        })),
        sourceCode: z.url().optional(),
    }),
});

export const collections = {projects};
