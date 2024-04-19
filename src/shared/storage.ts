import Find from "pouchdb-find";
import PouchDB from "pouchdb-node";
import { Note } from "./types";

PouchDB.plugin(Find);

// type annotation here reflects everywhere
// I
const store = new PouchDB<Note>("insculpo_db", {});

export default store;
