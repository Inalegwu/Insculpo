import { publicProcedure, router } from "@src/trpc";

export const notebooksRouter = router({
  getNotebooks: publicProcedure.query(async ({ ctx }) => {
    const notebooks = await ctx.db.query.notebooks.findMany({
      with: {
        notes: true,
      },
    });

    return notebooks;
  }),
});
