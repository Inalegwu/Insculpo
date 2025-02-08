import { Collection } from "@signaldb/core";
import createIndexedDBAdapter from "@signaldb/indexeddb";
import PouchDb from "pouchdb-node";

export const db = new PouchDb<Note>("insculpo-db");

export const signalDB = {
    notes: new Collection<SignalNote>(
        {
            persistence: createIndexedDBAdapter("notes"),
        },
    ),
    notebooks: new Collection<Notebook>({
        persistence: createIndexedDBAdapter("notebooks"),
    }),
    classes: new Collection<Class>({
        persistence: createIndexedDBAdapter("classes"),
    }),
};
