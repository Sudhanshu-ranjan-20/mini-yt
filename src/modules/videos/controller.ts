import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Knex as IKnex } from "knex";
import { VideoRepository } from "../../repository-svc";

class VideoController {
  private app: FastifyInstance;
  private videoRepository: VideoRepository;
  constructor(app: FastifyInstance) {
    this.app = app;
    this.videoRepository = new VideoRepository(app.db);
  }
  async create(req: FastifyRequest, reply: FastifyReply) {}
}

export default VideoController;
