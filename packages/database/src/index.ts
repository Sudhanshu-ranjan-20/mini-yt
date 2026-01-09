import knex, { Knex as IKnex } from "knex";
import { types } from "@mini-yt/shared";

let db: IKnex | null;
export function createDb(
  dbConfig: types.database.TDbConfig = {
    DATABASE_URL: process.env.DATABASE_URL ?? "",
  }
): IKnex {
  try {
    if (db) return db;
    db = knex({
      client: "pg",
      connection: dbConfig.DATABASE_URL,
      migrations: {
        directory: __dirname + "/migrations",
      },
      seeds: {
        directory: __dirname + "/seeds",
      },
    });

    return db;
  } catch (error) {
    console.log("ERROR IN CREATING DB CLIENT", error);
    throw new Error(`DATA_BASE init failed ${error}`);
  }
}
export function getDb(): IKnex | null {
  if (!db) return null;
  return db;
}

export async function closeDb(): Promise<void> {
  try {
    if (db) {
      await db.destroy();
      db = null;
    }
  } catch (error) {
    throw new Error("Error closing the database connection");
  }
}
