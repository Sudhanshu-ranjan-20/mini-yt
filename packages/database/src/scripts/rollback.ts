import { getDb, createDb } from "..";

async function rollback() {
  let db = getDb();
  if (!db) db = createDb();

  const [batch, logs] = await db.migrate.rollback();
  console.log({ batch, logs });
  process.exit(0);
}

rollback().catch((e: Error) => {
  console.log("Error in rolling back", e.message);
});
