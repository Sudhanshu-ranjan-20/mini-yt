import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AuthUtils, logger } from "../../utilities";
import { inspect } from "util";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Repository } from "@mini-yt/svc";
import { ENV, types } from "@mini-yt/shared";

class AuthController {
  private userRepository;
  private refreshTokenRepository;
  private app: FastifyInstance;
  constructor(app: FastifyInstance) {
    this.app = app;
    this.userRepository = new Repository.UserRepository(app.db);
    this.refreshTokenRepository = new Repository.RefreshTokenRepository(app.db);
  }
  async signup(
    req: FastifyRequest<{ Body: types.schema.auth.SignupBody }>,
    reply: FastifyReply
  ) {
    try {
      logger.info("AuthController.signup Called::");
      const { email, password } = req.body;
      const userData = await this.userRepository.getUserByConditions({
        email,
      });
      if (userData) throw this.app.httpErrors.conflict("Email Already exists!");
      const hashedPassword = await AuthUtils.hashPassword(password);

      const [user] = await this.userRepository.createUser({
        email,
        password: hashedPassword,
      });

      const payload = { id: user.id, email: user.email };

      const accessToken = await reply.jwtSign(payload, {
        expiresIn: ENV.ACCESS_TOKEN_TTL,
      });
      const refreshToken = await this.issueRefreshToken(user.id);
      reply.setCookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/auth/refresh",
      });
      return { user: payload };
    } catch (error) {
      logger.error("AuthController.signup error::", inspect(error));
      throw error;
    }
  }
  async login(
    req: FastifyRequest<{ Body: types.schema.auth.LoginBody }>,
    reply: FastifyReply
  ) {
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

      const accessToken = await reply.jwtSign(payload, {
        expiresIn: ENV.ACCESS_TOKEN_TTL,
      });
      const refreshToken = await this.issueRefreshToken(user.id);
      reply.setCookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/auth/refresh",
      });
      return { user: payload };
    } catch (error) {
      logger.error("AuthController.login error::", inspect(error));
      throw error;
    }
  }
  async logout(req: FastifyRequest, reply: FastifyReply) {
    try {
      logger.info("AuthController.logout Called::");

      const user = await this.app.requireUser(req);

      await this.refreshTokenRepository.deleteRefrehToken({ id: user.id });

      reply.clearCookie("access_token", { path: "/" });
      reply.clearCookie("refresh_token", { path: "/auth/refresh" });
      return { ok: true };
    } catch (error) {
      logger.error("AuthController.logout error::", inspect(error));
      throw error;
    }
  }

  async processNewRefreshToken(req: FastifyRequest, reply: FastifyReply) {
    try {
      logger.info("AuthController.processNewRefreshToken Called::");

      const refreshToken = req.cookies["refresh_token"];
      if (!refreshToken)
        throw this.app.httpErrors.unauthorized("Missing refreshed tokens");

      const tokens = await this.refreshTokenRepository.getValidRefreshTokens();
      let matched;
      for (const t of tokens) {
        if (await bcrypt.compare(refreshToken, t.token_hash)) {
          matched = t;
          break;
        }
      }
      if (!matched)
        throw this.app.httpErrors.unauthorized("Invalid Refresh token");

      const user = await this.userRepository.getUserByConditions({
        id: matched.user,
      });
      if (!user) throw this.app.httpErrors.notFound("User not found!");

      await this.refreshTokenRepository.deleteRefrehToken({ id: matched.id });
      const newRefreshToken = await this.issueRefreshToken(user.id);

      const accessToken = await reply.jwtSign(
        {
          id: user.id,
          email: user.email,
        },
        { expiresIn: ENV.ACCESS_TOKEN_TTL }
      );

      reply.setCookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
      reply.setCookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/auth/refresh",
      });

      return { ok: true };
    } catch (error) {
      logger.error(
        "AuthController.processNewRefreshToken Error::",
        inspect(error)
      );
    }
  }

  async issueRefreshToken(userId: string) {
    try {
      logger.info("AuthController.issueRefreshToken Called::");

      const rawToken = crypto.randomBytes(48).toString("hex");
      const hash = await bcrypt.hash(rawToken, 10);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(ENV.REFRESH_TOKEN_TTL));

      await this.refreshTokenRepository.createRefreshToken({
        user: userId,
        token_hash: hash,
        expires_at: expiresAt,
      });

      return rawToken;
    } catch (error) {
      logger.error("AuthController.issueRefreshToken error::", inspect(error));
      throw error;
    }
  }
}
export default AuthController;
