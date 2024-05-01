import { publicProcedure, router } from "@src/trpc";
import pkg from "../../../package.json";
import { linksRouter } from "./links";
import { notebooksRouter } from "./notebooks";
import { notesRouter } from "./notes";
import { systemRouter } from "./system";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  version: publicProcedure.query(async () => {
    return pkg.version;
  }),
  links: linksRouter,
  notes: notesRouter,
  notebooks: notebooksRouter,
  system: systemRouter,
});

export type AppRouter = typeof appRouter;
