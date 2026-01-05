import Fastify from "fastify";
import { getDb, createDb, closeDb } from "./db";
import { Knex as Iknex } from "knex";
export async function buildApp() {
  const app = Fastify({ logger: true });

  let db = getDb();
  if (!db) db = createDb();
  app.decorate("db", db);

  app.get("/health", async () => ({}));

  app.addHook("onClose", async () => {
    await closeDb();
  });

  return app;
}

declare module "fastify" {
  interface FastifyInstance {
    db: Iknex;
  }
}
