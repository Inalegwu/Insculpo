import { publicProcedure, router } from "@src/trpc";
import { eq } from "drizzle-orm";
import * as fs from "node:fs";
import { v4 } from "uuid";
import z from "zod";
import { notes } from "../schema";

export const notesRouter = router({
  getNotes: publicProcedure.query(async ({ ctx }) => {
    const notes = await ctx.db.query.notes.findMany({});

    return notes;
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
      const note = await ctx.db.query.notes.findFirst({
        where: (note, { eq }) => eq(note.id, input.noteId!),
      });

      if (!note) return null;

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
      const name = input.content.split("\n")[0].replace(/[^a-zA-Z0-9' ]/gi, "");

      if (input.noteId === null) {
        const finalized = ctx.db
          .insert(notes)
          .values({
            id: v4(),
            name: name,
            content: input.content,
          })
          .returning({
            id: notes.id,
            name: notes.name,
            content: notes.content,
          })
          .get();
        return finalized;
      }

      await ctx.db
        .update(notes)
        .set({
          content: input.content,
          name: name,
          dateUpdated: Date.now(),
        })
        .where(eq(notes.id, input.noteId));
    }),
  findNote: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return null;
    }),
  deleteNote: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(notes).where(eq(notes.id, input.noteId));
    }),
  dumpNotes: publicProcedure.mutation(async ({ ctx }) => {
    const notes = await ctx.db.query.notes.findMany();

    const destination = `${ctx.app.getPath("documents")}/Insculpo`;

    if (!fs.existsSync(destination)) {
      fs.mkdir(`${ctx.app.getPath("documents")}/Insculpo`, undefined, (e) => {
        console.log(e?.errno);
      });
    }

    for (const note of notes) {
      if (!note) {
        continue;
      }

      if (!note.content) {
        continue;
      }

      fs.writeFile(
        `${destination}/${note.name}.md`,
        note.content,
        {
          encoding: "utf8",
        },
        (e) => {
          console.log(e);
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
      if (input.noteId === null) return;
      const note = await ctx.db.query.notes.findFirst({
        where: (note, { eq }) => eq(note.id, input.noteId),
      });

      const destination = `${ctx.app.getPath("documents")}/Insculpo`;

      if (!fs.existsSync(destination)) {
        fs.mkdir(`${ctx.app.getPath("documents")}/Insculpo`, undefined, (e) => {
          console.log(e?.errno);
        });
      }

      if (!note || !note.content) {
        return;
      }

      fs.writeFile(
        `${destination}/${note?.name}.md`,
        note?.content,
        {
          encoding: "utf8",
        },
        (e) => {
          console.log(e);
        },
      );
    }),
});
