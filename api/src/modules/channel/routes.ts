import { FastifyPluginAsync } from "fastify";
import Validator from "./validator";
import controller from "./controller";

const routes: FastifyPluginAsync = async (app) => {
  const ChannelController = new controller(app);
  app.post(
    "/",
    { schema: Validator.createChannelSchema() },
    ChannelController.createChannel.bind(ChannelController)
  );

  app.get(
    "/:handle",
    { schema: Validator.getChannelByHandleSchema() },
    ChannelController.getChannel.bind(ChannelController)
  );
};

export default routes;
