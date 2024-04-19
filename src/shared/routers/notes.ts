import { publicProcedure, router } from "@src/trpc";
import { app } from "electron";
import * as fs from "fs";
import { v4 } from "uuid";
import z from "zod";
import { notes } from "../schema";

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
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.query.notes.findFirst({
        where: (note, { eq }) => eq(note.id, input.noteId),
      });

      return note;
    }),
  saveNote: publicProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(notes).values({
        id: v4(),
        body: input.content,
        name: input.content.split("\n")[0],
      });
    }),
  dumpNotes: publicProcedure.mutation(async ({ ctx }) => {
    const notes = await ctx.db.query.notes.findMany();

    for (const note of notes) {
      if (note.body === null) {
        continue;
      }
      fs.writeFileSync(
        `${app.getPath("documents")}/insculpo/${note.name}-${note.id}`,
        note.body,
        {
          encoding: "utf-8",
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
      const note = await ctx.db.query.notes.findFirst({
        where: (note, { eq }) => eq(note.id, input.noteId),
      });

      if (!note || note?.body === null) {
        return;
      }

      fs.writeFileSync(
        `${app.getPath("documents")}/insculpo/${note.name}-${note.id}`,
        note.body,
        {
          encoding: "utf-8",
        },
      );
    }),
});
