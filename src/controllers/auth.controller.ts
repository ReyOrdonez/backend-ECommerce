import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//zod schema
import { userLogin } from "../Schemas/user.schemas.js";

//service
import { authService } from "../services/auth.services.js";

//prismaClient
import { prisma } from "../lib/prisma.js";

const authServicesModule = authService(prisma, bcrypt, jwt);

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = userLogin.parse(req.body);
    const result = await authServicesModule.login(email, password);
    res
      .status(200)
      .cookie("access_token", result.token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, //1 hour
      })
      .json({
        id: result.id,
        username: result.username,
        email: result.email,
      });
  } catch (error) {
    next(error);
  }
};

export const authController = { login };
