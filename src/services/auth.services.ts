import { PrismaClient } from "../../prisma/generated/client.js";
import { IncorrectPassword, NotFoundError } from "../errors/errors.classes.js";
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
        throw new NotFoundError("User Not Found");
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new IncorrectPassword();
      }
      const secret = process.env.SECRET_JWT_KEY;

      if (!secret) {
        throw new Error("SECRET_JWT_KEY is undefined");
      }
      const token = JWT.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        secret,
        {
          expiresIn: "1h",
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
