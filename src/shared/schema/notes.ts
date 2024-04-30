import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { collection } from "./collection";
import { tags } from "./tags";

export const notes = sqliteTable("notes", {
  id: text("id").notNull().unique(),
  name: text("title").notNull(),
  content: text("content"),
  collectionId: text("collection_id").references(() => collection.id),
});

export const noteCollectionRelation = relations(notes, ({ one }) => ({
  collection: one(collection, {
    fields: [notes.collectionId],
    references: [collection.id],
  }),
}));

export const noteTagRelation = relations(notes, ({ many }) => ({
  tags: many(tags),
}));
