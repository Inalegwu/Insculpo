import { publicProcedure, router } from "@src/trpc";

export const notebooksRouter = router({
  getNotebooks: publicProcedure.query(async ({ ctx }) => {}),
});
