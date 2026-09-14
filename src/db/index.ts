import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

export * from "./schema";

const sqlite = new Database("fossnote.sqlite");
sqlite.run("PRAGMA foreign_keys = OK;");

export const db = drizzle(sqlite, { schema });