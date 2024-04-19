import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { notes } from "./note";

export const notebooks = sqliteTable("notebooks", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
});

export const noteBooksToNoteRelation = relations(notebooks, ({ many }) => ({
  notes: many(notes),
}));
