import { FastifyInstance, FastifyRequest } from "fastify";
import sensible from "@fastify/sensible";
import { ENV } from "../../config";

export async function authPlugin(app: FastifyInstance) {
  await app.register(import("@fastify/cookie"));
  await app.register(sensible);

  await app.register(import("@fastify/jwt"), {
    secret: ENV.JWT_SECRET,
    cookie: {
      cookieName: "access_token",
      signed: false,
    },
  });

  app.decorate(
    "requireUser",
    async (request: FastifyRequest): Promise<{ id: string; email: string }> => {
      try {
        await request.jwtVerify();
        return request.user as { id: string; email: string };
      } catch {
        throw app.httpErrors.unauthorized("Not Authenticated!!");
      }
    }
  );
}

declare module "fastify" {
  interface FastifyInstance {
    requireUser: (
      req: FastifyRequest
    ) => Promise<{ id: string; email: string }>;
  }
}
