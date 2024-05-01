import { publicProcedure, router } from "@src/trpc";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { z } from "zod";
import { notebooks, notes } from "../schema";

export const notebooksRouter = router({
  getNotebooks: publicProcedure.query(async ({ ctx }) => {
    const collections = await ctx.db.query.notebooks.findMany({
      with: {
        notes: true,
      },
    });

    return collections;
  }),
  createNotebook: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const finalized = ctx.db
        .insert(notebooks)
        .values({
          id: v4(),
          name: input.name,
        })
        .returning({
          id: notebooks.id,
          name: notebooks.name,
        })
        .get();

      return finalized;
    }),
  deleteNotebook: publicProcedure
    .input(
      z.object({
        bookId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const finalized = ctx.db
        .delete(notebooks)
        .where(eq(notebooks.id, input.bookId))
        .returning({
          id: notebooks.id,
        });

      return finalized;
    }),
  getNotebook: publicProcedure
    .input(
      z.object({
        notebookId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const notebook = await ctx.db.query.notebooks.findFirst({
        where: (noetbooks, { eq }) => eq(notebooks.id, input.notebookId),
        with: {
          notes: true,
        },
      });

      return notebook;
    }),
  addNoteToCollection: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
        collectionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const added = await ctx.db
        .update(notes)
        .set({
          collectionId: input.collectionId,
        })
        .returning({
          id: notes.id,
          name: notes.name,
          collectionId: notes.collectionId,
        });

      return added;
    }),
});
