import { PrismaClient } from "../../prisma/generated/client.js";
import { IncorrectPasswordOrEmail } from "../errors/errors.classes.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

type bcryptType = typeof bcrypt;

export const authService = (
  prisma: PrismaClient,
  bcrypt: bcryptType,
  JWT: typeof jwt,
) => {
  return {
    async login(email: string, password: string) {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new IncorrectPasswordOrEmail();
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new IncorrectPasswordOrEmail();
      }
      const secret = process.env.SECRET_JWT_KEY;
      const duration = process.env.COOKIE_EXPIRATION;

      if (!secret) {
        throw new Error("SECRET_JWT_KEY is undefined");
      }
      if (!duration) {
        throw new Error("COOKIE_EXPIRATION is undefined");
      }
      const token = JWT.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        secret,
        {
          expiresIn: duration as any,
        },
      );
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      };
    },
  };
};
