import Fastify from "fastify";
import { getDb, createDb, closeDb } from "./db";
import { Knex as Iknex } from "knex";
import authPlugin from "./modules/auth/auth.plugin";
import fastifySensible from "@fastify/sensible";
export async function buildApp() {
  const app = Fastify({ logger: true });

  let db = getDb();
  if (!db) db = createDb();
  app.decorate("db", db);

  await app.register(fastifySensible);
  await app.register(authPlugin);
  await app.register(import("./modules/auth/routes"), { prefix: "/auth" });
  await app.register(import("./modules/channel/routes"), {
    prefix: "/channel",
  });
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
