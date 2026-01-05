import { getDb, createDb } from "..";

async function seed(): Promise<void> {
  let db = getDb();
  try {
    if (!db) db = createDb();
    await db.seed.run();
    process.exit(0);
  } catch (error) {
    throw error;
  }
}

seed().catch((e: Error) => {
  console.error(`Error in running seeds`, e.message);
});
