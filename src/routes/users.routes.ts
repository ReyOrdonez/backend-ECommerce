import { authorizeRole } from "./../middlewares/roleVerification.middleware.js";
import { Router } from "express";
import usersController from "../controllers/users.controller.js";

export const publicUsersRouter = Router();

publicUsersRouter.post("/register", usersController.create);

export const privateUsersRouter = Router();

privateUsersRouter.get("/", authorizeRole("ADMIN"), usersController.getAll);

privateUsersRouter.get("/:id", authorizeRole("ADMIN"), usersController.getById);

privateUsersRouter.delete(
  "/:id",
  authorizeRole("ADMIN"),
  usersController.remove,
);

privateUsersRouter.patch(
  "/:id",
  authorizeRole("ADMIN"),
  usersController.update,
);
