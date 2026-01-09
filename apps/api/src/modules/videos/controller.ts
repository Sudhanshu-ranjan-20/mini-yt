import { FastifyInstance, FastifyRequest } from "fastify";
import { v7 } from "uuid";
import { ChannelRepository, VideoRepository } from "../../repository-svc";
import type { FromSchema } from "json-schema-to-ts";
import Validator from "./validator";
import { DEFAULTS } from "../../db/constants";
import { S3Service, SqsService } from "../../common-svc";
import { ENV, CONFIG } from "../../config";
import { logger } from "../../utilities";

type CreateVideoBody = FromSchema<typeof Validator.createVideoSchema.body>;
type FinalizeVideoParams = FromSchema<
  typeof Validator.finalizeVideoSchema.params
>;
type GetVideoMetaDataParams = FromSchema<
  typeof Validator.getVideoMetadataSchema.params
>;

class VideoController {
  private app: FastifyInstance;
  private videoRepository: VideoRepository;
  private channelRepository: ChannelRepository;
  constructor(app: FastifyInstance) {
    this.app = app;
    this.videoRepository = new VideoRepository(app.db);
    this.channelRepository = new ChannelRepository(app.db);
  }
  async uploadVideo(req: FastifyRequest<{ Body: CreateVideoBody }>) {
    try {
      logger.info("VideoController.uploadVideo called::");
      const user = await this.app.requireUser(req);
      const { title, description = "", contentType } = req.body;

      const channel = await this.channelRepository.getChannel({
        owner: user.id,
      });

      if (!channel) throw this.app.httpErrors.badRequest("USER HAS NO CHANNEL");

      const videoId = v7();
      const rawS3Key = `${ENV.NODE_ENV}/videos/raw/${channel.id}/${videoId}`;

      await this.videoRepository.create({
        id: videoId,
        title,
        channel: channel.id,
        description,
        status: DEFAULTS.VIDEO_UPLOAD_STATUS,
        raw_s3_key: rawS3Key,
      });

      const uploadUrl = await S3Service.getSignedUploadUrl({
        key: rawS3Key,
        contentType,
      });

      return {
        videoId,
        uploadUrl,
      };
    } catch (error) {
      logger.error("VideoController.uploadVideo error::");
      throw error;
    }
  }
  async finalizeUpload(req: FastifyRequest<{ Params: FinalizeVideoParams }>) {
    try {
      logger.info("VideoController.finalizeUpload called::");
      const user = await this.app.requireUser(req);
      const { id } = req.params;

      const video = await this.videoRepository.get({ id });
      if (!video) throw this.app.httpErrors.notFound("Video not found!");

      // checking if the video belongs to the current user
      const channel = this.channelRepository.getChannel({
        id: video.channel,
        owner: user.id,
      });
      if (!channel) throw this.app.httpErrors.notFound("Not Video Owner!");

      // dont proceed if the video is not in uploading state
      if (video.status !== "UPLOADING") {
        return { status: video.status };
      }

      // check if the video exists in S3

      const doesVideoExists = await S3Service.assetExists(video.raw_s3_key);
      if (!doesVideoExists)
        throw this.app.httpErrors.notFound("Video is not there in S3");

      // push it to the queue for workers to process the raw files

      await SqsService.sendEvent({
        queueUrl: CONFIG.QUEUES_URL.VIDEO_PROCESSING,
        payload: {
          videoId: video.id,
          rawKey: video.raw_s3_key,
        },
      });

      await this.videoRepository.update({
        id: video.id,
        updateBody: { status: "PROCESSING" },
      });

      return { status: "PROCESSING" };
    } catch (error) {
      logger.error("VideoController.finalizeUpload error::");
      throw error;
    }
  }

  async getMetaData(req: FastifyRequest<{ Params: GetVideoMetaDataParams }>) {
    try {
      logger.info("VideoController.getMetaData called::");
      const user = await this.app.requireUser(req);
      const video = await this.videoRepository.get({ id: user.id });
      if (!video) throw this.app.httpErrors.notFound("Video not found");

      return { video };
    } catch (error) {
      logger.error("VideoController.getMetaData error::");
      throw error;
    }
  }
}

export default VideoController;
