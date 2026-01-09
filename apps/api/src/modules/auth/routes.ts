import { FastifyPluginAsync } from "fastify";
import Validator from "./validator";
import Controller from "./controller";

const routes: FastifyPluginAsync = async (app) => {
  const authController = new Controller(app);
  app.post(
    "/signup",
    { schema: Validator.signupSchema() },
    authController.signup.bind(authController)
  );
  app.post(
    "/login",
    { schema: Validator.loginSchema() },
    authController.login.bind(authController)
  );
  app.post("/refresh", authController.login.bind(authController));
  app.post("/logout", authController.logout.bind(authController));
};

export default routes;
