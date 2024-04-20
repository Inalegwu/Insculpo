import { publicProcedure, router } from "@src/trpc";
import { shell } from "electron";
import z from "zod";
import pkg from "../../../package.json";
import { notebooksRouter } from "./notebooks";
import { notesRouter } from "./notes";
import { windowRouter } from "./window";
import { linksRouter } from "./links";

export const appRouter = router({
  window: windowRouter,
  version: publicProcedure.query(async () => {
    return pkg.version;
  }),
  links:linksRouter,
  notes: notesRouter,
  notebooks: notebooksRouter,
});

export type AppRouter = typeof appRouter;
