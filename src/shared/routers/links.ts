import { publicProcedure, router } from "@src/trpc";
import { extractOGTag } from "@utils";
import axios from "axios";
import { load } from "cheerio";
import { shell } from "electron";
import { z } from "zod";

export const linksRouter = router({
  openExternal: publicProcedure
    .input(
      z.object({
        link: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      await shell.openExternal(input.link);
    }),
  fetchLinkData: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .query(async ({ input }) => {
      const body = await axios.get(input.url);

      const html = load(body.data);

      const tags = extractOGTag(html);

      return tags;
    }),
});
