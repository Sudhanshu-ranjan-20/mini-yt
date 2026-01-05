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
};

export default routes;
