import { relations } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { notebooks } from "./notebooks";
import { tags } from "./tags";

export const notes = sqliteTable(
  "notes",
  {
    id: text("id").notNull().unique(),
    name: text("title").notNull(),
    content: text("content").notNull(),
    collectionId: text("notebook_id").references(() => notebooks.id),
    dateCreated: integer("date_created").default(Date.now()),
    dateUpdated: integer("date_updated").default(Date.now()),
  },
  (t) => ({
    idIdx: index("id_index").on(t.id),
  }),
);

export const noteCollectionRelation = relations(notes, ({ one }) => ({
  collection: one(notebooks, {
    fields: [notes.collectionId],
    references: [notebooks.id],
  }),
}));

export const noteTagRelation = relations(notes, ({ many }) => ({
  tags: many(tags),
}));

export const noteToTag = sqliteTable(
  "note_to_tag",
  {
    noteId: text("note_id")
      .notNull()
      .references(() => notes.id),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.noteId, t.tagId],
    }),
  }),
);

export const noteToTagRelation = relations(noteToTag, ({ one }) => ({
  tag: one(tags, {
    fields: [noteToTag.tagId],
    references: [tags.id],
  }),
  note: one(notes, {
    fields: [noteToTag.noteId],
    references: [notes.id],
  }),
}));
