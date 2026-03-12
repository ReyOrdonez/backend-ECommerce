import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).json({ mensaje: "Token required" });
  }
  req.user = null;
  try {
    const key = process.env.SECRET_JWT_KEY;
    if (!key) {
      throw new Error("key is undefined");
    }
    const data = jwt.verify(token, key) as User;
    req.user = data;

    return next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido" });
  }
};

export default verifyToken;
