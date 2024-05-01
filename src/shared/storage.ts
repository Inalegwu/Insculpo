import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { app } from "electron";
import * as schema from "./schema/index";

process.env = {
  STORAGE_LOCATION: `${app.getPath("appData")}/Insculpo/insculpo.db`,
};

const sqlite = new Database(process.env.STORAGE_LOCATION!);

export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: ".drizzle" });
