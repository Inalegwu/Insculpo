import { publicProcedure, router } from "@src/trpc";
import * as fs from "node:fs";
import { v4 } from "uuid";
import z from "zod";

export const notesRouter = router({
  getNotes: publicProcedure.query(async ({ ctx }) => {
    const notes = await ctx.db.allDocs({
      include_docs: true,
    }).then((response) =>
      response.rows.map((row) => ({
        id: row.doc?._id,
        body: row.doc?.body,
        title: row.doc?.title,
        subtitle: row.doc?.subtitle,
        rev: row.doc?._rev,
      }))
    );

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
      const note = await ctx.db.find({
        selector: {
          _id: input.noteId,
        },
      }).then((response) =>
        response.docs.map((doc) => ({
          id: doc._id,
          rev: doc._rev,
          body: doc.body,
          title: doc.title,
          subtitle: doc.subtitle,
        })).find((item) => item.id === input.noteId)
      );

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
        const finalized = await ctx.db.put({
          body: input.content,
          _id: v4(),
          title: "",
          subtitle: "",
        }).then(async (response) =>
          await ctx.db.find({
            selector: {
              _id: response.id,
            },
          }).then((r) => r.docs.find((item) => item._id === response.id))
        );

        return finalized;
      }

      return await ctx.db.put({
        _id: input.noteId,
        body: input.content,
        subtitle: "",
        title: "",
      }).then(async (response) =>
        await ctx.db.find({
          selector: {
            _id: response.id,
          },
        }).then((r) => r.docs.find((item) => item._id === response.id))
      );
    }),
  findNote: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return false;
    }),
  deleteNote: publicProcedure
    .input(
      z.object({
        noteId: z.string(),
        rev: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.remove({
        _id: input.noteId,
        _rev: input.rev,
      });
    }),
  dumpNotes: publicProcedure.mutation(async ({ ctx }) => {
    const notes = await ctx.db.allDocs({
      include_docs: true,
    }).then((res) => res.rows).then((rows) =>
      rows.map((row) => ({
        _id: row.doc?._id,
        body: row.doc?.body,
        title: row.doc?.title,
        subtitle: row.doc?.subtitle,
      }))
    );

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

      if (!note.body) {
        continue;
      }

      fs.writeFile(
        `${destination}/${note.title}.md`,
        note.body,
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
      const note = await ctx.db.find({
        selector: {
          _id: input.noteId,
        },
      }).then((res) => res.docs.find((row) => row._id === input.noteId));

      const destination = `${ctx.app.getPath("documents")}/Insculpo`;

      if (!fs.existsSync(destination)) {
        fs.mkdir(`${ctx.app.getPath("documents")}/Insculpo`, undefined, (e) => {
          console.log(e?.errno);
        });
      }

      if (!note || !note.body) {
        return;
      }

      fs.writeFile(
        `${destination}/${note?.title}.md`,
        note.body,
        {
          encoding: "utf8",
        },
        (e) => {
          console.log(e);
        },
      );
    }),
});
