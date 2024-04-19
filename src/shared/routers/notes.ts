import { publicProcedure, router } from "@src/trpc";
import { v4 } from "uuid";
import z from "zod";

type Note = {
  name: string;
  body: string;
};

type PouchPutType<T> = PouchDB.Core.IdMeta & PouchDB.Core.GetMeta & T;

export const notesRouter = router({
  getNotes: publicProcedure.query(async ({ ctx }) => {
    const notes = await ctx.db.allDocs<PouchDB.Core.AllDocsResponse<Note>>({
      include_docs: true,
    });

    const rows = notes.rows;

    return rows;
  }),
  getNote: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.get<Note>(input.noteId);

      return note;
    }),
  saveNote: publicProcedure
    .input(
      z.object({
        content: z.string(),
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.noteId === "") {
        return ctx.db.put<Note>({
          body: input.content,
          name: input.content.split("\n")[0],
          _id: v4(),
        });
      }
      ctx.db.get<Note>(input.noteId).then((v: PouchPutType<Note>) => {
        v.body = input.content;
        return ctx.db.put(v);
      });
    }),
  dumpNotes: publicProcedure.mutation(async ({ ctx }) => {}),
  dumpNote: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {}),
});
