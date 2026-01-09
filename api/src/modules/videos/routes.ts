import { FastifyPluginAsync } from "fastify";
import VideoController from "./controller";
import Validator from "./validator";

const routes: FastifyPluginAsync = async (app) => {
  const videoController = new VideoController(app);
  app.get(
    "/:id",
    { schema: Validator.getVideoMetadataSchema },
    videoController.getMetaData.bind(videoController)
  );
  app.post(
    "/",
    { schema: Validator.createVideoSchema },
    videoController.uploadVideo.bind(videoController)
  );
  app.post(
    "/:id/finalize",
    { schema: Validator.finalizeVideoSchema },
    videoController.finalizeUpload.bind(videoController)
  );
};

export default routes;
