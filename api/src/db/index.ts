import knex, { Knex as IKnex } from "knex";
import { ENV } from "../config";

let db: IKnex | null;
export function createDb(): IKnex {
  try {
    if (db) return db;
    db = knex({
      client: "pg",
      connection: ENV.DATABASE_URL,
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

export default createDb();
