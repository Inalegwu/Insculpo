import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { notebooks } from "./notebook";

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey().notNull(),
  body: text("body").primaryKey(),
  dateCreated: integer("date_created", {
    mode: "timestamp",
  }),
  dateUpdated: integer("date_updated", {
    mode: "timestamp",
  }),
  notebookId: text("notebook_id").references(() => notebooks.id, {
    onDelete: "cascade",
  }),
});
