import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { notes } from "./notes";

export const tags = sqliteTable("tags", {
  id: text("id").notNull().unique(),
  name: text("name").notNull().unique(),
});

export const tagsNoteRelation = relations(tags, ({ many }) => ({
  notes: many(notes),
}));
