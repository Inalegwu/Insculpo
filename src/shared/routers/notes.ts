import { publicProcedure, router } from "@src/trpc";
import z from "zod";

export const notesRouter = router({
  getNotes: publicProcedure.query(async ({ ctx }) => {
    const notes = await ctx.db.query.notes.findMany();

    return notes;
  }),
  getNote: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {}),
  dumpNotes: publicProcedure.mutation(async () => {}),
  dumpNote: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {}),
});
