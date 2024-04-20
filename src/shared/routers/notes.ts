import { publicProcedure, router } from "@src/trpc";
import * as fs from "node:fs";
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
      // make sure not to store
      // empty content
      if (input.content === "") return;

      // ensure markdown charachters aren't in the name
      const name = input.content.split("\n")[0].replace(/[^a-zA-Z0-9' ]/gi, "");

      // if the noteId is null , this means
      // it's a new note
      if (input.noteId === null) {
        const finalized = await ctx.db
          .put({
            _id: v4(),
            body: input.content,
            name: name,
          })
          .then(async (v) => {
            const note = await ctx.db.get(v.id);
            return {
              id: note._id,
              body: note.body,
              name: note.name,
            };
          });
        return finalized;
      }

      // otherwise , just update the note
      await ctx.db.get(input.noteId).then((v) => {
        v.body = input.content;
        v.name = name;
        ctx.db.put(v);
      });
    }),
  findNote: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const results = await ctx.db.find({
        selector: {
          name: input.query,
          body: input.query,
        },
        sort: ["name"],
        limit: 5,
        use_index: "name",
      });

      return results.docs;
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

    const destination = `${ctx.app.getPath("documents")}/Insculpo`;

    if (!fs.existsSync(destination)) {
      fs.mkdir(`${ctx.app.getPath("documents")}/Insculpo`, undefined, (e) => {
        console.log(e?.errno);
      });
    }

    for (const note of notes.rows) {
      if (!note.doc) {
        continue;
      }
      fs.writeFile(
        `${destination}/${note.doc.name}`,
        note.doc.body,
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
        noteId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.noteId === null) return;
      const note = await ctx.db.get(input.noteId);

      const destination = `${ctx.app.getPath("documents")}/Insculpo`;

      if (!fs.existsSync(destination)) {
        fs.mkdir(`${ctx.app.getPath("documents")}/Insculpo`, undefined, (e) => {
          console.log(e?.errno);
        });
      }

      fs.writeFile(
        `${destination}/${note.name}.md`,
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
