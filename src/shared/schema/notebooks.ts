import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { notes } from "./notes";

export const notebooks = sqliteTable("notebooks", {
  id: text("id").notNull().unique(),
  name: text("name").notNull().unique(),
});

export const notebooksNotesRelation = relations(notebooks, ({ many }) => ({
  notes: many(notes),
}));
