import { publicProcedure, router } from "@src/trpc";
import { shell } from "electron";
import z from "zod";
import pkg from "../../../package.json";
import { notebooksRouter } from "./notebooks";
import { notesRouter } from "./notes";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  version: publicProcedure.query(async () => {
    return pkg.version;
  }),
  openExternal: publicProcedure
    .input(
      z.object({
        link: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      await shell.openExternal(input.link);
    }),
  notes: notesRouter,
  notebooks: notebooksRouter,
});

export type AppRouter = typeof appRouter;
