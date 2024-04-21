import { publicProcedure, router } from "@src/trpc";
import pkg from "../../../package.json";
import { linksRouter } from "./links";
import { notebooksRouter } from "./notebooks";
import { notesRouter } from "./notes";
import { syncRouter } from "./sync";
import { windowRouter } from "./window";

export const appRouter = router({
  window: windowRouter,
  version: publicProcedure.query(async () => {
    return pkg.version;
  }),
  links: linksRouter,
  notes: notesRouter,
  notebooks: notebooksRouter,
  sync: syncRouter,
});

export type AppRouter = typeof appRouter;
