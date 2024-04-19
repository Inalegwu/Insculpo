import { publicProcedure, router } from "@src/trpc";
import z from "zod";

export const notesRouter = router({
  getNotes: publicProcedure.query(async () => {}),
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
