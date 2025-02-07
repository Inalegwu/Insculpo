import PouchDb from "pouchdb-node";

export const db = new PouchDb<Note>("insculpo-db");
