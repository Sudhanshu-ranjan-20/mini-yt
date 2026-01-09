import { buildApp } from "./app";
import { ENV } from "./config";
(async () => {
  const app = await buildApp();
  app.listen({ port: ENV.PORT });
})();
