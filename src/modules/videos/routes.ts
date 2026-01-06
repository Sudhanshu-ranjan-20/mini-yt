import { FastifyPluginAsync } from "fastify";
import VideoController from "./controller";

const routes: FastifyPluginAsync = async (app) => {
  const videoController = new VideoController(app);
  app.post("/", {}, videoController.create.bind(videoController));
};

export default routes;
