import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { notes } from "./notes";

export const collection = sqliteTable("collection", {
  id: text("id").notNull().unique(),
  name: text("name").notNull().unique(),
});

export const collectionNotesRelation = relations(collection, ({ many }) => ({
  notes: many(notes),
}));
