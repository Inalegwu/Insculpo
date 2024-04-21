import Find from "pouchdb-find";
import PouchDB from "pouchdb-node";
import type { Note } from "./types";

PouchDB.plugin(Find);

const store = new PouchDB<Note>("insculpo_db");

store.createIndex({
  index: {
    fields: ["name", "body"],
    name: "searchIndex",
    type: "json",
  },
});

export default store;
