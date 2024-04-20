import { publicProcedure, router } from "@src/trpc";
import cheerio from "cheerio";
import { shell } from "electron";
import { z } from "zod";
import { extractOGTag } from "../utils";

export const linksRouter = router({
  openExternal: publicProcedure
    .input(
      z.object({
        link: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      await shell.openExternal(input.link);

      const body = await fetch(input.link)
        .then((res) => res.text())
        .then((v) => v);

      const html = cheerio.load(body);

      const tags = extractOGTag(html);

      console.log(tags);

      return tags;
    }),
  fetchLinkData: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      const body = await fetch(input.url)
        .then((res) => res.text())
        .then((v) => v);

      const html = cheerio.load(body);

      const tags = extractOGTag(html);

      console.log(tags);
      return tags;
    }),
});
