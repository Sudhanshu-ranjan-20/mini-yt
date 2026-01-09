import { buildApp } from "./app";
import { ENV } from "@mini-yt/shared";
(async () => {
  const app = await buildApp();
  app.listen({ port: ENV.PORT });
})();
