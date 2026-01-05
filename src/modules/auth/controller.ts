import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AuthUtils, logger } from "../../utilities";
import { inspect } from "util";
import { UserRepository } from "../../repository-svc";
import { SignupBody, LoginBody } from "../../schemas/auth-schema";

class AuthController {
  private userRepository;
  private app: FastifyInstance;
  constructor(app: FastifyInstance) {
    this.app = app;
    this.userRepository = new UserRepository(app.db);
  }
  async signup(req: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) {
    try {
      logger.info("AuthController.signup Called::");
      const { email, password } = req.body;
      const userData = await this.userRepository.getUserByConditions({
        email,
      });
      if (userData) throw this.app.httpErrors.conflict("Email Already exists!");
      const hashedPassword = await AuthUtils.hashPassword(password);

      const user = await this.userRepository.createUser({
        email,
        password: hashedPassword,
      });

      const payload = { id: user.id, email: user.email };

      const token = await reply.jwtSign(payload);
      reply.setCookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
      return { user: payload };
    } catch (error) {
      logger.error("AuthController.signup error::", inspect(error));
      throw error;
    }
  }
  async login(req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    try {
      logger.info("AuthController.login Called::");
      const { email, password } = req.body;
      const user = await this.userRepository.getUserByConditions({
        email,
      });
      if (!user) throw this.app.httpErrors.unauthorized("Invalid Credentials");

      const validPassword = await AuthUtils.comparePassword(
        password,
        user.password
      );
      if (!validPassword)
        throw this.app.httpErrors.unauthorized("Invalid Credentials");
      const payload = { id: user.id, email: user.email };

      const token = await reply.jwtSign(payload);

      reply.setCookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
      return { user: payload };
    } catch (error) {
      logger.error("AuthController.login error::", inspect(error));
      throw error;
    }
  }
  async logout(_req: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("access_token", { path: "/" });
    return { ok: true };
  }
}
export default AuthController;
