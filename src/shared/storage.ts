import Find from "pouchdb-find";
import PouchDB from "pouchdb-node";
import type { Note } from "./types";

PouchDB.plugin(Find);

const store = new PouchDB<Note>("insculpo_db");

store.sync("http://localhost:5984/insculpo_db", {
  live: true,
});

store.createIndex({
  index: {
    fields: ["name", "body"],
  },
});

export default store;
