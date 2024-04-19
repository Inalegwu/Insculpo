import { Note } from "@shared/types";
import { publicProcedure, router } from "@src/trpc";
import * as fs from "fs";
import { v4 } from "uuid";
import z from "zod";

export const notesRouter = router({
  getNotes: publicProcedure.query(async ({ ctx }) => {
    const notes = await ctx.db.allDocs({
      include_docs: true,
    });

    const rows = notes.rows;

    return rows;
  }),
  getNote: publicProcedure
    .input(
      z.object({
        noteId: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.noteId === null) {
        return null;
      }
      const note = await ctx.db.get(input.noteId);

      return note;
    }),
  saveNote: publicProcedure
    .input(
      z.object({
        content: z.string(),
        noteId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.noteId === null) {
        const finalized = await ctx.db
          .put({
            _id: v4(),
            body: input.content,
            name: input.content.split("\n")[0],
          })
          .then(async (v) => {
            const note = await ctx.db.get<Note>(v.id);
            return {
              id: note._id,
              body: note.body,
              name: note.name,
            };
          });
        return finalized;
      }

      await ctx.db.get<Note>(input.noteId).then((v) => {
        v.body = input.content;
        v.name = input.content;
        ctx.db.put<Note>(v);
      });
    }),
  deleteNote: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
        rev: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.remove({
        _id: input.noteId,
        _rev: input.rev,
      });
    }),
  dumpNotes: publicProcedure.mutation(async ({ ctx }) => {
    const notes = await ctx.db.allDocs({
      include_docs: true,
    });

    for (const note of notes.rows) {
      if (!note.doc) {
        continue;
      }
      fs.writeFileSync(
        `${ctx.app.getPath("documents")}/Insculpo/${note.doc._id}-${
          note.doc.name
        }`,
        note.doc.body,
        {
          encoding: "utf8",
        },
      );
    }
  }),
  dumpNote: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.db.get(input.noteId);

      fs.writeFileSync(
        `${ctx.app.getPath("documents")}/Insculpo/${note._id}-${note.name}`,
        note.body,
        {
          encoding: "utf8",
        },
      );
    }),
});
