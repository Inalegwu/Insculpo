import Find from "pouchdb-find";
import PouchDB from "pouchdb-node";

PouchDB.plugin(Find);

const store = new PouchDB("insculpo_db", {});

export default store;
