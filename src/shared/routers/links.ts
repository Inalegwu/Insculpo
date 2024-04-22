import { publicProcedure, router } from "@src/trpc";
import axios from "axios";
import { load } from "cheerio";
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
    }),
  fetchLinkData: publicProcedure
    .input(
      z.object({
        url: z.string().url().nullable(),
      }),
    )
    .query(async ({ input }) => {
      if (input.url === null) {
        return;
      }

      const body = await axios.get(input.url);

      const html = load(body.data);

      const tags = extractOGTag(html);

      return tags;
    }),
});
