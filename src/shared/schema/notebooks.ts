import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { notes } from "./notes";

export const notebooks = sqliteTable("notebooks", {
  id: text("id").notNull().unique(),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at").default(Date.now()),
  updatedAt: integer("updated_at").default(Date.now()),
});

export const notebooksNotesRelation = relations(notebooks, ({ many }) => ({
  notes: many(notes),
}));
