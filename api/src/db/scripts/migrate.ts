import { createDb, getDb } from "..";

async function migrate(): Promise<void> {
  let db = getDb();
  if (!db) db = createDb();
  const [batch, log] = await db.migrate.latest();
  console.log({ batch, log });
  process.exit(0);
}

migrate().catch((e: Error) => {
  console.error("Error in migrating the files", e.message);
});
