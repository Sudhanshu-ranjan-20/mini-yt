import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ChannelRepository, UserRepository } from "../../repository-svc";
import { IChannelBody } from "../../schemas/channel-schema";
import { logger } from "../../utilities";
import { inspect } from "util";

class ChannelController {
  private app: FastifyInstance;
  private channelRepository: ChannelRepository;
  private userRepository: UserRepository;
  constructor(app: FastifyInstance) {
    this.app = app;
    this.channelRepository = new ChannelRepository(this.app.db);
    this.userRepository = new UserRepository(this.app.db);
  }
  async createChannel(
    req: FastifyRequest<{ Body: IChannelBody }>,
    reply: FastifyReply
  ) {
    try {
      logger.info("ChannelController.createChannel called:");
      const { handle, name } = req.body;

      const user = await this.app.requireUser(req);

      const channelData = await this.channelRepository.getChannel({
        owner: user.id,
      });

      if (channelData)
        throw this.app.httpErrors.conflict("User already has a channel");

      const handleData = await this.channelRepository.getChannel({ handle });
      if (handleData)
        throw this.app.httpErrors.conflict("Handle name is already taken");

      const [channel] = await this.channelRepository.createChannel({
        name,
        handle,
        owner: user.id,
      });
      return { channel };
    } catch (error) {
      logger.error("ChannelController.createChannel called:", inspect(error));
      throw error;
    }
  }
  async getChannel(
    req: FastifyRequest<{ Params: { handle: string } }>,
    reply: FastifyReply
  ) {
    try {
      logger.info("ChannelController.createChannel called:");
      const { handle } = req.params;

      const channelData = await this.channelRepository.getChannel({
        handle,
      });

      if (!channelData)
        throw this.app.httpErrors.notFound(
          "No Channel with the given handleName found!!"
        );

      return { channelData };
    } catch (error) {
      logger.error("ChannelController.createChannel called:", inspect(error));
      throw error;
    }
  }
}
export default ChannelController;
