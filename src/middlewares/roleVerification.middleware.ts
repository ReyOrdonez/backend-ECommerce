import { UnauthorizedError } from "../errors/errors.classes.js";

import { NextFunction, Request, Response } from "express";

export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      throw new UnauthorizedError();
    }

    const hasPermission = allowedRoles.includes(req.user.role);

    if (!hasPermission) {
      throw new UnauthorizedError();
    }

    next();
  };
};
